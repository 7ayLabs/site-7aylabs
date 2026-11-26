/**
 * Flagship — Vizzor in one panel: what it is, why it is different, where to go.
 */
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { VizzorMark } from '@/components/layout/brand-mark';
import { Section } from '@/components/ui/section';
import { Tick } from '@/components/ui/tick';
import { VIZZOR } from '@/lib/site';

const POINTS = ['graded', 'plans', 'onchain', 'plain'] as const;

export async function Flagship() {
  const t = await getTranslations('home.flagship');

  return (
    <Section id="vizzor">
      <div data-reveal-frame className="l-glass overflow-hidden rounded-[36px] p-7 sm:p-12 lg:p-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="l-kicker inline-flex items-center gap-2.5">
              <VizzorMark className="h-5 w-auto" />
              {t('kicker')}
            </p>
            <h2 className="l-display l-section-title mt-5 text-[var(--fg)]">
              {t('titleA')} <span className="text-[var(--fg-3)]">{t('titleB')}</span>
            </h2>
            <p className="l-lede mt-6">{t('lede')}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href={VIZZOR.site} target="_blank" rel="noopener noreferrer" className="l-btn l-btn-primary group" data-magnetic>
                <span>{t('ctaSite')}</span>
                <ArrowUpRight
                  size={15}
                  strokeWidth={2.5}
                  aria-hidden
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <Link href="/vizzor" className="l-btn l-btn-ghost">
                {t('ctaMore')}
              </Link>
            </div>
          </div>

          <ul className="grid content-center gap-6">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-4">
                <span className="mt-0.5">
                  <Tick />
                </span>
                <span>
                  <span className="block text-[17px] font-semibold text-[var(--fg)]">{t(`points.${p}.title`)}</span>
                  <span className="mt-1 block text-[15.5px] leading-relaxed text-[var(--fg-2)]">{t(`points.${p}.line`)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
