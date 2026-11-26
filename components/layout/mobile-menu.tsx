'use client';

/**
 * MobileMenu — the page links below `md`, as a full-screen sheet.
 *
 * A real dialog: focus is trapped while it is open, Escape closes it, the
 * page behind does not scroll, and focus returns to the trigger afterwards.
 * It closes by itself when the route changes.
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { VIZZOR } from '@/lib/site';
import { LanguageSwitch } from './language-switch';
import { NAV_ITEMS } from './nav-config';
import { ThemeToggle } from './theme-toggle';

export function MobileMenu() {
  const t = useTranslations('chrome');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={t('menu.open')}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--fg)] md:hidden"
      >
        <Menu size={20} strokeWidth={1.75} aria-hidden />
      </button>

      {mounted && open
        ? createPortal(
            <div
              id="mobile-menu"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t('menu.title')}
              className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)] px-5 pb-8 pt-5 md:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="t-note">{t('menu.title')}</span>
                <button
                  type="button"
                  aria-label={t('menu.close')}
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--fg)]"
                >
                  <X size={22} strokeWidth={1.75} aria-hidden />
                </button>
              </div>

              <ul className="mt-8 flex flex-col">
                {NAV_ITEMS.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`) || (item.key === 'products' && pathname === '/vizzor');
                  return (
                    <li key={item.key} className="border-b border-[var(--line)]">
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className="t-display flex min-h-16 items-center justify-between py-3 text-[44px] text-[var(--fg)]"
                      >
                        {t(`nav.${item.key}`)}
                        {active ? <span aria-hidden className="h-2.5 w-2.5 bg-[var(--accent)]" /> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <LanguageSwitch align="left" />
                  <ThemeToggle />
                </div>
                <a href={VIZZOR.app} target="_blank" rel="noopener noreferrer" className="btn btn-ink w-full">
                  <span>{t('openVizzor')}</span>
                  <ArrowUpRight size={16} strokeWidth={2.25} aria-hidden />
                </a>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
