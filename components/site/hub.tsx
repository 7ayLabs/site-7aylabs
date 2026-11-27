/**
 * Hub — everything Vizzor connects to, as a hub and spokes: the product in
 * the middle, the chains it reads around it, and light running in along
 * each line. Decorative; the same facts are stated in text around it.
 */
import { getTranslations } from 'next-intl/server';
import { ChainMark } from '@/components/ui/chain-mark';
import type { ChainId } from '@/lib/vizzor/chains';

const SPOKES: readonly ChainId[] = ['ethereum', 'solana', 'bitcoin', 'base', 'arbitrum', 'bnb', 'tron', 'ton', 'sui', 'polygon'];

export async function Hub() {
  const t = await getTranslations('home.hub');
  const R = 39; // radius of the ring, in % of the square

  return (
    <figure data-reveal="scale" className="mx-auto w-full max-w-[640px]">
      <figcaption className="t-head text-center text-[var(--fg)]">{t('title')}</figcaption>
      <p className="t-note mx-auto mt-2 max-w-[44ch] text-center">{t('note')}</p>
      <div aria-hidden className="relative mx-auto mt-8 aspect-square w-full max-w-[560px]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
          {SPOKES.map((c, i) => {
            const a = (i / SPOKES.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(a) * R;
            const y = 50 + Math.sin(a) * R;
            return (
              <g key={c}>
                <line x1={x} y1={y} x2="50" y2="50" className="spoke" vectorEffect="non-scaling-stroke" />
                <line
                  x1={x}
                  y1={y}
                  x2="50"
                  y2="50"
                  pathLength={100}
                  className="spoke-light"
                  vectorEffect="non-scaling-stroke"
                  style={{ '--d': `${(i * -0.34).toFixed(2)}s` } as React.CSSProperties}
                />
              </g>
            );
          })}
        </svg>
        {SPOKES.map((c, i) => {
          const a = (i / SPOKES.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <span
              key={c}
              className="glass absolute grid h-[13%] w-[13%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[26%]"
              style={{ left: `${50 + Math.cos(a) * R}%`, top: `${50 + Math.sin(a) * R}%` }}
            >
              <ChainMark chain={c} size={30} />
            </span>
          );
        })}
        <span className="glass absolute left-1/2 top-1/2 grid h-[27%] w-[27%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[24%]">
          <span className="t-display text-[clamp(1.1rem,3vw,1.7rem)] text-[var(--fg)]">{t('center')}</span>
        </span>
      </div>
    </figure>
  );
}
