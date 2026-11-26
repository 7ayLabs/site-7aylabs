/** The site's pages, in menu order. Labels live in `chrome.nav.<key>`. */
export const NAV_ITEMS = [
  { key: 'vizzor', href: '/vizzor' },
  { key: 'about', href: '/about' },
  { key: 'updates', href: '/updates' },
  { key: 'contact', href: '/contact' },
] as const;

export type NavHref = (typeof NAV_ITEMS)[number]['href'] | '/' | '/legal/privacy';
