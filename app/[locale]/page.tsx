import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import { BigStats } from '@/components/site/big-stats';
import { Coverage } from '@/components/site/coverage';
import { Fields } from '@/components/site/fields';
import { Hero } from '@/components/site/hero';
import { Hub } from '@/components/site/hub';
import { Block, Indexed } from '@/components/site/layout';
import { Log } from '@/components/site/log';
import { ChainMarquee, Kinetic } from '@/components/site/marquees';
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

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const products = await getTranslations('products');
  const chrome = await getTranslations('chrome');
  const posts = listUpdates(locale as Locale).slice(0, 4);
  const s = (k: 'lab' | 'products' | 'stack' | 'method' | 'reach' | 'updates' | 'faq' | 'contact') => chrome(`sections.${k}`);

  return (
    <>
      <Hero />

      <Indexed>
        <Block id="lab" n="01" label={s('lab')} title={t('fields.title')} lede={t('fields.lede')}>
          <BigStats />
          <div className="mt-16">
            <Fields />
          </div>
        </Block>

        <Kinetic />

        <Block id="products" n="02" label={s('products')} title={products('title')} lede={products('lede')}>
          <ProductList />
          <div className="mt-20">
            <Hub />
          </div>
        </Block>

        <Block id="stack" n="03" label={s('stack')} title={t('stack.title')} lede={t('stack.lede')}>
          <Stack />
        </Block>

        <Block id="method" n="04" label={s('method')} title={t('method.title')} lede={t('method.lede')}>
          <Rules />
        </Block>

        <Block id="reach" n="05" label={s('reach')} title={t('reach.title', { count: CHAIN_COUNT })} lede={t('reach.lede')}>
          <div className="-mx-[calc((100vw-100%)/2)]">
            <ChainMarquee />
          </div>
          <Coverage grid={false} />
        </Block>

        {posts.length > 0 ? (
          <Block id="updates" n="06" label={s('updates')} title={t('updates.title')} lede={t('updates.lede')}>
            <Log posts={posts} locale={locale as Locale} />
            <div className="mt-10 flex justify-center">
              <Link href="/updates" className="btn btn-line">
                {t('updates.all')}
              </Link>
            </div>
          </Block>
        ) : null}

        <Block id="faq" n="07" label={s('faq')} title={t('faq.title')} lede={t('faq.lede')}>
          <div className="mx-auto max-w-[860px]">
            <Questions />
          </div>
        </Block>

        <Block id="contact" n="08" label={s('contact')} title={t('contact.title')} lede={t('contact.lede')}>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/contact" className="btn btn-ink">
              {chrome('talk')}
            </Link>
            <a href={VIZZOR.app} target="_blank" rel="noopener noreferrer" className="btn btn-line">
              {chrome('openVizzor')}
            </a>
          </div>
          <div className="glass mx-auto mt-10 flex max-w-[560px] justify-center rounded-[22px] p-6 sm:p-7">
            <NewsletterForm />
          </div>
        </Block>
      </Indexed>
    </>
  );
}
