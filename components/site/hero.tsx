/**
 * Hero — the claim in the tallest type on the site, and next to it the thing
 * that backs the claim up: a call being made and graded.
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { VIZZOR } from '@/lib/site';
import { CallDemo } from './call-demo';
import { HeroEntrance } from './hero-entrance';
import { WRAP } from './layout';

export async function Hero() {
  const t = await getTranslations('home.hero');

  return (
    <section className="overflow-hidden">
      <HeroEntrance className={`${WRAP} grid items-start gap-12 pb-16 pt-8 sm:pb-24 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,480px)]`}>
        <div>
          <h1 className="t-display t-hero text-[var(--fg)] lg:text-[clamp(5rem,9.4vw,10.5rem)]">
            <span data-mask>
              <span data-line className="block">
                {t('titleA')}
              </span>
            </span>
            <span data-mask>
              <span data-line className="block">
                {t('titleB')}
              </span>
            </span>
          </h1>

          <div data-step className="mt-8 lg:mt-10">
            <p className="t-lede">{t('sub')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={VIZZOR.app}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('ctaPrimary')} (${t('newTab')})`}
                className="btn btn-ink"
              >
                {t('ctaPrimary')}
              </a>
              <Link href="/vizzor" className="btn btn-line">
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>

        <div data-step className="lg:pt-3">
          <CallDemo />
        </div>
      </HeroEntrance>
    </section>
  );
}
