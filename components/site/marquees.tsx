/**
 * Marquees: rows that slide by on their own. Each renders its content twice
 * so the loop has no seam; the copy is hidden from assistive tech.
 */
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { ChainMark } from '@/components/ui/chain-mark';
import { CHAINS } from '@/lib/vizzor/chains';

function Row({ children, reverse, dur }: { children: ReactNode; reverse?: boolean; dur: string }) {
  return (
    <div className="marquee" data-reverse={reverse ? '' : undefined}>
      <div className="marquee-track" style={{ '--dur': dur } as React.CSSProperties}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Every chain Vizzor reads, as glass tiles in two rows moving opposite ways. */
export function ChainMarquee() {
  const half = Math.ceil(CHAINS.length / 2);
  const tile = (c: (typeof CHAINS)[number]) => (
    <span key={c.id} className="glass mx-2 inline-flex min-h-[4.25rem] items-center gap-3 rounded-[18px] pl-3.5 pr-5">
      <ChainMark chain={c.id} size={36} />
      <span className="whitespace-nowrap text-[16px] font-semibold text-[var(--fg)]">{c.name}</span>
    </span>
  );
  return (
    <div className="grid gap-4">
      <Row dur="60s">{CHAINS.slice(0, half).map(tile)}</Row>
      <Row dur="66s" reverse>
        {CHAINS.slice(half).map(tile)}
      </Row>
    </div>
  );
}

/** The four disciplines as giant type: one row solid, one row glass. */
export async function Kinetic() {
  const t = await getTranslations('home');
  const words = t.raw('words') as string[];
  const row = (cls: string) =>
    words.map((w) => (
      <span key={w} className={`kinetic px-[0.32em] ${cls}`}>
        {w}
      </span>
    ));
  return (
    <div aria-hidden className="-mx-[calc((100vw-100%)/2)] grid gap-1 overflow-hidden py-6">
      <Row dur="38s">{row('')}</Row>
      <Row dur="46s" reverse>
        {row('kinetic-glass')}
      </Row>
    </div>
  );
}
