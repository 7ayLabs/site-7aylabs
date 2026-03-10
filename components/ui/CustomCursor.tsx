"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";

const PX = 2;
const GRID = 6;
const TRAIL_LIFE = 500;
const CLICK_LIFE = 400;
const TRAIL_MAX = 50;
const BRAND = ["#00FFC6", "#C084FC", "#22D3EE"] as const;

const ARROW: number[][] = [
  [1],
  [1, 1],
  [1, 2, 1],
  [1, 2, 2, 1],
  [1, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 1, 1, 1],
  [1, 2, 2, 1, 2, 2, 1],
  [1, 2, 1, 0, 1, 2, 2, 1],
  [1, 1, 0, 0, 1, 2, 2, 1],
  [1, 0, 0, 0, 0, 1, 2, 1],
  [0, 0, 0, 0, 0, 1, 1],
];

interface TrailCell {
  gx: number;
  gy: number;
  born: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  ci: number;
}

function usePixelCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  trailRef: React.MutableRefObject<TrailCell[]>,
  particlesRef: React.MutableRefObject<Particle[]>,
  visible: boolean,
) {
  const rafRef = useRef(0);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      cvs.width = window.innerWidth * dpr;
      cvs.height = window.innerHeight * dpr;
      cvs.style.width = `${window.innerWidth}px`;
      cvs.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (visible) {
        const trail = trailRef.current;
        for (let i = trail.length - 1; i >= 0; i--) {
          const c = trail[i];
          const age = now - c.born;
          if (age > TRAIL_LIFE) {
            trail.splice(i, 1);
            continue;
          }
          const t = 1 - age / TRAIL_LIFE;
          const sz = t > 0.6 ? GRID : t > 0.3 ? GRID - 2 : 2;
          const off = (GRID - sz) / 2;
          const px = c.gx * GRID + off;
          const py = c.gy * GRID + off;
          if (t > 0.7) {
            ctx.globalAlpha = t * 0.12;
            ctx.fillStyle = BRAND[0];
            ctx.fillRect(px - 2, py - 2, sz + 4, sz + 4);
          }
          ctx.globalAlpha = t * 0.45;
          ctx.fillStyle = BRAND[0];
          ctx.fillRect(px, py, sz, sz);
        }

        const parts = particlesRef.current;
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          const age = now - p.born;
          if (age > CLICK_LIFE) {
            parts.splice(i, 1);
            continue;
          }
          const t = age / CLICK_LIFE;
          const px = p.x + p.vx * t * 50;
          const py = p.y + p.vy * t * 50;
          const gx = Math.round(px / GRID) * GRID;
          const gy = Math.round(py / GRID) * GRID;
          ctx.globalAlpha = (1 - t) * 0.7;
          ctx.fillStyle = BRAND[p.ci];
          ctx.fillRect(gx, gy, GRID - 1, GRID - 1);
        }
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, trailRef, particlesRef, visible]);
}

function PixelArrow({ pressed }: { pressed: boolean }) {
  const w = Math.max(...ARROW.map((r) => r.length)) * PX;
  const h = ARROW.length * PX;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        imageRendering: "pixelated",
        transform: pressed ? "scale(0.85)" : undefined,
        transition: "transform 0.06s, filter 0.06s",
        filter: pressed
          ? "drop-shadow(0 0 6px rgba(0,255,198,0.6))"
          : "drop-shadow(0 0 2px rgba(0,0,0,0.4))",
      }}
    >
      {ARROW.flatMap((row, r) =>
        row.map((v, c) => {
          if (!v) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * PX}
              y={r * PX}
              width={PX}
              height={PX}
              fill={v === 1 ? "#111" : "#fff"}
            />
          );
        }),
      )}
      <rect x={0} y={0} width={PX} height={PX} fill={BRAND[0]} />
    </svg>
  );
}

function PixelReticle({ pressed }: { pressed: boolean }) {
  const S = PX;
  const size = 13 * S;
  const cx = 6;
  const p: { x: number; y: number; c: string; o: number }[] = [];

  for (let i = 1; i <= 5; i++) {
    p.push({ x: (cx + i) * S, y: cx * S, c: BRAND[0], o: 0.7 });
    p.push({ x: (cx - i) * S, y: cx * S, c: BRAND[0], o: 0.7 });
    p.push({ x: cx * S, y: (cx + i) * S, c: BRAND[0], o: 0.7 });
    p.push({ x: cx * S, y: (cx - i) * S, c: BRAND[0], o: 0.7 });
  }
  p.push({ x: cx * S, y: cx * S, c: "#fff", o: 1 });

  (
    [
      { bx: 0, by: 0, dx: 1, dy: 1, c: BRAND[1] },
      { bx: 12, by: 0, dx: -1, dy: 1, c: BRAND[1] },
      { bx: 0, by: 12, dx: 1, dy: -1, c: BRAND[2] },
      { bx: 12, by: 12, dx: -1, dy: -1, c: BRAND[2] },
    ] as const
  ).forEach(({ bx, by, dx, dy, c }) => {
    p.push({ x: bx * S, y: by * S, c, o: 0.6 });
    p.push({ x: (bx + dx) * S, y: by * S, c, o: 0.45 });
    p.push({ x: bx * S, y: (by + dy) * S, c, o: 0.45 });
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        imageRendering: "pixelated",
        transform: `translate(-50%, -50%) ${pressed ? "scale(0.82)" : ""}`,
        transition: "transform 0.06s, filter 0.06s",
        filter: pressed
          ? "drop-shadow(0 0 8px rgba(0,255,198,0.5))"
          : "drop-shadow(0 0 3px rgba(0,255,198,0.15))",
      }}
    >
      {p.map((pt, i) => (
        <rect
          key={i}
          x={pt.x}
          y={pt.y}
          width={S}
          height={S}
          fill={pt.c}
          opacity={pt.o}
        />
      ))}
    </svg>
  );
}

export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const [fine, setFine] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailCell[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastGridRef = useRef({ gx: -1, gy: -1 });

  usePixelCanvas(canvasRef, trailRef, particlesRef, visible);

  useEffect(() => {
    trailRef.current = [];
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const h = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", h);

    if (mq.matches) {
      const style = document.createElement("style");
      style.id = "custom-cursor-hide";
      style.textContent = `@media(pointer:fine){*,*::before,*::after{cursor:none!important}}`;
      document.head.appendChild(style);
      return () => {
        mq.removeEventListener("change", h);
        style.remove();
      };
    }
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    if (!fine || reduceMotion) return;

    const onMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      mx.set(e.clientX);
      my.set(e.clientY);

      const gx = Math.floor(e.clientX / GRID);
      const gy = Math.floor(e.clientY / GRID);
      const last = lastGridRef.current;
      if (gx !== last.gx || gy !== last.gy) {
        trailRef.current.push({ gx, gy, born: performance.now() });
        if (trailRef.current.length > TRAIL_MAX) trailRef.current.shift();
        last.gx = gx;
        last.gy = gy;
      }
    };

    const onLeave = () => {
      setVisible(false);
      trailRef.current = [];
    };
    const onEnter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(
        !!t.closest(
          "a, button, [role='button'], input, textarea, select, [data-cursor-hover]",
        ),
      );
    };

    const onDown = (e: MouseEvent) => {
      setPressed(true);
      const now = performance.now();
      const dirs: [number, number][] = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [0.7, 0.7],
        [-0.7, 0.7],
        [0.7, -0.7],
        [-0.7, -0.7],
      ];
      dirs.forEach(([vx, vy], i) => {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx,
          vy,
          born: now,
          ci: i % 3,
        });
      });
    };

    const onUp = () => setPressed(false);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, [fine, reduceMotion, visible, mx, my]);

  if (!fine || reduceMotion) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9994 }}
      />

      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: mx,
          y: my,
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.1s",
        }}
      >
        {hovering ? (
          <PixelReticle pressed={pressed} />
        ) : (
          <PixelArrow pressed={pressed} />
        )}
      </motion.div>
    </>
  );
}
