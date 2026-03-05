export const ROUTES = {
  home: "/",
  about: "/about",
  tech: "/tech",
  useCases: "/use-cases",
  whyPresence: "/why-presence",
  updates: "/updates",
  waitlist: "/waitlist",
  newsletter: "/newsletter",
  services: "/services",
  roadmap: "/#roadmap",
} as const;

export const EXTERNAL_LINKS = {
  twitter: "https://x.com/7ayLabs",
  github: "https://github.com/7ayLabs",
  githubRepo: "https://github.com/7ayLabs/7aychain",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type ExternalLink = (typeof EXTERNAL_LINKS)[keyof typeof EXTERNAL_LINKS];

export const NAV_LINKS = [
  { href: ROUTES.tech, label: "Tech" },
  { href: ROUTES.useCases, label: "Use Cases" },
  { href: ROUTES.whyPresence, label: "Why Presence" },
  { href: ROUTES.updates, label: "Updates" },
] as const;

export const FOOTER_LINKS = [
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.roadmap, label: "Roadmap" },
] as const;
