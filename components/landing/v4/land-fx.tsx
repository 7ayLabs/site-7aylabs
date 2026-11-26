'use client';

/**
 * LandFx — pointer effects for the whole landing, from one listener.
 *
 *   [data-tilt]      leans the card a few degrees toward the pointer;
 *   [data-magnetic]  pulls a button a few pixels toward the pointer.
 *
 * Fine pointers only (a finger has no hover), and nothing at all under
 * reduced motion. Renders nothing.
 */

import { useEffect } from 'react';

const TILT_DEG = 5;
const PULL = 0.22;

export function LandFx(): null {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tilted: HTMLElement | null = null;
    let pulled: HTMLElement | null = null;
    let raf = 0;
    let last: PointerEvent | null = null;

    const release = (el: HTMLElement | null, vars: string[]) => {
      if (!el) return;
      for (const v of vars) el.style.removeProperty(v);
    };

    const apply = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      const tilt = target?.closest<HTMLElement>('[data-tilt]') ?? null;
      if (tilt !== tilted) release(tilted, ['--rx', '--ry']);
      tilted = tilt;
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty('--rx', `${(-ny * TILT_DEG).toFixed(2)}deg`);
        tilt.style.setProperty('--ry', `${(nx * TILT_DEG).toFixed(2)}deg`);
      }

      const mag = target?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (mag !== pulled) release(pulled, ['--tx', '--ty']);
      pulled = mag;
      if (mag) {
        const r = mag.getBoundingClientRect();
        mag.style.setProperty('--tx', `${((e.clientX - (r.left + r.width / 2)) * PULL).toFixed(1)}px`);
        mag.style.setProperty('--ty', `${((e.clientY - (r.top + r.height / 2)) * PULL).toFixed(1)}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      release(tilted, ['--rx', '--ry']);
      release(pulled, ['--tx', '--ty']);
    };
  }, []);

  return null;
}
