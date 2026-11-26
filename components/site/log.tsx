/** Log — update posts as dated rows. Used on the home page and on /updates. */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { formatDate, type UpdateMeta } from '@/lib/updates';

export async function Log({ posts, locale }: { posts: UpdateMeta[]; locale: Locale }) {
  const t = await getTranslations('log');

  return (
    <ul className="border-b border-[var(--line)]" data-stagger>
      {posts.map((p) => (
        <li key={p.slug} data-reveal className="border-t border-[var(--line)]">
          <Link href={`/updates/${p.slug}`} className="group grid gap-x-10 gap-y-2 py-6 sm:grid-cols-[220px_minmax(0,1fr)]">
            <span className="t-note t-num">
              <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
              <span className="mt-0.5 block font-semibold text-[var(--fg-2)]">{t(`tags.${p.tag}`)}</span>
            </span>
            <span>
              <span className="t-head block text-[var(--fg)] transition-colors duration-200 group-hover:text-[var(--accent)]">{p.title}</span>
              <span className="mt-2 block max-w-[62ch] text-[16.5px] leading-relaxed text-[var(--fg-2)]">{p.summary}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
