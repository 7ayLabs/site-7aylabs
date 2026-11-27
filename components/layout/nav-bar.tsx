import type { ReactNode } from 'react';

/** The header shell: a rail of glass across the top that stays in place. */
export function NavBar({ children }: { children: ReactNode }) {
  return (
    <header className="pointer-events-none sticky top-0 z-40 h-[88px] px-3 pt-4 sm:px-5">
      <div className="glass pointer-events-auto mx-auto max-w-[1280px] rounded-[18px]">{children}</div>
    </header>
  );
}
