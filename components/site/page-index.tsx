'use client';

/**
 * SectionStrip — a pane of glass under the header listing the page's
 * sections. It marks the one being read and keeps that tab in view when the
 * strip itself has to scroll sideways on a narrow screen.
 */
import { useEffect, useRef, useState } from 'react';

export interface IndexItem {
  id: string;
  label: string;
}

export function PageIndex({ items, label }: { items: IndexItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const line = window.innerHeight * 0.36;
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

  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !tab) return;
    list.scrollTo({ left: tab.offsetLeft - list.clientWidth / 2 + tab.clientWidth / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <nav aria-label={label} className="sticky top-[84px] z-30 -mx-1 mb-6">
      <ul ref={listRef} className="glass strip mx-auto flex w-max max-w-full gap-1 overflow-x-auto rounded-full p-1.5">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id} className="shrink-0">
              <a
                href={`#${it.id}`}
                aria-current={on ? 'location' : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-4 text-[14.5px] font-semibold transition-colors duration-300 ${
                  on ? 'bg-[var(--accent-fill)] text-[var(--on-accent)]' : 'text-[var(--fg-2)] hover:text-[var(--fg)]'
                }`}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
