# syntax=docker/dockerfile:1.7

# ──────────────────────────────────────────────────────────────────────
# Base: Node 22 LTS on Alpine, digest-pinned (Dependabot bumps it), with
# the pnpm version the lockfile was written by.
# ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# ──────────────────────────────────────────────────────────────────────
# deps: install only. Keyed on the lockfile, so it stays cached between
# deploys that do not touch dependencies.
# ──────────────────────────────────────────────────────────────────────
FROM base AS deps
# better-sqlite3 is a native module. Alpine (musl) has no usable prebuilt
# binary guarantee, so node-gyp needs a toolchain here. It never reaches the
# runner image: the standalone bundle carries only the compiled .node file.
RUN apk add --no-cache python3 make g++
# `.npmrc*` is a glob so the build does not fail if the file is removed.
COPY package.json pnpm-lock.yaml .npmrc* ./
RUN pnpm install --frozen-lockfile

# ──────────────────────────────────────────────────────────────────────
# build: produce the Next.js standalone output
# ──────────────────────────────────────────────────────────────────────
FROM base AS build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG GIT_SHA=unknown
ARG BUILD_TIME=unknown
ENV GIT_SHA=$GIT_SHA
ENV BUILD_TIME=$BUILD_TIME

# NEXT_PUBLIC_* values are inlined into the bundle by `next build`. Setting
# them in the host env file later does nothing, so they are build args.
ARG NEXT_PUBLIC_SITE_URL=https://7aylabs.com
ARG NEXT_PUBLIC_SITE_ENV=production
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_ENV=$NEXT_PUBLIC_SITE_ENV

# A writable scratch data dir, in case a module opens the database while
# `next build` collects page data. Nothing from it is copied to the runner.
ENV SITE_DATA_DIR=/tmp/site-build-data
RUN mkdir -p /tmp/site-build-data

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ──────────────────────────────────────────────────────────────────────
# runner: the standalone bundle and nothing else
# ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV SITE_DATA_DIR=/app/.data

# ENV does not cross stages. /api/health reads GIT_SHA at request time in
# THIS image, and the deploy smoke test compares it with the commit that was
# deployed, so both values are declared again here.
ARG GIT_SHA=unknown
ARG BUILD_TIME=unknown
ENV GIT_SHA=$GIT_SHA
ENV BUILD_TIME=$BUILD_TIME

LABEL org.opencontainers.image.title="site-7aylabs" \
      org.opencontainers.image.source="https://github.com/7ayLabs/site-7aylabs" \
      org.opencontainers.image.revision="$GIT_SHA" \
      org.opencontainers.image.created="$BUILD_TIME"

# No extra packages: the node:alpine image already ships libstdc++ and
# libgcc, which is all the compiled better-sqlite3 binary links against.
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
# Update posts (MDX) are read from disk at request time.
COPY --from=build --chown=nextjs:nodejs /app/content ./content

# Pre-create the two writable paths with the runtime owner:
#   /app/.data         SQLite volume mount point. A named volume copies the
#                      ownership of the image directory on first use; without
#                      this Docker creates it root-owned and SQLite cannot
#                      write its WAL files.
#   /app/.next/cache   Next's runtime cache. The compose overlays mount a
#                      tmpfs here because the root filesystem is read-only.
RUN mkdir -p /app/.data /app/.next/cache \
 && chown -R nextjs:nodejs /app/.data /app/.next/cache

USER nextjs

# Fail the build, not the deploy, if the native module did not survive the
# standalone trace or cannot load on this libc.
RUN node -e "const D=require('better-sqlite3');const d=new D(':memory:');if(d.prepare('select 1 as x').get().x!==1)process.exit(1);d.close();console.log('[build] better-sqlite3 loads in the runner image')"

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
