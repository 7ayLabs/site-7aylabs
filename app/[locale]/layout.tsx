import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { display, mono, sans } from '../fonts';
import { ThemeProvider, themeBootScript } from '@/components/layout/theme-provider';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { ChainField } from '@/components/site/chain-field';
import { PageFx } from '@/components/site/fx';
import { JsonLd } from '@/components/site/json-ld';
import { organizationJsonLd } from '@/lib/seo';
import { SITE, isProduction } from '@/lib/site';

/** The pages listed as the site's navigation in its structured data. */
const NAV_PAGES = [
  { ns: 'vizzorPage', path: '/vizzor' },
  { ns: 'productsPage', path: '/products' },
  { ns: 'aboutPage', path: '/about' },
  { ns: 'updatesPage', path: '/updates' },
  { ns: 'contactPage', path: '/contact' },
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f4f4' },
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t('title'), template: `%s | ${SITE.name}` },
    description: t('description'),
    keywords: t.raw('keywords') as string[],
    category: 'technology',
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    // Staging and previews must never be indexed.
    robots: isProduction
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
      : { index: false, follow: false },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'chrome' });
  const meta = await getTranslations({ locale, namespace: 'meta' });
  const nav = await getTranslations({ locale });

  return (
    <html
      lang={locale as Locale}
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <JsonLd
          data={organizationJsonLd({
            description: meta('description'),
            slogan: meta('slogan'),
            keywords: meta.raw('keywords') as string[],
            locale: locale as Locale,
            nav: NAV_PAGES.map((n) => ({ name: nav(`${n.ns}.meta.crumb`), description: nav(`${n.ns}.meta.description`), path: n.path })),
          })}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <a href="#main" className="skip-link">
              {t('skip')}
            </a>
            <div aria-hidden className="backdrop">
              <i />
              <i />
              <i />
              <ChainField />
            </div>
            <div aria-hidden className="scroll-progress" />
            <PageFx />
            <div className="flex min-h-dvh flex-col">
              <SiteNav />
              <main id="main" className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
