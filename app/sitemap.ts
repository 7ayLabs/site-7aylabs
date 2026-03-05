import type { MetadataRoute } from "next";

const BASE_URL = "https://7aylabs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/technology", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/why-presence", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/use-cases", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/devnet", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/validators", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/ecosystem", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/glossary", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/roadmap", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/updates", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/waitlist", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/newsletter", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  return pages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
