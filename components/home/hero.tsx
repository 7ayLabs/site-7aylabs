/**
 * Hero — who we are in one line, and the way into what we make.
 *
 * Left: the company statement and two actions. Right (from `lg`): Vizzor as
 * a glass card, because the product is the proof.
 */
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, Orbit } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { GlassIcon } from '@/components/landing/v4/glass-icon';
import { VizzorMark } from '@/components/layout/brand-mark';
import { WRAP } from '@/components/ui/section';
import { VIZZOR } from '@/lib/site';
import { CHAIN_COUNT } from '@/lib/vizzor/chains';
import { HeroEntrance } from './hero-entrance';

function MaskedLine({ children }: { children: string }) {
  return (
    <span data-hero-mask>
      <span data-hero-word className="block will-change-transform">
        {children}
      </span>
    </span>
  );
}

export async function Hero() {
  const t = await getTranslations('home.hero');

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-76px)] items-center overflow-hidden">
      <HeroEntrance className="relative w-full">
        <div className={`${WRAP} grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16`}>
          <div>
            <p data-hero-step className="l-glass inline-flex min-h-9 items-center gap-2.5 rounded-full px-4 text-[13.5px] font-semibold text-[var(--fg-2)]">
              <span className="l-live-dot" aria-hidden />
              {t('pill')}
            </p>

            <h1 className="l-display l-hero-title mt-7 text-[var(--fg)]">
              <MaskedLine>{t('titleA')}</MaskedLine>
              <MaskedLine>{t('titleB')}</MaskedLine>
            </h1>

            <p data-hero-step className="l-lede mt-8 max-w-[600px]">
              {t('sub')}
            </p>

            <div data-hero-step className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <a
                href={VIZZOR.app}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('ctaPrimary')} (${t('newTab')})`}
                className="l-btn l-btn-primary group w-full sm:w-auto"
                data-magnetic
              >
                <span>{t('ctaPrimary')}</span>
                <ArrowUpRight
                  size={15}
                  strokeWidth={2.5}
                  aria-hidden
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <Link href="/vizzor" className="l-btn l-btn-ghost w-full sm:w-auto">
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>

          {/* The product card. */}
          <aside data-hero-step data-tilt aria-label={t('card.label')} className="l-glass relative overflow-hidden rounded-[32px] p-7 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2.5">
                <VizzorMark className="h-6 w-auto" />
                <span className="l-display text-[19px] text-[var(--fg)]">vizzor</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-hi)] px-3 py-1 text-[12.5px] font-semibold text-[var(--fg-2)]">
                <span className="l-live-dot" aria-hidden />
                {t('card.live')}
              </span>
            </div>

            <div className="-my-2 flex items-center justify-center">
              <GlassIcon shape="orb" size={260} fallback={<Orbit size={64} strokeWidth={1.1} />} />
            </div>

            <p className="l-card-title text-[var(--fg)]">{t('card.title')}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg-2)]">{t('card.line')}</p>

            <dl className="mt-6 grid grid-cols-3 items-start gap-3 border-t border-[var(--l-hairline)] pt-5">
              {[
                { v: String(CHAIN_COUNT), k: t('card.chains') },
                { v: String(VIZZOR.editions.length), k: t('card.editions') },
                { v: String(VIZZOR.languages.length), k: t('card.languages') },
              ].map((s) => (
                <div key={s.k} className="flex flex-col-reverse justify-end gap-2">
                  <dt className="text-[12.5px] font-medium leading-snug text-[var(--fg-3)]">{s.k}</dt>
                  <dd className="mono text-[26px] font-semibold leading-none text-[var(--fg)]">{s.v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </HeroEntrance>
    </section>
  );
}
