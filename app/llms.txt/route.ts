import { routing } from '@/i18n/routing';
import { localeUrl } from '@/lib/seo';
import { PLATFORMS, SITE, VIZZOR } from '@/lib/site';
import { listUpdates } from '@/lib/updates';
import { CHAIN_COUNT } from '@/lib/vizzor/chains';

export const dynamic = 'force-static';

/** A plain summary of the site for AI assistants and crawlers (llms.txt). */
export function GET(): Response {
  const en = routing.defaultLocale;
  const posts = listUpdates(en)
    .map((p) => `- [${p.title}](${localeUrl(`/updates/${p.slug}`, en)}): ${p.summary}`)
    .join('\n');
  const platforms = PLATFORMS.map((p) => `- ${p.name}: ${p.status === 'live' ? 'live' : 'in testing, not yet released'}`).join('\n');
  const body = `# ${SITE.name}

> 7ayLabs is a Web3 laboratory. It designs, builds and runs its own apps, software, intelligence and on-chain products. Its first product, Vizzor, is live.

## Pages
- [Home](${SITE.url}): what the lab is and what it builds
- [Products](${SITE.url}/products): what has shipped and what is in development
- [Vizzor](${SITE.url}/vizzor): the lab's first product
- [About](${SITE.url}/about): why the lab exists and how it works
- [Updates](${SITE.url}/updates): release notes and news
- [Contact](${SITE.url}/contact)

## Vizzor
Crypto intelligence, graded in public. It makes price calls with a target, a deadline and a confidence, then marks each one right or wrong when the deadline arrives. It also traces wallets and follows large holders across ${CHAIN_COUNT} blockchains. Site: ${VIZZOR.site}

Platforms:
${platforms}

## Updates
${posts}

## Languages
English (default), Spanish (/es), French (/fr).
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
