'use client';

/**
 * Decode — text that resolves out of hash characters, left to right, when it
 * enters the window: the way a hash turns into something readable.
 *
 * The real text is always in the markup (and is what assistive tech reads);
 * the scramble is drawn over it for under a second. Under reduced motion
 * nothing is scrambled.
 */
import { useEffect, useRef, useState } from 'react';

const GLYPHS = '0123456789abcdef#x';

export function Decode({ text, className, duration = 900 }: { text: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let start = 0;
    const frame = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / duration);
      const solved = Math.floor(p * text.length);
      let out = text.slice(0, solved);
      for (let i = solved; i < text.length; i++) {
        const ch = text[i]!;
        out += ch === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setShown(out);
      if (p < 1) raf = requestAnimationFrame(frame);
      else setShown(text);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        cancelAnimationFrame(raf);
        if (e?.isIntersecting) {
          start = 0;
          raf = requestAnimationFrame(frame);
        } else {
          setShown(text);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{shown}</span>
    </span>
  );
}
