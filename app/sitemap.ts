import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { localeUrl } from '@/lib/seo';
import { listUpdates } from '@/lib/updates';

const PAGES = [
  { path: '/', priority: 1 },
  { path: '/products', priority: 0.9 },
  { path: '/vizzor', priority: 0.9 },
  { path: '/about', priority: 0.7 },
  { path: '/updates', priority: 0.7 },
  { path: '/contact', priority: 0.5 },
  { path: '/legal/privacy', priority: 0.2 },
] as const;

function entry(path: string, priority: number, lastModified?: string): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localeUrl(path, l);
  return routing.locales.map((l) => ({
    url: localeUrl(path, l),
    ...(lastModified ? { lastModified } : {}),
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = listUpdates(routing.defaultLocale);
  const newest = posts[0]?.date;
  return [
    ...PAGES.flatMap((p) => entry(p.path, p.priority, p.path === '/' || p.path === '/updates' ? newest : undefined)),
    ...posts.flatMap((p) => entry(`/updates/${p.slug}`, 0.6, p.date)),
  ];
}
