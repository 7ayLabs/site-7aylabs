'use client';

/**
 * Marquee — an endless row that answers the scroll.
 *
 * Drifts at a base speed; scrolling adds the scroll's velocity on top, and
 * the drift follows the scroll's direction (down pushes it one way, up the
 * other), then eases back to the base speed when the page rests. Pointer
 * drag on the row nudges it too. One rAF loop per row, only while the row
 * is on screen; under reduced motion it is a static row.
 *
 * The content is rendered twice and the track wraps at half its width, so
 * the loop has no seam.
 */

import { useEffect, useRef, type ReactElement, type ReactNode } from 'react';

export function Marquee({
  children,
  speed = 40,
  reverse = false,
  className,
  label,
}: {
  children: ReactNode;
  /** Base drift in px per second. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  /** Accessible name; the duplicate copy is hidden from assistive tech. */
  label?: string;
}): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let x = 0;
    let boost = 0;
    let dir = reverse ? 1 : -1;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    let visible = false;
    let dragX: number | null = null;

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (dy !== 0) {
        dir = (dy > 0 ? -1 : 1) * (reverse ? -1 : 1);
        boost = Math.min(900, boost + Math.abs(dy) * 6);
      }
    };
    const onDown = (e: PointerEvent) => {
      dragX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (dragX === null) return;
      x += e.clientX - dragX;
      dragX = e.clientX;
    };
    const onUp = () => {
      dragX = null;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      boost *= 0.92;
      const half = track.scrollWidth / 2;
      if (dragX === null) x += dir * (speed + boost) * dt;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en?.isIntersecting ?? false;
      cancelAnimationFrame(raf);
      if (visible) {
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(root);
    window.addEventListener('scroll', onScroll, { passive: true });
    root.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      root.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [speed, reverse]);

  return (
    <div
      ref={rootRef}
      role={label ? 'group' : undefined}
      aria-label={label}
      className={`relative w-full touch-pan-y select-none overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] ${className ?? ''}`}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
