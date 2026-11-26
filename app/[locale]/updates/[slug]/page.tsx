import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { WRAP } from '@/components/site/layout';
import { localeUrl, pageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { formatDate, getUpdate, listSlugs } from '@/lib/updates';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => listSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getUpdate(slug, locale as Locale);
  if (!post) return {};
  return pageMetadata({
    path: `/updates/${slug}`,
    locale: locale as Locale,
    title: post.title,
    description: post.summary,
    type: 'article',
    publishedTime: post.date,
  });
}

export default async function UpdatePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getUpdate(slug, locale as Locale);
  if (!post) notFound();
  const t = await getTranslations('updatesPage');
  const tags = await getTranslations('log.tags');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    inLanguage: post.lang,
    mainEntityOfPage: localeUrl(`/updates/${slug}`, locale as Locale),
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    publisher: { '@id': `${SITE.url}/#organization` },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className={`${WRAP} pb-20 pt-10 sm:pb-28 sm:pt-16`}>
          <div className="max-w-[760px]">
            <Link
              href="/updates"
             
              className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-[var(--fg-2)] transition-colors duration-200 hover:text-[var(--accent)]"
            >
              <ArrowLeft size={16} strokeWidth={2} aria-hidden />
              {t('back')}
            </Link>

            <p className="t-note t-num mt-8 flex flex-wrap items-center gap-3">
              <time dateTime={post.date}>{formatDate(post.date, locale as Locale)}</time>
              <span className="font-semibold text-[var(--fg-2)]">
                {tags(post.tag)}
              </span>
            </p>
            <h1 className="t-display t-title mt-4 text-[var(--fg)]">
              {post.title}
            </h1>
            <p className="t-lede mt-6">
              {post.summary}
            </p>

            {post.lang !== locale ? (
              <p className="mt-8 rounded-md border border-[var(--line-strong)] px-5 py-4 text-[15px] text-[var(--fg-2)]">
                {t('fallback')}
              </p>
            ) : null}

            <div lang={post.lang} className="prose mt-12 border-t border-[var(--line-strong)] pt-10">
              <MDXRemote source={post.body} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>
          </div>
        </div>
    </article>
  );
}
