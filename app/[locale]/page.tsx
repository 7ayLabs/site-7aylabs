import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { Fields } from '@/components/site/fields';
import { Hero } from '@/components/site/hero';
import { Block, Indexed, Tiles } from '@/components/site/layout';
import { Log } from '@/components/site/log';
import { ProductList } from '@/components/site/product-list';
import { Questions } from '@/components/site/questions';
import { pageMetadata } from '@/lib/seo';
import { listUpdates } from '@/lib/updates';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    ...pageMetadata({ path: '/', locale: locale as Locale, title: t('title'), description: t('description') }),
    title: { absolute: t('title') },
  };
}

const METHOD = ['receipts', 'plain', 'privacy', 'ship'] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const products = await getTranslations('products');
  const chrome = await getTranslations('chrome');
  const posts = listUpdates(locale as Locale).slice(0, 3);

  const index = (['fields', 'products', 'method', 'updates', 'faq'] as const)
    .filter((id) => id !== 'updates' || posts.length > 0)
    .map((id) => ({ id, label: t(`index.${id}`) }));

  return (
    <>
      <Hero />

      <Indexed items={index} label={chrome('index')}>
        <Block id="fields" title={t('fields.title')} lede={t('fields.lede')}>
          <Fields />
        </Block>

        <Block id="products" title={products('title')} lede={products('lede')}>
          <ProductList />
        </Block>

        <Block id="method" title={t('method.title')} lede={t('method.lede')}>
          <Tiles items={METHOD.map((k) => ({ title: t(`method.items.${k}.title`), line: t(`method.items.${k}.line`) }))} />
        </Block>

        {posts.length > 0 ? (
          <Block id="updates" title={t('updates.title')}>
            <Log posts={posts} locale={locale as Locale} />
            <Link href="/updates" className="btn btn-line mt-10">
              {t('updates.all')}
            </Link>
          </Block>
        ) : null}

        <Block id="faq" title={t('faq.title')}>
          <Questions />
        </Block>
      </Indexed>
    </>
  );
}
