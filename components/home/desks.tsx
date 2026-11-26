/**
 * Desks — what Vizzor does, as four desks on one floor.
 *
 * Each is a glass card with its own 3D glass object. Predict is the wide lead
 * card because every other desk feeds a call.
 */
import { getTranslations } from 'next-intl/server';
import { CandlestickChart, Layers, Network, Orbit } from 'lucide-react';
import type { ReactNode } from 'react';
import { GlassIcon } from '@/components/landing/v4/glass-icon';
import type { GlassShape } from '@/components/landing/v4/glass-renderer';
import { ChainMark } from '@/components/ui/chain-mark';
import { Section, SectionHead } from '@/components/ui/section';
import { CHAIN_COUNT, INTEL_SAMPLE, MAJOR_CHAINS, type ChainId } from '@/lib/vizzor/chains';

type DeskKey = 'predict' | 'intel' | 'markets' | 'record';

interface Desk {
  key: DeskKey;
  shape: GlassShape;
  fallback: ReactNode;
  span: string;
  chains?: readonly ChainId[];
  total?: number;
}

const DESKS: readonly Desk[] = [
  { key: 'predict', shape: 'orb', fallback: <Orbit size={56} strokeWidth={1.2} />, span: 'lg:col-span-4', chains: MAJOR_CHAINS },
  { key: 'intel', shape: 'trace', fallback: <Network size={56} strokeWidth={1.2} />, span: 'lg:col-span-2', chains: INTEL_SAMPLE, total: CHAIN_COUNT },
  { key: 'markets', shape: 'candles', fallback: <CandlestickChart size={56} strokeWidth={1.2} />, span: 'lg:col-span-3', chains: MAJOR_CHAINS },
  { key: 'record', shape: 'stack', fallback: <Layers size={56} strokeWidth={1.2} />, span: 'lg:col-span-3' },
];

function ChainRow({ chains, total }: { chains: readonly ChainId[]; total: number }) {
  return (
    <span className="flex items-center">
      {chains.map((c, i) => (
        <span key={c} className="rounded-full ring-2 ring-[var(--surface)]" style={{ marginLeft: i === 0 ? 0 : -8 }}>
          <ChainMark chain={c} size={20} />
        </span>
      ))}
      {total > chains.length ? (
        <span className="ml-2 text-[12.5px] font-semibold text-[var(--fg-2)]">+{total - chains.length}</span>
      ) : null}
    </span>
  );
}

export async function Desks() {
  const t = await getTranslations('home.desks');

  return (
    <Section id="desks">
      <SectionHead kicker={t('kicker')} title={t('title')} lede={t('lede')} />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {DESKS.map((d) => (
          <article
            key={d.key}
            data-reveal
            className={`l-glass relative flex min-h-[340px] flex-col overflow-hidden rounded-[32px] p-7 sm:p-8 ${d.span}`}
          >
            <div className="-my-6 flex flex-1 items-center justify-center">
              <GlassIcon shape={d.shape} size={d.key === 'predict' ? 320 : 250} fallback={d.fallback} />
            </div>
            <h3 className="l-card-title text-[var(--fg)]">{t(`items.${d.key}.name`)}</h3>
            <p className="mt-2 max-w-[460px] text-[15.5px] leading-relaxed text-[var(--fg-2)]">{t(`items.${d.key}.line`)}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[var(--l-hairline)] pt-4">
              {d.chains ? <ChainRow chains={d.chains} total={d.total ?? d.chains.length} /> : null}
              <span className="text-[13px] font-medium text-[var(--fg-3)]">{t(`items.${d.key}.reach`, { count: CHAIN_COUNT })}</span>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
