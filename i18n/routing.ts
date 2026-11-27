/**
 * Locale list, default locale and prefix strategy.
 *
 * English lives at the root (`/`, `/vizzor`); Spanish and French get a prefix
 * (`/es/…`, `/fr/…`). next-intl's own detection is off, so every URL serves
 * exactly one language and hreflang stays truthful; first-time visitors are
 * sent to their language by `middleware.ts` (rules in `lib/geo.ts`).
 */
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es', 'fr'] as const,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
  // Our own cookie (`lib/geo.ts`) remembers the language; one is enough.
  localeCookie: false,
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
