import { getTranslations } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { OG_SIZE, renderOg } from '@/lib/og';
import { formatDate, getUpdate, listSlugs } from '@/lib/updates';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = '7ayLabs';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => listSlugs().map((slug) => ({ locale, slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = getUpdate(slug, locale as Locale);
  const m = await getTranslations({ locale, namespace: 'meta' });
  if (!post) return renderOg({ stamp: '7ayLabs', title: m('slogan'), line: '' });
  return renderOg({ stamp: formatDate(post.date, locale as Locale), title: post.title, line: m('slogan'), vizzor: post.tag === 'product' });
}
