# Contributing to 7ayLabs Website

Thank you for your interest in contributing to the 7ayLabs website.

## Branch Strategy

- **`main`** — Production-ready code. Protected, requires PR with review.
- **`develop`** — Integration branch. All feature branches merge here first.
- **Feature branches** — Created from `develop`, merged back via PR.

### Branch Naming

Use prefixes to categorize your work:

```
feat/short-description     # New features
fix/short-description      # Bug fixes
chore/short-description    # Maintenance, dependencies
docs/short-description     # Documentation changes
refactor/short-description # Code refactoring
```

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add newsletter signup form
fix: resolve mobile navbar overlap
refactor: extract animation constants
perf: lazy-load hero background
chore: update dependencies
docs: add API integration guide
```

## Pull Request Process

1. **Fork** the repository and create your branch from `develop`
2. Make your changes following the conventions above
3. Ensure `pnpm lint` and `pnpm build` pass locally
4. Open a PR targeting the `develop` branch
5. Fill in the PR description with a summary and test plan
6. Wait for review and CI checks to pass

## Development Setup

```bash
pnpm install
pnpm dev
```

## Code Quality

Before submitting a PR, verify:

- `pnpm lint` — passes with no errors
- `pnpm build` — builds successfully
- Components use `"use client"` directive when using hooks or Framer Motion
- Routes use the `ROUTES` constant from `lib/constants/routes.ts`
- Animations use centralized variants from `lib/constants/animations.ts`
