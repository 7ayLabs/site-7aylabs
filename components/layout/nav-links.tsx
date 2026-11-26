'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV_ITEMS } from './nav-config';

/** The page links in the header (≥ md). The current page carries the teal rule. */
export function NavLinks() {
  const t = useTranslations('chrome.nav');
  const pathname = usePathname();

  return (
    <ul className="ml-auto hidden items-center gap-7 md:flex">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.key}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`relative inline-flex h-11 items-center text-[15px] font-semibold transition-colors duration-200 hover:text-[var(--accent)] ${
                active ? 'text-[var(--fg)]' : 'text-[var(--fg-2)]'
              }`}
            >
              {t(item.key)}
              {active ? <span aria-hidden className="absolute inset-x-0 bottom-1.5 h-[2px] bg-[var(--accent-fill)]" /> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
