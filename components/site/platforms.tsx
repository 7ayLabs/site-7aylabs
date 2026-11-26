/**
 * Platforms — where Vizzor runs, each with its real status.
 *
 * The status comes from `PLATFORMS` in lib/site.ts. Nothing is shown as
 * live before it is open to everyone.
 */
import { getTranslations } from 'next-intl/server';
import ExchangeHyperliquid from '@web3icons/react/icons/exchanges/ExchangeHyperliquid';
import { Globe, LineChart } from 'lucide-react';
import { PLATFORMS } from '@/lib/site';

function Mark({ id }: { id: (typeof PLATFORMS)[number]['id'] }) {
  if (id === 'hyperliquid') return <ExchangeHyperliquid variant="branded" size={26} />;
  const Icon = id === 'web' ? Globe : LineChart;
  return <Icon size={22} strokeWidth={1.6} className="text-[var(--accent)]" />;
}

export async function Platforms() {
  const t = await getTranslations('products.platforms');

  return (
    <div data-reveal>
      <h4 className="t-head text-[var(--fg)]">{t('title')}</h4>
      <ul className="mt-5 grid gap-3 md:grid-cols-3">
        {PLATFORMS.map((p) => {
          const live = p.status === 'live';
          const body = (
            <>
              <span aria-hidden className="glass grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[14px]">
                <Mark id={p.id} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[17px] font-semibold text-[var(--fg)]">{p.name}</span>
                <span className="mt-0.5 block text-[14.5px] text-[var(--fg-2)]">{t(`items.${p.id}`)}</span>
              </span>
              <span className={`inline-flex shrink-0 items-center gap-2 text-[14px] font-semibold ${live ? 'text-[var(--fg)]' : 'text-[var(--fg-2)]'}`}>
                {live ? <span className="pulse" aria-hidden /> : <span aria-hidden className="h-2 w-2 rounded-full border border-current" />}
                {t(live ? 'live' : 'testing')}
              </span>
            </>
          );
          const cls = 'glass flex min-h-[5.25rem] items-center gap-4 rounded-[20px] px-4 py-3';
          return (
            <li key={p.id}>
              {p.href ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer" className={`${cls} glass-live`}>
                  {body}
                </a>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="t-note mt-4 max-w-[70ch]">{t('note')}</p>
    </div>
  );
}
