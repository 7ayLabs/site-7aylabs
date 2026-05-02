"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  /** Target value to count up to. */
  to: number;
  /** Animation duration in milliseconds. Default 1400. */
  duration?: number;
  /** Optional non-numeric suffix to render after the count. */
  suffix?: string;
  /** Skip animation and show `to` immediately. */
  disabled?: boolean;
}

/**
 * Returns a ref to attach to a DOM node + a current count value.
 *
 * The count animates from 0 → `to` once when the node enters the viewport
 * (via IntersectionObserver). Eased with cubic-out so the number feels
 * confident at the end. SSR-safe: renders the final value on the server,
 * recomputes only on first viewport entry on the client.
 */
export function useCountUp({
  to,
  duration = 1400,
  disabled = false,
}: UseCountUpOptions): {
  ref: React.RefObject<HTMLElement | null>;
  value: number;
} {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState<number>(disabled ? to : 0);
  const triggered = useRef(false);

  useEffect(() => {
    if (disabled) {
      setValue(to);
      return;
    }
    if (typeof window === "undefined") return;
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(to);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || triggered.current) continue;
          triggered.current = true;

          const start = performance.now();
          let raf = 0;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            // cubic-out
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(eased * to));
            if (t < 1) {
              raf = requestAnimationFrame(tick);
            }
          };
          raf = requestAnimationFrame(tick);
          // keep raf id around so re-renders don't restart it
          return () => cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [to, duration, disabled]);

  return { ref, value };
}
