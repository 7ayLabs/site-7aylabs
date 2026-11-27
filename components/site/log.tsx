/** Log — update posts as dated rows. Used on the home page and on /updates. */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { formatDate, type UpdateMeta } from '@/lib/updates';

export async function Log({ posts, locale }: { posts: UpdateMeta[]; locale: Locale }) {
  const t = await getTranslations('log');

  return (
    <ul className="grid gap-4 md:grid-cols-2" data-stagger>
      {posts.map((p) => (
        <li key={p.slug} data-reveal>
          <Link href={`/updates/${p.slug}`} className="glass glass-live group flex h-full min-h-[15rem] flex-col gap-5 rounded-[26px] p-7">
            <span className="t-note t-num flex items-center justify-between gap-4">
              <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
              <span className="rounded-full bg-[color-mix(in_oklab,var(--accent-fill)_16%,transparent)] px-3 py-1 font-semibold text-[var(--accent)]">{t(`tags.${p.tag}`)}</span>
            </span>
            <span className="mt-auto">
              <span className="t-head block text-[var(--fg)] transition-colors duration-200 group-hover:text-[var(--accent)]">{p.title}</span>
              <span className="mt-2 block max-w-[62ch] text-[16.5px] leading-relaxed text-[var(--fg-2)]">{p.summary}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
