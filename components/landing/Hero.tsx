"use client";

import { memo, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { heroStagger, kineticReveal } from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PHRASES = [
  "Prove you're here. No biometrics.",
  "Bot-proof by design.",
  "Private by nature, not promise.",
] as const;

const TYPE_SPEED = 45;
const DELETE_SPEED = 25;
const PAUSE_AFTER_TYPE = 2800;
const PAUSE_AFTER_DELETE = 400;

/* ------------------------------------------------------------------ */
/*  Chain Network — 21 nodes, 3 colors                                 */
/* ------------------------------------------------------------------ */

type NodeColor = "teal" | "violet" | "cyan";

const COLOR_MAP: Record<NodeColor, { base: string; bright: string }> = {
  teal:   { base: "#178E77", bright: "#00FFC6" },
  violet: { base: "#8B5CF6", bright: "#C084FC" },
  cyan:   { base: "#0891B2", bright: "#22D3EE" },
};

interface NetNode {
  id: number;
  x: number;
  y: number;
  tier: 1 | 2 | 3;
  color: NodeColor;
}

interface NetLink { from: number; to: number }

/** A closed-loop circuit: packet visits each node in order, then returns to start */
interface Circuit {
  path: number[];
  speed: number;
  delay: number;
  shape?: "block";
  size?: "sm" | "lg";
}

const NODES: NetNode[] = [
  // ── Top row
  { id: 0,  x: 60,   y: 80,   tier: 3, color: "teal"   },
  { id: 1,  x: 380,  y: 100,  tier: 2, color: "teal"   },
  { id: 2,  x: 560,  y: 60,   tier: 3, color: "cyan"   },
  { id: 3,  x: 740,  y: 90,   tier: 2, color: "teal"   },
  { id: 4,  x: 920,  y: 55,   tier: 3, color: "violet" },
  { id: 5,  x: 1160, y: 210,  tier: 3, color: "violet" },
  // ── Upper-mid
  { id: 6,  x: 30,   y: 260,  tier: 3, color: "cyan"   },
  { id: 7,  x: 180,  y: 230,  tier: 3, color: "teal"   },
  { id: 8,  x: 1020, y: 250,  tier: 3, color: "teal"   },
  // ── Core validators
  { id: 9,  x: 320,  y: 320,  tier: 1, color: "teal"   },
  { id: 10, x: 680,  y: 290,  tier: 1, color: "teal"   },
  { id: 11, x: 500,  y: 490,  tier: 1, color: "teal"   },
  // ── Side anchors
  { id: 12, x: 20,   y: 430,  tier: 3, color: "violet" },
  { id: 13, x: 1180, y: 470,  tier: 3, color: "cyan"   },
  // ── Lower-mid
  { id: 14, x: 1050, y: 540,  tier: 3, color: "violet" },
  { id: 15, x: 900,  y: 580,  tier: 2, color: "cyan"   },
  // ── Bottom row
  { id: 16, x: 80,   y: 660,  tier: 2, color: "teal"   },
  { id: 17, x: 250,  y: 720,  tier: 3, color: "cyan"   },
  { id: 18, x: 620,  y: 710,  tier: 2, color: "violet" },
  { id: 19, x: 800,  y: 680,  tier: 3, color: "teal"   },
  { id: 20, x: 1140, y: 600,  tier: 3, color: "teal"   },
];

// Static structure lines
const LINKS: NetLink[] = [
  { from: 0,  to: 1  }, { from: 1,  to: 2  }, { from: 2,  to: 3  },
  { from: 3,  to: 4  }, { from: 4,  to: 5  },
  { from: 0,  to: 6  }, { from: 0,  to: 7  }, { from: 4,  to: 8  },
  { from: 5,  to: 8  }, { from: 6,  to: 9  }, { from: 7,  to: 9  },
  { from: 1,  to: 9  }, { from: 8,  to: 10 }, { from: 3,  to: 10 },
  { from: 2,  to: 10 }, { from: 12, to: 9  }, { from: 6,  to: 12 },
  { from: 13, to: 10 }, { from: 5,  to: 13 }, { from: 9,  to: 10 },
  { from: 9,  to: 11 }, { from: 10, to: 11 }, { from: 9,  to: 16 },
  { from: 11, to: 17 }, { from: 11, to: 18 }, { from: 10, to: 15 },
  { from: 10, to: 14 }, { from: 11, to: 19 }, { from: 12, to: 16 },
  { from: 14, to: 20 }, { from: 15, to: 19 }, { from: 13, to: 14 },
  { from: 16, to: 17 }, { from: 17, to: 18 }, { from: 18, to: 19 },
  { from: 19, to: 20 }, { from: 15, to: 20 },
];

// ── Full-circuit packets — each completes a closed loop ──
const CIRCUITS: Circuit[] = [
  // Core triangle — fast inner orbits
  { path: [9, 10, 11],                                               speed: 2.5, delay: 0 },
  { path: [11, 10, 9],                                               speed: 3,   delay: 1.2,  size: "lg" },

  // Left wing loop
  { path: [0, 7, 9, 11, 17, 16, 12, 6],                             speed: 7,   delay: 0.4,  shape: "block" },

  // Right wing loop
  { path: [4, 8, 10, 15, 19, 20, 14, 13, 5],                        speed: 8,   delay: 0.2 },

  // Top arc sweep
  { path: [0, 1, 2, 3, 4, 8, 10, 9, 7],                             speed: 6,   delay: 1.0 },

  // Bottom arc sweep
  { path: [16, 17, 18, 19, 15, 10, 9],                               speed: 5.5, delay: 0.7,  shape: "block" },

  // Full perimeter clockwise
  { path: [0, 1, 2, 3, 4, 5, 13, 14, 20, 19, 18, 17, 16, 12, 6],   speed: 13,  delay: 0,    size: "sm" },

  // Full perimeter counter-clockwise
  { path: [6, 12, 16, 17, 18, 19, 20, 14, 13, 5, 4, 3, 2, 1, 0],   speed: 15,  delay: 4,    size: "sm" },

  // Diagonal left→right through core
  { path: [6, 9, 10, 8, 5],                                          speed: 4.5, delay: 0.6 },

  // Diagonal right→left through core
  { path: [13, 10, 11, 17, 16, 12],                                  speed: 5,   delay: 1.8,  shape: "block" },

  // Inner figure-8 through core
  { path: [7, 9, 11, 18, 19, 15, 10, 3, 2, 10, 9],                  speed: 8,   delay: 0.3 },

  // Core to all bottom nodes
  { path: [9, 16, 17, 11, 18, 19, 15, 10],                           speed: 6.5, delay: 1.5,  size: "lg" },
];

/** Build an SVG path string for a closed circuit */
function circuitPath(ids: number[]): string {
  const first = NODES[ids[0]];
  let d = `M${first.x},${first.y}`;
  for (let i = 1; i < ids.length; i++) {
    d += ` L${NODES[ids[i]].x},${NODES[ids[i]].y}`;
  }
  // Close the loop back to start
  d += ` L${first.x},${first.y}`;
  return d;
}

/* ------------------------------------------------------------------ */
/*  HeroScene                                                          */
/* ------------------------------------------------------------------ */

function HeroScene() {
  const nodeR = (tier: number) => (tier === 1 ? 9 : tier === 2 ? 5.5 : 3.5);

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="w-full h-full"
        style={{ transformStyle: "preserve-3d", transformOrigin: "center 55%" }}
        initial={{ opacity: 0, rotateX: 18 }}
        animate={{ opacity: 1, rotateX: 8 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg
          viewBox="0 0 1200 800"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <filter id="pkt-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
              <feComposite in="SourceGraphic" in2="b" operator="over" />
            </filter>
            <filter id="bloom" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="22" />
            </filter>
          </defs>

          {/* === Connection lines (static chain structure) === */}
          {LINKS.map((link, i) => {
            const a = NODES[link.from];
            const b = NODES[link.to];
            const c = COLOR_MAP[a.color];
            return (
              <g key={`l-${i}`}>
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={c.base} strokeWidth="0.7"
                  opacity="0.14" strokeLinecap="round"
                />
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={c.base} strokeWidth="0.35"
                  strokeDasharray="3 9" opacity="0.12"
                  className="chain-flow"
                />
              </g>
            );
          })}

          {/* === Core validator triangulation zone === */}
          <motion.path
            d={`M${NODES[9].x},${NODES[9].y} L${NODES[10].x},${NODES[10].y} L${NODES[11].x},${NODES[11].y} Z`}
            fill="rgba(0,255,198,0.015)"
            stroke="#00FFC6"
            strokeWidth="0.8"
            strokeDasharray="8 6"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.04, 0.14, 0.04] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* === Full-circuit packets === */}
          {CIRCUITS.map((circuit, i) => {
            const pathD = circuitPath(circuit.path);
            const srcColor = NODES[circuit.path[0]].color;
            const color = COLOR_MAP[srcColor].bright;
            const r = circuit.size === "lg" ? 3.5 : circuit.size === "sm" ? 1.8 : 2.5;
            const glowR = r * 3.5;
            const isBlock = circuit.shape === "block";

            return (
              <g key={`c-${i}`}>
                {/* Glow trail */}
                <circle r={glowR} fill={color} opacity="0.12" filter="url(#pkt-glow)">
                  <animateMotion
                    dur={`${circuit.speed}s`}
                    repeatCount="indefinite"
                    begin={`${circuit.delay}s`}
                    path={pathD}
                  />
                </circle>
                {/* Core shape */}
                {isBlock ? (
                  <rect
                    x={-r} y={-r} width={r * 2} height={r * 2} rx={r * 0.4}
                    fill={color} opacity="0.9"
                  >
                    <animateMotion
                      dur={`${circuit.speed}s`}
                      repeatCount="indefinite"
                      begin={`${circuit.delay}s`}
                      path={pathD}
                    />
                  </rect>
                ) : (
                  <circle r={r} fill={color} opacity="0.9">
                    <animateMotion
                      dur={`${circuit.speed}s`}
                      repeatCount="indefinite"
                      begin={`${circuit.delay}s`}
                      path={pathD}
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* === Network Nodes === */}
          {NODES.map((node) => {
            const r = nodeR(node.tier);
            const { base, bright } = COLOR_MAP[node.color];

            return (
              <g key={`n-${node.id}`}>
                {/* Ambient bloom */}
                <circle
                  cx={node.x} cy={node.y} r={r * 5}
                  fill={base} opacity="0.04" filter="url(#bloom)"
                />
                {/* Outer ring */}
                <circle
                  cx={node.x} cy={node.y} r={r + 4}
                  fill="none" stroke={base} strokeWidth="0.5" opacity="0.22"
                />
                {/* Node body */}
                <circle
                  cx={node.x} cy={node.y} r={r}
                  fill="#050508" stroke={bright}
                  strokeWidth={node.tier === 1 ? "1.8" : "1"}
                  opacity="0.9"
                />
                {/* Inner core */}
                <circle
                  cx={node.x} cy={node.y} r={r * 0.35}
                  fill={bright} opacity="0.85"
                />
                {/* Ping ripple */}
                {node.tier <= 2 && (
                  <>
                    <circle
                      cx={node.x} cy={node.y}
                      fill="none" stroke={bright}
                      strokeWidth={node.tier === 1 ? "1.2" : "0.6"}
                    >
                      <animate
                        attributeName="r" values={`${r};${r * 7}`}
                        dur={node.tier === 1 ? "2s" : "3.5s"}
                        repeatCount="indefinite" begin={`${node.id * 0.2}s`}
                      />
                      <animate
                        attributeName="opacity" values="0.4;0"
                        dur={node.tier === 1 ? "2s" : "3.5s"}
                        repeatCount="indefinite" begin={`${node.id * 0.2}s`}
                      />
                    </circle>
                    {node.tier === 1 && (
                      <circle
                        cx={node.x} cy={node.y}
                        fill="none" stroke={bright} strokeWidth="0.6"
                      >
                        <animate
                          attributeName="r" values={`${r};${r * 7}`}
                          dur="2s" repeatCount="indefinite"
                          begin={`${node.id * 0.2 + 1}s`}
                        />
                        <animate
                          attributeName="opacity" values="0.25;0"
                          dur="2s" repeatCount="indefinite"
                          begin={`${node.id * 0.2 + 1}s`}
                        />
                      </circle>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Typewriter Hook                                                    */
/* ------------------------------------------------------------------ */

function useTypewriter(phrases: readonly string[]) {
  const [display, setDisplay] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = phrases[phraseIdx];
    if (!isDeleting) {
      if (display.length < current.length) {
        return { next: current.slice(0, display.length + 1), delay: TYPE_SPEED };
      }
      return { next: display, delay: PAUSE_AFTER_TYPE, startDelete: true };
    }
    if (display.length > 0) {
      return { next: display.slice(0, -1), delay: DELETE_SPEED };
    }
    return { next: "", delay: PAUSE_AFTER_DELETE, nextPhrase: true };
  }, [display, phraseIdx, isDeleting, phrases]);

  useEffect(() => {
    const result = tick();
    const timeout = setTimeout(() => {
      setDisplay(result.next);
      if (result.startDelete) setIsDeleting(true);
      if (result.nextPhrase) {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % phrases.length);
      }
    }, result.delay);
    return () => clearTimeout(timeout);
  }, [tick, phrases.length]);

  return display;
}

/* ------------------------------------------------------------------ */
/*  Hero Component                                                     */
/* ------------------------------------------------------------------ */

function HeroComponent() {
  const typed = useTypewriter(PHRASES);

  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden">
      <HeroScene />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        <motion.h1
          variants={kineticReveal}
          className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95]"
        >
          <span className="text-fg">Your </span>
          <span className="gradient-text-accent">presence</span>
          <br />
          <span className="text-fg">is your </span>
          <span className="gradient-text-accent">proof</span>
        </motion.h1>

        <motion.p
          variants={kineticReveal}
          className="mt-6 text-fg-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Prove you&apos;re really here — without scanning your face, sharing
          your location, or buying special hardware.
        </motion.p>

        <motion.div
          variants={kineticReveal}
          className="flex flex-wrap gap-4 justify-center mt-8"
        >
          <Button href="/waitlist" variant="primary" size="lg">
            Get Early Access
          </Button>
          <Button href="#how-it-works" variant="secondary" size="lg" withArrow>
            See How It Works
          </Button>
        </motion.div>

        <motion.div
          variants={kineticReveal}
          className="mt-10 h-7 flex items-center justify-center"
        >
          <span className="font-mono text-sm sm:text-base text-fg-muted tracking-wide">
            {typed}
          </span>
          <span
            className="inline-block w-[2px] h-[1.1em] ml-0.5 bg-[var(--color-accent-primary)]"
            style={{ animation: "cursorBlink 1s step-end infinite" }}
          />
        </motion.div>
      </motion.div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to top, var(--color-bg-primary), transparent)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}

const Hero = memo(HeroComponent);
Hero.displayName = "Hero";

export default Hero;
