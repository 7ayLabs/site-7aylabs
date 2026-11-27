/**
 * BigStats — the lab in three large figures, centred, read from the site's
 * own data and counted up each time they come into view.
 */
import { getTranslations } from 'next-intl/server';
import { PLATFORMS } from '@/lib/site';
import { CHAIN_COUNT } from '@/lib/vizzor/chains';
import { Count } from './count';

const LIVE_PRODUCTS = PLATFORMS.some((p) => p.id === 'web' && p.status === 'live') ? 1 : 0;

/** Scan, track, decode, ship: the four in `fields.tsx`. */
const INSTRUMENTS = 4;

export async function BigStats() {
  const t = await getTranslations('home.status');
  const items = [
    { n: LIVE_PRODUCTS, label: t('products') },
    { n: CHAIN_COUNT, label: t('chains') },
    { n: INSTRUMENTS, label: t('instruments') },
  ];

  return (
    <dl aria-label={t('title')} className="glass grid overflow-hidden rounded-[22px] sm:grid-cols-3" data-stagger>
      {items.map((it) => (
        <div key={it.label} data-reveal className="-mb-px -mr-px flex flex-col-reverse items-center gap-3 border-b border-r border-[var(--glass-line)] px-6 py-9 text-center">
          <dt className="text-[15px] font-medium text-[var(--fg-2)]">{it.label}</dt>
          <dd className="t-display t-num text-[clamp(3.5rem,7vw,6rem)] font-bold leading-[0.9] text-[var(--fg)]">
            <Count to={it.n} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
