import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import CustomCursor from "@/components/ui/CustomCursor";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const LOCALE_OG_MAP: Record<string, string> = {
  en: "en_US", es: "es_ES", pt: "pt_BR", fr: "fr_FR",
  de: "de_DE", zh: "zh_CN", ja: "ja_JP",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  // Build hreflang alternates
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = l === routing.defaultLocale
      ? "https://7aylabs.com"
      : `https://7aylabs.com/${l}`;
  }

  return {
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    keywords: [
      "7ayLabs", "7aychain", "Proof of Presence", "PoP protocol",
      "presence layer", "Layer 1 blockchain", "Web3 infrastructure",
      "$7AY token", "witness circles", "network latency triangulation",
      "Substrate", "Sybil resistance", "human verification blockchain",
      "zero knowledge presence", "Polkadot SDK", "DePIN protocol",
      "presence-based consensus", "proof of personhood",
    ],
    metadataBase: new URL("https://7aylabs.com"),
    alternates: { canonical: "/", languages },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://7aylabs.com",
      siteName: "7ayLabs",
      images: [
        {
          url: "/og/7aylabs-og.png",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
      type: "website",
      locale: LOCALE_OG_MAP[locale] || "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: ["/og/7aylabs-og.png"],
      creator: "@7aylabs",
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    category: "technology",
    applicationName: "7ayLabs",
    creator: "7ayLabs",
    publisher: "7ayLabs",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`scroll-smooth ${plusJakarta.variable} ${syne.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.setAttribute('data-theme',window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "7ayLabs",
                  url: "https://7aylabs.com",
                  logo: "https://7aylabs.com/7aylabs_white_logo.svg",
                  sameAs: [
                    "https://x.com/7ayLabs",
                    "https://github.com/7ayLabs",
                  ],
                },
                {
                  "@type": "WebSite",
                  name: "7ayLabs",
                  url: "https://7aylabs.com",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen antialiased bg-bg text-fg">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <CustomCursor />
            <a href="#main-content" className="skip-to-content">
              {/* Not translated — screen reader utility, always English */}
              Skip to main content
            </a>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
