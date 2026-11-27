/** The home page's sections, in order. Labels live in `chrome.sections.<key>`. */
export const NAV_SECTIONS = ['lab', 'console', 'products', 'stack', 'method', 'updates'] as const;

/** The site's other pages, for the footer. Labels live in `chrome.nav.<key>`. */
export const NAV_ITEMS = [
  { key: 'products', href: '/products' },
  { key: 'about', href: '/about' },
  { key: 'updates', href: '/updates' },
  { key: 'contact', href: '/contact' },
] as const;
