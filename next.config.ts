import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { LEGACY_REDIRECTS } from './lib/redirects';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const config: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  // Needed when the repo is checked out as a git worktree: without it Next
  // infers the tracing root from the nearest lockfile above.
  outputFileTracingRoot: import.meta.dirname,
  serverExternalPackages: ['better-sqlite3'],
  // The update posts are read from disk at request time.
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
};

export default withNextIntl(config);
