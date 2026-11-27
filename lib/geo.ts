/**
 * Which language a first-time visitor gets.
 *
 * Order: the language they chose before (a cookie), then the country the
 * request comes from, then the languages their browser asks for, then
 * English. Countries with more than one of our languages in wide use are
 * left to the browser's own preference.
 *
 * Pure functions, so the middleware and the tests share one set of rules.
 */
import { routing, type Locale } from '@/i18n/routing';

/** Remembers the visitor's language. A preference only; it identifies no one. */
export const LOCALE_COOKIE = '7ay_locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const ES = 'AR BO CL CO CR CU DO EC ES GQ GT HN MX NI PA PE PR PY SV UY VE'.split(' ');
const FR = 'FR MC SN CI ML BF NE TG BJ GA CG CD CM MG HT GN TD RE GP MQ GF NC PF LU'.split(' ');

const BY_COUNTRY = new Map<string, Locale>([...ES.map((c) => [c, 'es'] as const), ...FR.map((c) => [c, 'fr'] as const)]);

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (routing.locales as readonly string[]).includes(v);
}

/** The first of our languages in an Accept-Language header, by the visitor's own order. */
export function fromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const weight = q ? Number(q.slice(2)) : 1;
      return { lang: tag.trim().toLowerCase().split('-')[0] ?? '', weight: Number.isFinite(weight) ? weight : 0 };
    })
    .filter((x) => x.weight > 0)
    .sort((a, b) => b.weight - a.weight);
  for (const { lang } of ranked) if (isLocale(lang)) return lang;
  return null;
}

export function detectLocale(input: { country?: string | null; acceptLanguage?: string | null }): Locale {
  const country = (input.country ?? '').trim().toUpperCase();
  return BY_COUNTRY.get(country) ?? fromAcceptLanguage(input.acceptLanguage) ?? routing.defaultLocale;
}

/** The locale a path is written in, when it says so (`/es/vizzor` → `es`). */
export function localeInPath(pathname: string): Locale | null {
  const first = pathname.split('/')[1] ?? '';
  return isLocale(first) ? first : null;
}

/** Crawlers and link-preview fetchers get every URL in its own language, never a redirect. */
export function isBot(userAgent: string | null | undefined): boolean {
  return /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|discord|preview|embed|lighthouse|pingdom|uptime|curl|wget|headless/i.test(
    userAgent ?? '',
  );
}
