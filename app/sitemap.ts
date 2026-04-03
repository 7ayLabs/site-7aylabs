import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://7aylabs.com";

const pages = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const, lastModified: "2026-03-12" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-02-15" },
  { path: "/technology", priority: 0.9, changeFrequency: "monthly" as const, lastModified: "2026-03-10" },
  { path: "/why-presence", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-02-20" },
  { path: "/use-cases", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-02-20" },
  { path: "/devnet", priority: 0.9, changeFrequency: "weekly" as const, lastModified: "2026-03-12" },
  { path: "/validators", priority: 0.9, changeFrequency: "monthly" as const, lastModified: "2026-03-01" },
  { path: "/ecosystem", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-02-28" },
  { path: "/glossary", priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-02-10" },
  { path: "/updates", priority: 0.6, changeFrequency: "weekly" as const, lastModified: "2026-03-12" },
  { path: "/waitlist", priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-03-05" },
  { path: "/newsletter", priority: 0.6, changeFrequency: "monthly" as const, lastModified: "2026-02-15" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of routing.locales) {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      const url = `${BASE_URL}${prefix}${page.path === "/" ? "" : page.path}`;

      // Build alternates for this page across all locales
      const languages: Record<string, string> = {};
      for (const altLocale of routing.locales) {
        const altPrefix = altLocale === routing.defaultLocale ? "" : `/${altLocale}`;
        languages[altLocale] = `${BASE_URL}${altPrefix}${page.path === "/" ? "" : page.path}`;
      }

      entries.push({
        url: url || BASE_URL,
        lastModified: new Date(page.lastModified),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
