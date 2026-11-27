import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { UnsubscribeButton } from '@/components/forms/unsubscribe-button';
import { WRAP } from '@/components/site/layout';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ s?: string; t?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'unsubscribePage.meta' });
  // A personal link: never indexed, and no canonical to share.
  return { title: t('title'), description: t('description'), robots: { index: false, follow: false } };
}

export default async function UnsubscribePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { s = '', t: token = '' } = await searchParams;
  const t = await getTranslations('unsubscribePage');
  const valid = /^\d{1,12}$/.test(s) && /^[0-9a-f]{40}$/.test(token);

  return (
    <section className={`${WRAP} flex min-h-[70dvh] flex-col items-start justify-center py-20`}>
      <h1 className="t-display type-settle text-[clamp(2.6rem,1rem+5vw,5.5rem)] leading-[0.98] text-[var(--fg)]">{t('title')}</h1>
      <p className="t-lede mb-8 mt-6">{t('lede')}</p>
      <UnsubscribeButton s={valid ? s : ''} t={valid ? token : ''} />
      <Link href="/" className="btn btn-line mt-6">
        {t('back')}
      </Link>
    </section>
  );
}
