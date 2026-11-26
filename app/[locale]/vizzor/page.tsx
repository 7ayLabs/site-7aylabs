import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight, BellRing, Bot, Languages, MessagesSquare, Newspaper, Radar, ScrollText, Trophy, Wallet } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { Closing } from '@/components/home/closing';
import { Desks } from '@/components/home/desks';
import { Reach } from '@/components/home/reach';
import { VizzorMark } from '@/components/layout/brand-mark';
import { LandingReveal } from '@/components/landing/landing-reveal';
import { Section, SectionHead, WRAP } from '@/components/ui/section';
import { Tick } from '@/components/ui/tick';
import { pageMetadata } from '@/lib/seo';
import { VIZZOR } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'vizzorPage.meta' });
  return pageMetadata({ path: '/vizzor', locale: locale as Locale, title: t('title'), description: t('description') });
}

const FEATURES = [
  { key: 'whales', Icon: Radar },
  { key: 'forensics', Icon: ScrollText },
  { key: 'wallets', Icon: Wallet },
  { key: 'alerts', Icon: BellRing },
  { key: 'news', Icon: Newspaper },
  { key: 'skills', Icon: Bot },
  { key: 'communities', Icon: MessagesSquare },
  { key: 'ranking', Icon: Trophy },
  { key: 'languages', Icon: Languages },
] as const;

const STEPS = ['ask', 'call', 'grade'] as const;

export default async function VizzorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('vizzorPage');

  return (
    <>
      {/* Head */}
      <section>
        <LandingReveal>
          <div className={`${WRAP} pb-6 pt-20 sm:pt-28`}>
            <p data-reveal className="l-kicker inline-flex items-center gap-2.5">
              <VizzorMark className="h-5 w-auto" />
              {t('kicker')}
            </p>
            <h1 data-reveal className="l-display l-hero-title mt-5 max-w-[15ch] text-[var(--fg)]">
              {t('titleA')} <span className="text-[var(--fg-3)]">{t('titleB')}</span>
            </h1>
            <p data-reveal className="l-lede mt-8">
              {t('lede')}
            </p>
            <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href={VIZZOR.app} target="_blank" rel="noopener noreferrer" className="l-btn l-btn-primary group" data-magnetic>
                <span>{t('ctaApp')}</span>
                <ArrowUpRight
                  size={15}
                  strokeWidth={2.5}
                  aria-hidden
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <a href={VIZZOR.site} target="_blank" rel="noopener noreferrer" className="l-btn l-btn-ghost">
                {t('ctaSite')}
              </a>
            </div>
          </div>
        </LandingReveal>
      </section>

      {/* How a call works */}
      <Section id="how">
        <SectionHead kicker={t('how.kicker')} title={t('how.title')} lede={t('how.lede')} />
        <ol className="mt-14 grid gap-5 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s} data-reveal className="l-glass rounded-[26px] p-7 sm:p-8">
              <span className="mono text-[13px] font-semibold text-[var(--fg-3)]">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="l-card-title mt-4 text-[var(--fg)]">{t(`how.steps.${s}.title`)}</h3>
              <p className="mt-2 text-[15.5px] leading-relaxed text-[var(--fg-2)]">{t(`how.steps.${s}.line`)}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Desks />

      {/* Editions */}
      <Section id="editions">
        <SectionHead kicker={t('editions.kicker')} title={t('editions.title')} lede={t('editions.lede')} />
        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {VIZZOR.editions.map((e) => (
            <li key={e.id} data-reveal className="l-glass flex flex-col rounded-[26px] p-7 sm:p-8">
              <span className="self-start rounded-full border border-[var(--border-hi)] px-3 py-1 text-[12.5px] font-semibold text-[var(--fg-2)]">
                {t(`editions.plans.${e.plan}`)}
              </span>
              <h3 className="l-display mt-6 text-[34px] text-[var(--fg)]">{e.name}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-[var(--fg-2)]">{t(`editions.items.${e.id}`)}</p>
            </li>
          ))}
        </ul>
        <p data-reveal className="mt-8 text-[15px] text-[var(--fg-2)]">
          {t('editions.note')}{' '}
          <a
            href={VIZZOR.pricing}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-[var(--fg)] underline underline-offset-4"
          >
            {t('editions.pricing')}
            <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden />
          </a>
        </p>
      </Section>

      {/* Features */}
      <Section id="features">
        <SectionHead kicker={t('features.kicker')} title={t('features.title')} />
        <ul className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, Icon }) => (
            <li key={key} data-reveal className="flex gap-4">
              <span className="l-glass grid h-12 w-12 shrink-0 place-items-center rounded-[14px] text-[var(--fg)]">
                <Icon size={20} strokeWidth={1.6} aria-hidden />
              </span>
              <span>
                <span className="block text-[17px] font-semibold text-[var(--fg)]">{t(`features.items.${key}.title`)}</span>
                <span className="mt-1 block text-[15px] leading-relaxed text-[var(--fg-2)]">{t(`features.items.${key}.line`)}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Receipts */}
      <Section id="receipts">
        <div data-reveal-frame className="l-glass rounded-[36px] p-7 sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="l-kicker">{t('receipts.kicker')}</p>
              <h2 className="l-display l-section-title mt-4 text-[var(--fg)]">{t('receipts.title')}</h2>
            </div>
            <div>
              <p className="l-lede">{t('receipts.lede')}</p>
              <ul className="mt-8 grid gap-4">
                {(['public', 'sealed', 'misses'] as const).map((k) => (
                  <li key={k} className="flex items-start gap-3.5 text-[16px] leading-relaxed text-[var(--fg)]">
                    <span className="mt-0.5">
                      <Tick />
                    </span>
                    {t(`receipts.points.${k}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Reach />
      <Closing namespace="vizzorPage.closing" />
    </>
  );
}
