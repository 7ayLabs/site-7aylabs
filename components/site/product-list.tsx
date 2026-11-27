/**
 * ProductList — the lab's releases. Each one is a card: its mark, its status,
 * one line on what it does, and the way in. The product's own demo and
 * detail live on its own page, so this page stays about the lab.
 * Unreleased work is one honest row: no names, no dates.
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { VizzorMark } from '@/components/layout/brand-mark';
import { VIZZOR } from '@/lib/site';

export async function ProductList() {
  const t = await getTranslations('products');

  return (
    <div className="grid gap-4">
      <article id="vizzor" data-reveal="scale" className="glass scroll-mt-28 overflow-hidden rounded-[30px]">
        <header className="flex flex-col items-center gap-6 px-6 pb-10 pt-10 text-center sm:px-10 sm:pb-14 sm:pt-14">
          <span className="float glass grid h-24 w-24 place-items-center rounded-[26px]">
            <VizzorMark className="h-12 w-auto" />
          </span>
          <div>
            <p className="flex items-center justify-center gap-4 text-[14.5px] font-semibold text-[var(--fg-2)]">
              <span className="inline-flex items-center gap-2 text-[var(--fg)]">
                <span className="pulse" aria-hidden />
                {t('vizzor.live')}
              </span>
              <span>{t('vizzor.kind')}</span>
            </p>
            <h3 className="t-display mt-3 text-[clamp(3.2rem,8vw,6rem)] leading-[0.92] text-[var(--fg)]">Vizzor</h3>
            <p className="mx-auto mt-5 max-w-[52ch] text-[17px] leading-relaxed text-[var(--fg-2)]">{t('vizzor.line')}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={VIZZOR.app} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
              {t('vizzor.open')}
            </a>
            <Link href="/vizzor" className="btn btn-line">
              {t('vizzor.more')}
            </Link>
          </div>
        </header>

      </article>

      <article
        data-reveal
        className="flex flex-col gap-5 rounded-[30px] border border-dashed border-[var(--line-strong)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9"
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
