'use client';

/**
 * The section links in the header capsule, with the one being read marked,
 * and under the capsule a small hint that changes with the section: a
 * question and the one action that answers it.
 */
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { VIZZOR } from '@/lib/site';
import { NAV_SECTIONS } from './nav-config';

const HINTS = {
  products: { href: VIZZOR.app, external: true },
  stack: { href: '/#contact', external: false },
  updates: { href: '/#contact', external: false },
} as const;

export function NavLinks() {
  const t = useTranslations('chrome');
  const pathname = usePathname();
  const [active, setActive] = useState('');

  useEffect(() => {
    if (pathname !== '/') {
      setActive('');
      return;
    }
    let raf = 0;
    const measure = () => {
      const line = window.innerHeight * 0.4;
      let current = '';
      for (const id of NAV_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      const contact = document.getElementById('contact');
      if (contact && contact.getBoundingClientRect().top <= line) current = '';
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  const hint = active in HINTS ? (active as keyof typeof HINTS) : null;

  return (
    <>
      <ul className="hidden items-center lg:flex">
        {NAV_SECTIONS.map((id) => (
          <li key={id}>
            <Link
              href={`/#${id}`}
              aria-current={active === id ? 'location' : undefined}
              className={`inline-flex h-11 items-center rounded-[12px] px-3 text-[14.5px] font-medium transition-colors duration-300 hover:text-[var(--fg)] ${
                active === id ? 'text-[var(--fg)]' : 'text-[var(--fg-2)]'
              }`}
            >
              {t(`sections.${id}`)}
            </Link>
          </li>
        ))}
      </ul>

      {hint ? (
        <p
          key={hint}
          className="glass page-enter absolute right-0 top-[calc(100%+8px)] hidden min-h-10 items-center gap-2 rounded-[14px] px-3.5 text-[13.5px] text-[var(--fg-2)] lg:inline-flex"
        >
          <span className="pulse" aria-hidden />
          {t(`hints.${hint}.text`)}
          {HINTS[hint].external ? (
            <a href={HINTS[hint].href} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--fg)] underline-offset-4 hover:underline">
              {t(`hints.${hint}.cta`)}
            </a>
          ) : (
            <Link href={HINTS[hint].href} className="font-semibold text-[var(--fg)] underline-offset-4 hover:underline">
              {t(`hints.${hint}.cta`)}
            </Link>
          )}
        </p>
      ) : null}
    </>
  );
}
