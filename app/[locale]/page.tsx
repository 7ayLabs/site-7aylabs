import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { Coverage } from '@/components/site/coverage';
import { Hero } from '@/components/site/hero';
import { Block, Indexed, Statements } from '@/components/site/layout';
import { Log } from '@/components/site/log';
import { Questions } from '@/components/site/questions';
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

const POINTS = ['graded', 'plans', 'onchain', 'plain'] as const;
const METHOD = ['receipts', 'plain', 'privacy', 'ship'] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const chrome = await getTranslations('chrome');
  const posts = listUpdates(locale as Locale).slice(0, 3);

  const index = (['vizzor', 'reach', 'method', 'updates', 'faq'] as const)
    .filter((id) => id !== 'updates' || posts.length > 0)
    .map((id) => ({ id, label: t(`index.${id}`) }));

  return (
    <>
      <Hero />

      <Indexed items={index} label={chrome('index')}>
        <Block id="vizzor" title={t('product.title')} lede={t('product.lede')}>
          <Statements items={POINTS.map((p) => ({ title: t(`product.points.${p}.title`), line: t(`product.points.${p}.line`) }))} />
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link href="/vizzor" className="btn btn-ink">
              {t('product.ctaMore')}
            </Link>
            <a href={VIZZOR.site} target="_blank" rel="noopener noreferrer" className="btn btn-line">
              {t('product.ctaSite')}
            </a>
          </div>
        </Block>

        <Block id="reach" title={t('reach.title', { count: CHAIN_COUNT })} lede={t('reach.lede')}>
          <Coverage />
        </Block>

        <Block id="method" title={t('method.title')} lede={t('method.lede')}>
          <Statements items={METHOD.map((k) => ({ title: t(`method.items.${k}.title`), line: t(`method.items.${k}.line`) }))} />
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
