'use client';

/**
 * HeroEntrance — the one page-load sequence.
 *
 * Headline words rise out of their masks (`[data-hero-word]`), then the
 * supporting pieces (`[data-hero-step]`) follow. The server markup is the
 * finished state, so without JavaScript or under reduced motion nothing is
 * ever hidden.
 */
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';

export function HeroEntrance({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const words = root.querySelectorAll<HTMLElement>('[data-hero-word]');
    const steps = root.querySelectorAll<HTMLElement>('[data-hero-step]');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(words, { yPercent: 110, duration: 1.1, stagger: 0.09 }, 0.05);
      tl.from(steps, { opacity: 0, y: 18, duration: 0.9, stagger: 0.1 }, 0.45);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
