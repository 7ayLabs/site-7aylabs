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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type NodeColor = "teal" | "violet" | "cyan";

interface NetworkNode {
  /** Unique identifier */
  id: number;
  /** Position as percentage of container width (0-100) */
  x: number;
  /** Position as percentage of container height (0-100) */
  y: number;
  /** Visual tier: 1 = core (largest), 2 = mid, 3 = edge (smallest) */
  tier: 1 | 2 | 3;
  /** Color family */
  color: NodeColor;
  /** Distance from center (0 = center, 1 = edge) for stagger calculation */
  distanceFromCenter: number;
}

interface NetworkLink {
  from: number;
  to: number;
}

interface FeatureCardData {
  title: string;
  description: string;
  accentColor: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const COLOR_MAP: Record<NodeColor, { base: string; bright: string }> = {
  teal: { base: "#178E77", bright: "#00FFC6" },
  violet: { base: "#8B5CF6", bright: "#C084FC" },
  cyan: { base: "#0891B2", bright: "#22D3EE" },
};

/** 14 nodes arranged in a distributed network pattern.
 *  Coordinates as percentages for responsive scaling. */
const NODES: NetworkNode[] = [
  // Core cluster (center) - settle first
  { id: 0, x: 50, y: 44, tier: 1, color: "teal", distanceFromCenter: 0 },
  { id: 1, x: 42, y: 36, tier: 1, color: "teal", distanceFromCenter: 0.15 },
  { id: 2, x: 58, y: 36, tier: 1, color: "teal", distanceFromCenter: 0.15 },

  // Inner ring - settle second
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

const FEATURE_CARDS: FeatureCardData[] = [
  {
    title: "Zero-Knowledge Location",
    description: "Prove where you are without revealing who you are",
    accentColor: "var(--color-accent-primary)",
  },
  {
    title: "Multilateration Network",
    description: "Multiple nodes triangulate your position cryptographically",
    accentColor: "var(--color-accent-tertiary)",
  },
  {
    title: "Immutable Proof",
    description: "Your presence verification lives permanently on-chain",
    accentColor: "var(--color-accent-secondary)",
  },
];

/** Spring config shared across all scroll-driven transforms */
const SPRING_CONFIG = { stiffness: 100, damping: 30, mass: 0.8 } as const;

/** Node radius by tier */
function nodeRadius(tier: 1 | 2 | 3): number {
  return tier === 1 ? 6 : tier === 2 ? 4 : 2.5;
}

/* ------------------------------------------------------------------ */
/*  Hook: useNodeScrollTransform                                       */
/*  Each node gets an individual translateY based on distance from     */
/*  center. Outer nodes travel farther and settle later.               */
/* ------------------------------------------------------------------ */

function useNodeScrollTransform(
  scrollProgress: MotionValue<number>,
  distanceFromCenter: number
): MotionValue<number> {
  // Outer nodes (distance ~1) start at -120, center nodes at -60
  const startY = -60 - distanceFromCenter * 60;
  // Stagger the settle point: center settles by 0.35, edges by 0.55
  const settleAt = 0.35 + distanceFromCenter * 0.2;

  const raw = useTransform(scrollProgress, [0, settleAt], [startY, 0]);
  return useSpring(raw, SPRING_CONFIG);
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Individual network node with its own staggered scroll transform */
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
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{ background: `radial-gradient(circle, ${base}, transparent 70%)` }}
      />
      {/* Outer ring */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${r * 2 + 24} ${r * 2 + 24}`}
        fill="none"
      >
        <circle
          cx={(r * 2 + 24) / 2}
          cy={(r * 2 + 24) / 2}
          r={r + 8}
          stroke={base}
          strokeWidth="0.5"
          opacity="0.25"
        />
        {/* Node body */}
        <circle
          cx={(r * 2 + 24) / 2}
          cy={(r * 2 + 24) / 2}
          r={r}
          fill="var(--color-bg-primary)"
          stroke={bright}
          strokeWidth={node.tier === 1 ? "1.8" : "1"}
          opacity="0.9"
        />
        {/* Inner core dot */}
        <circle
          cx={(r * 2 + 24) / 2}
          cy={(r * 2 + 24) / 2}
          r={r * 0.35}
          fill={bright}
          opacity="0.85"
        />
        {/* Pulse ripple for tier 1 and 2 */}
        {node.tier <= 2 && (
          <circle
            cx={(r * 2 + 24) / 2}
            cy={(r * 2 + 24) / 2}
            fill="none"
            stroke={bright}
            strokeWidth={node.tier === 1 ? "1" : "0.5"}
          >
            <animate
              attributeName="r"
              values={`${r};${r * 4}`}
              dur={node.tier === 1 ? "2.5s" : "3.5s"}
              repeatCount="indefinite"
              begin={`${node.id * 0.3}s`}
            />
            <animate
              attributeName="opacity"
              values="0.35;0"
              dur={node.tier === 1 ? "2.5s" : "3.5s"}
              repeatCount="indefinite"
              begin={`${node.id * 0.3}s`}
            />
          </circle>
        )}
      </svg>
    </motion.div>
  );
}

/** Connection lines rendered as an SVG overlay.
 *  The SVG itself transforms with the 3D scene, so lines
 *  don't need individual scroll transforms. */
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
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke={c.base}
              strokeWidth="0.7"
              opacity="0.12"
              strokeLinecap="round"
            />
            <line
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke={c.base}
              strokeWidth="0.35"
              strokeDasharray="3 9"
              opacity="0.1"
              className="chain-flow"
            />
          </g>
        );
      })}

      {/* Core triangle fill */}
      <polygon
        points={`${NODES[0].x}%,${NODES[0].y}% ${NODES[1].x}%,${NODES[1].y}% ${NODES[2].x}%,${NODES[2].y}%`}
        fill="rgba(0,255,198,0.02)"
        stroke="#00FFC6"
        strokeWidth="0.5"
        strokeDasharray="6 4"
        opacity="0.15"
      />
    </svg>
  );
}

/** A single feature card that parallaxes into view */
function FeatureCard({
  card,
  index,
  scrollProgress,
}: {
  card: FeatureCardData;
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  // Cards animate in the 0.3-0.7 scroll range with offsets per card
  const offset = index * 0.06;

  // Card 0: from left, Card 1: from right, Card 2: from bottom
  const translateXRaw = useTransform(
    scrollProgress,
    [0.28 + offset, 0.58 + offset],
    [index === 0 ? -200 : index === 1 ? 200 : 0, 0]
  );
  const translateYRaw = useTransform(
    scrollProgress,
    [0.28 + offset, 0.58 + offset],
    [index === 2 ? 100 : 30, 0]
  );
  const opacityRaw = useTransform(
    scrollProgress,
    [0.25 + offset, 0.5 + offset],
    [0, 1]
  );

  const translateX = useSpring(translateXRaw, SPRING_CONFIG);
  const translateY = useSpring(translateYRaw, SPRING_CONFIG);
  const opacity = useSpring(opacityRaw, { stiffness: 120, damping: 30 });

  return (
    <motion.div
      className={cn(
        "glass-card glow-border p-5 sm:p-6 rounded-2xl max-w-[280px] w-full",
        // On mobile, stack vertically; on desktop, position with grid
        "mx-auto md:mx-0"
      )}
      style={{ x: translateX, y: translateY, opacity }}
    >
      {/* Accent bar */}
      <div
        className="w-8 h-1 rounded-full mb-4"
        style={{ background: card.accentColor }}
      />
      <h3 className="font-display font-bold text-base sm:text-lg text-fg mb-2 tracking-tight">
        {card.title}
      </h3>
      <p className="text-fg-tertiary text-sm leading-relaxed">
        {card.description}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Static Fallback (prefers-reduced-motion)                           */
/* ------------------------------------------------------------------ */

function StaticFallback() {
  return (
    <section
      className="relative w-full px-5 sm:px-6 lg:px-8 py-24 md:py-32"
      aria-labelledby="connections-heading-static"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-5">
            <SectionLabel>Network</SectionLabel>
          </div>
          <h2
            id="connections-heading-static"
            className="heading-lg text-fg mb-3"
          >
            The Network Sees You
          </h2>
          <p className="body-lg max-w-xl mx-auto">
            Without knowing who you are
          </p>
        </div>

        {/* Feature cards in a simple grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.title}
              className="glass-card glow-border p-5 sm:p-6 rounded-2xl"
            >
              <div
                className="w-8 h-1 rounded-full mb-4"
                style={{ background: card.accentColor }}
              />
              <h3 className="font-display font-bold text-base sm:text-lg text-fg mb-2 tracking-tight">
                {card.title}
              </h3>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Connections() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  /* ---------- 3D Scene transforms (network container) ---------- */
  const rotateXRaw = useTransform(scrollYProgress, [0, 0.5], [45, 0]);
  const rotateYRaw = useTransform(scrollYProgress, [0, 0.5], [-15, 0]);
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5], [0.7, 1]);
  const translateYRaw = useTransform(scrollYProgress, [0, 0.5], [80, 0]);
  const sceneOpacityRaw = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const rotateX = useSpring(rotateXRaw, SPRING_CONFIG);
  const rotateY = useSpring(rotateYRaw, SPRING_CONFIG);
  const scale = useSpring(scaleRaw, SPRING_CONFIG);
  const sceneTranslateY = useSpring(translateYRaw, SPRING_CONFIG);
  const sceneOpacity = useSpring(sceneOpacityRaw, { stiffness: 120, damping: 30 });

  /* ---------- Title transforms ---------- */
  const titleOpacityRaw = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);
  const titleBlurRaw = useTransform(scrollYProgress, [0.2, 0.45], [20, 0]);
  const titleYRaw = useTransform(scrollYProgress, [0.2, 0.45], [40, 0]);

  const titleOpacity = useSpring(titleOpacityRaw, { stiffness: 120, damping: 30 });
  const titleBlur = useSpring(titleBlurRaw, SPRING_CONFIG);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);
  const titleFilter = useTransform(titleBlur, (v) => `blur(${v}px)`);

  /* ---------- Background glow opacity ---------- */
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 0.7, 0.4]);

  // Reduced motion: render static version
  if (shouldReduceMotion) {
    return <StaticFallback />;
  }

  return (
    <section aria-labelledby="connections-heading">
      {/* Scroll container - 200vh tall to give scroll room */}
      <div ref={containerRef} className="relative" style={{ height: "200vh" }}>
        {/* Sticky viewport-height container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* -------- Layer 1: Background Mesh -------- */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: glowOpacity }}
            aria-hidden="true"
          >
            {/* Teal radial glow */}
            <div
              className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(23, 142, 119, 0.12), transparent 70%)",
                left: "15%",
                top: "20%",
              }}
            />
            {/* Violet radial glow */}
            <div
              className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent 70%)",
                right: "10%",
                top: "15%",
              }}
            />
            {/* Cyan bottom glow */}
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

          {/* -------- Layer 2: 3D Network Grid -------- */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1200px" }}
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
              {/* Connection lines (sit below nodes in DOM) */}
              <ConnectionLines />

              {/* Individual nodes with staggered scroll transforms */}
              {NODES.map((node) => (
                <ScrollNode
                  key={node.id}
                  node={node}
                  scrollProgress={scrollYProgress}
                />
              ))}
            </motion.div>
          </div>

          {/* -------- Layer 3: Floating Feature Cards -------- */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className={cn(
                "relative h-full w-full max-w-6xl mx-auto px-5 sm:px-6 lg:px-8",
                "flex flex-col md:flex-row items-end justify-center md:justify-between",
                "pb-[12vh] md:pb-[10vh] gap-4 md:gap-6"
              )}
            >
              {FEATURE_CARDS.map((card, i) => (
                <FeatureCard
                  key={card.title}
                  card={card}
                  index={i}
                  scrollProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>

          {/* -------- Layer 4: Section Title -------- */}
          <motion.div
            className="absolute inset-x-0 top-[8vh] sm:top-[10vh] flex flex-col items-center text-center px-6 z-10 pointer-events-none"
            style={{
              opacity: titleOpacity,
              y: titleY,
              filter: titleFilter,
            }}
          >
            <div className="mb-5">
              <SectionLabel>Network</SectionLabel>
            </div>
            <h2
              id="connections-heading"
              className="heading-lg text-fg mb-3"
            >
              The Network Sees You
            </h2>
            <p className="body-lg max-w-xl mx-auto">
              Without knowing who you are
            </p>
          </motion.div>

          {/* Bottom fade gradient for smooth transition to next section */}
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
