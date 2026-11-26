'use client';

/**
 * GlassIcon — one 3D glass object, drawn by the shared glass renderer.
 *
 * Renders a 2D canvas sized to its box (capped device pixel ratio) and the
 * `fallback` icon underneath until the first glass frame lands, so a browser
 * without WebGL still shows a clean line icon.
 */

import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import type { GlassShape } from './glass-renderer';

export function GlassIcon({
  shape,
  size = 200,
  fallback,
  className,
}: {
  shape: GlassShape;
  size?: number;
  fallback?: ReactNode;
  className?: string;
}): ReactElement {
  const ref = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    let cleanup: (() => void) | null = null;
    let cancelled = false;
    // The renderer module (and its shader) loads only when an icon mounts.
    void import('./glass-renderer').then(({ registerGlass }) => {
      if (cancelled) return;
      cleanup = registerGlass(canvas, shape, () => setLive(true));
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [shape, size]);

  return (
    <div
      aria-hidden
      className={`relative grid place-items-center ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      {fallback && !live ? (
        <div className="absolute inset-0 grid place-items-center text-[var(--fg-3)]">{fallback}</div>
      ) : null}
      <canvas
        ref={ref}
        className={`h-full w-full transition-opacity duration-700 ${live ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
