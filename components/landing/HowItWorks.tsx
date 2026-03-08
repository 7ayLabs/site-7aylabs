"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Phase {
  readonly id: number;
  readonly code: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly statusBar: string;
  readonly statusLabel: string;
  readonly color: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PHASES: readonly Phase[] = [
  {
    id: 1,
    code: "01",
    label: "CONNECT",
    title: "OPEN THE APP",
    description:
      "Connect from any device \u2014 your\nphone, laptop, or tablet. No\ndownloads, no equipment, no setup.",
    statusBar: "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
    statusLabel: "READY",
    color: "#00FFC6",
  },
  {
    id: 2,
    code: "02",
    label: "VERIFY",
    title: "CONFIRMING PRESENCE",
    description:
      "The network measures your connection\nfrom multiple points to confirm your\nreal-world location \u2014 privately and\ninstantly.",
    statusBar: "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591",
    statusLabel: "SCANNING",
    color: "#C084FC",
  },
  {
    id: 3,
    code: "03",
    label: "OWN",
    title: "PROOF RECORDED",
    description:
      "Your verified presence is recorded\npermanently on a public record you\nown. No company can change or\nrevoke it.",
    statusBar: "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
    statusLabel: "VERIFIED \u2713",
    color: "#22D3EE",
  },
] as const;

const SPRING_CFG = { stiffness: 100, damping: 30, mass: 0.8 } as const;
const OPACITY_SPRING = { stiffness: 120, damping: 30 } as const;

/* ------------------------------------------------------------------ */
/*  Utility: derive phase-based accent color from scroll               */
/* ------------------------------------------------------------------ */

function usePhaseColor(
  scrollYProgress: MotionValue<number>,
): MotionValue<string> {
  return useTransform(scrollYProgress, (v) => {
    if (v < 0.30) return PHASES[0].color;
    if (v < 0.60) return PHASES[1].color;
    return PHASES[2].color;
  });
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Radar Display (SVG)                                 */
/* ------------------------------------------------------------------ */

function RadarDisplay({
  sweepAngle,
  phaseColor,
  blipPositions,
  showTriangle,
  centerGlow,
}: {
  sweepAngle: MotionValue<number>;
  phaseColor: MotionValue<string>;
  blipPositions: {
    outer: MotionValue<number>;
    middle: MotionValue<number>;
    center: MotionValue<number>;
  };
  showTriangle: MotionValue<number>;
  centerGlow: MotionValue<number>;
}) {
  const sweepRotate = useTransform(sweepAngle, (v) => `rotate(${v}deg)`);

  /* Extract useTransform calls out of JSX to avoid hook-in-render violations */
  const trailBackground = useTransform(
    phaseColor,
    (c) =>
      `conic-gradient(from 0deg at 50% 50%, ${c}00 0deg, ${c}08 270deg, ${c}30 350deg, ${c}60 358deg, ${c}00 360deg)`,
  );
  const sweepLineBackground = useTransform(
    phaseColor,
    (c) =>
      `linear-gradient(to top, ${c}00 0%, ${c}99 70%, ${c} 100%)`,
  );

  return (
    <div className="relative w-[60vmin] h-[60vmin] md:w-[65vmin] md:h-[65vmin] max-w-[600px] max-h-[600px]">
      {/* Concentric rings + crosshairs (SVG) */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {/* Ring 1: 33% radius */}
        <circle
          cx="200"
          cy="200"
          r="66"
          fill="none"
          className="stroke-[var(--radar-ring)]"
          strokeWidth="0.6"
          strokeDasharray="4 6"
        />
        {/* Ring 2: 66% radius */}
        <circle
          cx="200"
          cy="200"
          r="132"
          fill="none"
          className="stroke-[var(--radar-ring)]"
          strokeWidth="0.6"
          strokeDasharray="4 6"
        />
        {/* Ring 3: 100% radius */}
        <circle
          cx="200"
          cy="200"
          r="198"
          fill="none"
          className="stroke-[var(--radar-ring)]"
          strokeWidth="0.6"
          strokeDasharray="4 6"
        />

        {/* Crosshairs: horizontal */}
        <line
          x1="2"
          y1="200"
          x2="398"
          y2="200"
          className="stroke-[var(--radar-ring)]"
          strokeWidth="0.4"
          strokeDasharray="6 10"
        />
        {/* Crosshairs: vertical */}
        <line
          x1="200"
          y1="2"
          x2="200"
          y2="398"
          className="stroke-[var(--radar-ring)]"
          strokeWidth="0.4"
          strokeDasharray="6 10"
        />

        {/* Diagonal crosshairs (45deg) */}
        <line
          x1="60"
          y1="60"
          x2="340"
          y2="340"
          className="stroke-[var(--radar-ring)]"
          strokeWidth="0.3"
          strokeDasharray="4 12"
        />
        <line
          x1="340"
          y1="60"
          x2="60"
          y2="340"
          className="stroke-[var(--radar-ring)]"
          strokeWidth="0.3"
          strokeDasharray="4 12"
        />

        {/* Center dot */}
        <circle
          cx="200"
          cy="200"
          r="2"
          className="fill-[var(--radar-ring)]"
        />
      </svg>

      {/* Sweep line + conic trail */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ transform: sweepRotate }}
      >
        {/* Conic trail (the afterglow) */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: trailBackground }}
        />
        {/* Sweep line itself */}
        <motion.div
          className="absolute top-0 left-1/2 w-[1px] h-1/2 origin-bottom"
          style={{ background: sweepLineBackground }}
        />
      </motion.div>

      {/* Blip: outer ring (Phase 1) */}
      <motion.div
        className="absolute"
        style={{
          top: "1%",
          left: "50%",
          x: "-50%",
          opacity: blipPositions.outer,
        }}
      >
        <div className="relative">
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: PHASES[0].color }}
          />
          <motion.div
            className="absolute inset-0 w-3 h-3 rounded-full animate-ping"
            style={{ backgroundColor: PHASES[0].color, opacity: 0.4 }}
          />
        </div>
      </motion.div>

      {/* Blip: middle ring (Phase 2) — with triangulation */}
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
        style={{ opacity: showTriangle }}
      >
        {/* Triangulation dots */}
        <circle cx="200" cy="134" r="5" fill={PHASES[1].color} opacity="0.9">
          <animate
            attributeName="r"
            values="4;6;4"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="143" cy="234" r="5" fill={PHASES[1].color} opacity="0.9">
          <animate
            attributeName="r"
            values="4;6;4"
            dur="2.3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="257" cy="234" r="5" fill={PHASES[1].color} opacity="0.9">
          <animate
            attributeName="r"
            values="4;6;4"
            dur="2.6s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Triangulation lines */}
        <polygon
          points="200,134 143,234 257,234"
          fill="none"
          stroke={PHASES[1].color}
          strokeWidth="1"
          strokeDasharray="6 4"
          opacity="0.5"
        >
          <animate
            attributeName="opacity"
            values="0.3;0.6;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        </polygon>
        {/* Inner fill */}
        <polygon
          points="200,134 143,234 257,234"
          fill={PHASES[1].color}
          opacity="0.03"
        />
      </motion.svg>

      {/* Blip: center (Phase 3) — center glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ opacity: centerGlow }}
      >
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-24 h-24 rounded-full blur-xl"
            style={{ backgroundColor: PHASES[2].color, opacity: 0.3 }}
          />
          <div
            className="absolute w-16 h-16 rounded-full blur-md"
            style={{ backgroundColor: PHASES[2].color, opacity: 0.4 }}
          />
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            className="relative z-10"
          >
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke={PHASES[2].color}
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M10 16L14 20L22 12"
              stroke={PHASES[2].color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Terminal Readout                                     */
/* ------------------------------------------------------------------ */

function TerminalReadout({
  phase,
  opacity,
  translateX,
  translateY,
  className,
}: {
  phase: Phase;
  opacity: MotionValue<number>;
  translateX?: MotionValue<number>;
  translateY?: MotionValue<number>;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "font-mono max-w-xs md:max-w-sm pointer-events-none select-none",
        className,
      )}
      style={{
        opacity,
        x: translateX,
        y: translateY,
      }}
    >
      {/* Phase header */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="text-xs tracking-[0.3em] font-semibold"
          style={{ color: phase.color }}
        >
          {"\u25C8"} PHASE {phase.code}
        </span>
        <span className="text-fg-faint text-xs">{"\u2500\u2500\u2500"}</span>
        <span
          className="text-xs tracking-[0.3em] font-semibold"
          style={{ color: phase.color }}
        >
          {phase.label}
        </span>
      </div>

      {/* Separator */}
      <div
        className="text-xs mb-3 opacity-30"
        style={{ color: phase.color }}
      >
        {"\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501"}
      </div>

      {/* Title */}
      <h3
        className="text-2xl md:text-4xl font-bold uppercase tracking-tight mb-4"
        style={{ color: phase.color }}
      >
        {phase.title}
      </h3>

      {/* Description */}
      <p className="text-sm md:text-base text-fg-tertiary leading-relaxed whitespace-pre-line mb-5">
        {phase.description}
      </p>

      {/* Status bar */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-fg-muted tracking-wider">STATUS:</span>
        <span
          className="tracking-[0.05em]"
          style={{ color: phase.color }}
        >
          {phase.statusBar}
        </span>
        <span
          className="tracking-[0.2em] font-semibold"
          style={{ color: phase.color }}
        >
          {phase.statusLabel}
        </span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Corner HUD elements                                 */
/* ------------------------------------------------------------------ */

function CornerHUD({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const progressText = useTransform(scrollProgress, (v) => {
    const pct = Math.round(v * 100);
    return `PROGRESS: ${pct}%`;
  });

  const hudOpacityRaw = useTransform(
    scrollProgress,
    [0, 0.04, 0.92, 1],
    [0, 1, 1, 0],
  );
  const hudOpacity = useSpring(hudOpacityRaw, OPACITY_SPRING);

  /* Extract from JSX to avoid hook-in-render violations */
  const coordOpacity = useTransform(
    scrollProgress,
    [0, 0.1, 0.3, 0.4, 0.6, 0.7, 0.9, 1],
    [0, 0.6, 0.6, 0.3, 0.3, 0.6, 0.6, 0],
  );

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none hidden md:block"
      style={{ opacity: hudOpacity }}
    >
      {/* Top-left */}
      <div className="absolute top-6 left-6 font-mono text-[10px] text-fg-faint tracking-wider">
        SCAN PROTOCOL v0.8.26
      </div>

      {/* Top-right */}
      <motion.div
        className="absolute top-6 right-6 font-mono text-[10px] text-fg-faint tracking-wider text-right"
        style={{ opacity: coordOpacity }}
      >
        LAT 40.7128{"\u00B0"} N{"  "}LON 74.0060{"\u00B0"} W
      </motion.div>

      {/* Bottom-left */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-fg-faint tracking-[0.2em]">
        7AYCHAIN NETWORK
      </div>

      {/* Bottom-right: scroll percentage */}
      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-fg-faint tracking-wider">
        <motion.span>{progressText}</motion.span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop scroll-driven layout                                       */
/* ------------------------------------------------------------------ */

function DesktopLayout() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* ----- Radar sweep ----- */
  const sweepAngleRaw = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const sweepAngle = useSpring(sweepAngleRaw, {
    stiffness: 60,
    damping: 30,
    mass: 1,
  });

  const phaseColor = usePhaseColor(scrollYProgress);

  /* ----- Blip opacity per phase ----- */
  const blipOuterRaw = useTransform(
    scrollYProgress,
    [0, 0.05, 0.28, 0.32],
    [0, 1, 1, 0],
  );
  const blipOuter = useSpring(blipOuterRaw, OPACITY_SPRING);

  const triangleRaw = useTransform(
    scrollYProgress,
    [0.28, 0.35, 0.58, 0.62],
    [0, 1, 1, 0],
  );
  const showTriangle = useSpring(triangleRaw, OPACITY_SPRING);

  const centerGlowRaw = useTransform(
    scrollYProgress,
    [0.58, 0.70],
    [0, 1],
  );
  const centerGlow = useSpring(centerGlowRaw, OPACITY_SPRING);

  /* ----- Phase 1 transforms (LEFT side) ----- */
  const p1OpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.08, 0.25, 0.32],
    [0, 1, 1, 0],
  );
  const p1Opacity = useSpring(p1OpacityRaw, OPACITY_SPRING);
  const p1TranslateXRaw = useTransform(
    scrollYProgress,
    [0, 0.05, 0.25, 0.32],
    [-60, 0, 0, -60],
  );
  const p1TranslateX = useSpring(p1TranslateXRaw, SPRING_CFG);

  /* ----- Phase 2 transforms (RIGHT side) ----- */
  const p2OpacityRaw = useTransform(
    scrollYProgress,
    [0.28, 0.35, 0.55, 0.62],
    [0, 1, 1, 0],
  );
  const p2Opacity = useSpring(p2OpacityRaw, OPACITY_SPRING);
  const p2TranslateXRaw = useTransform(
    scrollYProgress,
    [0.28, 0.35, 0.55, 0.62],
    [60, 0, 0, 60],
  );
  const p2TranslateX = useSpring(p2TranslateXRaw, SPRING_CFG);

  /* ----- Phase 3 transforms (BOTTOM center) ----- */
  const p3OpacityRaw = useTransform(
    scrollYProgress,
    [0.58, 0.65, 0.88, 0.95],
    [0, 1, 1, 0],
  );
  const p3Opacity = useSpring(p3OpacityRaw, OPACITY_SPRING);
  const p3TranslateYRaw = useTransform(
    scrollYProgress,
    [0.58, 0.65],
    [40, 0],
  );
  const p3TranslateY = useSpring(p3TranslateYRaw, SPRING_CFG);

  /* ----- Section heading ----- */
  const headingOpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.03, 0.06, 0.90, 0.96],
    [0, 0, 1, 1, 0],
  );
  const headingOpacity = useSpring(headingOpacityRaw, OPACITY_SPRING);

  return (
    <div className="hidden md:block" id="how-it-works">
      {/* 300vh scroll container */}
      <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
        {/* Sticky viewport */}
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{
            backgroundColor: "var(--color-bg-primary)",
          }}
        >
          {/* Scan-line texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, var(--scanline-color) 0px, var(--scanline-color) 1px, transparent 1px, transparent 3px)",
            }}
            aria-hidden="true"
          />

          {/* Corner HUD */}
          <CornerHUD scrollProgress={scrollYProgress} />

          {/* Section heading (top center) */}
          <motion.div
            className="absolute top-[6vh] inset-x-0 text-center z-10 pointer-events-none"
            style={{ opacity: headingOpacity }}
          >
            <h2 className="font-mono text-xs md:text-sm tracking-[0.4em] uppercase text-fg-muted mb-2">
              How It Works
            </h2>
            <p className="font-mono text-[10px] md:text-xs text-fg-faint tracking-wider">
              From presence to proof in three steps
            </p>
          </motion.div>

          {/* Main content area: radar + readouts */}
          <div className="absolute inset-0 flex items-center justify-center z-[2]">
            {/* Phase 1 readout (LEFT of radar) */}
            <div className="absolute left-[4vw] xl:left-[8vw] top-1/2 -translate-y-1/2 z-10">
              <TerminalReadout
                phase={PHASES[0]}
                opacity={p1Opacity}
                translateX={p1TranslateX}
              />
            </div>

            {/* Radar (center) */}
            <RadarDisplay
              sweepAngle={sweepAngle}
              phaseColor={phaseColor}
              blipPositions={{
                outer: blipOuter,
                middle: showTriangle,
                center: centerGlow,
              }}
              showTriangle={showTriangle}
              centerGlow={centerGlow}
            />

            {/* Phase 2 readout (RIGHT of radar) */}
            <div className="absolute right-[4vw] xl:right-[8vw] top-1/2 -translate-y-1/2 z-10">
              <TerminalReadout
                phase={PHASES[1]}
                opacity={p2Opacity}
                translateX={p2TranslateX}
              />
            </div>

            {/* Phase 3 readout (BELOW radar, centered) */}
            <div className="absolute bottom-[6vh] inset-x-0 flex justify-center z-10">
              <TerminalReadout
                phase={PHASES[2]}
                opacity={p3Opacity}
                translateY={p3TranslateY}
                className="text-center"
              />
            </div>
          </div>

          {/* Top edge fade */}
          <div
            className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-bg-primary), transparent)",
            }}
            aria-hidden="true"
          />

          {/* Bottom edge fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to top, var(--color-bg-primary), transparent)",
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile layout                                                      */
/* ------------------------------------------------------------------ */

function MobileLayout() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* ----- Radar sweep (same as desktop, just smaller) ----- */
  const sweepAngleRaw = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const sweepAngle = useSpring(sweepAngleRaw, {
    stiffness: 60,
    damping: 30,
    mass: 1,
  });

  const phaseColor = usePhaseColor(scrollYProgress);

  /* ----- Blips ----- */
  const blipOuterRaw = useTransform(
    scrollYProgress,
    [0, 0.06, 0.30, 0.35],
    [0, 1, 1, 0],
  );
  const blipOuter = useSpring(blipOuterRaw, OPACITY_SPRING);

  const triangleRaw = useTransform(
    scrollYProgress,
    [0.30, 0.38, 0.60, 0.66],
    [0, 1, 1, 0],
  );
  const showTriangle = useSpring(triangleRaw, OPACITY_SPRING);

  const centerGlowRaw = useTransform(
    scrollYProgress,
    [0.62, 0.74],
    [0, 1],
  );
  const centerGlow = useSpring(centerGlowRaw, OPACITY_SPRING);

  /* ----- Phase transforms (all appear BELOW radar) ----- */
  const p1OpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.08, 0.28, 0.34],
    [0, 1, 1, 0],
  );
  const p1Opacity = useSpring(p1OpacityRaw, OPACITY_SPRING);

  const p2OpacityRaw = useTransform(
    scrollYProgress,
    [0.30, 0.38, 0.58, 0.64],
    [0, 1, 1, 0],
  );
  const p2Opacity = useSpring(p2OpacityRaw, OPACITY_SPRING);

  const p3OpacityRaw = useTransform(
    scrollYProgress,
    [0.60, 0.68, 0.90, 0.96],
    [0, 1, 1, 0],
  );
  const p3Opacity = useSpring(p3OpacityRaw, OPACITY_SPRING);

  const p1YRaw = useTransform(scrollYProgress, [0, 0.08], [30, 0]);
  const p1Y = useSpring(p1YRaw, SPRING_CFG);
  const p2YRaw = useTransform(scrollYProgress, [0.30, 0.38], [30, 0]);
  const p2Y = useSpring(p2YRaw, SPRING_CFG);
  const p3YRaw = useTransform(scrollYProgress, [0.60, 0.68], [30, 0]);
  const p3Y = useSpring(p3YRaw, SPRING_CFG);

  /* Extract useTransform calls out of JSX to avoid hook-in-render violations */
  const mobileSweepRotate = useTransform(sweepAngle, (v) => `rotate(${v}deg)`);
  const mobileTrailBg = useTransform(
    phaseColor,
    (c) =>
      `conic-gradient(from 0deg at 50% 50%, ${c}00 0deg, ${c}08 270deg, ${c}30 350deg, ${c}60 358deg, ${c}00 360deg)`,
  );
  const mobileSweepLineBg = useTransform(
    phaseColor,
    (c) =>
      `linear-gradient(to top, ${c}00 0%, ${c}99 70%, ${c} 100%)`,
  );

  return (
    <div className="md:hidden" id="how-it-works-mobile">
      {/* 250vh scroll container */}
      <div ref={containerRef} className="relative" style={{ height: "250vh" }}>
        {/* Sticky viewport */}
        <div
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center"
          style={{ backgroundColor: "var(--color-bg-primary)" }}
        >
          {/* Scan-line texture */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, var(--scanline-color) 0px, var(--scanline-color) 1px, transparent 1px, transparent 3px)",
            }}
            aria-hidden="true"
          />

          {/* Heading */}
          <div className="relative z-10 pt-16 pb-4 text-center px-5">
            <h2 className="font-mono text-xs tracking-[0.4em] uppercase text-fg-muted mb-1">
              How It Works
            </h2>
            <p className="font-mono text-[10px] text-fg-faint tracking-wider">
              From presence to proof in three steps
            </p>
          </div>

          {/* Radar (smaller on mobile) */}
          <div className="relative z-[2] flex-shrink-0 mt-2">
            <div className="w-[70vw] h-[70vw] max-w-[280px] max-h-[280px] relative">
              {/* Reuse radar SVG inline for mobile size */}
              <svg
                viewBox="0 0 400 400"
                className="absolute inset-0 w-full h-full"
                aria-hidden="true"
              >
                <circle
                  cx="200" cy="200" r="66" fill="none"
                  className="stroke-[var(--radar-ring)]"
                  strokeWidth="0.6" strokeDasharray="4 6"
                />
                <circle
                  cx="200" cy="200" r="132" fill="none"
                  className="stroke-[var(--radar-ring)]"
                  strokeWidth="0.6" strokeDasharray="4 6"
                />
                <circle
                  cx="200" cy="200" r="198" fill="none"
                  className="stroke-[var(--radar-ring)]"
                  strokeWidth="0.6" strokeDasharray="4 6"
                />
                <line
                  x1="2" y1="200" x2="398" y2="200"
                  className="stroke-[var(--radar-ring)]"
                  strokeWidth="0.4" strokeDasharray="6 10"
                />
                <line
                  x1="200" y1="2" x2="200" y2="398"
                  className="stroke-[var(--radar-ring)]"
                  strokeWidth="0.4" strokeDasharray="6 10"
                />
                <circle cx="200" cy="200" r="2" className="fill-[var(--radar-ring)]" />
              </svg>

              {/* Sweep */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ transform: mobileSweepRotate }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: mobileTrailBg }}
                />
                <motion.div
                  className="absolute top-0 left-1/2 w-[1px] h-1/2 origin-bottom"
                  style={{ background: mobileSweepLineBg }}
                />
              </motion.div>

              {/* Outer blip */}
              <motion.div
                className="absolute top-[1%] left-1/2 -translate-x-1/2"
                style={{ opacity: blipOuter }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES[0].color }} />
              </motion.div>

              {/* Triangle (phase 2) */}
              <motion.svg
                viewBox="0 0 400 400"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: showTriangle }}
              >
                <circle cx="200" cy="134" r="4" fill={PHASES[1].color} opacity="0.9" />
                <circle cx="143" cy="234" r="4" fill={PHASES[1].color} opacity="0.9" />
                <circle cx="257" cy="234" r="4" fill={PHASES[1].color} opacity="0.9" />
                <polygon
                  points="200,134 143,234 257,234" fill="none"
                  stroke={PHASES[1].color} strokeWidth="1" strokeDasharray="6 4" opacity="0.4"
                />
              </motion.svg>

              {/* Center glow (phase 3) */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ opacity: centerGlow }}
              >
                <div
                  className="w-12 h-12 rounded-full blur-lg"
                  style={{ backgroundColor: PHASES[2].color, opacity: 0.3 }}
                />
              </motion.div>
            </div>
          </div>

          {/* Readout area (stacks below radar) */}
          <div className="relative z-10 flex-1 w-full px-5 mt-4 overflow-hidden">
            {/* Phase 1 */}
            <motion.div
              className="absolute inset-x-5 top-0"
              style={{ opacity: p1Opacity, y: p1Y }}
            >
              <MobileReadout phase={PHASES[0]} />
            </motion.div>
            {/* Phase 2 */}
            <motion.div
              className="absolute inset-x-5 top-0"
              style={{ opacity: p2Opacity, y: p2Y }}
            >
              <MobileReadout phase={PHASES[1]} />
            </motion.div>
            {/* Phase 3 */}
            <motion.div
              className="absolute inset-x-5 top-0"
              style={{ opacity: p3Opacity, y: p3Y }}
            >
              <MobileReadout phase={PHASES[2]} />
            </motion.div>
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to top, var(--color-bg-primary), transparent)",
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile readout (simplified terminal block)                         */
/* ------------------------------------------------------------------ */

function MobileReadout({ phase }: { phase: Phase }) {
  return (
    <div className="font-mono">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="text-[10px] tracking-[0.3em] font-semibold"
          style={{ color: phase.color }}
        >
          {"\u25C8"} PHASE {phase.code}
        </span>
        <span className="text-fg-faint text-[10px]">{"\u2500\u2500\u2500"}</span>
        <span
          className="text-[10px] tracking-[0.3em] font-semibold"
          style={{ color: phase.color }}
        >
          {phase.label}
        </span>
      </div>
      <div
        className="text-[10px] mb-2 opacity-30"
        style={{ color: phase.color }}
      >
        {"\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501"}
      </div>
      <h3
        className="text-xl font-bold uppercase tracking-tight mb-2"
        style={{ color: phase.color }}
      >
        {phase.title}
      </h3>
      <p className="text-xs text-fg-tertiary leading-relaxed whitespace-pre-line mb-3">
        {phase.description}
      </p>
      <div className="flex items-center gap-2 text-[10px]">
        <span className="text-fg-muted tracking-wider">STATUS:</span>
        <span style={{ color: phase.color }}>{phase.statusBar}</span>
        <span
          className="tracking-[0.2em] font-semibold"
          style={{ color: phase.color }}
        >
          {phase.statusLabel}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reduced motion: static fallback                                    */
/* ------------------------------------------------------------------ */

function StaticFallback() {
  return (
    <section
      id="how-it-works"
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
      aria-labelledby="how-it-works-heading-static"
    >
      {/* Scan-line texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--scanline-color) 0px, var(--scanline-color) 1px, transparent 1px, transparent 3px)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            id="how-it-works-heading-static"
            className="font-mono text-xs md:text-sm tracking-[0.4em] uppercase text-fg-muted mb-2"
          >
            How It Works
          </h2>
          <p className="font-mono text-[10px] md:text-xs text-fg-faint tracking-wider">
            From presence to proof in three steps
          </p>
        </div>

        {/* Stacked readouts */}
        <div className="flex flex-col gap-16">
          {PHASES.map((phase) => (
            <div
              key={phase.id}
              className="font-mono"
              style={{
                borderLeft: `2px solid ${phase.color}`,
                paddingLeft: "1.5rem",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs tracking-[0.3em] font-semibold"
                  style={{ color: phase.color }}
                >
                  {"\u25C8"} PHASE {phase.code}
                </span>
                <span className="text-fg-faint text-xs">
                  {"\u2500\u2500\u2500"}
                </span>
                <span
                  className="text-xs tracking-[0.3em] font-semibold"
                  style={{ color: phase.color }}
                >
                  {phase.label}
                </span>
              </div>
              <div
                className="text-xs mb-3 opacity-30"
                style={{ color: phase.color }}
              >
                {"\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501"}
              </div>
              <h3
                className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-3"
                style={{ color: phase.color }}
              >
                {phase.title}
              </h3>
              <p className="text-sm md:text-base text-fg-tertiary leading-relaxed whitespace-pre-line mb-4">
                {phase.description}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-fg-muted tracking-wider">STATUS:</span>
                <span style={{ color: phase.color }}>{phase.statusBar}</span>
                <span
                  className="tracking-[0.2em] font-semibold"
                  style={{ color: phase.color }}
                >
                  {phase.statusLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline styles for CSS custom properties                            */
/* ------------------------------------------------------------------ */

const SECTION_CSS_VARS = {
  "--radar-ring": "rgba(255,255,255,0.08)",
  "--scanline-color": "rgba(255,255,255,0.015)",
} as React.CSSProperties;

const SECTION_CSS_VARS_LIGHT = `
  [data-theme="light"] .scan-protocol-section {
    --radar-ring: rgba(0,0,0,0.06);
    --scanline-color: rgba(0,0,0,0.02);
  }
  @media (prefers-color-scheme: light) {
    :root:not([data-theme]) .scan-protocol-section {
      --radar-ring: rgba(0,0,0,0.06);
      --scanline-color: rgba(0,0,0,0.02);
    }
  }
`;

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: SECTION_CSS_VARS_LIGHT }} />
        <div className="scan-protocol-section" style={SECTION_CSS_VARS}>
          <StaticFallback />
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SECTION_CSS_VARS_LIGHT }} />
      <div
        className="scan-protocol-section"
        style={SECTION_CSS_VARS}
        aria-label="How it works: Scan protocol experience"
      >
        <DesktopLayout />
        <MobileLayout />
      </div>
    </>
  );
}
