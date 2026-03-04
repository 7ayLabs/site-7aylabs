# 7ayLabs — Official Website

The official website for [7ayLabs](https://7aylabs.com), the organization behind [7aychain](https://github.com/7ayLabs/7aychain) — a Layer 1 blockchain implementing the **Proof of Presence** protocol.

## Tech Stack

- **Next.js 15** (App Router, standalone output)
- **React 19** with TypeScript 5.9
- **Tailwind CSS 3.4** with design tokens
- **Mantine UI 8.3** component library
- **Framer Motion 11.18** for animations
- **pnpm 9** package manager

## Infrastructure

- **Docker** — Multi-stage builds with Node 20 Alpine
- **Nginx** — Reverse proxy configuration
- **GitHub Actions** — CI pipeline (lint, typecheck, security audit, build)
- **Docker Compose** — Local and production environments

## Quick Start

```bash
git clone https://github.com/7ayLabs/site-7aylabs.git
cd site-7aylabs
pnpm install
pnpm dev
```

## Docker (Local)

```bash
docker compose -f docker-compose.local.yml up --build
```

The app will be available at [http://localhost:8082](http://localhost:8082).

## Environment Setup

```bash
cp .env.example .env.local
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch strategy, commit conventions, and PR process.

## License

This project is licensed under the [MIT License](LICENSE).
