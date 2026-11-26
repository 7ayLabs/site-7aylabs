'use client';

/**
 * HeroEntrance — the page's one load sequence: the headline lines rise out
 * of their masks, then the rest of the hero settles in. The server markup is
 * the finished state, so nothing is hidden without JavaScript or under
 * reduced motion.
 */
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';

export function HeroEntrance({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('[data-line]', { yPercent: 105, duration: 1.05, stagger: 0.1 }, 0.05);
      tl.from('[data-step]', { opacity: 0, y: 16, duration: 0.8, stagger: 0.09 }, 0.5);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
