'use client';

/**
 * PageIndex — the table of contents beside an indexed page. It marks the
 * block currently being read (the last one whose top has passed the upper
 * third of the window).
 */
import { useEffect, useState } from 'react';

export interface IndexItem {
  id: string;
  label: string;
}

export function PageIndex({ items, label }: { items: IndexItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const line = window.innerHeight * 0.33;
      let current = items[0]?.id ?? '';
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) current = it.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  return (
    <nav aria-label={label} className="hidden lg:block">
      <ul className="sticky top-[92px] border-t border-[var(--line-strong)] pt-6">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={on ? 'location' : undefined}
                className={`flex min-h-11 items-center gap-3 text-[15.5px] font-semibold transition-colors duration-200 hover:text-[var(--accent)] ${
                  on ? 'text-[var(--fg)]' : 'text-[var(--fg-3)]'
                }`}
              >
                <span
                  aria-hidden
                  className={`h-[2px] bg-[var(--accent-fill)] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? 'w-6' : 'w-0'}`}
                />
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
