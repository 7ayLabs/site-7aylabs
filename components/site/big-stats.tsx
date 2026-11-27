/**
 * BigStats — the lab in three large figures, read from the site's own data
 * and counted up each time they come into view.
 */
import { getTranslations } from 'next-intl/server';
import { PLATFORMS, VIZZOR } from '@/lib/site';
import { CHAIN_COUNT } from '@/lib/vizzor/chains';
import { Count } from './count';

const LIVE_PRODUCTS = PLATFORMS.some((p) => p.id === 'web' && p.status === 'live') ? 1 : 0;

export async function BigStats() {
  const t = await getTranslations('home.status');
  const items = [
    { n: LIVE_PRODUCTS, label: t('products') },
    { n: CHAIN_COUNT, label: t('chains') },
    { n: VIZZOR.languages.length, label: t('languages') },
  ];

  return (
    <dl aria-label={t('title')} className="grid gap-y-10 sm:grid-cols-3" data-stagger>
      {items.map((it) => (
        <div key={it.label} data-reveal className="flex flex-col-reverse items-center gap-3 text-center">
          <dt className="text-[13.5px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-2)]">{it.label}</dt>
          <dd className="t-display t-num text-[clamp(4.5rem,11vw,9rem)] font-extrabold leading-[0.9] text-[var(--fg)]">
            <Count to={it.n} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
