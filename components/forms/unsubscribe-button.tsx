'use client';

/** The one button on the unsubscribe page. The result replaces it. */
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

type State = 'idle' | 'sending' | 'done' | 'invalid' | 'error';

export function UnsubscribeButton({ s, t: token }: { s: string; t: string }) {
  const t = useTranslations('unsubscribePage');
  const [state, setState] = useState<State>(s && token ? 'idle' : 'invalid');

  async function go() {
    setState('sending');
    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ s: Number(s), t: token }),
      });
      setState(res.ok ? 'done' : res.status === 400 ? 'invalid' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done' || state === 'invalid') {
    return (
      <p role="status" className="glass max-w-[52ch] rounded-[18px] px-5 py-4 text-[17px] text-[var(--fg)]">
        {t(state)}
      </p>
    );
  }

  return (
    <div>
      <button type="button" onClick={go} disabled={state === 'sending'} className="btn btn-ink disabled:opacity-60">
        {state === 'sending' ? <Loader2 size={16} aria-hidden className="animate-spin" /> : null}
        {t('button')}
      </button>
      <p role="status" aria-live="polite" className="mt-3 min-h-6 text-[15px] text-[var(--wrong)]">
        {state === 'error' ? t('error') : ''}
      </p>
    </div>
  );
}
