'use client';

/** The header shell: a rule appears under it once the page has scrolled. */
import { useEffect, useState, type ReactNode } from 'react';

export function NavBar({ children }: { children: ReactNode }) {
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const onScroll = () => setMoved(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="pointer-events-none sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div
        className={`glass pointer-events-auto mx-auto max-w-[1360px] rounded-[20px] transition-shadow duration-500 ${
          moved ? '' : 'shadow-none'
        }`}
      >
        {children}
      </div>
    </header>
  );
}
