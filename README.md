# site-7aylabs

The 7ayLabs company site, [7aylabs.com](https://7aylabs.com). It presents the company and its product, [Vizzor](https://vizzor.ai).

## Stack

- Next.js 15 (App Router, standalone output), React 19, TypeScript (strict)
- Tailwind CSS 4, with the design tokens in `app/globals.css`
- Sora, Geist and Geist Mono; liquid glass in CSS, 3D glass icons from a small ray-marching WebGL renderer of our own
- next-intl: English (root), Spanish (`/es`), French (`/fr`)
- SQLite (better-sqlite3) for newsletter sign-ups and contact messages
- pnpm 9.15, Node 22

## Develop

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev            # http://localhost:3000
```

Checks, the same four CI runs:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Layout

| Path | What lives there |
|---|---|
| `app/[locale]/` | Pages: home, `/vizzor`, `/about`, `/updates`, `/contact`, `/legal/privacy` |
| `app/api/` | `contact`, `newsletter`, `health` |
| `components/` | `site/` page sections and the call demo, `layout/` header and footer, `forms/`, `ui/` |
| `content/updates/` | Update posts, one file per post and language: `<slug>.<locale>.mdx` |
| `messages/` | All interface text, one JSON file per language |
| `lib/site.ts` | Facts about the company and Vizzor shown on the site |
| `lib/redirects.ts` | Where the addresses of the previous site go |
| `docs/ops/runbook.md` | Server setup, deploy, rollback, backups |

## Adding an update post

Create `content/updates/<slug>.en.mdx` with this front matter, then optionally `.es.mdx` and `.fr.mdx` (a missing language falls back to English):

```mdx
---
title: "…"
summary: "…"
date: 2026-11-26
tag: product   # or company
---
```

## Deploy

`main` deploys to production automatically; `testing` deploys to staging on request. See [BRANCHING.md](BRANCHING.md) and [docs/ops/runbook.md](docs/ops/runbook.md).
