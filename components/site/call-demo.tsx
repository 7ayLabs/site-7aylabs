'use client';

/**
 * CallDemo — the site's one moving part: a call being made and then graded.
 *
 * It plays the four moments of a Vizzor call in a loop: the question, the
 * call (direction, target, deadline, confidence), the wait, and the grade.
 * Rounds alternate between a call that was right and one that was wrong,
 * because showing the misses is the whole point.
 *
 * It is an illustration with made-up values and says so. The reader can
 * pause it or jump to any step; under reduced motion it starts paused on
 * the graded state.
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Pause, Play } from 'lucide-react';

const STEPS = ['ask', 'call', 'wait', 'grade'] as const;
const HOLD_MS = [1700, 2400, 2600, 3400] as const;

interface Round {
  question: string;
  direction: 'up' | 'down';
  target: string;
  deadline: string;
  confidence: string;
}

export function CallDemo() {
  const t = useTranslations('demo');
  const rounds = t.raw('rounds') as Round[];
  const [step, setStep] = useState(3);
  const [round, setRound] = useState(0);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);

  // Start playing once mounted, unless the reader prefers reduced motion.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(0);
      setPlaying(true);
    }
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      if (step === 3) {
        setRound((r) => (r + 1) % rounds.length);
        setStep(0);
      } else {
        setStep(step + 1);
      }
    }, HOLD_MS[step]);
    return () => window.clearTimeout(id);
  }, [playing, step, rounds.length]);

  const r = rounds[round] ?? rounds[0]!;
  const right = round % 2 === 0;
  const called = step >= 1;
  const graded = step === 3;

  const value = (v: string) => (called ? v : '—');
  const cell = 'flex flex-col-reverse gap-1.5 border-t border-[var(--line)] py-3.5';
  const dt = 't-note';
  const dd = 't-num text-[1.35rem] font-semibold leading-none text-[var(--fg)]';

  return (
    <figure className="glass self-start overflow-hidden rounded-[20px]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] py-2 pl-5 pr-2">
        <figcaption className="text-[15px] font-semibold text-[var(--fg)]">{t('title')}</figcaption>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? t('pause') : t('play')}
          title={playing ? t('pause') : t('play')}
          className="inline-flex h-11 w-11 items-center justify-center rounded text-[var(--fg-2)] transition-colors duration-200 hover:text-[var(--accent)]"
        >
          {playing ? <Pause size={17} strokeWidth={2} aria-hidden /> : <Play size={17} strokeWidth={2} aria-hidden />}
        </button>
      </div>

      <div className="px-5 pb-5 pt-5">
        <p className="t-note">{t('youAsk')}</p>
        <p className="t-head mt-1.5 min-h-[1.1em] text-[var(--fg)]">“{r.question}”</p>

        <dl className="mt-5 grid grid-cols-2 gap-x-6">
          <div className={cell}>
            <dd className={dd}>
              {called ? (
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden>{r.direction === 'up' ? '▲' : '▼'}</span>
                  {t(r.direction)}
                </span>
              ) : (
                '—'
              )}
            </dd>
            <dt className={dt}>{t('direction')}</dt>
          </div>
          <div className={cell}>
            <dd className={dd}>{value(r.target)}</dd>
            <dt className={dt}>{t('target')}</dt>
          </div>
          <div className={cell}>
            <dd className={dd}>{value(r.deadline)}</dd>
            <dt className={dt}>{t('deadline')}</dt>
          </div>
          <div className={cell}>
            <dd className={dd}>{value(r.confidence)}</dd>
            <dt className={dt}>{t('confidence')}</dt>
          </div>
        </dl>

        {/* The wait, and the grade that ends it. */}
        <div className="relative mt-1 border-t border-[var(--line)] pt-5">
          <div aria-hidden className="h-[6px] overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--fg)_10%,transparent)]">
            <div
              key={`${round}-${step >= 2 ? 'on' : 'off'}`}
              className="demo-bar h-full bg-[var(--fg)]"
              data-run={step === 2 && playing ? '' : undefined}
              data-done={graded || (step === 2 && !playing) ? '' : undefined}
              style={{ '--demo-wait': `${HOLD_MS[2]}ms` } as React.CSSProperties}
            />
          </div>
          <div className="mt-4 flex min-h-[3.5rem] items-center justify-between gap-4">
            <p className="text-[15px] text-[var(--fg-2)]">
              {graded ? t(right ? 'gradedRight' : 'gradedWrong') : step === 2 ? t('waiting') : t('notYet')}
            </p>
            {graded ? (
              <span
                key={round}
                data-land=""
                className={`demo-stamp t-display inline-flex h-12 shrink-0 items-center gap-2 rounded-[4px] border-[3px] px-3 text-[1.7rem] uppercase ${
                  right ? 'border-[var(--right)] text-[var(--right)]' : 'border-[var(--wrong)] text-[var(--wrong)]'
                }`}
              >
                <span aria-hidden>{right ? '✓' : '✕'}</span>
                {t(right ? 'right' : 'wrong')}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <ol className="grid grid-cols-4 border-t border-[var(--line)]">
        {STEPS.map((s, i) => (
          <li key={s} className="border-l border-[var(--line)] first:border-l-0">
            <button
              type="button"
              aria-current={step === i ? 'step' : undefined}
              onClick={() => {
                setPlaying(false);
                setStep(i);
              }}
              className={`flex min-h-12 w-full items-center justify-center px-1 text-[14px] font-semibold transition-colors duration-200 hover:text-[var(--accent)] ${
                step === i ? 'bg-[var(--fg)] text-[var(--bg)] hover:text-[var(--bg)]' : 'text-[var(--fg-2)]'
              }`}
            >
              {t(`steps.${s}`)}
            </button>
          </li>
        ))}
      </ol>
      <p className="t-note border-t border-[var(--line)] px-5 py-3">{t('note')}</p>
    </figure>
  );
}
