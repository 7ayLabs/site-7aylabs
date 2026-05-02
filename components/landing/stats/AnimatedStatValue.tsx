"use client";

import { useRef, useState, useEffect } from "react";

interface AnimatedStatValueProps {
  value: string;
  className?: string;
}

/**
 * Renders a stat value string with a number-aware count-up.
 *
 * Strings are decomposed into runs of digits and non-digits. Digit runs
 * animate from 0 → target on viewport entry; non-digit chars (e.g. "v",
 * ".", "<", "s") render as static decoration. So `v0.9.7`, `<1s`, and
 * `78` all just work.
 *
 * Respects `prefers-reduced-motion` and SSR.
 */
export default function AnimatedStatValue({ value, className }: AnimatedStatValueProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [progress, setProgress] = useState(0); // 0 → 1
  const triggered = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || triggered.current) continue;
          triggered.current = true;

          const start = performance.now();
          const duration = 1400;
          let raf = 0;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3); // cubic-out
            setProgress(eased);
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          return () => cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Decompose the value string into digit / non-digit runs
  const runs: ReadonlyArray<{ digits: boolean; text: string }> = (() => {
    const parts: { digits: boolean; text: string }[] = [];
    let buf = "";
    let bufDigits: boolean | null = null;
    for (const ch of value) {
      const isDigit = /[0-9]/.test(ch);
      if (bufDigits === null) {
        bufDigits = isDigit;
        buf = ch;
      } else if (bufDigits === isDigit) {
        buf += ch;
      } else {
        parts.push({ digits: bufDigits, text: buf });
        bufDigits = isDigit;
        buf = ch;
      }
    }
    if (buf) parts.push({ digits: bufDigits ?? false, text: buf });
    return parts;
  })();

  return (
    <span ref={ref} className={className}>
      {runs.map((run, i) => {
        if (!run.digits) {
          return <span key={i}>{run.text}</span>;
        }
        const target = parseInt(run.text, 10);
        const current = Math.round(target * progress);
        // Pad to original digit length so layout doesn't jitter as it counts
        const padded = String(current).padStart(run.text.length, "0").replace(/^0+(?=\d)/, "");
        return <span key={i}>{padded || "0"}</span>;
      })}
    </span>
  );
}
