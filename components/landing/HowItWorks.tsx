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
import SectionLabel from "@/components/ui/SectionLabel";
import { EASING, DURATION } from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type NodeColor = "teal" | "violet" | "cyan";

interface NetworkNode {
  id: number;
  x: number;
  y: number;
  tier: 1 | 2 | 3;
  color: NodeColor;
  distanceFromCenter: number;
}

interface NetworkLink {
  from: number;
  to: number;
}

interface Step {
  readonly number: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly accentColor: string;
  readonly glowColor: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const COLOR_MAP: Record<NodeColor, { base: string; bright: string }> = {
  teal: { base: "#178E77", bright: "#00FFC6" },
  violet: { base: "#8B5CF6", bright: "#C084FC" },
  cyan: { base: "#0891B2", bright: "#22D3EE" },
};

const NODES: NetworkNode[] = [
  // Core cluster (center) - settle first
  { id: 0, x: 50, y: 44, tier: 1, color: "teal", distanceFromCenter: 0 },
  { id: 1, x: 42, y: 36, tier: 1, color: "teal", distanceFromCenter: 0.15 },
  { id: 2, x: 58, y: 36, tier: 1, color: "teal", distanceFromCenter: 0.15 },
  // Inner ring
  { id: 3, x: 35, y: 50, tier: 2, color: "violet", distanceFromCenter: 0.3 },
  { id: 4, x: 65, y: 50, tier: 2, color: "cyan", distanceFromCenter: 0.3 },
  { id: 5, x: 50, y: 60, tier: 2, color: "violet", distanceFromCenter: 0.35 },
  { id: 6, x: 38, y: 26, tier: 2, color: "cyan", distanceFromCenter: 0.35 },
  { id: 7, x: 62, y: 26, tier: 2, color: "violet", distanceFromCenter: 0.35 },
  // Outer ring - settle last
  { id: 8, x: 22, y: 38, tier: 3, color: "teal", distanceFromCenter: 0.6 },
  { id: 9, x: 78, y: 38, tier: 3, color: "teal", distanceFromCenter: 0.6 },
  { id: 10, x: 20, y: 58, tier: 3, color: "cyan", distanceFromCenter: 0.7 },
  { id: 11, x: 80, y: 58, tier: 3, color: "violet", distanceFromCenter: 0.7 },
  { id: 12, x: 32, y: 68, tier: 3, color: "teal", distanceFromCenter: 0.65 },
  { id: 13, x: 68, y: 68, tier: 3, color: "cyan", distanceFromCenter: 0.65 },
];

const LINKS: NetworkLink[] = [
  // Core triangle
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 2 },
  // Core to inner ring
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 0, to: 5 },
  { from: 1, to: 6 },
  { from: 2, to: 7 },
  // Inner ring connections
  { from: 3, to: 5 },
  { from: 4, to: 5 },
  { from: 6, to: 7 },
  // Inner to outer ring
  { from: 6, to: 8 },
  { from: 7, to: 9 },
  { from: 3, to: 10 },
  { from: 4, to: 11 },
  { from: 5, to: 12 },
  { from: 5, to: 13 },
  // Outer ring cross-links
  { from: 8, to: 10 },
  { from: 9, to: 11 },
  { from: 12, to: 13 },
];

const STEPS: readonly Step[] = [
  {
    number: "01",
    label: "CONNECT",
    title: "Open the App",
    description:
      "Connect from any device — your phone, laptop, or tablet. No downloads, no equipment, no setup.",
    accentColor: "var(--color-accent-primary)",
    glowColor: "rgba(23, 142, 119, 0.15)",
  },
  {
    number: "02",
    label: "VERIFY",
    title: "We Confirm You're There",
    description:
      "The network measures your connection from multiple points to confirm your real-world location — privately and instantly.",
    accentColor: "var(--color-accent-tertiary)",
    glowColor: "rgba(139, 92, 246, 0.15)",
  },
  {
    number: "03",
    label: "OWN",
    title: "You Get Your Proof",
    description:
      "Your verified presence is recorded permanently on a public record you own. No company can change or revoke it.",
    accentColor: "var(--color-accent-secondary)",
    glowColor: "rgba(0, 255, 198, 0.12)",
  },
] as const;

/** Spring config shared across all scroll-driven transforms */
const SPRING_CONFIG = { stiffness: 100, damping: 30, mass: 0.8 } as const;
const OPACITY_SPRING = { stiffness: 120, damping: 30 } as const;

function nodeRadius(tier: 1 | 2 | 3): number {
  return tier === 1 ? 6 : tier === 2 ? 4 : 2.5;
}

/* ------------------------------------------------------------------ */
/*  SVG Illustrations (per step card)                                  */
/* ------------------------------------------------------------------ */

const illustrationNodeVariant = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: DURATION.slow,
      delay: 0.2 + i * 0.1,
      ease: EASING.snappy,
    },
  }),
};

const illustrationLineVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.4 + i * 0.12,
      ease: "easeOut",
    },
  }),
};

function ConnectIllustration({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <motion.rect
        x="72" y="60" width="56" height="80" rx="8"
        stroke={color} strokeWidth="2" fill="none"
        variants={illustrationNodeVariant} custom={0}
      />
      <motion.rect
        x="78" y="68" width="44" height="56" rx="4"
        stroke={color} strokeWidth="1" strokeOpacity="0.4" fill="none"
        variants={illustrationNodeVariant} custom={1}
      />
      <motion.circle
        cx="100" cy="132" r="3"
        stroke={color} strokeWidth="1.5" fill="none"
        variants={illustrationNodeVariant} custom={1}
      />
      {[28, 40, 52].map((r, i) => (
        <motion.path
          key={r}
          d={`M ${100 + r} 96 A ${r} ${r} 0 0 0 ${100 + r * 0.7} ${96 - r * 0.7}`}
          stroke={color} strokeWidth="1.5" strokeOpacity={0.6 - i * 0.15}
          strokeLinecap="round" fill="none"
          variants={illustrationLineVariant} custom={i}
        />
      ))}
      {[
        { cx: 160, cy: 50 },
        { cx: 170, cy: 100 },
        { cx: 155, cy: 150 },
      ].map((pos, i) => (
        <motion.circle
          key={i} cx={pos.cx} cy={pos.cy} r="6"
          stroke={color} strokeWidth="1.5" fill="none"
          variants={illustrationNodeVariant} custom={i + 2}
        >
          <animate
            attributeName="r" values="5;7;5"
            dur={`${3 + i * 0.5}s`} repeatCount="indefinite"
          />
        </motion.circle>
      ))}
      {[
        "M 148 75 L 160 50",
        "M 152 96 L 170 100",
        "M 148 117 L 155 150",
      ].map((d, i) => (
        <motion.path
          key={d} d={d}
          stroke={color} strokeWidth="1" strokeOpacity="0.3"
          strokeDasharray="4 4" fill="none"
          variants={illustrationLineVariant} custom={i + 2}
        />
      ))}
    </svg>
  );
}

function VerifyIllustration({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[
        { cx: 100, cy: 40 },
        { cx: 40, cy: 160 },
        { cx: 160, cy: 160 },
      ].map((pos, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={pos.cx} cy={pos.cy} r="10"
            stroke={color} strokeWidth="2" fill="none"
            variants={illustrationNodeVariant} custom={i}
          />
          <motion.circle
            cx={pos.cx} cy={pos.cy} r="4"
            fill={color} fillOpacity="0.6"
            variants={illustrationNodeVariant} custom={i}
          >
            <animate
              attributeName="fill-opacity" values="0.3;0.8;0.3"
              dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite"
            />
          </motion.circle>
        </motion.g>
      ))}
      {[
        "M 100 52 L 100 90",
        "M 48 154 L 90 108",
        "M 152 154 L 110 108",
      ].map((d, i) => (
        <motion.path
          key={d} d={d}
          stroke={color} strokeWidth="1.5" strokeDasharray="6 4"
          strokeLinecap="round" fill="none"
          variants={illustrationLineVariant} custom={i}
        />
      ))}
      {[
        "M 100 40 L 40 160",
        "M 40 160 L 160 160",
        "M 160 160 L 100 40",
      ].map((d, i) => (
        <motion.path
          key={d} d={d}
          stroke={color} strokeWidth="1" strokeOpacity="0.2" fill="none"
          variants={illustrationLineVariant} custom={i + 3}
        />
      ))}
      <motion.circle
        cx="100" cy="105" r="14"
        stroke={color} strokeWidth="2" fill="none"
        variants={illustrationNodeVariant} custom={4}
      >
        <animate
          attributeName="r" values="12;16;12"
          dur="3s" repeatCount="indefinite"
        />
      </motion.circle>
      <motion.path
        d="M 92 105 L 98 112 L 110 98"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"
        strokeLinejoin="round" fill="none"
        variants={illustrationLineVariant} custom={5}
      />
    </svg>
  );
}

function OwnIllustration({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <motion.path
        d="M 100 30 L 150 55 L 150 110 Q 150 150 100 175 Q 50 150 50 110 L 50 55 Z"
        stroke={color} strokeWidth="2" fill="none"
        variants={illustrationNodeVariant} custom={0}
      />
      <motion.path
        d="M 100 45 L 138 64 L 138 108 Q 138 140 100 160 Q 62 140 62 108 L 62 64 Z"
        stroke={color} strokeWidth="1" strokeOpacity="0.3" fill="none"
        variants={illustrationNodeVariant} custom={1}
      />
      <motion.rect
        x="82" y="90" width="36" height="30" rx="4"
        stroke={color} strokeWidth="2" fill="none"
        variants={illustrationNodeVariant} custom={2}
      />
      <motion.path
        d="M 90 90 L 90 78 A 10 10 0 0 1 110 78 L 110 90"
        stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"
        variants={illustrationLineVariant} custom={2}
      />
      <motion.circle
        cx="100" cy="102" r="4"
        fill={color} fillOpacity="0.6"
        variants={illustrationNodeVariant} custom={3}
      >
        <animate
          attributeName="fill-opacity" values="0.4;0.9;0.4"
          dur="3s" repeatCount="indefinite"
        />
      </motion.circle>
      <motion.path
        d="M 50 95 Q 30 95 30 105 Q 30 115 50 115"
        stroke={color} strokeWidth="1.5" strokeOpacity="0.5" fill="none"
        variants={illustrationLineVariant} custom={3}
      />
      <motion.path
        d="M 38 100 Q 18 100 18 110 Q 18 120 38 120"
        stroke={color} strokeWidth="1.5" strokeOpacity="0.3" fill="none"
        variants={illustrationLineVariant} custom={4}
      />
      <motion.path
        d="M 150 95 Q 170 95 170 105 Q 170 115 150 115"
        stroke={color} strokeWidth="1.5" strokeOpacity="0.5" fill="none"
        variants={illustrationLineVariant} custom={3}
      />
      <motion.path
        d="M 162 100 Q 182 100 182 110 Q 182 120 162 120"
        stroke={color} strokeWidth="1.5" strokeOpacity="0.3" fill="none"
        variants={illustrationLineVariant} custom={4}
      />
    </svg>
  );
}

const ILLUSTRATIONS = [ConnectIllustration, VerifyIllustration, OwnIllustration];

/* ------------------------------------------------------------------ */
/*  Hook: per-node staggered scroll transform                          */
/* ------------------------------------------------------------------ */

function useNodeScrollTransform(
  scrollProgress: MotionValue<number>,
  distanceFromCenter: number,
): MotionValue<number> {
  const startY = -60 - distanceFromCenter * 60;
  const settleAt = 0.35 + distanceFromCenter * 0.2;
  const raw = useTransform(scrollProgress, [0, settleAt], [startY, 0]);
  return useSpring(raw, SPRING_CONFIG);
}

/* ------------------------------------------------------------------ */
/*  Network sub-components                                             */
/* ------------------------------------------------------------------ */

function ScrollNode({
  node,
  scrollProgress,
}: {
  node: NetworkNode;
  scrollProgress: MotionValue<number>;
}) {
  const translateY = useNodeScrollTransform(scrollProgress, node.distanceFromCenter);
  const r = nodeRadius(node.tier);
  const { base, bright } = COLOR_MAP[node.color];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        x: "-50%",
        y: translateY,
        width: `${r * 2 + 24}px`,
        height: `${r * 2 + 24}px`,
        marginLeft: `-${(r * 2 + 24) / 2}px`,
        marginTop: `-${(r * 2 + 24) / 2}px`,
      }}
    >
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{ background: `radial-gradient(circle, ${base}, transparent 70%)` }}
      />
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${r * 2 + 24} ${r * 2 + 24}`}
        fill="none"
      >
        <circle
          cx={(r * 2 + 24) / 2} cy={(r * 2 + 24) / 2} r={r + 8}
          stroke={base} strokeWidth="0.5" opacity="0.25"
        />
        <circle
          cx={(r * 2 + 24) / 2} cy={(r * 2 + 24) / 2} r={r}
          fill="var(--color-bg-primary)" stroke={bright}
          strokeWidth={node.tier === 1 ? "1.8" : "1"} opacity="0.9"
        />
        <circle
          cx={(r * 2 + 24) / 2} cy={(r * 2 + 24) / 2} r={r * 0.35}
          fill={bright} opacity="0.85"
        />
        {node.tier <= 2 && (
          <circle
            cx={(r * 2 + 24) / 2} cy={(r * 2 + 24) / 2}
            fill="none" stroke={bright}
            strokeWidth={node.tier === 1 ? "1" : "0.5"}
          >
            <animate
              attributeName="r" values={`${r};${r * 4}`}
              dur={node.tier === 1 ? "2.5s" : "3.5s"}
              repeatCount="indefinite" begin={`${node.id * 0.3}s`}
            />
            <animate
              attributeName="opacity" values="0.35;0"
              dur={node.tier === 1 ? "2.5s" : "3.5s"}
              repeatCount="indefinite" begin={`${node.id * 0.3}s`}
            />
          </circle>
        )}
      </svg>
    </motion.div>
  );
}

function ConnectionLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {LINKS.map((link, i) => {
        const a = NODES[link.from];
        const b = NODES[link.to];
        const c = COLOR_MAP[a.color];
        return (
          <g key={`link-${i}`}>
            <line
              x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`}
              stroke={c.base} strokeWidth="0.7" opacity="0.12" strokeLinecap="round"
            />
            <line
              x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`}
              stroke={c.base} strokeWidth="0.35" strokeDasharray="3 9"
              opacity="0.1" className="chain-flow"
            />
          </g>
        );
      })}
      <polygon
        points={`${NODES[0].x}%,${NODES[0].y}% ${NODES[1].x}%,${NODES[1].y}% ${NODES[2].x}%,${NODES[2].y}%`}
        fill="rgba(0,255,198,0.02)" stroke="#00FFC6"
        strokeWidth="0.5" strokeDasharray="6 4" opacity="0.15"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll-driven step card                                            */
/* ------------------------------------------------------------------ */

function ScrollStepCard({
  step,
  index,
  scrollProgress,
}: {
  step: Step;
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const IllustrationComponent = ILLUSTRATIONS[index];

  /* --- Scroll ranges for each card ---
   *  Card 0: slide in 0.15-0.35, peak 0.20-0.33, fade out 0.33-0.42
   *  Card 1: slide in 0.30-0.50, peak 0.37-0.50, fade out 0.50-0.58
   *  Card 2: slide in 0.45-0.65, peak 0.52-0.72, stays visible
   */
  const enterStart = 0.15 + index * 0.15;
  const enterEnd = enterStart + 0.20;
  const peakStart = enterStart + 0.05;
  const peakEnd = enterEnd + 0.03;
  const exitEnd = peakEnd + 0.09;
  const isLast = index === STEPS.length - 1;

  // Translate X: odd cards come from right, even from left
  const fromX = index % 2 === 0 ? -300 : 300;
  const translateXRaw = useTransform(
    scrollProgress,
    [enterStart, enterEnd],
    [fromX, 0],
  );
  const translateX = useSpring(translateXRaw, SPRING_CONFIG);

  // Opacity: fade in during enter, fade out after peak (last card stays at 1)
  const exitOpacity = isLast ? 1 : 0;
  const opacityRaw = useTransform(
    scrollProgress,
    [enterStart, peakStart, peakEnd, exitEnd],
    [0, 1, 1, exitOpacity],
  );
  const opacity = useSpring(opacityRaw, OPACITY_SPRING);

  // Scale: subtle scale-up on enter
  const scaleRaw = useTransform(
    scrollProgress,
    [enterStart, enterEnd],
    [0.92, 1],
  );
  const scale = useSpring(scaleRaw, SPRING_CONFIG);

  // Vertical translate: slide up slightly on enter
  const translateYRaw = useTransform(
    scrollProgress,
    [enterStart, enterEnd],
    [40, 0],
  );
  const translateY = useSpring(translateYRaw, SPRING_CONFIG);

  return (
    <motion.div
      className={cn(
        "absolute inset-x-0 flex items-center justify-center",
        "px-5 sm:px-6 lg:px-8",
        "pointer-events-none",
      )}
      style={{
        top: "50%",
        x: translateX,
        y: translateY,
        opacity,
        scale,
        marginTop: "-140px", // offset to center the card in viewport
      }}
    >
      <motion.div
        className={cn(
          "glass-card glow-border relative overflow-hidden rounded-2xl",
          "p-6 sm:p-8 md:p-10",
          "flex flex-col gap-6",
          "md:flex-row md:items-center md:gap-10 lg:gap-16",
          "max-w-3xl w-full",
          "pointer-events-auto",
          index % 2 !== 0 && "md:flex-row-reverse",
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Illustration area with accent glow */}
        <div className="relative flex-shrink-0 w-full md:w-[240px] lg:w-[280px]">
          <div
            className="absolute inset-0 rounded-2xl opacity-60 blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${step.glowColor}, transparent 70%)`,
            }}
            aria-hidden="true"
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative aspect-square max-w-[180px] mx-auto md:max-w-none"
          >
            <IllustrationComponent color={step.accentColor} />
          </motion.div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Step number watermark */}
          <span
            className={cn(
              "absolute -top-4 font-display font-black select-none pointer-events-none",
              "text-[64px] sm:text-[80px] md:text-[100px] leading-none",
              "gradient-text-accent opacity-[0.06]",
              index % 2 !== 0
                ? "right-4 md:right-6"
                : "left-4 md:left-6",
            )}
            aria-hidden="true"
          >
            {step.number}
          </span>

          <span
            className="inline-block font-mono text-xs font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: step.accentColor }}
          >
            {step.label}
          </span>
          <h3 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-fg mb-3 tracking-tight">
            {step.title}
          </h3>
          <p className="text-fg-secondary text-base sm:text-lg leading-relaxed max-w-xl">
            {step.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Flow indicator pills (bottom of viewport)                          */
/* ------------------------------------------------------------------ */

function FlowIndicator({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const opacityRaw = useTransform(scrollProgress, [0.60, 0.75], [0, 1]);
  const opacity = useSpring(opacityRaw, OPACITY_SPRING);
  const yRaw = useTransform(scrollProgress, [0.60, 0.75], [20, 0]);
  const y = useSpring(yRaw, SPRING_CONFIG);

  return (
    <motion.div
      className="absolute bottom-[8vh] inset-x-0 z-10 pointer-events-none hidden md:flex items-center justify-center gap-0"
      style={{ opacity, y }}
    >
      {STEPS.map((step, i) => (
        <span key={step.label} className="contents">
          <span
            className="px-5 py-2 glass-card rounded-full font-mono text-xs font-medium tracking-wider"
            style={{ color: step.accentColor }}
          >
            {step.label}
          </span>
          {i < STEPS.length - 1 && (
            <svg
              width="48" height="2" viewBox="0 0 48 2"
              className="mx-1" aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id={`hiw-flowGrad-${i}`}
                  x1="0" y1="0" x2="48" y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor={STEPS[i].accentColor} />
                  <stop offset="1" stopColor={STEPS[i + 1].accentColor} />
                </linearGradient>
              </defs>
              <line
                x1="0" y1="1" x2="48" y2="1"
                stroke={`url(#hiw-flowGrad-${i})`}
                strokeWidth="1.5" strokeDasharray="4 4"
                className="chain-flow"
              />
            </svg>
          )}
        </span>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Static fallback (prefers-reduced-motion)                           */
/* ------------------------------------------------------------------ */

function StaticFallback() {
  return (
    <section
      id="how-it-works"
      className="relative w-full px-5 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 overflow-hidden"
      aria-labelledby="how-it-works-heading-static"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <div className="mb-5">
            <SectionLabel>How It Works</SectionLabel>
          </div>
          <h2
            id="how-it-works-heading-static"
            className="heading-lg text-fg mb-4"
          >
            From presence to proof in three steps
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            No biometrics. No hardware. Just your connection.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {STEPS.map((step, index) => {
            const IllustrationComponent = ILLUSTRATIONS[index];
            return (
              <div
                key={step.number}
                className={cn(
                  "glass-card glow-border relative overflow-hidden rounded-2xl",
                  "p-6 sm:p-8 md:p-10",
                  "flex flex-col gap-6",
                  "md:flex-row md:items-center md:gap-10 lg:gap-16",
                  index % 2 !== 0 && "md:flex-row-reverse",
                )}
              >
                <div className="relative flex-shrink-0 w-full md:w-[240px] lg:w-[280px]">
                  <div
                    className="absolute inset-0 rounded-2xl opacity-60 blur-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${step.glowColor}, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative aspect-square max-w-[180px] mx-auto md:max-w-none">
                    <IllustrationComponent color={step.accentColor} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block font-mono text-xs font-semibold uppercase tracking-[0.2em] mb-3"
                    style={{ color: step.accentColor }}
                  >
                    {step.label}
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-fg mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-fg-secondary text-base sm:text-lg leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Static flow indicator */}
        <div className="hidden md:flex items-center justify-center gap-0 mt-16">
          {STEPS.map((step, i) => (
            <span key={step.label} className="contents">
              <span
                className="px-5 py-2 glass-card rounded-full font-mono text-xs font-medium tracking-wider"
                style={{ color: step.accentColor }}
              >
                {step.label}
              </span>
              {i < STEPS.length - 1 && (
                <svg
                  width="48" height="2" viewBox="0 0 48 2"
                  className="mx-1" aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id={`hiw-static-flowGrad-${i}`}
                      x1="0" y1="0" x2="48" y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor={STEPS[i].accentColor} />
                      <stop offset="1" stopColor={STEPS[i + 1].accentColor} />
                    </linearGradient>
                  </defs>
                  <line
                    x1="0" y1="1" x2="48" y2="1"
                    stroke={`url(#hiw-static-flowGrad-${i})`}
                    strokeWidth="1.5" strokeDasharray="4 4"
                    className="chain-flow"
                  />
                </svg>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile layout (no scroll-driven, simple stacked cards)             */
/* ------------------------------------------------------------------ */

function MobileLayout() {
  return (
    <section
      id="how-it-works"
      className="relative w-full px-5 sm:px-6 py-24 overflow-hidden md:hidden"
      aria-labelledby="how-it-works-heading-mobile"
    >
      <div className="max-w-lg mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="mb-5">
            <SectionLabel>How It Works</SectionLabel>
          </div>
          <h2
            id="how-it-works-heading-mobile"
            className="heading-lg text-fg mb-4"
          >
            From presence to proof in three steps
          </h2>
          <p className="body-lg">
            No biometrics. No hardware. Just your connection.
          </p>
        </div>

        {/* Stacked cards */}
        <div className="flex flex-col gap-6">
          {STEPS.map((step, index) => {
            const IllustrationComponent = ILLUSTRATIONS[index];
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.5, ease: "easeOut" },
                }}
                viewport={{ once: true, margin: "-60px" }}
                className={cn(
                  "glass-card glow-border relative overflow-hidden rounded-2xl",
                  "p-6",
                  "flex flex-col gap-5",
                )}
              >
                {/* Watermark */}
                <span
                  className="absolute -top-3 right-3 font-display font-black select-none pointer-events-none text-[60px] leading-none gradient-text-accent opacity-[0.06]"
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                <div className="relative w-full">
                  <div
                    className="absolute inset-0 rounded-2xl opacity-60 blur-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${step.glowColor}, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative aspect-square max-w-[160px] mx-auto">
                    <IllustrationComponent color={step.accentColor} />
                  </div>
                </div>

                <div>
                  <span
                    className="inline-block font-mono text-xs font-semibold uppercase tracking-[0.2em] mb-2"
                    style={{ color: step.accentColor }}
                  >
                    {step.label}
                  </span>
                  <h3 className="font-display font-bold text-lg text-fg mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-fg-secondary text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop scroll-driven layout                                       */
/* ------------------------------------------------------------------ */

function DesktopScrollLayout() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  /* ----- 3D scene transforms ----- */
  const rotateXRaw = useTransform(scrollYProgress, [0, 0.35], [45, 0]);
  const rotateYRaw = useTransform(scrollYProgress, [0, 0.35], [-15, 0]);
  const scaleRaw = useTransform(scrollYProgress, [0, 0.35], [0.7, 1]);
  const sceneTranslateYRaw = useTransform(scrollYProgress, [0, 0.35], [80, 0]);
  const sceneOpacityRaw = useTransform(scrollYProgress, [0, 0.20], [0, 1]);

  const rotateX = useSpring(rotateXRaw, SPRING_CONFIG);
  const rotateY = useSpring(rotateYRaw, SPRING_CONFIG);
  const scale = useSpring(scaleRaw, SPRING_CONFIG);
  const sceneTranslateY = useSpring(sceneTranslateYRaw, SPRING_CONFIG);
  const sceneOpacity = useSpring(sceneOpacityRaw, OPACITY_SPRING);

  /* ----- Network fade out as cards appear ----- */
  const networkDimRaw = useTransform(
    scrollYProgress,
    [0.10, 0.25, 0.35, 0.50],
    [1, 1, 0.5, 0.25],
  );
  const networkDim = useSpring(networkDimRaw, OPACITY_SPRING);

  /* ----- Title transforms ----- */
  const titleOpacityRaw = useTransform(scrollYProgress, [0.08, 0.22], [0, 1]);
  const titleBlurRaw = useTransform(scrollYProgress, [0.08, 0.22], [20, 0]);
  const titleYRaw = useTransform(scrollYProgress, [0.08, 0.22], [40, 0]);

  const titleOpacity = useSpring(titleOpacityRaw, OPACITY_SPRING);
  const titleBlur = useSpring(titleBlurRaw, SPRING_CONFIG);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);
  const titleFilter = useTransform(titleBlur, (v) => `blur(${v}px)`);

  /* ----- Background glow ----- */
  const glowOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 0.7, 0.4]);

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="hidden md:block">
      {/* 250vh scroll container */}
      <div ref={containerRef} className="relative" style={{ height: "250vh" }}>
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

          {/* -------- Layer 1: Background mesh glows -------- */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: glowOpacity }}
            aria-hidden="true"
          >
            <div
              className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(23, 142, 119, 0.12), transparent 70%)",
                left: "15%",
                top: "20%",
              }}
            />
            <div
              className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent 70%)",
                right: "10%",
                top: "15%",
              }}
            />
            <div
              className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(0, 255, 198, 0.06), transparent 70%)",
                left: "50%",
                bottom: "15%",
                transform: "translateX(-50%)",
              }}
            />
          </motion.div>

          {/* -------- Layer 2: 3D Network (background) -------- */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1200px", opacity: networkDim }}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-[16/10] mx-auto"
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
                rotateX,
                rotateY,
                scale,
                y: sceneTranslateY,
                opacity: sceneOpacity,
              }}
            >
              <ConnectionLines />
              {NODES.map((node) => (
                <ScrollNode
                  key={node.id}
                  node={node}
                  scrollProgress={scrollYProgress}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* -------- Layer 3: Section title -------- */}
          <motion.div
            className="absolute inset-x-0 top-[8vh] sm:top-[10vh] flex flex-col items-center text-center px-6 z-10 pointer-events-none"
            style={{
              opacity: titleOpacity,
              y: titleY,
              filter: titleFilter,
            }}
          >
            <div className="mb-5">
              <SectionLabel>How It Works</SectionLabel>
            </div>
            <h2
              id="how-it-works-heading"
              className="heading-lg text-fg mb-3"
            >
              From presence to proof in three steps
            </h2>
            <p className="body-lg max-w-xl mx-auto">
              No biometrics. No hardware. Just your connection.
            </p>
          </motion.div>

          {/* -------- Layer 4: Step cards (one at a time) -------- */}
          <div className="absolute inset-0 z-10">
            {STEPS.map((step, index) => (
              <ScrollStepCard
                key={step.number}
                step={step}
                index={index}
                scrollProgress={scrollYProgress}
              />
            ))}
          </div>

          {/* -------- Layer 5: Flow indicator pills -------- */}
          <FlowIndicator scrollProgress={scrollYProgress} />

          {/* Bottom fade gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
            style={{
              background: "linear-gradient(to top, var(--color-bg-primary), transparent)",
            }}
            aria-hidden="true"
          />
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
    <>
      {/* Mobile: simple stacked layout with viewport animations */}
      <MobileLayout />
      {/* Desktop: full 3D scroll-driven experience */}
      <DesktopScrollLayout />
    </>
  );
}
