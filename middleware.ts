import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, detectLocale, isBot, isLocale, localeInPath } from './lib/geo';
import { SECURITY_HEADERS } from './lib/security-headers';

const intl = createMiddleware(routing);

function finish(res: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
  // Staging and previews are never indexed, whatever a page's own tags say.
  if (process.env.NEXT_PUBLIC_SITE_ENV !== 'production') res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

function remember(res: NextResponse, locale: string): void {
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

/**
 * Every URL still serves exactly one language. What this adds: a person who
 * opens an address with no language in it is sent to their own language —
 * the one they picked before, or else the one their country and browser
 * point to. An address that names a language is always respected, and
 * crawlers are never redirected, so search engines index each URL as written.
 */
export default function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const inPath = localeInPath(pathname);
  const saved = req.cookies.get(LOCALE_COOKIE)?.value;
  const person = req.method === 'GET' && !isBot(req.headers.get('user-agent'));

  if (person && !inPath) {
    const want = isLocale(saved)
      ? saved
      : detectLocale({
          country: req.headers.get('cf-ipcountry') ?? req.headers.get('x-vercel-ip-country'),
          acceptLanguage: req.headers.get('accept-language'),
        });
    if (want !== routing.defaultLocale) {
      const url = req.nextUrl.clone();
      url.pathname = `/${want}${pathname === '/' ? '' : pathname}`;
      url.search = search;
      const res = NextResponse.redirect(url, 307);
      // The answer depends on who asks, so no shared cache may keep it.
      res.headers.set('Cache-Control', 'private, no-store');
      res.headers.set('Vary', 'Accept-Language, Cookie');
      remember(res, want);
      return finish(res);
    }
  }

  const res = intl(req);
  const shown = inPath ?? routing.defaultLocale;
  if (person && saved !== shown) remember(res, shown);
  return finish(res);
}

export const config = {
  // Pages only: not the API, not Next's internals, not files with an extension.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
