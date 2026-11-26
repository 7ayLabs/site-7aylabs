import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Closing } from '@/components/home/closing';
import { Desks } from '@/components/home/desks';
import { Faq } from '@/components/home/faq';
import { Flagship } from '@/components/home/flagship';
import { Hero } from '@/components/home/hero';
import { Kinetic } from '@/components/home/kinetic';
import { Principles } from '@/components/home/principles';
import { Reach } from '@/components/home/reach';
import { UpdatesPreview } from '@/components/home/updates-preview';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    ...pageMetadata({ path: '/', locale: locale as Locale, title: t('title'), description: t('description') }),
    title: { absolute: t('title') },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Flagship />
      <Desks />
      <Reach />
      <Kinetic />
      <Principles />
      <UpdatesPreview />
      <Faq />
      <Closing />
    </>
  );
}
