"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════
   Config
   ═══════════════════════════════════════════════════════ */
const TRAIL_LENGTH = 30;
const IDLE_DECAY_START = 300;    // start fading fast
const IDLE_DECAY_RATE = 12;      // remove 1 point every 12ms when idle
const CLICK_BURST_DURATION = 400;

interface Point { x: number; y: number }
interface ClickBurst { id: number; x: number; y: number; born: number }

/* ═══════════════════════════════════════════════════════
   Canvas Stela
   ═══════════════════════════════════════════════════════ */
function useStelaCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  trailRef: React.MutableRefObject<Point[]>,
  lastMoveRef: React.MutableRefObject<number>,
  visible: boolean,
) {
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let lastDecayTime = 0;

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const trail = trailRef.current;
      const timeSinceMove = now - lastMoveRef.current;

      // Fast idle decay
      if (timeSinceMove > IDLE_DECAY_START && trail.length > 0) {
        if (now - lastDecayTime > IDLE_DECAY_RATE) {
          // Remove 2 points at a time for faster vanish
          trail.splice(0, 2);
          lastDecayTime = now;
        }
      }

      const alpha = timeSinceMove > IDLE_DECAY_START
        ? Math.min(1, Math.max(0, trail.length / 6))
        : 1;

      if (visible && trail.length > 2 && alpha > 0.01) {
        for (let i = 1; i < trail.length; i++) {
          const t = i / trail.length;
          const prev = trail[i - 1];
          const curr = trail[i];

          // Glow
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.strokeStyle = `rgba(0, 255, 198, ${t * 0.1 * alpha})`;
          ctx.lineWidth = 6 * t + 1;
          ctx.lineCap = "round";
          ctx.stroke();

          // Core
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.strokeStyle = `rgba(0, 255, 198, ${t * 0.45 * alpha})`;
          ctx.lineWidth = Math.max(0.8, 2 * t);
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Head dot
        const head = trail[trail.length - 1];
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 198, ${0.5 * alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, trailRef, lastMoveRef, visible]);
}

/* ═══════════════════════════════════════════════════════
   Pointer — Hexagonal presence beacon
   ═══════════════════════════════════════════════════════ */
function PointerSVG({ pressed }: { pressed: boolean }) {
  return (
    <svg
      width={22}
      height={28}
      viewBox="0 0 22 28"
      fill="none"
      style={{
        transform: pressed ? "scale(0.85)" : "scale(1)",
        transition: "transform 0.08s ease",
        filter: pressed
          ? "drop-shadow(0 0 8px rgba(0,255,198,0.8))"
          : "drop-shadow(0 0 3px rgba(0,255,198,0.25))",
      }}
    >
      {/* Main pointer — sharp geometric arrow */}
      <path
        d="M1.5 0.5L3.5 22L8.5 17.5L17 16Z"
        fill={pressed ? "rgba(0,255,198,0.2)" : "rgba(0,255,198,0.06)"}
        stroke="#00FFC6"
        strokeWidth="1"
        strokeLinejoin="bevel"
      />
      {/* Inner accent — signal path */}
      <line x1="2.5" y1="3" x2="4" y2="19" stroke="#00FFC6" strokeWidth="0.4" opacity="0.25" strokeDasharray="1 2" />

      {/* Tip — primary node */}
      <path d="M1.5 0.5L3.5 2L0 2Z" fill="#00FFC6" opacity="0.9" />

      {/* Bottom vertex */}
      <circle cx="3.5" cy="22" r="1.2" fill="#050508" stroke="#00FFC6" strokeWidth="0.8" />
      <circle cx="3.5" cy="22" r="0.4" fill="#00FFC6" />

      {/* Right vertex — violet */}
      <circle cx="17" cy="16" r="1.2" fill="#050508" stroke="#C084FC" strokeWidth="0.8" />
      <circle cx="17" cy="16" r="0.4" fill="#C084FC" />

      {/* Mid vertex — cyan */}
      <circle cx="8.5" cy="17.5" r="1" fill="#050508" stroke="#22D3EE" strokeWidth="0.7" />
      <circle cx="8.5" cy="17.5" r="0.35" fill="#22D3EE" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   Hover — Hexagonal lock-on
   ═══════════════════════════════════════════════════════ */
function HoverSVG({ pressed }: { pressed: boolean }) {
  // Hexagon points at radius 12, centered at 16,16
  const hexPoints = [0, 1, 2, 3, 4, 5].map((i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return { x: 16 + 12 * Math.cos(angle), y: 16 + 12 * Math.sin(angle) };
  });
  const hexPath = hexPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + "Z";

  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      style={{
        transform: pressed ? "scale(0.82) rotate(30deg)" : "scale(1)",
        transition: "transform 0.1s ease",
        filter: pressed
          ? "drop-shadow(0 0 10px rgba(0,255,198,0.7))"
          : "drop-shadow(0 0 5px rgba(0,255,198,0.3))",
      }}
    >
      {/* Hex outline */}
      <path d={hexPath} stroke="#00FFC6" strokeWidth="1" opacity="0.5" fill={pressed ? "rgba(0,255,198,0.1)" : "none"} />

      {/* Center dot */}
      <circle cx="16" cy="16" r={pressed ? 3.5 : 2} fill="#00FFC6" opacity="0.85" />

      {/* Vertex markers — alternating colors on every other vertex */}
      {hexPoints.filter((_, i) => i % 2 === 0).map((p, i) => {
        const colors = ["#00FFC6", "#C084FC", "#22D3EE"];
        return (
          <g key={i}>
            <line x1="16" y1="16" x2={p.x} y2={p.y} stroke={colors[i]} strokeWidth="0.5" opacity="0.3" />
            <circle cx={p.x} cy={p.y} r="1.5" fill={colors[i]} opacity="0.8" />
          </g>
        );
      })}

      {/* Pulse hex */}
      <path d={hexPath} stroke="#00FFC6" strokeWidth="0.5" opacity="0.2">
        <animateTransform attributeName="transform" type="scale" values="1;1.5" dur="1.2s" repeatCount="indefinite" additive="sum" />
        <animate attributeName="opacity" values="0.2;0" dur="1.2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   Click Burst
   ═══════════════════════════════════════════════════════ */
function ClickBurstEffect({ burst }: { burst: ClickBurst }) {
  // Hex burst — 6 lines outward
  const lines = [0, 1, 2, 3, 4, 5].map((i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return {
      ex: 40 + 28 * Math.cos(angle),
      ey: 40 + 28 * Math.sin(angle),
    };
  });
  const colors = ["#00FFC6", "#C084FC", "#22D3EE", "#00FFC6", "#C084FC", "#22D3EE"];

  return (
    <div
      className="fixed pointer-events-none"
      style={{ left: burst.x, top: burst.y, zIndex: 9998, transform: "translate(-50%, -50%)" }}
    >
      <svg width={80} height={80} viewBox="0 0 80 80" fill="none">
        {/* Expanding hex ring */}
        <circle cx="40" cy="40" r="5" stroke="#00FFC6" strokeWidth="1.2" opacity="0.6">
          <animate attributeName="r" values="5;32" dur={`${CLICK_BURST_DURATION}ms`} fill="freeze" />
          <animate attributeName="opacity" values="0.6;0" dur={`${CLICK_BURST_DURATION}ms`} fill="freeze" />
        </circle>

        {/* 6 lines radiating outward */}
        {lines.map((l, i) => (
          <g key={i}>
            <line x1="40" y1="40" x2="40" y2="40" stroke={colors[i]} strokeWidth="1" strokeLinecap="round">
              <animate attributeName="x2" values={`40;${l.ex.toFixed(1)}`} dur={`${CLICK_BURST_DURATION * 0.8}ms`} fill="freeze" />
              <animate attributeName="y2" values={`40;${l.ey.toFixed(1)}`} dur={`${CLICK_BURST_DURATION * 0.8}ms`} fill="freeze" />
              <animate attributeName="opacity" values="0.7;0" dur={`${CLICK_BURST_DURATION}ms`} fill="freeze" />
            </line>
            <circle cx="40" cy="40" r="1" fill={colors[i]}>
              <animate attributeName="cx" values={`40;${l.ex.toFixed(1)}`} dur={`${CLICK_BURST_DURATION * 0.8}ms`} fill="freeze" />
              <animate attributeName="cy" values={`40;${l.ey.toFixed(1)}`} dur={`${CLICK_BURST_DURATION * 0.8}ms`} fill="freeze" />
              <animate attributeName="opacity" values="0.8;0" dur={`${CLICK_BURST_DURATION}ms`} fill="freeze" />
            </circle>
          </g>
        ))}

        {/* Center flash */}
        <circle cx="40" cy="40" r="4" fill="#00FFC6" opacity="0.6">
          <animate attributeName="r" values="4;1" dur="150ms" fill="freeze" />
          <animate attributeName="opacity" values="0.6;0" dur="250ms" fill="freeze" />
        </circle>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════ */
export default function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [clicks, setClicks] = useState<ClickBurst[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 180, mass: 0.4 };
  const followerX = useSpring(mouseX, springConfig);
  const followerY = useSpring(mouseY, springConfig);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<Point[]>([]);
  const lastMoveRef = useRef<number>(performance.now());
  const clickIdRef = useRef(0);

  useStelaCanvas(canvasRef, trailRef, lastMoveRef, isVisible);

  /* Clear trail on route change */
  useEffect(() => {
    trailRef.current = [];
  }, [pathname]);

  /* Detect pointer type */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsPointerFine(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Click burst cleanup */
  useEffect(() => {
    if (clicks.length === 0) return;
    const timer = setTimeout(() => {
      setClicks((prev) => prev.filter((c) => Date.now() - c.born < CLICK_BURST_DURATION));
    }, CLICK_BURST_DURATION + 50);
    return () => clearTimeout(timer);
  }, [clicks]);

  /* Mouse events */
  const onMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    lastMoveRef.current = performance.now();

    const trail = trailRef.current;
    trail.push({ x: e.clientX, y: e.clientY });
    if (trail.length > TRAIL_LENGTH) trail.shift();
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!isPointerFine || shouldReduceMotion) return;

    const handleMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      onMouseMove(e);
    };

    const handleLeave = () => {
      setIsVisible(false);
      trailRef.current = [];
    };
    const handleEnter = () => setIsVisible(true);

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor-hover]"
      ));
    };

    const handleDown = (e: MouseEvent) => {
      setIsPressed(true);
      clickIdRef.current += 1;
      setClicks((prev) => [
        ...prev,
        { id: clickIdRef.current, x: e.clientX, y: e.clientY, born: Date.now() },
      ]);
    };
    const handleUp = () => setIsPressed(false);

    document.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [isPointerFine, shouldReduceMotion, isVisible, onMouseMove]);

  if (!isPointerFine || shouldReduceMotion) return null;

  return (
    <>
      <style jsx global>{`
        @media (pointer: fine) {
          *, *::before, *::after { cursor: none !important; }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9994 }}
      />

      {clicks.map((burst) => (
        <ClickBurstEffect key={burst.id} burst={burst} />
      ))}

      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.12s",
        }}
      >
        {isHovering ? (
          <div style={{ transform: "translate(-50%, -50%)" }}>
            <HoverSVG pressed={isPressed} />
          </div>
        ) : (
          <PointerSVG pressed={isPressed} />
        )}
      </motion.div>

      {!isHovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none"
          style={{
            x: followerX,
            y: followerY,
            width: 38,
            height: 38,
            translateX: "-50%",
            translateY: "-50%",
            opacity: isVisible ? 0.3 : 0,
            zIndex: 9996,
            transition: "opacity 0.2s",
          }}
        >
          <svg width={38} height={38} viewBox="0 0 38 38" fill="none">
            {/* Hex orbit */}
            {(() => {
              const pts = [0, 1, 2, 3, 4, 5].map((i) => {
                const a = (Math.PI / 3) * i - Math.PI / 2;
                return `${19 + 16 * Math.cos(a)},${19 + 16 * Math.sin(a)}`;
              });
              return (
                <polygon
                  points={pts.join(" ")}
                  stroke="#00FFC6" strokeWidth="0.4"
                  strokeDasharray="2 3" fill="none" opacity="0.4"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 19 19;360 19 19"
                    dur="16s"
                    repeatCount="indefinite"
                  />
                </polygon>
              );
            })()}

            {/* 3 orbiting witness dots */}
            {[0, 120, 240].map((angle, idx) => {
              const colors = ["#00FFC6", "#C084FC", "#22D3EE"];
              return (
                <circle key={angle} cx="19" cy="3" r="1.2" fill={colors[idx]} opacity="0.6">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values={`${angle} 19 19;${angle + 360} 19 19`}
                    dur="7s"
                    repeatCount="indefinite"
                  />
                </circle>
              );
            })}
          </svg>
        </motion.div>
      )}
    </>
  );
}
