/**
 * Locale list, default locale and prefix strategy.
 *
 * English lives at the root (`/`, `/vizzor`); Spanish and French get a prefix
 * (`/es/…`, `/fr/…`). Detection is off, so every URL serves exactly one
 * language and hreflang stays truthful.
 */
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es', 'fr'] as const,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
