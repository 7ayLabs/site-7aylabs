import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { CallDemo } from '@/components/site/call-demo';
import { Coverage } from '@/components/site/coverage';
import { Block, Indexed, PageHead, Tiles } from '@/components/site/layout';
import { JsonLd } from '@/components/site/json-ld';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { VIZZOR } from '@/lib/site';
import { CHAIN_COUNT } from '@/lib/vizzor/chains';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'vizzorPage.meta' });
  return pageMetadata({ path: '/vizzor', locale: locale as Locale, title: t('title'), description: t('description') });
}

const STEPS = ['ask', 'call', 'grade'] as const;
const DESKS = ['predict', 'intel', 'markets', 'record'] as const;
const FEATURES = ['whales', 'forensics', 'wallets', 'alerts', 'news', 'skills', 'communities', 'ranking'] as const;
const RECEIPTS = ['public', 'sealed', 'misses'] as const;

export default async function VizzorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('vizzorPage');


  const meta = await getTranslations('meta');
  const crumbs = breadcrumbJsonLd(locale as Locale, [
    { name: meta('home'), path: '/' },
    { name: t('meta.crumb'), path: '/vizzor' },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <PageHead title={t('title')} lede={t('lede')}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href={VIZZOR.app} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
            {t('ctaApp')}
          </a>
          <a href={VIZZOR.site} target="_blank" rel="noopener noreferrer" className="btn btn-line">
            {t('ctaSite')}
          </a>
        </div>
      </PageHead>

      <Indexed>
        <Block id="how" title={t('how.title')} lede={t('how.lede')}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-14">
            {/* A real sequence, so it is numbered. */}
            <ol className="grid content-start gap-3" data-stagger>
              {STEPS.map((s, i) => (
                <li key={s} data-reveal className="glass grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 rounded-[22px] p-6">
                  <span aria-hidden className="t-display text-[2.6rem] leading-none text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <span>
                    <h3 className="t-head text-[var(--fg)]">{t(`how.steps.${s}.title`)}</h3>
                    <p className="mt-2 max-w-[48ch] text-[16.5px] leading-relaxed text-[var(--fg-2)]">{t(`how.steps.${s}.line`)}</p>
                  </span>
                </li>
              ))}
            </ol>
            <CallDemo />
          </div>
        </Block>

        <Block id="desks" title={t('desks.title')} lede={t('desks.lede')}>
          <dl className="grid gap-4 md:grid-cols-2" data-stagger>
            {DESKS.map((d) => (
              <div key={d} data-reveal className="glass glass-live flex min-h-[13rem] flex-col justify-end rounded-[26px] p-7">
                <dt className="t-display text-[2.1rem] text-[var(--fg)]">{t(`desks.items.${d}.name`)}</dt>
                <dd className="mt-3">
                  <p className="max-w-[54ch] text-[1.1rem] leading-snug text-[var(--fg)]">{t(`desks.items.${d}.line`)}</p>
                  <p className="t-note mt-2">{t(`desks.items.${d}.reach`, { count: CHAIN_COUNT })}</p>
                </dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block id="editions" title={t('editions.title')} lede={t('editions.lede')}>
          <ul className="grid gap-4 md:grid-cols-3" data-stagger>
            {VIZZOR.editions.map((e) => (
              <li key={e.id} data-reveal className="glass glass-live rounded-[22px] p-6 sm:p-7">
                <p className="t-note font-semibold">{t(`editions.plans.${e.plan}`)}</p>
                <h3 className="t-display mt-3 text-[2.4rem] text-[var(--fg)]">{e.name}</h3>
                <p className="mt-4 text-[16.5px] leading-relaxed text-[var(--fg-2)]">{t(`editions.items.${e.id}`)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[58ch] text-[16.5px] leading-relaxed text-[var(--fg-2)]">
            {t('editions.note')}{' '}
            <a href={VIZZOR.pricing} target="_blank" rel="noopener noreferrer" className="link font-semibold">
              {t('editions.pricing')}
            </a>
            .
          </p>
        </Block>

        <Block id="features" title={t('features.title')}>
          <Tiles items={FEATURES.map((k) => ({ title: t(`features.items.${k}.title`), line: t(`features.items.${k}.line`) }))} />
        </Block>

        <Block id="record" title={t('receipts.title')} lede={t('receipts.lede')}>
          <ul className="glass rounded-[26px] px-7" data-stagger>
            {RECEIPTS.map((k) => (
              <li key={k} data-reveal className="flex items-baseline gap-4 border-t border-[var(--glass-line)] py-5 first:border-t-0 text-[1.2rem] leading-snug text-[var(--fg)]">
                <span aria-hidden className="font-bold text-[var(--fg)]">
                  ✓
                </span>
                {t(`receipts.points.${k}`)}
              </li>
            ))}
          </ul>
        </Block>

        <Block id="reach" title={t('reach.title', { count: CHAIN_COUNT })} lede={t('reach.lede')}>
          <Coverage />
        </Block>
      </Indexed>
    </>
  );
}
