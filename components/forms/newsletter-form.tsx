'use client';

/**
 * NewsletterForm — one field, one button.
 *
 * The result is announced in a live region; the hidden "company" field is a
 * honeypot that people never see and scripts tend to fill in.
 */
import { useId, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

type State = 'idle' | 'sending' | 'done' | 'error';

export function NewsletterForm() {
  const t = useTranslations('forms.newsletter');
  const locale = useLocale();
  const id = useId();
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setState('sending');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: data.get('email'), company: data.get('company'), locale }),
      });
      if (res.ok) {
        setState('done');
        setMessage(t('done'));
        form.reset();
      } else {
        setState('error');
        setMessage(res.status === 429 ? t('rateLimited') : res.status === 400 ? t('invalid') : t('error'));
      }
    } catch {
      setState('error');
      setMessage(t('error'));
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-[440px]">
      <label htmlFor={`${id}-email`} className="text-[14px] font-semibold text-[var(--fg)]">
        {t('label')}
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={t('placeholder')}
          aria-invalid={state === 'error' ? true : undefined}
          aria-describedby={`${id}-status`}
          className="l-field !rounded-full"
        />
        {/* Honeypot: off-screen, out of the tab order, ignored by assistive tech. */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
        <button
          type="submit"
          disabled={state === 'sending'}
          aria-label={t('submit')}
          className="l-btn l-btn-primary !w-[3.25rem] shrink-0 !px-0 disabled:opacity-60"
        >
          {state === 'sending' ? (
            <Loader2 size={18} aria-hidden className="animate-spin" />
          ) : state === 'done' ? (
            <Check size={18} strokeWidth={2.5} aria-hidden />
          ) : (
            <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
          )}
        </button>
      </div>
      <p
        id={`${id}-status`}
        role="status"
        aria-live="polite"
        className={`mt-2 min-h-5 text-[13.5px] ${state === 'error' ? 'text-[var(--danger)]' : 'text-[var(--fg-2)]'}`}
      >
        {message || t('hint')}
      </p>
    </form>
  );
}
