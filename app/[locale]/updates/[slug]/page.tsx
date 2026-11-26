import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { LandingReveal } from '@/components/landing/landing-reveal';
import { WRAP } from '@/components/ui/section';
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
  const tags = await getTranslations('home.updates.tags');

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
      <LandingReveal>
        <div className={`${WRAP} pb-20 pt-16 sm:pb-32 sm:pt-24`}>
          <div className="mx-auto max-w-[760px]">
            <Link
              href="/updates"
              data-reveal
              className="inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold text-[var(--fg-2)] transition-colors duration-300 hover:text-[var(--fg)]"
            >
              <ArrowLeft size={16} strokeWidth={2} aria-hidden />
              {t('back')}
            </Link>

            <p data-reveal className="mt-8 flex flex-wrap items-center gap-3 text-[13.5px] font-medium text-[var(--fg-3)]">
              <time dateTime={post.date}>{formatDate(post.date, locale as Locale)}</time>
              <span className="rounded-full border border-[var(--border-hi)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--fg-2)]">
                {tags(post.tag)}
              </span>
            </p>
            <h1 data-reveal className="l-display l-section-title mt-5 text-[var(--fg)]">
              {post.title}
            </h1>
            <p data-reveal className="l-lede mt-6">
              {post.summary}
            </p>

            {post.lang !== locale ? (
              <p data-reveal className="l-glass mt-8 rounded-[18px] px-5 py-4 text-[14.5px] text-[var(--fg-2)]">
                {t('fallback')}
              </p>
            ) : null}

            <div data-reveal lang={post.lang} className="l-prose mt-12 border-t border-[var(--l-hairline)] pt-10">
              <MDXRemote source={post.body} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>
          </div>
        </div>
      </LandingReveal>
    </article>
  );
}
