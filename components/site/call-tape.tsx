/**
 * CallTape — a ticker of example calls sliding by: the asset in its own
 * colours, the direction, the target, the deadline, and how it was graded.
 * The values are illustrative and the tape says so.
 */
import { getTranslations } from 'next-intl/server';
import { Disc, TOKENS, type Ticker } from '@/components/ui/web3-marks';

const CALLS: { ticker: Ticker; up: boolean; target: string; window: string; hit: boolean }[] = [
  { ticker: 'BTC', up: true, target: '+1.8%', window: '4h', hit: true },
  { ticker: 'ETH', up: true, target: '+2.4%', window: '4h', hit: true },
  { ticker: 'SOL', up: false, target: '−3.1%', window: '24h', hit: false },
  { ticker: 'BNB', up: true, target: '+1.2%', window: '12h', hit: true },
  { ticker: 'XRP', up: false, target: '−2.0%', window: '8h', hit: true },
  { ticker: 'AVAX', up: true, target: '+4.5%', window: '24h', hit: false },
  { ticker: 'DOGE', up: false, target: '−5.2%', window: '12h', hit: true },
  { ticker: 'LINK', up: true, target: '+3.0%', window: '8h', hit: true },
];

export async function CallTape() {
  const t = await getTranslations('products.vizzor');

  const items = CALLS.map((c) => (
    <span key={c.ticker} className="glass mx-1.5 inline-flex min-h-12 items-center gap-3 rounded-full py-1.5 pl-2 pr-4">
      <Disc Icon={TOKENS[c.ticker]} size={30} />
      <span className="t-num text-[14.5px] font-bold text-[var(--fg)]">{c.ticker}</span>
      <span className={`t-num text-[14.5px] font-semibold ${c.up ? 'text-[var(--right)]' : 'text-[var(--wrong)]'}`}>
        {c.up ? '▲' : '▼'} {c.target}
      </span>
      <span className="t-num text-[13.5px] text-[var(--fg-3)]">{c.window}</span>
      <span
        className={`rounded-full px-2.5 py-0.5 text-[12.5px] font-bold ${
          c.hit ? 'bg-[color-mix(in_oklab,var(--right)_18%,transparent)] text-[var(--right)]' : 'bg-[color-mix(in_oklab,var(--wrong)_18%,transparent)] text-[var(--wrong)]'
        }`}
      >
        {c.hit ? '✓' : '✕'} {t(c.hit ? 'right' : 'wrong')}
      </span>
    </span>
  ));

  return (
    <div>
      <p className="t-note mb-3 font-semibold">
        {t('tape')} <span className="font-normal">· {t('tapeNote')}</span>
      </p>
      <div className="tape" aria-hidden>
        <div className="tape-track">
          <div className="flex shrink-0 items-center">{items}</div>
          <div className="flex shrink-0 items-center">{items}</div>
        </div>
      </div>
    </div>
  );
}
