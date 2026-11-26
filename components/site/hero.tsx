/**
 * Hero — what the lab is, in the tallest type on the site, and what is on
 * its bench right now.
 *
 * The headline arrives wide and tightens into the lab's narrow voice
 * (`.type-settle`); the glass board beside the copy lists the products:
 * the one that is live, and an honest line about the next.
 */
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { WRAP } from './layout';

export async function Hero() {
  const t = await getTranslations('home.hero');

  return (
    <section className={`${WRAP} grid items-end gap-12 pb-20 pt-10 sm:pb-28 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16`} data-stagger>
      <div>
        <h1 className="t-display type-settle max-w-[15ch] text-[clamp(3.1rem,1rem+7.2vw,8.25rem)] leading-[0.86] text-[var(--fg)]">{t('title')}</h1>
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

      <aside data-reveal aria-label={t('board.title')} className="glass rounded-[22px] p-2">
          <p className="px-4 pb-2 pt-3 text-[15px] font-semibold text-[var(--fg-2)]">{t('board.title')}</p>
          <ul>
            <li>
              <Link
                href="/vizzor"
                className="glass glass-live group flex min-h-[5.25rem] items-center gap-4 rounded-[16px] px-4 py-3"
              >
                <span className="min-w-0 flex-1">
                  <span className="t-display block text-[2.1rem] text-[var(--fg)]">Vizzor</span>
                  <span className="mt-1 block truncate text-[14.5px] text-[var(--fg-2)]">{t('board.vizzorLine')}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-2 text-[14px] font-semibold text-[var(--fg)]">
                  <span className="pulse" aria-hidden />
                  {t('board.live')}
                </span>
                <ArrowUpRight
                  size={18}
                  strokeWidth={2}
                  aria-hidden
                  className="shrink-0 text-[var(--fg-3)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                />
              </Link>
            </li>
            <li className="mt-2 flex min-h-[5.25rem] items-center gap-4 rounded-[16px] border border-dashed border-[var(--line-strong)] px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="t-display block text-[2.1rem] text-[var(--fg-3)]">{t('board.nextName')}</span>
                <span className="mt-1 block text-[14.5px] text-[var(--fg-2)]">{t('board.nextLine')}</span>
              </span>
              <span className="shrink-0 text-[14px] font-semibold text-[var(--fg-2)]">{t('board.building')}</span>
            </li>
          </ul>
        </aside>
    </section>
  );
}
