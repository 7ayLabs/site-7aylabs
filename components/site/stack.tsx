/**
 * Stack — how the lab is wired: the five layers every product sits on, from
 * what people touch down to the servers. A signal travels down the line that
 * joins them. It is a real order (each layer rests on the next), so it reads
 * top to bottom as a list.
 */
import { getTranslations } from 'next-intl/server';
import { AppWindow, Blocks, BrainCircuit, Cpu, Server } from 'lucide-react';
import type { ReactNode } from 'react';
import { ChainMark } from '@/components/ui/chain-mark';
import { Disc, WALLETS } from '@/components/ui/web3-marks';
import { VIZZOR } from '@/lib/site';
import { CHAIN_COUNT, type ChainId } from '@/lib/vizzor/chains';
import { GlassIcon } from './glass3d/glass-icon';
import type { GlassShape } from './glass3d/renderer';

const SHOWN: readonly ChainId[] = ['ethereum', 'solana', 'bitcoin', 'base', 'arbitrum', 'bnb', 'tron', 'ton'];

const LAYERS: { key: 'interface' | 'engine' | 'models' | 'chains' | 'ground'; shape: GlassShape; fallback: ReactNode }[] = [
  { key: 'interface', shape: 'apps', fallback: <AppWindow size={30} strokeWidth={1.5} /> },
  { key: 'engine', shape: 'software', fallback: <Cpu size={30} strokeWidth={1.5} /> },
  { key: 'models', shape: 'intelligence', fallback: <BrainCircuit size={30} strokeWidth={1.5} /> },
  { key: 'chains', shape: 'onchain', fallback: <Blocks size={30} strokeWidth={1.5} /> },
  { key: 'ground', shape: 'ground', fallback: <Server size={30} strokeWidth={1.5} /> },
];

function Overlap({ children }: { children: ReactNode[] }) {
  return (
    <span className="flex items-center">
      {children.map((c, i) => (
        <span key={i} className="rounded-full ring-2 ring-[var(--bg)]" style={{ marginLeft: i === 0 ? 0 : -9 }}>
          {c}
        </span>
      ))}
    </span>
  );
}

export async function Stack() {
  const t = await getTranslations('home.stack');
  const chip = 'glass inline-flex min-h-9 items-center rounded-full px-3.5 text-[14px] font-semibold text-[var(--fg)]';

  const extra: Record<string, ReactNode> = {
    interface: (
      <ul className="flex flex-wrap gap-2">
        {VIZZOR.languages.map((l) => (
          <li key={l} className={chip}>
            {l}
          </li>
        ))}
      </ul>
    ),
    models: (
      <ul className="flex flex-wrap gap-2">
        <li className={chip}>ChronoVisor</li>
        <li className={chip}>Claude</li>
      </ul>
    ),
    chains: (
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <span className="flex items-center gap-3">
          <Overlap>
            {SHOWN.map((c) => (
              <ChainMark key={c} chain={c} size={28} />
            ))}
          </Overlap>
          <span className="t-note font-semibold">{t('more', { count: CHAIN_COUNT - SHOWN.length })}</span>
        </span>
        <span className="flex items-center gap-3">
          <Overlap>
            {WALLETS.map((w) => (
              <Disc key={w.id} Icon={w.Icon} size={28} />
            ))}
          </Overlap>
          <span className="t-note font-semibold">{t('wallets')}</span>
          <span className="sr-only">{WALLETS.map((w) => w.name).join(', ')}</span>
        </span>
      </div>
    ),
  };

  return (
    <ol className="rail grid gap-3" data-stagger style={{ '--rail-run': `${LAYERS.length * 8.2}rem` } as React.CSSProperties}>
      {LAYERS.map((l) => (
        <li key={l.key} data-reveal className="glass glass-live relative grid items-center gap-x-6 gap-y-4 rounded-[26px] p-4 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:p-5 lg:grid-cols-[6.5rem_minmax(0,1fr)_auto]">
          <GlassIcon shape={l.shape} size={132} fallback={l.fallback} className="-m-4" />
          <div>
            <h3 className="t-head text-[var(--fg)]">{t(`layers.${l.key}.name`)}</h3>
            <p className="mt-1.5 max-w-[56ch] text-[16px] leading-relaxed text-[var(--fg-2)]">{t(`layers.${l.key}.line`, { count: CHAIN_COUNT })}</p>
          </div>
          {extra[l.key] ? <div className="sm:col-start-2 lg:col-start-3 lg:justify-self-end">{extra[l.key]}</div> : null}
        </li>
      ))}
    </ol>
  );
}
