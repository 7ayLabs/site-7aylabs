import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { SITE, VIZZOR } from '@/lib/site';

/** The public URL of a path in a given locale (English has no prefix). */
export function localeUrl(path: string, locale: Locale): string {
  const clean = path === '/' ? '' : path;
  return `${SITE.url}${locale === routing.defaultLocale ? '' : `/${locale}`}${clean}` || SITE.url;
}

/** Canonical + hreflang for a page that exists in every locale. */
export function pageAlternates(path: string, locale: Locale): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localeUrl(path, l);
  languages['x-default'] = localeUrl(path, routing.defaultLocale);
  return {
    canonical: localeUrl(path, locale),
    languages,
    types: { 'application/rss+xml': `${SITE.url}/feed.xml` },
  };
}

const OG_LOCALE: Record<Locale, string> = { en: 'en_US', es: 'es_ES', fr: 'fr_FR' };

export function pageMetadata(opts: {
  path: string;
  locale: Locale;
  title: string;
  description: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}): Metadata {
  const url = localeUrl(opts.path, opts.locale);
  return {
    title: opts.title,
    description: opts.description,
    alternates: pageAlternates(opts.path, opts.locale),
    openGraph: {
      type: opts.type ?? 'website',
      url,
      siteName: SITE.name,
      title: opts.title,
      description: opts.description,
      locale: OG_LOCALE[opts.locale],
      alternateLocale: routing.locales.filter((l) => l !== opts.locale).map((l) => OG_LOCALE[l]),
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime, authors: [SITE.name] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.xHandle,
      creator: SITE.xHandle,
      title: opts.title,
      description: opts.description,
    },
  };
}

/**
 * Site-wide structured data: who the organisation is, what the site is, and
 * the product it publishes. Search engines use this to connect the company,
 * its product and its profiles.
 */
export function organizationJsonLd(opts: { description: string; slogan: string; keywords: readonly string[]; locale: Locale }) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: { '@type': 'ImageObject', url: `${SITE.url}/android-chrome-512x512.png`, width: 512, height: 512 },
        description: opts.description,
        slogan: opts.slogan,
        knowsAbout: [...opts.keywords],
        sameAs: [SITE.x, SITE.github],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: localeUrl('/contact', opts.locale),
          availableLanguage: ['en', 'es', 'fr'],
        },
        makesOffer: { '@type': 'Offer', itemOffered: { '@id': `${VIZZOR.site}/#product` } },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: opts.description,
        publisher: { '@id': `${SITE.url}/#organization` },
        inLanguage: [...routing.locales],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${VIZZOR.site}/#product`,
        name: VIZZOR.name,
        url: VIZZOR.site,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', url: VIZZOR.pricing },
        publisher: { '@id': `${SITE.url}/#organization` },
        sameAs: [VIZZOR.x],
      },
    ],
  };
}

/** The trail from the home page to this one, for breadcrumb rich results. */
export function breadcrumbJsonLd(locale: Locale, trail: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: localeUrl(t.path, locale),
    })),
  };
}
