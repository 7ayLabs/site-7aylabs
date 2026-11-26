/**
 * ProductList — what has left the lab, and a plain word on what has not.
 *
 * Vizzor gets a wide glass pane with its call demo beside the copy, because
 * the demo is the quickest way to see what the product does. Unreleased work
 * is one honest row: no names, no dates.
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { VIZZOR } from '@/lib/site';
import { ChainMark } from '@/components/ui/chain-mark';
import { CHAIN_COUNT, INTEL_SAMPLE } from '@/lib/vizzor/chains';
import { CallDemo } from './call-demo';
import { Platforms } from './platforms';

export async function ProductList() {
  const t = await getTranslations('products');
  const board = await getTranslations('home.hero.board');

  return (
    <div className="grid gap-4">
      <article data-reveal="scale" className="glass rounded-[32px] p-6 sm:p-10">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,430px)] xl:gap-14">
          <div className="flex flex-col">
            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-semibold text-[var(--fg-2)]">
              <span className="inline-flex items-center gap-2 text-[var(--fg)]">
                <span className="pulse" aria-hidden />
                {board('live')}
              </span>
              <span>{t('vizzor.kind')}</span>
            </p>
            <h3 className="t-display mt-5 text-[clamp(3rem,6vw,5.25rem)] leading-[0.95] text-[var(--fg)]">Vizzor</h3>
            <p className="mt-6 max-w-[48ch] text-[1.15rem] leading-relaxed text-[var(--fg-2)]">{t('vizzor.line', { count: CHAIN_COUNT })}</p>
            <p aria-hidden className="mt-6 flex items-center">
              {INTEL_SAMPLE.map((c, i) => (
                <span key={c} className="rounded-full ring-2 ring-[var(--bg)]" style={{ marginLeft: i === 0 ? 0 : -9 }}>
                  <ChainMark chain={c} size={30} />
                </span>
              ))}
              <span className="t-note t-num ml-3 font-semibold">+{CHAIN_COUNT - INTEL_SAMPLE.length}</span>
            </p>
            <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
              <Link href="/vizzor" className="btn btn-ink">
                {t('vizzor.more')}
              </Link>
              <a href={VIZZOR.app} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                {t('vizzor.open')}
              </a>
            </div>
          </div>
          <CallDemo />
        </div>
        <div className="mt-10 border-t border-[var(--glass-line)] pt-8">
          <Platforms />
        </div>
      </article>

      <article
        data-reveal
        className="flex flex-col gap-5 rounded-[32px] border border-dashed border-[var(--line-strong)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9"
      >
        <div>
          <h3 className="t-head text-[var(--fg)]">{t('next.title')}</h3>
          <p className="mt-2 max-w-[56ch] text-[16.5px] leading-relaxed text-[var(--fg-2)]">{t('next.line')}</p>
        </div>
        <Link href="/contact" className="btn btn-line shrink-0">
          {t('next.cta')}
        </Link>
      </article>
    </div>
  );
}
