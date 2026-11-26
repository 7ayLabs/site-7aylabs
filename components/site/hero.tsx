/**
 * Hero — what the lab is, with its four kinds of work as panes of glass that
 * lean toward the pointer, and under it what is on the bench right now.
 */
import { getTranslations } from 'next-intl/server';
import { AppWindow, ArrowUpRight, Blocks, BrainCircuit, Cpu } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { GlassIcon } from './glass3d/glass-icon';
import { WRAP } from './layout';

const PANES = [
  { key: 'apps', Icon: AppWindow, cls: 'left-[0%] top-[6%] w-[46%]', r: '-7deg', k: '18px' },
  { key: 'software', Icon: Cpu, cls: 'right-[0%] top-[14%] w-[48%]', r: '5deg', k: '-12px' },
  { key: 'intelligence', Icon: BrainCircuit, cls: 'left-[2%] top-[70%] w-[54%]', r: '3deg', k: '26px' },
  { key: 'onchain', Icon: Blocks, cls: 'right-[2%] top-[78%] w-[44%]', r: '-4deg', k: '-20px' },
] as const;

export async function Hero() {
  const t = await getTranslations('home.hero');
  const fields = await getTranslations('home.fields.items');

  return (
    <section className={`${WRAP} pb-10 pt-10 sm:pt-16`}>
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-6">
        <div>
          <h1 className="t-display type-settle max-w-[11ch] text-[clamp(2.9rem,1rem+6.1vw,7rem)] leading-[0.96] text-[var(--fg)]">{t('title')}</h1>
          <div data-reveal className="mt-9">
            <p className="t-lede">{t('sub')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn btn-ink">
                {t('ctaPrimary')}
              </Link>
              <Link href="/about" className="btn btn-line">
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative: the same four fields are listed as text further down. */}
        <div aria-hidden data-parallax className="stack relative hidden h-[32rem] lg:block">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <GlassIcon shape="lab" size={460} />
          </span>
          {PANES.map(({ key, Icon, cls, r, k }) => (
            <span
              key={key}
              className={`stack-pane glass absolute flex items-center gap-4 rounded-[20px] px-4 py-4 ${cls}`}
              style={{ '--r': r, '--k': k } as React.CSSProperties}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[var(--accent-fill)] text-[var(--on-accent)]">
                <Icon size={22} strokeWidth={1.6} />
              </span>
              <span className="t-display text-[1.5rem] text-[var(--fg)]">{fields(`${key}.title`)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* The bench: what is in the lab right now. */}
      <aside data-reveal="scale" aria-label={t('board.title')} className="glass mt-14 rounded-[28px] p-2 sm:mt-20">
        <p className="px-5 pb-2 pt-3 text-[15px] font-semibold text-[var(--fg-2)]">{t('board.title')}</p>
        <ul className="grid gap-2 md:grid-cols-2">
          <li>
            <Link href="/vizzor" className="glass glass-live group flex min-h-[6rem] items-center gap-4 rounded-[20px] px-5 py-4">
              <span className="min-w-0 flex-1">
                <span className="t-display block text-[1.9rem] text-[var(--fg)]">Vizzor</span>
                <span className="mt-1 block truncate text-[15px] text-[var(--fg-2)]">{t('board.vizzorLine')}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 text-[14.5px] font-semibold text-[var(--fg)]">
                <span className="pulse" aria-hidden />
                {t('board.live')}
              </span>
              <ArrowUpRight
                size={20}
                strokeWidth={2}
                aria-hidden
                className="shrink-0 text-[var(--fg-3)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
              />
            </Link>
          </li>
          <li className="flex min-h-[6rem] items-center gap-4 rounded-[20px] border border-dashed border-[var(--line-strong)] px-5 py-4">
            <span className="min-w-0 flex-1">
              <span className="t-display block text-[1.9rem] text-[var(--fg-3)]">{t('board.nextName')}</span>
              <span className="mt-1 block text-[15px] text-[var(--fg-2)]">{t('board.nextLine')}</span>
            </span>
            <span className="shrink-0 text-[14.5px] font-semibold text-[var(--fg-2)]">{t('board.building')}</span>
          </li>
        </ul>
      </aside>
    </section>
  );
}
