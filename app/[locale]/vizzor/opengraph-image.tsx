import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { OG_SIZE, renderOg } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = '7ayLabs';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'vizzorPage' });
  const m = await getTranslations({ locale, namespace: 'meta' });
  return renderOg({ vizzor: true, stamp: t('meta.crumb'), title: t('title'), line: m('slogan') });
}
