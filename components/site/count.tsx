'use client';

/**
 * Count — a figure that counts up to its value when it enters the window,
 * and again each time it comes back. The final value is in the markup, so it
 * is what a reader without JavaScript, or with reduced motion, sees.
 */
import { useEffect, useRef, useState } from 'react';

export function Count({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const run = () => {
      let start = 0;
      const dur = 900 + Math.min(900, to * 25);
      const frame = (now: number) => {
        if (!start) start = now;
        const p = Math.min(1, (now - start) / dur);
        setN(Math.round(to * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        cancelAnimationFrame(raf);
        if (e?.isIntersecting) run();
        else setN(to);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  );
}
