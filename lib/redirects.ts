/**
 * Where the pages of the previous site went.
 *
 * The old site was about a different project; none of its pages exist any
 * more. Each old address answers with a permanent redirect so links and
 * search results land somewhere useful instead of on a 404.
 *
 * `:locale` covers every locale the old site prefixed (it had seven); the
 * four that no longer exist fall back to the English page.
 */
export interface LegacyRedirect {
  source: string;
  destination: string;
}

const OLD_LOCALES = 'es|pt|fr|de|zh|ja';

/** Old path → new path (both without a locale prefix). */
const MOVED: ReadonlyArray<readonly [string, string]> = [
  ['/technology', '/vizzor'],
  ['/tech', '/vizzor'],
  ['/ecosystem', '/vizzor'],
  ['/services', '/vizzor'],
  ['/use-cases', '/vizzor'],
  ['/use-cases/:slug', '/vizzor'],
  ['/why-presence', '/about'],
  ['/glossary', '/about'],
  ['/devnet', '/'],
  ['/validators', '/'],
  ['/waitlist', '/contact'],
  ['/newsletter', '/updates'],
];

const KEPT_LOCALES = new Set(['es', 'fr']);

export const LEGACY_REDIRECTS: readonly LegacyRedirect[] = [
  ...MOVED.map(([source, destination]) => ({ source, destination })),
  // Prefixed variants: keep the language when we still publish it.
  ...MOVED.flatMap(([source, destination]) =>
    OLD_LOCALES.split('|').map((l) => ({
      source: `/${l}${source}`,
      destination: KEPT_LOCALES.has(l) ? `/${l}${destination === '/' ? '' : destination}` : destination,
    })),
  ),
  // Locales we no longer publish: their home and remaining pages go to English.
  ...['pt', 'de', 'zh', 'ja'].flatMap((l) => [
    { source: `/${l}`, destination: '/' },
    { source: `/${l}/:path*`, destination: '/:path*' },
  ]),
];
