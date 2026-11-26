/**
 * Faq — native <details>, so it works with no JavaScript and the browser
 * handles keyboard and assistive tech. Also emitted as FAQPage structured data.
 */
import { getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';
import { Section, SectionHead } from '@/components/ui/section';

const ITEMS = ['what', 'vizzor', 'relation', 'free', 'work'] as const;

export async function Faq() {
  const t = await getTranslations('home.faq');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ITEMS.map((k) => ({
      '@type': 'Question',
      name: t(`items.${k}.q`),
      acceptedAnswer: { '@type': 'Answer', text: t(`items.${k}.a`) },
    })),
  };

  return (
    <Section id="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <SectionHead kicker={t('kicker')} title={t('title')} />
        </div>
        <div className="grid gap-3">
          {ITEMS.map((k) => (
            <details key={k} data-reveal className="l-glass group rounded-[22px] px-6 open:pb-6 sm:px-7">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold text-[var(--fg)] [&::-webkit-details-marker]:hidden">
                {t(`items.${k}.q`)}
                <Plus
                  size={18}
                  strokeWidth={2}
                  aria-hidden
                  className="shrink-0 text-[var(--fg-3)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45"
                />
              </summary>
              <p className="max-w-[62ch] text-[15.5px] leading-relaxed text-[var(--fg-2)]">{t(`items.${k}.a`)}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
