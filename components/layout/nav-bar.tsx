import type { ReactNode } from 'react';

/** The header shell: a compact capsule of glass, centred, that stays on top. */
export function NavBar({ children }: { children: ReactNode }) {
  return (
    <header className="pointer-events-none sticky top-0 z-40 flex h-[88px] items-start justify-center px-3 pt-4">
      <div className="glass pointer-events-auto relative w-full max-w-max rounded-[18px] max-lg:max-w-none">{children}</div>
    </header>
  );
}
