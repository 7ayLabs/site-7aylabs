'use client';

/**
 * NavFx — the header capsule's one behaviour: it tightens once the page has
 * scrolled, so it steps out of the reading line. It never hides.
 */
import { useEffect, useState, type ReactNode } from 'react';

const TIGHT_AFTER_PX = 24;

export function NavFx({ children }: { children: ReactNode }) {
  const [tight, setTight] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTight(window.scrollY > TIGHT_AFTER_PX));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="pointer-events-none sticky top-0 z-40 w-full px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        data-tight={tight || undefined}
        className="l-glass l-nav pointer-events-auto mx-auto max-w-[1240px] rounded-full transition-[max-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[tight]:max-w-[1120px]"
      >
        {children}
      </div>
    </header>
  );
}
