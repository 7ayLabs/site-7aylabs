'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[70dvh] max-w-[1320px] flex-col items-start justify-center px-4 py-24 sm:px-6">
      <h1 className="l-display l-section-title max-w-[16ch] text-[var(--fg)]">{t('title')}</h1>
      <p className="l-lede mt-6">{t('lede')}</p>
      <button type="button" onClick={reset} className="l-btn l-btn-primary mt-10">
        {t('retry')}
      </button>
    </section>
  );
}
