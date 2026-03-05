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
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.tech, label: "Tech" },
  { href: ROUTES.useCases, label: "Use Cases" },
  { href: ROUTES.whyPresence, label: "Why Presence" },
  { href: ROUTES.updates, label: "Updates" },
] as const;

export const NAV_CATEGORIES = [
  {
    label: "Learn",
    items: [
      { href: ROUTES.about, label: "About" },
      { href: ROUTES.whyPresence, label: "Why Presence" },
      { href: ROUTES.tech, label: "Technology" },
    ],
  },
  {
    label: "Use",
    items: [
      { href: ROUTES.useCases, label: "Use Cases" },
      { href: ROUTES.services, label: "Services" },
    ],
  },
  {
    label: "Build",
    items: [
      { href: ROUTES.roadmap, label: "Roadmap" },
      { href: ROUTES.updates, label: "Updates" },
      { href: EXTERNAL_LINKS.githubRepo, label: "GitHub", external: true },
    ],
  },
  {
    label: "Participate",
    items: [
      { href: ROUTES.waitlist, label: "Waitlist" },
      { href: ROUTES.newsletter, label: "Newsletter" },
      { href: EXTERNAL_LINKS.twitter, label: "X", external: true },
    ],
  },
] as const;

export const FOOTER_LINK_GROUPS = [
  {
    title: "Learn",
    links: [
      { href: ROUTES.about, label: "About" },
      { href: ROUTES.whyPresence, label: "Why Presence" },
      { href: ROUTES.tech, label: "Technology" },
    ],
  },
  {
    title: "Use",
    links: [
      { href: ROUTES.useCases, label: "Use Cases" },
      { href: ROUTES.services, label: "Services" },
      { href: ROUTES.roadmap, label: "Roadmap" },
    ],
  },
  {
    title: "Build",
    links: [
      { href: ROUTES.updates, label: "Updates" },
      { href: EXTERNAL_LINKS.githubRepo, label: "GitHub", external: true },
    ],
  },
  {
    title: "Community",
    links: [
      { href: EXTERNAL_LINKS.twitter, label: "X (Twitter)", external: true },
      { href: EXTERNAL_LINKS.github, label: "GitHub", external: true },
      { href: ROUTES.waitlist, label: "Join Waitlist" },
      { href: ROUTES.newsletter, label: "Newsletter" },
    ],
  },
] as const;
