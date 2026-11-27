import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHead, WRAP } from '@/components/site/layout';
import { Log } from '@/components/site/log';
import { JsonLd } from '@/components/site/json-ld';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { listUpdates } from '@/lib/updates';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'updatesPage.meta' });
  return pageMetadata({ path: '/updates', locale: locale as Locale, title: t('title'), description: t('description') });
}

export default async function UpdatesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('updatesPage');
  const posts = listUpdates(locale as Locale);

  const meta = await getTranslations('meta');
  const crumbs = breadcrumbJsonLd(locale as Locale, [
    { name: meta('home'), path: '/' },
    { name: t('meta.crumb'), path: '/updates' },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <PageHead title={t('title')} lede={t('lede')} />
      <section className={`${WRAP} pb-24`}>
        {posts.length === 0 ? <p className="t-lede">{t('empty')}</p> : <Log posts={posts} locale={locale as Locale} />}
      </section>
    </>
  );
}
