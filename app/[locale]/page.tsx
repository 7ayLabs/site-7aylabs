import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import { BigStats } from '@/components/site/big-stats';
import { Coverage } from '@/components/site/coverage';
import { Fields } from '@/components/site/fields';
import { Hero } from '@/components/site/hero';
import { Block, Indexed } from '@/components/site/layout';
import { Log } from '@/components/site/log';
import { ProductList } from '@/components/site/product-list';
import { Questions } from '@/components/site/questions';
import { Rules } from '@/components/site/rules';
import { Stack } from '@/components/site/stack';
import { pageMetadata } from '@/lib/seo';
import { VIZZOR } from '@/lib/site';
import { listUpdates } from '@/lib/updates';
import { CHAIN_COUNT } from '@/lib/vizzor/chains';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    ...pageMetadata({ path: '/', locale: locale as Locale, title: t('title'), description: t('description') }),
    title: { absolute: t('title') },
  };
}

type SectionKey = 'lab' | 'products' | 'stack' | 'method' | 'reach' | 'updates' | 'faq' | 'contact';

/**
 * The home page is built as a chain: the hero is the genesis block, and each
 * section after it is a block with its own number and hash, linked to the
 * one above.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const products = await getTranslations('products');
  const chrome = await getTranslations('chrome');
  const posts = listUpdates(locale as Locale).slice(0, 4);
  const head = (key: SectionKey, n: string) => ({ id: key, n, label: chrome(`sections.${key}`), blockWord: chrome('block') });

  return (
    <>
      <Hero />

      <Indexed>
        <Block {...head('lab', '01')} title={t('fields.title')} lede={t('fields.lede')}>
          <Fields />
          <div className="mt-4">
            <BigStats />
          </div>
        </Block>

        <Block {...head('products', '02')} title={products('title')} lede={products('lede')}>
          <ProductList />
        </Block>

        <Block {...head('stack', '03')} title={t('stack.title')} lede={t('stack.lede')}>
          <Stack />
        </Block>

        <Block {...head('method', '04')} title={t('method.title')} lede={t('method.lede')}>
          <Rules />
        </Block>

        <Block {...head('reach', '05')} title={t('reach.title', { count: CHAIN_COUNT })} lede={t('reach.lede')}>
          <Coverage />
        </Block>

        {posts.length > 0 ? (
          <Block {...head('updates', '06')} title={t('updates.title')} lede={t('updates.lede')}>
            <Log posts={posts} locale={locale as Locale} />
            <Link href="/updates" className="btn btn-line mt-8">
              {t('updates.all')}
            </Link>
          </Block>
        ) : null}

        <Block {...head('faq', '07')} title={t('faq.title')} lede={t('faq.lede')}>
          <Questions />
        </Block>

        <Block {...head('contact', '08')} title={t('contact.title')} lede={t('contact.lede')}>
          <div className="glass grid gap-8 rounded-[26px] p-7 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn btn-ink">
                {chrome('talk')}
              </Link>
              <a href={VIZZOR.app} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                {chrome('openVizzor')}
              </a>
            </div>
            <NewsletterForm />
          </div>
        </Block>
      </Indexed>
    </>
  );
}
