'use client';

/**
 * prefers-reduced-motion, live, without pulling GSAP in.
 *
 * `lib/motion.ts` has the same answer but imports gsap at module scope,
 * and the composer is rendered under surfaces whose tests cannot load it.
 * False until mounted: the composer's animated surfaces only exist after
 * an interaction, by which point the real value is in.
 */

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(QUERY);
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent): void => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/**
 * The conservative twin: TRUE until mounted and whenever the answer cannot
 * be read (SSR, no matchMedia), then live. Use it where animating by mistake
 * is worse than a missed animation — tweened numbers, draw-ins — so the
 * server markup and the first client frame are always the final state.
 * `lib/motion` re-exports it; import it from here to keep gsap out of the
 * bundle.
 */
export function useReducedMotionSafe(): boolean {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(QUERY);
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent): void => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
