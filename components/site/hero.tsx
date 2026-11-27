/**
 * Hero — centred, over ribbons of light: a pill that says what this is, the
 * two-tone title, the slogan, two actions, and a cue to scroll.
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Decode } from './decode';
import { HeroFlow } from './hero-flow';
import { Duo, WRAP } from './layout';

export async function Hero() {
  const t = await getTranslations('home.hero');

  return (
    <section className="relative isolate -mt-[88px] flex min-h-[100svh] items-center overflow-hidden pt-[88px]">
      <HeroFlow />
      {/* A soft pool of the page colour behind the copy, so it always reads. */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_46%_at_50%_50%,color-mix(in_oklab,var(--bg)_82%,transparent),transparent_100%)]" />
      <div className={`${WRAP} relative w-full pb-24 pt-10 text-center`}>
        <p className="glass type-settle inline-flex min-h-10 items-center rounded-full px-4 text-[14.5px] font-semibold text-[var(--fg)]">{t('pill')}</p>
        <div className="type-settle mx-auto mt-8 max-w-[1000px]">
          <Duo as="h1" text={t('title')} size="duo-hero" />
        </div>
        <p data-reveal className="t-head mx-auto mt-8 max-w-[30ch] !font-normal text-[var(--fg-2)]">
          <Decode text={t('slogan')} duration={1100} />
        </p>
        <p data-reveal className="t-lede mx-auto mt-5 !max-w-[62ch]">
          {t('sub')}
        </p>
        <div data-reveal className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a href="#products" className="btn btn-ink">
            {t('ctaPrimary')}
          </a>
          <Link href="/about" className="btn btn-line">
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>
      <a href="#lab" aria-label={t('scroll')} className="absolute bottom-7 left-1/2 -translate-x-1/2">
        <span className="cue" />
      </a>
    </section>
  );
}
