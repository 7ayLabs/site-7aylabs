import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Fields } from '@/components/site/fields';
import { PageHead, WRAP } from '@/components/site/layout';
import { ProductList } from '@/components/site/product-list';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'productsPage.meta' });
  return pageMetadata({ path: '/products', locale: locale as Locale, title: t('title'), description: t('description') });
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('productsPage');
  const home = await getTranslations('home');

  return (
    <>
      <PageHead title={t('title')} lede={t('lede')} />
      <section className={`${WRAP} pb-20`}>
        <ProductList />
      </section>
      <section className={`${WRAP} pb-24`} aria-labelledby="fields-title">
        <h2 id="fields-title" data-reveal className="t-display t-title max-w-[18ch] pt-8 text-[var(--fg)] sm:pt-10">
          {home('fields.title')}
        </h2>
        <p data-reveal className="t-lede mb-12 mt-6">
          {home('fields.lede')}
        </p>
        <Fields />
      </section>
    </>
  );
}
