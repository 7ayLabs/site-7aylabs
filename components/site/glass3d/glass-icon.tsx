'use client';

/**
 * GlassIcon — one 3D object of liquid glass, drawn by the shared renderer.
 *
 * The `fallback` icon shows until the first frame lands, and stays if the
 * browser has no WebGL. The renderer (and its shader) is only downloaded
 * when an icon mounts.
 */
import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import type { GlassShape } from './renderer';

export function GlassIcon({
  shape,
  size = 160,
  fallback,
  className = '',
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
    let stop: (() => void) | null = null;
    let cancelled = false;
    void import('./renderer').then(({ registerGlass }) => {
      if (cancelled) return;
      stop = registerGlass(canvas, shape, () => setLive(true));
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [shape, size]);

  return (
    <span aria-hidden className={`relative inline-grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size }}>
      {fallback && !live ? <span className="absolute inset-0 grid place-items-center text-[var(--accent)]">{fallback}</span> : null}
      <canvas ref={ref} className={`h-full w-full transition-opacity duration-700 ${live ? 'opacity-100' : 'opacity-0'}`} />
    </span>
  );
}
