/**
 * Hero — the genesis block of the page: what the lab is, its slogan, and a
 * drop of liquid glass with the four disciplines hung around it. Ribbons of
 * light move behind.
 */
import { getTranslations } from 'next-intl/server';
import { AppWindow, Blocks, BrainCircuit, Cpu } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Decode } from './decode';
import { GlassIcon } from './glass3d/glass-icon';
import { HeroFlow } from './hero-flow';
import { WRAP, blockHash } from './layout';

const PANES = [
  { key: 'apps', Icon: AppWindow, cls: 'left-[0%] top-[6%] w-[46%]', r: '-7deg', k: '18px' },
  { key: 'software', Icon: Cpu, cls: 'right-[0%] top-[14%] w-[48%]', r: '5deg', k: '-12px' },
  { key: 'intelligence', Icon: BrainCircuit, cls: 'left-[0%] top-[66%] w-[54%]', r: '3deg', k: '26px' },
  { key: 'onchain', Icon: Blocks, cls: 'right-[0%] top-[74%] w-[44%]', r: '-4deg', k: '-20px' },
] as const;

export async function Hero() {
  const t = await getTranslations('home.hero');
  const chrome = await getTranslations('chrome');
  const fields = await getTranslations('home.fields.items');

  return (
    <section className="relative isolate -mt-[88px] flex min-h-[100svh] items-center overflow-hidden pt-[88px]">
      <HeroFlow />
      <div className={`${WRAP} relative grid w-full items-center gap-10 pb-16 pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-6`}>
        <div>
          <p className="type-settle flex flex-wrap items-center gap-3 text-[14px] font-semibold text-[var(--fg-2)]">
            <span className="glass inline-flex min-h-10 items-center gap-2.5 rounded-[12px] px-3.5 text-[var(--fg)]">
              <span className="pulse" aria-hidden />
              <span className="t-num">
                {chrome('block')} 00
              </span>
              <span className="h-3.5 w-px bg-[var(--line-strong)]" aria-hidden />
              {chrome('genesis')}
            </span>
            <span className="t-num t-note" aria-hidden>
              {blockHash('genesis')}
            </span>
          </p>
          <h1 className="t-display type-settle mt-7 max-w-[11ch] text-[clamp(2.9rem,1rem+6.1vw,7rem)] leading-[0.96] text-[var(--fg)]">{t('title')}</h1>
          <p data-reveal className="t-head mt-6 text-[var(--fg-2)]">
            <Decode text={t('slogan')} duration={1100} />
          </p>
          <p data-reveal className="t-lede mt-5">
            {t('sub')}
          </p>
          <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#products" className="btn btn-ink">
              {t('ctaPrimary')}
            </a>
            <Link href="/about" className="btn btn-line">
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>

        {/* Decorative: the same four disciplines are listed as text below. */}
        <div aria-hidden data-parallax className="stack relative hidden h-[34rem] lg:block">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <GlassIcon shape="lab" size={600} />
          </span>
          {PANES.map(({ key, Icon, cls, r, k }) => (
            <span
              key={key}
              className={`stack-pane glass absolute flex items-center gap-4 rounded-[20px] px-4 py-4 ${cls}`}
              style={{ '--r': r, '--k': k } as React.CSSProperties}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[var(--fg)] text-[var(--bg)]">
                <Icon size={22} strokeWidth={1.6} />
              </span>
              <span className="t-display text-[1.5rem] text-[var(--fg)]">{fields(`${key}.title`)}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
