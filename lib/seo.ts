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
  return { canonical: localeUrl(path, locale), languages };
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
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.xHandle,
      title: opts.title,
      description: opts.description,
    },
  };
}

/** Organization + product structured data for the whole site. */
export function organizationJsonLd(description: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/android-chrome-512x512.png`,
        description,
        sameAs: [SITE.x, SITE.github],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
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
        publisher: { '@id': `${SITE.url}/#organization` },
        sameAs: [VIZZOR.x],
      },
    ],
  };
}
