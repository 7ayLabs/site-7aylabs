import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { SECURITY_HEADERS } from './lib/security-headers';

const intl = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const res = intl(req);

  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
  // Staging and previews are never indexed, whatever a page's own tags say.
  if (process.env.NEXT_PUBLIC_SITE_ENV !== 'production') res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = {
  // Pages only: not the API, not Next's internals, not files with an extension.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
