import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { OG_SIZE, renderOg } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = '7ayLabs · On-chain intelligence lab';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.hero' });
  const c = await getTranslations({ locale, namespace: 'chrome' });
  return renderOg({ stamp: `${c('block')} 00 · ${c('genesis')}`, title: t('title'), line: t('slogan') });
}
