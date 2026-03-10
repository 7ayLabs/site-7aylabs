# Contributing to 7ayLabs Website

Thank you for your interest in contributing to the 7ayLabs website. Every contribution helps build the public face of 7aychain's Proof of Presence protocol.

## Getting Started

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/site-7aylabs.git
cd site-7aylabs

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.example .env.local

# 4. Start dev server
pnpm dev
```

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Protected, requires PR with review. |
| `testing` | Staging branch. Auto-deploys to test.7aylabs.com. |
| `develop` | Integration branch. Feature branches merge here first. |

### Branch Naming

Use prefixes to categorize your work:

```
feat/short-description       # New features
fix/short-description        # Bug fixes
chore/short-description      # Maintenance, dependencies
docs/short-description       # Documentation changes
refactor/short-description   # Code refactoring
perf/short-description       # Performance improvements
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

**Rules:**
- Use imperative mood (`add`, not `added` or `adds`)
- Keep the subject line under 72 characters
- Reference issues when applicable (`fix: navbar overlap #42`)

## Pull Request Process

1. **Fork** the repository and create your branch from `develop`
2. Make your changes following the conventions above
3. Ensure checks pass locally:
   ```bash
   pnpm lint      # No ESLint errors
   pnpm build     # Builds successfully
   ```
4. Open a PR targeting the `develop` branch
5. Fill in the PR template with a summary and test plan
6. Wait for CI checks to pass and a maintainer review

### PR Title Format

Use the same Conventional Commits format:
```
feat: add dark mode toggle to navbar
fix: prevent layout shift on mobile hero
```

## Code Conventions

### General

- Use TypeScript strict mode — no `any` types
- Use `cn()` from `lib/utils/cn.ts` for Tailwind class merging
- Use animation variants from `lib/constants/animations.ts`
- Use `ROUTES` constant from `lib/constants/routes.ts` for navigation
- Use path aliases (`@/components/*`, `@/lib/*`, `@/types/*`)

### Components

- Add `"use client"` directive when using hooks, Framer Motion, or browser APIs
- Use `useReducedMotion` for all animated components
- Include proper ARIA attributes for accessibility
- Support both dark and light themes via CSS custom properties

### Styling

- Use Tailwind CSS utility classes as the primary styling method
- Use CSS custom properties from `styles/tokens.css` for theme-aware colors
- Avoid inline `style={{}}` unless theme-dependent values require it
- Use responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)

### API Routes

- All API routes go in `app/api/`
- Use validation helpers from `lib/api/validation.ts`
- Use response helpers from `lib/api/response.ts`
- Always validate input, check rate limits, and verify CORS origin

## i18n

Translation files are in `messages/`. When adding user-facing text:

1. Add the key to `messages/en.json`
2. Add translations for all 7 locales (`en`, `es`, `pt`, `fr`, `de`, `zh`, `ja`)
3. Use `useTranslations("namespace")` in components

## Database

- Schema is defined in `prisma/schema.prisma`
- Migrations are in `prisma/migrations/`
- After schema changes, generate a migration:
  ```bash
  pnpm db:migrate
  ```

## Need Help?

- Open a [GitHub Issue](https://github.com/7ayLabs/site-7aylabs/issues) for bugs or feature requests
- Check existing issues before creating new ones
- Tag issues with appropriate labels (`bug`, `feature`, `i18n`, etc.)
