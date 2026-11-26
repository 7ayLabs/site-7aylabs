/**
 * UpdatesPreview — the three most recent posts.
 */
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { Section, SectionHead } from '@/components/ui/section';
import { formatDate, listUpdates } from '@/lib/updates';

export async function UpdatesPreview() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('home.updates');
  const posts = listUpdates(locale).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <Section id="updates">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionHead kicker={t('kicker')} title={t('title')} />
        </div>
        <Link href="/updates" data-reveal className="l-btn l-btn-ghost self-start sm:self-auto">
          {t('all')}
        </Link>
      </div>

      <ul className={`mt-12 grid gap-5 ${posts.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
        {posts.map((p) => (
          <li key={p.slug} data-reveal>
            <Link
              href={`/updates/${p.slug}`}
              className="l-glass group flex h-full min-h-[220px] flex-col rounded-[26px] p-7 transition-colors duration-300 hover:border-[var(--border-hi)]"
            >
              <span className="flex items-center justify-between text-[13px] font-medium text-[var(--fg-3)]">
                <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
                <span className="rounded-full border border-[var(--border-hi)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--fg-2)]">
                  {t(`tags.${p.tag}`)}
                </span>
              </span>
              <span className="l-card-title mt-5 block text-[var(--fg)]">{p.title}</span>
              <span className="mt-2 block text-[15px] leading-relaxed text-[var(--fg-2)]">{p.summary}</span>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-semibold text-[var(--fg)]">
                {t('read')}
                <ArrowUpRight
                  size={15}
                  strokeWidth={2.25}
                  aria-hidden
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
