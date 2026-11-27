import { routing } from '@/i18n/routing';
import { localeUrl } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { listUpdates } from '@/lib/updates';

export const dynamic = 'force-static';

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The update posts as an RSS feed (English). */
export function GET(): Response {
  const locale = routing.defaultLocale;
  const posts = listUpdates(locale);
  const items = posts
    .map((p) => {
      const url = localeUrl(`/updates/${p.slug}`, locale);
      return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate><description>${esc(p.summary)}</description></item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${SITE.name} lab notes</title><link>${SITE.url}/updates</link><atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/><description>Releases and news from 7ayLabs, the Web3 laboratory.</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
