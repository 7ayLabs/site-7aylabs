'use client';

/**
 * ContactForm — name, email, topic, message.
 *
 * Validation runs on submit and reports next to each field; the first field
 * with a problem takes focus. The server checks everything again.
 */
import { useId, useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

const TOPICS = ['general', 'vizzor', 'partnership', 'press', 'security'] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Field = 'name' | 'email' | 'message';
type State = 'idle' | 'sending' | 'done' | 'error';

export function ContactForm() {
  const t = useTranslations('forms.contact');
  const locale = useLocale();
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<State>('idle');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const next: Partial<Record<Field, string>> = {};
    if (name.length < 2) next.name = t('errors.name');
    if (!EMAIL_RE.test(email)) next.email = t('errors.email');
    if (message.length < 10) next.message = t('errors.message');
    setErrors(next);
    const first = (['name', 'email', 'message'] as const).find((f) => next[f]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      setStatus('');
      return;
    }

    setState('sending');
    setStatus('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          topic: data.get('topic'),
          company: data.get('company'),
          locale,
        }),
      });
      if (res.ok) {
        const out = (await res.json().catch(() => ({}))) as { ref?: string };
        setState('done');
        setStatus(t('done', { ref: out.ref ?? '7AY' }));
        form.reset();
      } else {
        setState('error');
        setStatus(res.status === 429 ? t('rateLimited') : res.status === 400 ? t('invalid') : t('error'));
      }
    } catch {
      setState('error');
      setStatus(t('error'));
    }
  }

  const fieldProps = (f: Field) => ({
    'aria-invalid': errors[f] ? (true as const) : undefined,
    'aria-describedby': errors[f] ? `${id}-${f}-err` : undefined,
  });
  const err = (f: Field) =>
    errors[f] ? (
      <p id={`${id}-${f}-err`} className="mt-1.5 text-[13.5px] text-[var(--wrong)]">
        {errors[f]}
      </p>
    ) : null;
  const labelCls = 'block text-[15.5px] font-semibold text-[var(--fg)]';

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={labelCls}>
            {t('name')}
          </label>
          <input id={`${id}-name`} name="name" type="text" required autoComplete="name" maxLength={120} className="field mt-2" {...fieldProps('name')} />
          {err('name')}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={labelCls}>
            {t('email')}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            className="field mt-2"
            {...fieldProps('email')}
          />
          {err('email')}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-topic`} className={labelCls}>
          {t('topic')}
        </label>
        <select id={`${id}-topic`} name="topic" defaultValue="general" className="field mt-2 appearance-none">
          {TOPICS.map((k) => (
            <option key={k} value={k}>
              {t(`topics.${k}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={labelCls}>
          {t('message')}
        </label>
        <textarea id={`${id}-message`} name="message" required rows={6} maxLength={4000} className="field mt-2 resize-y" {...fieldProps('message')} />
        {err('message')}
      </div>

      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[40ch] text-[13.5px] leading-relaxed text-[var(--fg-3)]">{t('privacy')}</p>
        <button type="submit" disabled={state === 'sending'} className="btn btn-ink w-full disabled:opacity-60 sm:w-auto">
          <span>{state === 'sending' ? t('sending') : t('submit')}</span>
          {state === 'sending' ? <Loader2 size={16} aria-hidden className="animate-spin" /> : null}
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`min-h-6 text-[15px] font-medium ${state === 'error' ? 'text-[var(--wrong)]' : 'text-[var(--fg)]'}`}
      >
        {status}
      </p>
    </form>
  );
}
