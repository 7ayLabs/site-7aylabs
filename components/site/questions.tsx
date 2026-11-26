/**
 * Questions — native <details>, so it works without JavaScript and the
 * browser handles keyboard and assistive tech. Also emitted as FAQPage data.
 */
import { getTranslations } from 'next-intl/server';

const ITEMS = ['what', 'vizzor', 'relation', 'free', 'work'] as const;

export async function Questions() {
  const t = await getTranslations('questions');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ITEMS.map((k) => ({
      '@type': 'Question',
      name: t(`${k}.q`),
      acceptedAnswer: { '@type': 'Answer', text: t(`${k}.a`) },
    })),
  };

  return (
    <div className="border-b border-[var(--line)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {ITEMS.map((k) => (
        <details key={k} className="group border-t border-[var(--line)]">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 transition-colors duration-200 hover:text-[var(--accent)] [&::-webkit-details-marker]:hidden">
            <span className="t-head text-[var(--fg)] group-hover:text-[var(--accent)]">{t(`${k}.q`)}</span>
            <span aria-hidden className="relative h-4 w-4 shrink-0">
              <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 bg-current" />
              <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <p className="max-w-[62ch] pb-7 text-[16.5px] leading-relaxed text-[var(--fg-2)]">{t(`${k}.a`)}</p>
        </details>
      ))}
    </div>
  );
}
