/**
 * Hero — the genesis block of the page, centred: the block stamp, the claim,
 * the slogan, what the lab is, and two actions. A drop of liquid glass sits
 * above the title, and the four desks hang either side on wide screens.
 */
import { getTranslations } from 'next-intl/server';
import { AppWindow, Blocks, BrainCircuit, Cpu } from 'lucide-react';
import { Decode } from './decode';
import { GlassIcon } from './glass3d/glass-icon';
import { HeroFlow } from './hero-flow';
import { WRAP, blockHash } from './layout';

const PANES = [
  { key: 'apps', Icon: AppWindow, cls: 'left-0 top-[16%]', r: '-6deg', k: '18px' },
  { key: 'software', Icon: Cpu, cls: 'right-0 top-[24%]', r: '5deg', k: '-14px' },
  { key: 'intelligence', Icon: BrainCircuit, cls: 'left-[2%] top-[80%]', r: '4deg', k: '24px' },
  { key: 'onchain', Icon: Blocks, cls: 'right-[2%] top-[84%]', r: '-5deg', k: '-20px' },
] as const;

export async function Hero() {
  const t = await getTranslations('home.hero');
  const chrome = await getTranslations('chrome');
  const fields = await getTranslations('home.fields.items');

  return (
    <section className="relative isolate -mt-[88px] flex min-h-[100svh] items-center overflow-hidden pt-[88px]">
      <HeroFlow />
      {/* A soft pool of the page colour behind the copy, so it always reads. */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(52%_44%_at_50%_56%,color-mix(in_oklab,var(--bg)_80%,transparent),transparent_100%)]" />

      <div className={`${WRAP} relative w-full pb-16 pt-6`}>
        {/* Decorative: the same four desks are listed as text in the next block. */}
        <div aria-hidden data-parallax className="stack pointer-events-none absolute inset-0 hidden xl:block">
          {PANES.map(({ key, Icon, cls, r, k }) => (
            // The outer span places the pane; the inner one is the glass.
            // (`.glass` sets its own positioning, so it cannot also be the
            // absolutely placed element.)
            <span key={key} className={`stack-pane absolute ${cls}`} style={{ '--r': r, '--k': k } as React.CSSProperties}>
              <span className="glass flex items-center gap-3.5 rounded-[18px] py-3.5 pl-3.5 pr-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-[var(--fg)] text-[var(--bg)]">
                  <Icon size={20} strokeWidth={1.6} />
                </span>
                <span className="t-display text-[1.25rem] text-[var(--fg)]">{fields(`${key}.title`)}</span>
              </span>
            </span>
          ))}
        </div>

        <div className="relative mx-auto flex max-w-[880px] flex-col items-center text-center">
          <span aria-hidden className="-mb-6 -mt-4">
            <GlassIcon shape="lab" size={230} />
          </span>
          <p className="type-settle flex flex-wrap items-center justify-center gap-3 text-[14px] font-semibold text-[var(--fg-2)]">
            <span className="glass inline-flex min-h-10 items-center gap-2.5 rounded-[12px] px-3.5 text-[var(--fg)]">
              <span className="pulse" aria-hidden />
              <span className="t-num">{chrome('block')} 00</span>
              <span className="h-3.5 w-px bg-[var(--line-strong)]" aria-hidden />
              {chrome('genesis')}
            </span>
            <span className="t-num t-note" aria-hidden>
              {blockHash('genesis')}
            </span>
          </p>
          <h1 className="t-display type-settle mt-7 text-[clamp(2.7rem,1rem+5.4vw,6.25rem)] leading-[0.98] text-[var(--fg)]">{t('title')}</h1>
          <p data-reveal className="t-head mt-6 text-[var(--fg-2)]">
            <Decode text={t('slogan')} duration={1100} />
          </p>
          <p data-reveal className="t-lede mx-auto mt-5 !max-w-[60ch]">
            {t('sub')}
          </p>
          <div data-reveal className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <a href="#vizzor" className="btn btn-ink">
              {t('ctaPrimary')}
            </a>
            <a href="#lab" className="btn btn-line">
              {t('ctaSecondary')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
