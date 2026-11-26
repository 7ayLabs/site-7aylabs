'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[70dvh] max-w-[1400px] flex-col items-start justify-center px-5 py-20 sm:px-8">
      <h1 className="t-display t-title max-w-[16ch] text-[var(--fg)]">{t('title')}</h1>
      <p className="t-lede mt-6">{t('lede')}</p>
      <button type="button" onClick={reset} className="btn btn-ink mt-10">
        {t('retry')}
      </button>
    </section>
  );
}
