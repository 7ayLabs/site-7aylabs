'use client';

/**
 * The section links in the header, with the one being read marked, and a
 * block counter: on the home page the header shows which block of the page
 * the reader is on, like a chain's height.
 */
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV_SECTIONS } from './nav-config';

/** Every block of the home page, in order (the hero is block 0). */
const BLOCKS = ['lab', 'console', 'products', 'stack', 'method', 'updates', 'faq', 'contact'] as const;

export function NavLinks() {
  const t = useTranslations('chrome');
  const pathname = usePathname();
  const [active, setActive] = useState('');
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (pathname !== '/') {
      setActive('');
      setHeight(-1);
      return;
    }
    let raf = 0;
    const measure = () => {
      const line = window.innerHeight * 0.4;
      let current = '';
      let n = 0;
      BLOCKS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) {
          current = id;
          n = i + 1;
        }
      });
      setActive(current);
      setHeight(n);
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

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      <ul className="hidden items-center lg:flex">
        {NAV_SECTIONS.map((id) => (
          <li key={id}>
            <Link
              href={`/#${id}`}
              aria-current={active === id ? 'location' : undefined}
              className={`relative inline-flex h-11 items-center px-3 text-[14.5px] font-medium transition-colors duration-300 hover:text-[var(--fg)] ${
                active === id ? 'text-[var(--fg)]' : 'text-[var(--fg-2)]'
              }`}
            >
              {t(`sections.${id}`)}
              {active === id ? <span aria-hidden className="absolute inset-x-3 bottom-1.5 h-[2px] bg-[var(--fg)]" /> : null}
            </Link>
          </li>
        ))}
      </ul>

      {height >= 0 ? (
        <p
          className="t-num ml-auto hidden items-center gap-2 text-[13px] font-semibold text-[var(--fg-2)] xl:inline-flex"
          aria-label={t('height', { n: height, total: BLOCKS.length })}
        >
          <span aria-hidden className="grid h-4 w-4 place-items-center rounded-[4px] border border-[var(--line-strong)]">
            <span className="block h-1.5 w-1.5 rounded-[1.5px] bg-[var(--fg)]" />
          </span>
          <span aria-hidden>
            {pad(height)}
            <span className="text-[var(--fg-3)]"> / {pad(BLOCKS.length)}</span>
          </span>
        </p>
      ) : null}
    </>
  );
}
