import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

const BASE_URL = "https://7aylabs.com";

/**
 * Build canonical URL + hreflang alternates for a page across all locales.
 */
export function buildPageAlternates(path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    languages[locale] = `${BASE_URL}${prefix}${path === "/" ? "" : path}`;
  }

  return {
    canonical: path,
    languages,
  };
}

/**
 * Build OpenGraph metadata for a page.
 */
export function buildOpenGraph(
  title: string,
  description: string,
  path: string,
) {
  return {
    title,
    description,
    url: `${BASE_URL}${path === "/" ? "" : path}`,
    siteName: "7ayLabs",
    images: [
      {
        url: "/og/7aylabs-og.png",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    type: "website" as const,
  };
}

/**
 * Build BreadcrumbList LD+JSON schema.
 */
export function buildBreadcrumbSchema(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
