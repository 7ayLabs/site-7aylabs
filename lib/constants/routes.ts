export const ROUTES = {
  home: "/",
  about: "/about",
  technology: "/technology",
  tech: "/tech",
  useCases: "/use-cases",
  whyPresence: "/why-presence",
  devnet: "/devnet",
  validators: "/validators",
  ecosystem: "/ecosystem",
  glossary: "/glossary",
  updates: "/updates",
  waitlist: "/waitlist",
  newsletter: "/newsletter",
  services: "/services",
} as const;

export const EXTERNAL_LINKS = {
  twitter: "https://x.com/7ayLabs",
  github: "https://github.com/7ayLabs",
  githubRepo: "https://github.com/7ayLabs/7aychain",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type ExternalLink = (typeof EXTERNAL_LINKS)[keyof typeof EXTERNAL_LINKS];

export const NAV_LINKS = [
  { href: ROUTES.technology, label: "Technology" },
  { href: ROUTES.whyPresence, label: "Why Presence" },
  { href: ROUTES.useCases, label: "Use Cases" },
  { href: ROUTES.devnet, label: "Devnet" },
  { href: ROUTES.validators, label: "Validators" },
] as const;

export const NAV_CATEGORIES = [
  {
    label: "Learn",
    items: [
      { href: ROUTES.technology, label: "Technology" },
      { href: ROUTES.whyPresence, label: "Why Presence" },
      { href: ROUTES.glossary, label: "Glossary" },
    ],
  },
  {
    label: "Build",
    items: [
      { href: ROUTES.devnet, label: "Devnet" },
      { href: ROUTES.validators, label: "Validators" },
      { href: ROUTES.ecosystem, label: "Ecosystem" },
      { href: EXTERNAL_LINKS.githubRepo, label: "GitHub", external: true },
    ],
  },
  {
    label: "Network",
    items: [
      { href: ROUTES.updates, label: "Updates" },
      { href: ROUTES.useCases, label: "Use Cases" },
    ],
  },
  {
    label: "Community",
    items: [
      { href: ROUTES.waitlist, label: "Waitlist" },
      { href: ROUTES.newsletter, label: "Newsletter" },
      { href: EXTERNAL_LINKS.twitter, label: "X (Twitter)", external: true },
    ],
  },
] as const;

export const FOOTER_LINK_GROUPS = [
  {
    title: "Learn",
    links: [
      { href: ROUTES.technology, label: "Technology" },
      { href: ROUTES.whyPresence, label: "Why Presence" },
      { href: ROUTES.glossary, label: "Glossary" },
    ],
  },
  {
    title: "Build",
    links: [
      { href: ROUTES.devnet, label: "Devnet" },
      { href: ROUTES.validators, label: "Validators" },
      { href: ROUTES.ecosystem, label: "Ecosystem" },
      { href: EXTERNAL_LINKS.githubRepo, label: "GitHub", external: true },
    ],
  },
  {
    title: "Network",
    links: [
      { href: ROUTES.updates, label: "Updates" },
      { href: ROUTES.useCases, label: "Use Cases" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: ROUTES.waitlist, label: "Join Waitlist" },
      { href: ROUTES.newsletter, label: "Newsletter" },
      { href: EXTERNAL_LINKS.twitter, label: "X (Twitter)", external: true },
    ],
  },
] as const;
