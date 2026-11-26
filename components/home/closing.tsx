/**
 * Closing — one glass panel, one headline, two ways forward.
 */
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { VizzorMark } from '@/components/layout/brand-mark';
import { Section } from '@/components/ui/section';
import { VIZZOR } from '@/lib/site';

export async function Closing({ namespace = 'home.closing' }: { namespace?: 'home.closing' | 'vizzorPage.closing' }) {
  const t = await getTranslations(namespace);

  return (
    <Section id="start" tight>
      <div data-reveal-frame className="l-glass flex flex-col items-center overflow-hidden rounded-[40px] px-6 py-16 text-center sm:py-24">
        <VizzorMark className="h-12 w-auto" />
        <h2 className="l-display l-section-title mt-8 max-w-[14ch] text-[var(--fg)]">{t('title')}</h2>
        <p className="l-lede mt-6">{t('lede')}</p>
        <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
          <a href={VIZZOR.app} target="_blank" rel="noopener noreferrer" className="l-btn l-btn-primary group" data-magnetic>
            <span>{t('ctaPrimary')}</span>
            <ArrowUpRight
              size={15}
              strokeWidth={2.5}
              aria-hidden
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <Link href="/contact" className="l-btn l-btn-ghost">
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>
    </Section>
  );
}
