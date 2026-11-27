/**
 * Status — the lab in four figures, all read from the site's own data: the
 * products that are live, the blockchains Vizzor reads, the languages it
 * speaks, and the date of the newest note. Nothing here is typed in by hand.
 */
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PLATFORMS, VIZZOR } from '@/lib/site';
import { listUpdates } from '@/lib/updates';
import { CHAIN_COUNT } from '@/lib/vizzor/chains';
import { Count } from './count';
import { Decode } from './decode';

/** Products that are open to everyone today. Vizzor is the one so far. */
const LIVE_PRODUCTS = PLATFORMS.some((p) => p.id === 'web' && p.status === 'live') ? 1 : 0;

export async function Status({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.status');
  const newest = listUpdates(locale)[0]?.date;
  const date = newest
    ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${newest}T00:00:00Z`))
    : null;

  const figure = 't-display t-num block text-[clamp(2rem,3.4vw,3rem)] leading-none text-[var(--fg)]';
  const label = 't-note mt-2 block';

  return (
    <section aria-label={t('title')} data-reveal="scale" className="glass rounded-[24px]">
      <dl className="status">
        <div className="flex flex-col-reverse justify-end">
          <dt className={label}>{t('products')}</dt>
          <dd className={`${figure} flex items-center gap-3`}>
            <Count to={LIVE_PRODUCTS} />
            <span className="pulse" aria-hidden />
          </dd>
        </div>
        <div className="flex flex-col-reverse justify-end">
          <dt className={label}>{t('chains')}</dt>
          <dd className={figure}>
            <Count to={CHAIN_COUNT} />
          </dd>
        </div>
        <div className="flex flex-col-reverse justify-end">
          <dt className={label}>{t('languages')}</dt>
          <dd className={figure}>
            <Count to={VIZZOR.languages.length} />
          </dd>
        </div>
        {date ? (
          <div className="flex flex-col-reverse justify-end">
            <dt className={label}>{t('latest')}</dt>
            <dd className={`${figure} !text-[clamp(1.25rem,2vw,1.75rem)] !leading-[1.5]`}>
              <Decode text={date} />
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
