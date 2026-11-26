import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { PageHead, Section } from '@/components/ui/section';
import { pageMetadata } from '@/lib/seo';
import { formatDate, listUpdates } from '@/lib/updates';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'updatesPage.meta' });
  return pageMetadata({ path: '/updates', locale: locale as Locale, title: t('title'), description: t('description') });
}

export default async function UpdatesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('updatesPage');
  const tags = await getTranslations('home.updates.tags');
  const posts = listUpdates(locale as Locale);

  return (
    <>
      <PageHead kicker={t('kicker')} title={t('title')} lede={t('lede')} />
      <Section id="posts" tight>
        {posts.length === 0 ? (
          <p className="l-lede">{t('empty')}</p>
        ) : (
          <ul className="grid gap-4">
            {posts.map((p) => (
              <li key={p.slug} data-reveal>
                <Link
                  href={`/updates/${p.slug}`}
                  className="l-glass group grid gap-4 rounded-[26px] p-7 transition-colors duration-300 hover:border-[var(--border-hi)] sm:grid-cols-[200px_minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:p-8"
                >
                  <span className="flex items-center gap-3 text-[13.5px] font-medium text-[var(--fg-3)] sm:flex-col sm:items-start sm:gap-2">
                    <time dateTime={p.date}>{formatDate(p.date, locale as Locale)}</time>
                    <span className="rounded-full border border-[var(--border-hi)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--fg-2)]">
                      {tags(p.tag)}
                    </span>
                  </span>
                  <span>
                    <span className="l-card-title block text-[var(--fg)]">{p.title}</span>
                    <span className="mt-2 block max-w-[64ch] text-[15.5px] leading-relaxed text-[var(--fg-2)]">{p.summary}</span>
                  </span>
                  <ArrowUpRight
                    size={20}
                    strokeWidth={2}
                    aria-hidden
                    className="hidden text-[var(--fg-3)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
