'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV_ITEMS } from './nav-config';

/** The page links in the header capsule (≥ md). The current page is marked. */
export function NavLinks() {
  const t = useTranslations('chrome.nav');
  const pathname = usePathname();

  return (
    <ul className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.key}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex h-10 items-center rounded-full px-4 text-[14px] font-semibold transition-colors duration-300 ${
                active
                  ? 'bg-[color-mix(in_oklab,var(--fg)_8%,transparent)] text-[var(--fg)]'
                  : 'text-[var(--fg-2)] hover:text-[var(--fg)]'
              }`}
            >
              {t(item.key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
