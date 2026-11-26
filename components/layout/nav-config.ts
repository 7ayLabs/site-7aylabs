/** The site's pages, in menu order. Labels live in `chrome.nav.<key>`. */
export const NAV_ITEMS = [
  { key: 'products', href: '/products' },
  { key: 'about', href: '/about' },
  { key: 'updates', href: '/updates' },
  { key: 'contact', href: '/contact' },
] as const;

export type NavHref = (typeof NAV_ITEMS)[number]['href'] | '/' | '/vizzor' | '/legal/privacy';
