<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/7aylabs_white_logo.svg" />
    <source media="(prefers-color-scheme: light)" srcset="public/7aylabs_blacklogo.png" />
    <img alt="7ayLabs" src="public/7aylabs_blacklogo.png" width="220" />
  </picture>
</p>

<p align="center">
  <strong>The official website for 7ayLabs — the organization behind 7aychain.</strong><br/>
  A Layer 1 blockchain implementing <b>Proof of Presence</b> consensus.<br/>
  Verifying humans through physical proximity, no biometrics.
</p>

<p align="center">
  <a href="https://7aylabs.com">Website</a> &middot;
  <a href="https://test.7aylabs.com">Staging</a> &middot;
  <a href="https://github.com/7ayLabs/site-7aylabs/releases">Releases</a> &middot;
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <a href="https://github.com/7ayLabs/site-7aylabs/actions/workflows/ci.yml"><img src="https://github.com/7ayLabs/site-7aylabs/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI" /></a>
  <a href="https://github.com/7ayLabs/site-7aylabs/releases/latest"><img src="https://img.shields.io/github/v/release/7ayLabs/site-7aylabs?color=ff6f00&label=release" alt="Release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/7ayLabs/site-7aylabs?color=0e8a16" alt="License" /></a>
  <a href="https://github.com/7ayLabs/site-7aylabs/pulls"><img src="https://img.shields.io/github/issues-pr/7ayLabs/site-7aylabs?color=5319e7" alt="PRs" /></a>
</p>

---

## About

This repository contains the source code for [7aylabs.com](https://7aylabs.com) — the public-facing website for the 7ayLabs DAO. It serves as the primary information hub for 7aychain's Proof of Presence protocol, developer resources, community updates, and ecosystem tools.

> **Note** — This is the website repository, not the blockchain implementation. For the 7aychain protocol, see [7ayLabs/7aychain](https://github.com/7ayLabs/7aychain).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org) (App Router, standalone output) |
| UI | [React 19](https://react.dev) + [TypeScript 5.9](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 3.4](https://tailwindcss.com) + CSS custom properties |
| Animations | [Framer Motion 11](https://www.framer.com/motion) |
| Icons | [Lucide React](https://lucide.dev) |
| Database | [PostgreSQL](https://www.postgresql.org) via [Prisma 6](https://www.prisma.io) |
| i18n | [next-intl](https://next-intl.dev) — 7 locales (en, es, pt, fr, de, zh, ja) |
| Package Manager | [pnpm 9](https://pnpm.io) |

## Infrastructure

| Component | Purpose |
|-----------|---------|
| Docker | Multi-stage builds, Node 20 Alpine, non-root container |
| Nginx | Reverse proxy, rate limiting, security headers, static caching |
| GitHub Actions | CI pipeline (lint, typecheck, security audit, build) |
| Jenkins | CD pipeline for staging deployments |
| Cloudflare | DNS, tunnel, DDoS protection |

## Quick Start

```bash
# Clone and install
git clone https://github.com/7ayLabs/site-7aylabs.git
cd site-7aylabs
pnpm install

# Set up environment
cp .env.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker

```bash
# Local development with Docker
docker compose -f docker-compose.local.yml up --build
```

The app runs at [http://localhost:8082](http://localhost:8082).

## Project Structure

```
site-7aylabs/
├── app/                    # Next.js App Router
│   ├── [locale]/           # i18n locale routing
│   ├── (public)/           # Public pages (technology, waitlist, etc.)
│   └── api/                # API routes (waitlist, newsletter, contact)
├── components/
│   ├── landing/            # Landing page sections
│   ├── layout/             # Navbar, Footer, providers
│   └── ui/                 # Reusable components (Button, Card, Badge, etc.)
├── lib/
│   ├── api/                # Validation, response helpers
│   ├── constants/          # Routes, animations, config
│   └── db/                 # Prisma client
├── messages/               # i18n translation files (7 locales)
├── prisma/                 # Schema and migrations
├── nginx/                  # Nginx reverse proxy config
├── styles/
│   ├── globals.css         # Global styles
│   └── tokens.css          # ~50 CSS custom properties (theme tokens)
└── public/                 # Static assets, logos, icons
```

## Features

- **Dual Theme** — Light and dark modes with OS preference detection and anti-FOUC
- **7 Languages** — Full i18n with locale-aware routing and per-locale SEO metadata
- **Animated UI** — Scroll-triggered animations with `useReducedMotion` fallbacks
- **API Routes** — Waitlist, newsletter, and contact endpoints with rate limiting
- **Security** — CSP headers, CORS validation, input sanitization, anti-enumeration
- **Accessible** — ARIA attributes, keyboard navigation, skip-to-content, semantic HTML
- **Performance** — Dynamic imports, static generation, image optimization, edge caching

## API Endpoints

All endpoints accept `POST` requests and are rate-limited to 10 requests/min per IP.

| Endpoint | Description |
|----------|-------------|
| `/api/waitlist` | Waitlist signup (email, name?, role?) |
| `/api/newsletter` | Newsletter subscription (email) |
| `/api/contact` | Contact form (email, name, message) |

## Environment Variables

```bash
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/7aylabs_dev"

# Optional
NODE_ENV=development
PORT=3000
HOSTNAME=localhost
ALLOWED_ORIGINS=http://localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build (standalone) |
| `pnpm lint` | ESLint check |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:studio` | Open Prisma Studio |

## CI/CD Pipeline

```
Push to main ──► GitHub Actions (lint, typecheck, audit, build) ──► DockerHub
Push to testing ──► GitHub Actions ──► DockerHub ──► Jenkins auto-deploy ──► VPS
```

- **CI**: Runs on every PR — lint, typecheck, security audit, build
- **CD**: Pushes to `testing` branch auto-deploy to staging via Jenkins

## Contributing

We welcome contributions from the community. See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Branch strategy and naming conventions
- Commit message format (Conventional Commits)
- Pull request process
- Code quality requirements

### Quick Contribution Guide

1. Fork the repository
2. Create a branch from `develop` (`feat/your-feature`)
3. Make changes, ensure `pnpm lint` and `pnpm build` pass
4. Open a PR targeting `develop`
5. Wait for CI checks and review

## Releases

This project uses [semantic versioning](https://semver.org). See [Releases](https://github.com/7ayLabs/site-7aylabs/releases) for the changelog.

| Version | Date | Highlights |
|---------|------|------------|
| [v1.0.0](https://github.com/7ayLabs/site-7aylabs/releases/tag/v1.0.0) | 2026-03-09 | Initial release — dual theme, i18n, security hardening, CI/CD |

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built by <a href="https://github.com/7ayLabs">7ayLabs</a> — Proof of Presence for the real world.
</p>
