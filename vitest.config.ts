import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    setupFiles: ['./tests/setup.ts'],
    server: { deps: { inline: ['next-intl'] } },
    testTimeout: 15_000,
    pool: 'forks',
  },
});
