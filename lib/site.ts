/**
 * Facts about the company and its product, in one place.
 *
 * Everything the pages state about Vizzor comes from here, so a number
 * changes in one file. Nothing here is aspirational: an entry is added when
 * it is true in production.
 */

export const SITE = {
  name: '7ayLabs',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://7aylabs.com').replace(/\/$/, ''),
  env: process.env.NEXT_PUBLIC_SITE_ENV ?? 'development',
  x: 'https://x.com/7ayLabs',
  xHandle: '@7aylabs',
  github: 'https://github.com/7ayLabs',
} as const;

export const VIZZOR = {
  name: 'Vizzor',
  site: 'https://vizzor.ai',
  app: 'https://app.vizzor.ai',
  docs: 'https://vizzor.ai/docs',
  pricing: 'https://vizzor.ai/pricing',
  x: 'https://x.com/vizzor_ai',
  /** Interface languages. */
  languages: ['English', 'Español', 'Français'],
  /** ChronoVisor editions, by plan. */
  editions: [
    { id: 'zonda', name: 'Zonda', plan: 'free' },
    { id: 'kat', name: 'Kat', plan: 'pro' },
    { id: 'zuor', name: 'Zuor', plan: 'elite' },
  ],
} as const;

/** Where Vizzor takes its data from. Integrations, not partnerships. */
export const DATA_SOURCES = ['CoinGecko', 'DexScreener', 'DefiLlama', 'Helius', 'Hyperliquid', 'Polymarket'] as const;

/** What Vizzor runs on. */
export const BUILT_WITH = ['Claude by Anthropic', 'Solana'] as const;

/** Confirmed community partners, with the marks their team supplied. */
export const PARTNERS = [
  {
    id: 'casablanca',
    name: 'Casa Blanca',
    href: 'https://x.com/casaweb3',
    logo: {
      onDark: '/partners/casablanca-house-white.svg',
      onLight: '/partners/casablanca-house-black.svg',
      width: 3652,
      height: 1759,
    },
  },
] as const;

export const isProduction = SITE.env === 'production';
