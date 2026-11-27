'use client';

/**
 * VizzorShowcase — Vizzor's four desks as tabs, each with a small looping
 * scene that shows what the desk does. The tabs advance on their own and
 * stop for good the moment the reader picks one.
 *
 * The scenes are illustrations: the figures in them are examples.
 */
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const TABS = ['predict', 'whales', 'forensics', 'markets'] as const;
type Tab = (typeof TABS)[number];
const HOLD_MS = 5200;

function PredictScene({ t }: { t: ReturnType<typeof useTranslations> }) {
  const row = 'flex items-center justify-between border-t border-[var(--glass-line)] py-2.5 text-[14.5px]';
  return (
    <div className="scene-rise mx-auto w-full max-w-[340px] rounded-[18px] border border-[var(--glass-line)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between">
        <span className="t-display text-[1.6rem] text-[var(--fg)]">{t('slip.asset')}</span>
        <span className="t-num rounded-full bg-[color-mix(in_oklab,var(--right)_18%,transparent)] px-3 py-1 text-[13px] font-bold text-[var(--right)]">
          ▲ {t('slip.dir')}
        </span>
      </div>
      <dl className="mt-3">
        {[
          [t('slip.target'), '+2.4%'],
          [t('slip.deadline'), '4h'],
          [t('slip.conf'), '68%'],
          [t('slip.entry'), '1,958'],
          [t('slip.tp'), '1,985 / 2,005'],
          [t('slip.stop'), '1,938'],
        ].map(([k, v]) => (
          <div key={k} className={row}>
            <dt className="text-[var(--fg-2)]">{k}</dt>
            <dd className="t-num font-semibold text-[var(--fg)]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function WhalesScene() {
  const bubbles = [
    { x: 18, y: 58, r: 54, up: true },
    { x: 44, y: 34, r: 78, up: true },
    { x: 70, y: 62, r: 46, up: false },
    { x: 84, y: 30, r: 34, up: true },
    { x: 30, y: 24, r: 28, up: false },
  ];
  return (
    <div className="scene-rise relative mx-auto h-[250px] w-full max-w-[400px]">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="bubble absolute rounded-full border"
          style={
            {
              '--i': i,
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.r,
              height: b.r,
              marginLeft: -b.r / 2,
              marginTop: -b.r / 2,
              borderColor: b.up ? 'var(--right)' : 'var(--wrong)',
              background: `color-mix(in oklab, ${b.up ? 'var(--right)' : 'var(--wrong)'} 16%, transparent)`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function ForensicsScene() {
  const pts: [number, number][] = [
    [8, 50],
    [30, 22],
    [52, 60],
    [74, 30],
    [92, 56],
  ];
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
  return (
    <svg viewBox="0 0 100 80" className="scene-rise mx-auto h-[250px] w-full max-w-[400px]" fill="none">
      <path d={d} stroke="var(--line-strong)" strokeWidth="0.6" />
      <path d={d} pathLength={100} className="trace" stroke="var(--fg)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4.2" fill="var(--surface)" stroke="var(--fg)" strokeWidth="0.8" />
          <circle cx={x} cy={y} r="1.5" fill={i === pts.length - 1 ? 'var(--wrong)' : 'var(--fg)'} />
        </g>
      ))}
    </svg>
  );
}

function MarketsScene() {
  // A fixed pattern, so the server and the browser draw the same grid.
  const cells = [1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1];
  return (
    <div className="heat scene-rise mx-auto grid w-full max-w-[400px] grid-cols-6 gap-1.5">
      {cells.map((up, i) => (
        <i
          key={i}
          className="block aspect-square rounded-[8px]"
          style={{ '--i': i, background: `color-mix(in oklab, ${up ? 'var(--right)' : 'var(--wrong)'} ${30 + ((i * 37) % 50)}%, transparent)` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function VizzorShowcase() {
  const t = useTranslations('products.vizzor');
  const [tab, setTab] = useState<Tab>('predict');
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAuto(true);
  }, []);

  useEffect(() => {
    if (!auto) return;
    const id = window.setTimeout(() => setTab((cur) => TABS[(TABS.indexOf(cur) + 1) % TABS.length]!), HOLD_MS);
    return () => window.clearTimeout(id);
  }, [auto, tab]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
      <div role="tablist" aria-orientation="vertical" className="grid content-start gap-2">
        {TABS.map((k) => {
          const on = k === tab;
          return (
            <button
              key={k}
              role="tab"
              type="button"
              id={`viz-tab-${k}`}
              aria-selected={on}
              aria-controls="viz-panel"
              onClick={() => {
                setAuto(false);
                setTab(k);
              }}
              className={`relative overflow-hidden rounded-[18px] border px-5 py-4 text-left transition-colors duration-300 ${
                on ? 'border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--fg)_7%,transparent)]' : 'border-[var(--glass-line)] hover:border-[var(--line-strong)]'
              }`}
            >
              <span className={`t-head block ${on ? 'text-[var(--fg)]' : 'text-[var(--fg-2)]'}`}>{t(`tabs.${k}.name`)}</span>
              {on ? <span className="mt-1.5 block text-[15px] leading-relaxed text-[var(--fg-2)]">{t(`tabs.${k}.line`)}</span> : null}
              {on && auto ? (
                <span
                  key={k}
                  aria-hidden
                  className="tab-fill absolute inset-x-0 bottom-0 block h-[2px] bg-[var(--fg)]"
                  style={{ '--hold': `${HOLD_MS}ms` } as React.CSSProperties}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        id="viz-panel"
        role="tabpanel"
        aria-labelledby={`viz-tab-${tab}`}
        className="glass flex min-h-[380px] flex-col justify-between gap-6 rounded-[22px] p-6 sm:p-8"
      >
        <p key={`h-${tab}`} className="scene-rise t-display text-[clamp(1.5rem,2.4vw,2.1rem)] text-[var(--fg)]">
          {t(`tabs.${tab}.title`)}
        </p>
        <div key={tab} aria-hidden className="grid flex-1 place-items-center">
          {tab === 'predict' ? <PredictScene t={t} /> : tab === 'whales' ? <WhalesScene /> : tab === 'forensics' ? <ForensicsScene /> : <MarketsScene />}
        </div>
        <p className="t-note">{t('tapeNote')}</p>
      </div>
    </div>
  );
}
