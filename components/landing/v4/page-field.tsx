'use client';

/**
 * PageField — the one live render behind every page.
 *
 * Mounted once by the layout. The canvas (and its shader) loads when the
 * browser is idle, so it never competes with the first paint; until then, and
 * wherever WebGL is missing, the page ground is simply the page colour.
 */
import dynamic from 'next/dynamic';
import { useEffect, useState, type ReactElement } from 'react';

const HeroField = dynamic(() => import('./hero-field'), { ssr: false });

export function PageField(): ReactElement {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setMount(true), { timeout: 1200 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setMount(true), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="sticky top-0 h-[100lvh] w-full overflow-hidden">{mount ? <HeroField /> : null}</div>
    </div>
  );
}
