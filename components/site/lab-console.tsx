/**
 * LabConsole — the lab's job in five lines: a block is scanned, money is
 * tracked, something odd is flagged, the model decodes it, an answer ships.
 *
 * Every line is always readable; the motion is only a light that sweeps each
 * line in turn. The run is an example and says so.
 */
import { getTranslations } from 'next-intl/server';

const ROWS = [
  { cmd: 'scan', ref: 'block 21,408,113' },
  { cmd: 'track', ref: '0x7a3f…e41c' },
  { cmd: 'flag', ref: '0x91bd…07aa' },
  { cmd: 'decode', ref: 'ChronoVisor' },
  { cmd: 'ship', ref: '200 OK' },
] as const;

export async function LabConsole() {
  const t = await getTranslations('home.console');

  return (
    <div data-reveal className="glass overflow-hidden rounded-[26px]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--glass-line)] px-5 py-3.5 sm:px-7">
        <span className="flex items-center gap-2.5 font-mono text-[13.5px] font-semibold text-[var(--fg)]">
          <span aria-hidden className="pulse inline-block size-2 rounded-full bg-[var(--right)]" />
          {t('head')}
        </span>
        <span className="t-note text-right">{t('note')}</span>
      </div>
      <ol className="console">
        {ROWS.map(({ cmd, ref }, i) => (
          <li key={cmd} className="console-row" style={{ '--i': i } as React.CSSProperties}>
            <span className="font-mono text-[13px] text-[var(--fg-3)]">{String(i + 1).padStart(2, '0')}</span>
            <span className="t-display text-[clamp(1.25rem,1.6vw,1.6rem)] text-[var(--fg)]">{cmd}</span>
            <span className="font-mono text-[13.5px] text-[var(--fg-2)]">{ref}</span>
            <span className="text-[16px] leading-snug text-[var(--fg-2)]">{t(`rows.${cmd}`)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
