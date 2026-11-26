/**
 * Principles — how the lab works, in four short statements.
 * Used on the home page (compact) and on /about.
 */
import { getTranslations } from 'next-intl/server';
import { Section, SectionHead } from '@/components/ui/section';

const ITEMS = ['receipts', 'plain', 'privacy', 'ship'] as const;

export async function Principles() {
  const t = await getTranslations('principles');

  return (
    <Section id="principles">
      <SectionHead kicker={t('kicker')} title={t('title')} lede={t('lede')} />
      <ol className="mt-14 grid gap-5 sm:grid-cols-2">
        {ITEMS.map((k, i) => (
          <li key={k} data-reveal className="l-glass rounded-[26px] p-7 sm:p-8">
            <span className="mono text-[13px] font-semibold text-[var(--fg-3)]">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="l-card-title mt-4 text-[var(--fg)]">{t(`items.${k}.title`)}</h3>
            <p className="mt-2 text-[15.5px] leading-relaxed text-[var(--fg-2)]">{t(`items.${k}.line`)}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
