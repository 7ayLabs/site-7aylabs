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
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly color: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PHASES: readonly Phase[] = [
  {
    label: "Phase One",
    title: "You show up",
    description:
      "Open the app from any device. No special equipment, no face scan, no fingerprints. Just your internet connection.",
    color: "#00FFC6",
  },
  {
    label: "Phase Two",
    title: "The network listens",
    description:
      "Nodes around you measure how long it takes for signals to travel back and forth. From those timings, they figure out where you are \u2014 without asking.",
    color: "#C084FC",
  },
  {
    label: "Phase Three",
    title: "Your proof is permanent",
    description:
      "Once enough nodes agree you were there, it\u2019s recorded on-chain. No one can change it, delete it, or take it from you.",
    color: "#22D3EE",
  },
] as const;

const LATENCY_LABELS = ["48ms", "52ms", "47ms"] as const;

const SPRING = { stiffness: 60, damping: 20, mass: 0.6 } as const;
const SPRING_SMOOTH = { stiffness: 50, damping: 22 } as const;

/* ------------------------------------------------------------------ */
/*  Geometry — equilateral triangle inscribed in a circle              */
/*                                                                     */
/*  SVG viewBox: 0 0 400 400, center at (200, 200)                    */
/*  Circumscribed circle radius: 160 (generous for ~55vmin visual)    */
/*  Witness A (top):          (200,  40)                              */
/*  Witness B (bottom-left):  ( 61, 280)                              */
/*  Witness C (bottom-right): (339, 280)                              */
/*  Secondary nodes: midpoints on the circle arc between witnesses    */
/* ------------------------------------------------------------------ */

const CX = 200;
const CY = 200;
const R = 160;

// Equilateral triangle vertices on circle (A at top, -90deg)
const A = { x: CX, y: CY - R }; // top
const B = { x: CX - R * Math.cos(Math.PI / 6), y: CY + R * Math.sin(Math.PI / 6) }; // bottom-left  (210deg)
const C = { x: CX + R * Math.cos(Math.PI / 6), y: CY + R * Math.sin(Math.PI / 6) }; // bottom-right (330deg)

// Secondary nodes: midpoints on the arc (30deg, 150deg, 270deg from top)
const S1 = { x: CX + R * Math.cos((-90 + 60) * (Math.PI / 180)), y: CY + R * Math.sin((-90 + 60) * (Math.PI / 180)) }; // between A and C
const S2 = { x: CX + R * Math.cos((-90 + 180) * (Math.PI / 180)), y: CY + R * Math.sin((-90 + 180) * (Math.PI / 180)) }; // between B and C (bottom)
const S3 = { x: CX + R * Math.cos((-90 + 300) * (Math.PI / 180)), y: CY + R * Math.sin((-90 + 300) * (Math.PI / 180)) }; // between A and B

// Line midpoints for latency labels (midpoint between witness and center)
const midA = { x: (A.x + CX) / 2, y: (A.y + CY) / 2 };
const midB = { x: (B.x + CX) / 2, y: (B.y + CY) / 2 };
const midC = { x: (C.x + CX) / 2, y: (C.y + CY) / 2 };

/* ------------------------------------------------------------------ */
/*  Utility: derive the current phase accent color from scroll         */
/* ------------------------------------------------------------------ */

function usePhaseColor(progress: MotionValue<number>): MotionValue<string> {
  return useTransform(progress, (v) => {
    if (v < 0.25) return PHASES[0].color;
    if (v < 0.55) return PHASES[1].color;
    return PHASES[2].color;
  });
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Triangulation Diagram (SVG)                         */
/* ------------------------------------------------------------------ */

function TriangulationDiagram({
  progress,
  isMobile,
}: {
  progress: MotionValue<number>;
  isMobile?: boolean;
}) {
  const phaseColor = usePhaseColor(progress);

  /* --- Phase 1: center dot + witness node arrivals --- */
  const centerDotOpacity = useSpring(
    useTransform(progress, [0.0, 0.08], [0, 1]),
    SPRING_SMOOTH,
  );
  const centerDotScale = useSpring(
    useTransform(progress, [0.0, 0.08], [0, 1]),
    SPRING,
  );

  // Witness A (top) — flies in from far above
  const witnessAOpacity = useSpring(
    useTransform(progress, [0.02, 0.12], [0, 1]),
    SPRING_SMOOTH,
  );
  const witnessAY = useSpring(
    useTransform(progress, [0.02, 0.20], [-450, 0]),
    SPRING,
  );

  // Witness B (bottom-left) — flies in from far lower-left
  const witnessBOpacity = useSpring(
    useTransform(progress, [0.05, 0.15], [0, 1]),
    SPRING_SMOOTH,
  );
  const witnessBX = useSpring(
    useTransform(progress, [0.05, 0.22], [-350, 0]),
    SPRING,
  );
  const witnessBY = useSpring(
    useTransform(progress, [0.05, 0.22], [350, 0]),
    SPRING,
  );

  // Witness C (bottom-right) — flies in from far lower-right
  const witnessCOpacity = useSpring(
    useTransform(progress, [0.08, 0.18], [0, 1]),
    SPRING_SMOOTH,
  );
  const witnessCX = useSpring(
    useTransform(progress, [0.08, 0.24], [350, 0]),
    SPRING,
  );
  const witnessCY = useSpring(
    useTransform(progress, [0.08, 0.24], [350, 0]),
    SPRING,
  );

  /* --- Phase 2: measurement lines + circle + secondary nodes --- */
  const lineDrawProgress = useSpring(
    useTransform(progress, [0.25, 0.50], [0, 1]),
    SPRING_SMOOTH,
  );
  const circleDrawProgress = useSpring(
    useTransform(progress, [0.35, 0.55], [0, 1]),
    SPRING_SMOOTH,
  );
  const secondaryNodesOpacity = useSpring(
    useTransform(progress, [0.40, 0.50], [0, 1]),
    SPRING_SMOOTH,
  );
  const latencyLabelsOpacity = useSpring(
    useTransform(progress, [0.30, 0.40], [0, 1]),
    SPRING_SMOOTH,
  );

  // Signal pulse positions (travel along lines)
  const pulsePosition = useTransform(progress, [0.28, 0.50], [0, 1]);

  // Pulse positions along each line (from witness to center)
  const pulseAX = useTransform(pulsePosition, (t) => A.x + (CX - A.x) * t);
  const pulseAY = useTransform(pulsePosition, (t) => A.y + (CY - A.y) * t);
  const pulseBX = useTransform(pulsePosition, (t) => B.x + (CX - B.x) * Math.min(1, t * 1.1));
  const pulseBY = useTransform(pulsePosition, (t) => B.y + (CY - B.y) * Math.min(1, t * 1.1));
  const pulseCX = useTransform(pulsePosition, (t) => C.x + (CX - C.x) * Math.min(1, t * 0.9 + 0.1));
  const pulseCY = useTransform(pulsePosition, (t) => C.y + (CY - C.y) * Math.min(1, t * 0.9 + 0.1));

  const pulseOpacity = useTransform(progress, [0.28, 0.32, 0.46, 0.50], [0, 0.8, 0.8, 0]);

  /* --- Phase 3: triangle fill + center glow + solid lines --- */
  const triangleFillOpacity = useSpring(
    useTransform(progress, [0.55, 0.72], [0, 1]),
    SPRING_SMOOTH,
  );
  const centerGlowScale = useSpring(
    useTransform(progress, [0.55, 0.75], [0.5, 2.5]),
    SPRING,
  );
  const centerGlowOpacity = useSpring(
    useTransform(progress, [0.55, 0.70], [0, 1]),
    SPRING_SMOOTH,
  );
  const solidLineOpacity = useSpring(
    useTransform(progress, [0.60, 0.75], [0, 1]),
    SPRING_SMOOTH,
  );
  const circumscribedBrightness = useSpring(
    useTransform(progress, [0.60, 0.80], [0.4, 0.8]),
    SPRING_SMOOTH,
  );

  // Node synchronous pulse in phase 3 (CSS animation handles it, we control opacity)
  const nodePulseOpacity = useSpring(
    useTransform(progress, [0.60, 0.75], [0, 0.5]),
    SPRING_SMOOTH,
  );

  /* --- Derived motion values for SVG stroke styles --- */
  const lineStrokeDashoffset = useTransform(lineDrawProgress, (v) => {
    const totalLength = 200;
    return totalLength * (1 - v);
  });

  const circleStrokeDashoffset = useTransform(circleDrawProgress, (v) => {
    const circumference = 2 * Math.PI * R;
    return circumference * (1 - v);
  });

  const circumscribedStrokeOpacity = useTransform(
    circumscribedBrightness,
    (v) => v,
  );

  /* Phase color aliases for semantic clarity in JSX */
  const strokeColor = phaseColor;
  const centerFill = phaseColor;

  /* --- Extract ALL useTransform calls out of JSX to avoid hook-in-render --- */
  const dashedLineOpacity = useTransform(lineDrawProgress, (v) => v * 0.7);
  const triangleFillFinalOpacity = useTransform(triangleFillOpacity, (v) => v * 0.15);
  const latencyLabelFinalOpacity = useTransform(latencyLabelsOpacity, (v) => v * 0.8);
  const secondaryNodeFinalOpacity = useTransform(secondaryNodesOpacity, (v) => v * 0.8);

  const sizeClass = isMobile
    ? "w-[min(75vw,320px)] h-[min(75vw,320px)]"
    : "w-[62vmin] h-[62vmin] max-w-[620px] max-h-[620px]";

  return (
    <div className={cn("relative", sizeClass)}>
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        {/* ===== Circumscribed circle ===== */}
        <motion.circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          strokeWidth="1.5"
          strokeDasharray={`${2 * Math.PI * R}`}
          style={{
            stroke: strokeColor,
            strokeDashoffset: circleStrokeDashoffset,
            opacity: circumscribedStrokeOpacity,
          }}
        />

        {/* ===== Measurement lines (dashed, phase 2) ===== */}
        {/* Line A -> Center */}
        <motion.line
          x1={A.x}
          y1={A.y}
          x2={CX}
          y2={CY}
          strokeWidth="1.5"
          strokeDasharray="8 5"
          pathLength="200"
          style={{
            stroke: strokeColor,
            strokeDashoffset: lineStrokeDashoffset,
            opacity: dashedLineOpacity,
          }}
        />
        {/* Line B -> Center */}
        <motion.line
          x1={B.x}
          y1={B.y}
          x2={CX}
          y2={CY}
          strokeWidth="1.5"
          strokeDasharray="8 5"
          pathLength="200"
          style={{
            stroke: strokeColor,
            strokeDashoffset: lineStrokeDashoffset,
            opacity: dashedLineOpacity,
          }}
        />
        {/* Line C -> Center */}
        <motion.line
          x1={C.x}
          y1={C.y}
          x2={CX}
          y2={CY}
          strokeWidth="1.5"
          strokeDasharray="8 5"
          pathLength="200"
          style={{
            stroke: strokeColor,
            strokeDashoffset: lineStrokeDashoffset,
            opacity: dashedLineOpacity,
          }}
        />

        {/* ===== Solid replacement lines (phase 3) ===== */}
        <motion.line
          x1={A.x} y1={A.y} x2={CX} y2={CY}
          strokeWidth="2"
          style={{ stroke: strokeColor, opacity: solidLineOpacity }}
        />
        <motion.line
          x1={B.x} y1={B.y} x2={CX} y2={CY}
          strokeWidth="2"
          style={{ stroke: strokeColor, opacity: solidLineOpacity }}
        />
        <motion.line
          x1={C.x} y1={C.y} x2={CX} y2={CY}
          strokeWidth="2"
          style={{ stroke: strokeColor, opacity: solidLineOpacity }}
        />

        {/* ===== Triangle fill (phase 3 — the payoff) ===== */}
        <motion.polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          style={{
            fill: strokeColor,
            opacity: triangleFillFinalOpacity,
          }}
        />

        {/* ===== Signal pulses (animated dots traveling along lines) ===== */}
        <motion.circle
          r="5"
          style={{
            cx: pulseAX,
            cy: pulseAY,
            fill: strokeColor,
            opacity: pulseOpacity,
          }}
        />
        <motion.circle
          r="5"
          style={{
            cx: pulseBX,
            cy: pulseBY,
            fill: strokeColor,
            opacity: pulseOpacity,
          }}
        />
        <motion.circle
          r="5"
          style={{
            cx: pulseCX,
            cy: pulseCY,
            fill: strokeColor,
            opacity: pulseOpacity,
          }}
        />

        {/* ===== Latency labels ===== */}
        <motion.text
          x={midA.x + 12}
          y={midA.y}
          className="font-mono"
          fontSize="11"
          style={{ fill: strokeColor, opacity: latencyLabelFinalOpacity }}
        >
          {LATENCY_LABELS[0]}
        </motion.text>
        <motion.text
          x={midB.x - 36}
          y={midB.y + 4}
          className="font-mono"
          fontSize="11"
          style={{ fill: strokeColor, opacity: latencyLabelFinalOpacity }}
        >
          {LATENCY_LABELS[1]}
        </motion.text>
        <motion.text
          x={midC.x + 12}
          y={midC.y + 4}
          className="font-mono"
          fontSize="11"
          style={{ fill: strokeColor, opacity: latencyLabelFinalOpacity }}
        >
          {LATENCY_LABELS[2]}
        </motion.text>

        {/* ===== Secondary nodes (on the circle between witnesses) ===== */}
        <motion.circle
          cx={S1.x} cy={S1.y} r="5"
          style={{
            fill: strokeColor,
            opacity: secondaryNodeFinalOpacity,
          }}
        />
        <motion.circle
          cx={S2.x} cy={S2.y} r="5"
          style={{
            fill: strokeColor,
            opacity: secondaryNodeFinalOpacity,
          }}
        />
        <motion.circle
          cx={S3.x} cy={S3.y} r="5"
          style={{
            fill: strokeColor,
            opacity: secondaryNodeFinalOpacity,
          }}
        />

        {/* ===== Witness node A (top) ===== */}
        <motion.g
          style={{
            opacity: witnessAOpacity,
            y: witnessAY,
          }}
        >
          <circle
            cx={A.x}
            cy={A.y}
            r="12"
            fill="var(--color-bg-primary)"
            stroke={PHASES[0].color}
            strokeWidth="2.5"
          />
          {/* Pulse ring (phase 3) */}
          <motion.circle
            cx={A.x}
            cy={A.y}
            r="18"
            fill="none"
            strokeWidth="1.5"
            style={{
              stroke: strokeColor,
              opacity: nodePulseOpacity,
            }}
          >
            <animate
              attributeName="r"
              values="14;26;14"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </motion.circle>
        </motion.g>

        {/* ===== Witness node B (bottom-left) ===== */}
        <motion.g
          style={{
            opacity: witnessBOpacity,
            x: witnessBX,
            y: witnessBY,
          }}
        >
          <circle
            cx={B.x}
            cy={B.y}
            r="12"
            fill="var(--color-bg-primary)"
            stroke={PHASES[0].color}
            strokeWidth="2.5"
          />
          <motion.circle
            cx={B.x}
            cy={B.y}
            r="18"
            fill="none"
            strokeWidth="1.5"
            style={{
              stroke: strokeColor,
              opacity: nodePulseOpacity,
            }}
          >
            <animate
              attributeName="r"
              values="14;26;14"
              dur="2.3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0;0.5"
              dur="2.3s"
              repeatCount="indefinite"
            />
          </motion.circle>
        </motion.g>

        {/* ===== Witness node C (bottom-right) ===== */}
        <motion.g
          style={{
            opacity: witnessCOpacity,
            x: witnessCX,
            y: witnessCY,
          }}
        >
          <circle
            cx={C.x}
            cy={C.y}
            r="12"
            fill="var(--color-bg-primary)"
            stroke={PHASES[0].color}
            strokeWidth="2.5"
          />
          <motion.circle
            cx={C.x}
            cy={C.y}
            r="18"
            fill="none"
            strokeWidth="1.5"
            style={{
              stroke: strokeColor,
              opacity: nodePulseOpacity,
            }}
          >
            <animate
              attributeName="r"
              values="14;26;14"
              dur="2.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0;0.5"
              dur="2.6s"
              repeatCount="indefinite"
            />
          </motion.circle>
        </motion.g>

        {/* ===== Center dot (YOU) ===== */}
        <motion.circle
          cx={CX}
          cy={CY}
          r="8"
          style={{
            fill: centerFill,
            opacity: centerDotOpacity,
            scale: centerDotScale,
          }}
        />

        {/* ===== Center glow ring (phase 3 payoff) ===== */}
        <motion.circle
          cx={CX}
          cy={CY}
          r="30"
          fill="none"
          strokeWidth="2"
          style={{
            stroke: strokeColor,
            opacity: centerGlowOpacity,
            scale: centerGlowScale,
          }}
        />
      </svg>

      {/* Center glow effect (HTML overlay for better blur performance) */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 140,
          height: 140,
          background: `radial-gradient(circle, ${PHASES[2].color}50 0%, ${PHASES[2].color}15 40%, ${PHASES[2].color}00 70%)`,
          opacity: centerGlowOpacity,
          scale: centerGlowScale,
        }}
      />

      {/* Enlarged center dot overlay for phase 3 */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 20,
          height: 20,
          backgroundColor: PHASES[2].color,
          opacity: centerGlowOpacity,
          boxShadow: `0 0 30px ${PHASES[2].color}90, 0 0 60px ${PHASES[2].color}50, 0 0 100px ${PHASES[2].color}20`,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Phase Text Block                                    */
/* ------------------------------------------------------------------ */

function PhaseTextBlock({
  phase,
  opacity,
  className,
}: {
  phase: Phase;
  opacity: MotionValue<number>;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("absolute inset-0 flex flex-col justify-center", className)}
      style={{ opacity }}
    >
      <div
        className="pl-6 md:pl-8"
        style={{ borderLeft: `4px solid ${phase.color}` }}
      >
        {/* Phase label */}
        <p
          className="text-xs tracking-[0.2em] uppercase font-medium mb-3 md:mb-4"
          style={{ color: phase.color }}
        >
          {phase.label}
        </p>

        {/* Title */}
        <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-5xl text-fg leading-tight mb-4 md:mb-6">
          {phase.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-fg-tertiary leading-relaxed max-w-md">
          {phase.description}
        </p>
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

  /* ----- Phase text opacity (crossfade) ----- */
  const p1Opacity = useSpring(
    useTransform(scrollYProgress, [0.0, 0.08, 0.22, 0.30], [0, 1, 1, 0]),
    SPRING_SMOOTH,
  );
  const p2Opacity = useSpring(
    useTransform(scrollYProgress, [0.25, 0.33, 0.52, 0.60], [0, 1, 1, 0]),
    SPRING_SMOOTH,
  );
  const p3Opacity = useSpring(
    useTransform(scrollYProgress, [0.55, 0.63, 0.85, 0.92], [0, 1, 1, 0]),
    SPRING_SMOOTH,
  );

  /* ----- Section heading ----- */
  const headingOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.04, 0.08, 0.88, 0.94], [0, 0, 1, 1, 0]),
    SPRING_SMOOTH,
  );

  return (
    <div className="hidden md:block">
      {/* 180vh scroll container */}
      <div ref={containerRef} className="relative" style={{ height: "180vh" }}>
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Section heading — top center */}
          <motion.div
            className="absolute top-[10vh] inset-x-0 text-center z-10 pointer-events-none px-6"
            style={{ opacity: headingOpacity }}
          >
            <span className="block text-xs tracking-[0.2em] uppercase text-fg-muted mb-3">
              How It Works
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-fg">
              From presence to proof
            </h2>
          </motion.div>

          {/* Two-column layout */}
          <div className="absolute inset-0 flex items-center z-[2]">
            {/* Left column — text block (35%) */}
            <div className="relative w-[35%] h-[50vh] pl-[5vw] xl:pl-[8vw] pr-8">
              <PhaseTextBlock phase={PHASES[0]} opacity={p1Opacity} />
              <PhaseTextBlock phase={PHASES[1]} opacity={p2Opacity} />
              <PhaseTextBlock phase={PHASES[2]} opacity={p3Opacity} />
            </div>

            {/* Gap */}
            <div className="w-[5%]" />

            {/* Right column — triangulation diagram (60%) */}
            <div className="flex-1 flex items-center justify-center">
              <TriangulationDiagram progress={scrollYProgress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile scroll-driven layout                                        */
/* ------------------------------------------------------------------ */

function MobileLayout() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* ----- Phase text opacity (crossfade) ----- */
  const p1Opacity = useSpring(
    useTransform(scrollYProgress, [0.0, 0.08, 0.22, 0.30], [0, 1, 1, 0]),
    SPRING_SMOOTH,
  );
  const p2Opacity = useSpring(
    useTransform(scrollYProgress, [0.25, 0.33, 0.52, 0.60], [0, 1, 1, 0]),
    SPRING_SMOOTH,
  );
  const p3Opacity = useSpring(
    useTransform(scrollYProgress, [0.55, 0.63, 0.85, 0.92], [0, 1, 1, 0]),
    SPRING_SMOOTH,
  );

  /* ----- Section heading ----- */
  const headingOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.04, 0.08, 0.88, 0.94], [0, 0, 1, 1, 0]),
    SPRING_SMOOTH,
  );

  return (
    <div className="md:hidden">
      {/* 160vh scroll container on mobile */}
      <div ref={containerRef} className="relative" style={{ height: "160vh" }}>
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center">
          {/* Section heading */}
          <motion.div
            className="relative z-10 pt-20 pb-4 text-center px-5"
            style={{ opacity: headingOpacity }}
          >
            <span className="block text-xs tracking-[0.2em] uppercase text-fg-muted mb-2">
              How It Works
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-fg">
              From presence to proof
            </h2>
          </motion.div>

          {/* Triangle — takes up the top portion */}
          <div className="relative z-[2] flex-shrink-0 flex items-center justify-center py-4">
            <TriangulationDiagram progress={scrollYProgress} isMobile />
          </div>

          {/* Text block area below triangle */}
          <div className="relative z-10 flex-1 w-full px-6 overflow-hidden">
            <PhaseTextBlock phase={PHASES[0]} opacity={p1Opacity} />
            <PhaseTextBlock phase={PHASES[1]} opacity={p2Opacity} />
            <PhaseTextBlock phase={PHASES[2]} opacity={p3Opacity} />
          </div>
        </div>
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
      className="relative w-full py-24 md:py-32"
      aria-labelledby="how-it-works-heading-static"
    >
      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 md:mb-20">
          <span className="block text-xs tracking-[0.2em] uppercase text-fg-muted mb-3">
            How It Works
          </span>
          <h2
            id="how-it-works-heading-static"
            className="font-display font-bold text-3xl md:text-5xl tracking-tight text-fg"
          >
            From presence to proof
          </h2>
        </div>

        {/* Stacked phase blocks */}
        <div className="flex flex-col gap-16 md:gap-20">
          {PHASES.map((phase) => (
            <div
              key={phase.label}
              className="pl-6 md:pl-8"
              style={{ borderLeft: `4px solid ${phase.color}` }}
            >
              {/* Phase label */}
              <p
                className="text-xs tracking-[0.2em] uppercase font-medium mb-3 md:mb-4"
                style={{ color: phase.color }}
              >
                {phase.label}
              </p>

              {/* Title */}
              <h3 className="font-display font-bold text-2xl md:text-4xl text-fg leading-tight mb-4 md:mb-5">
                {phase.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-fg-tertiary leading-relaxed max-w-md">
                {phase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <StaticFallback />;
  }

  return (
    <section
      id="how-it-works"
      aria-label="How 7aychain verifies your presence"
    >
      <DesktopLayout />
      <MobileLayout />
    </section>
  );
}
