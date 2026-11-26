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
    <header
      className={`sticky top-0 z-40 border-b bg-[var(--bg)] transition-colors duration-300 ${
        moved ? 'border-[var(--line)]' : 'border-transparent'
      }`}
    >
      {children}
    </header>
  );
}
