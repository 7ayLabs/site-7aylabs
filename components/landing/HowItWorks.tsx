"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils/cn";
import SectionLabel from "@/components/ui/SectionLabel";
import {
  staggerContainer,
  fadeUpBlur,
  defaultViewport,
  EASING,
  DURATION,
} from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                 */
/* ------------------------------------------------------------------ */

const watermarkVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASING.snappy },
  },
};

const connectorVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeInOut", delay: 0.3 },
  },
};

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

/* ------------------------------------------------------------------ */
/*  SVG Illustrations                                                  */
/* ------------------------------------------------------------------ */

function ConnectIllustration({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Central device icon */}
      <motion.rect
        x="72"
        y="60"
        width="56"
        height="80"
        rx="8"
        stroke={color}
        strokeWidth="2"
        fill="none"
        variants={illustrationNodeVariant}
        custom={0}
      />
      {/* Device screen */}
      <motion.rect
        x="78"
        y="68"
        width="44"
        height="56"
        rx="4"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.4"
        fill="none"
        variants={illustrationNodeVariant}
        custom={1}
      />
      {/* Home button */}
      <motion.circle
        cx="100"
        cy="132"
        r="3"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        variants={illustrationNodeVariant}
        custom={1}
      />

      {/* Signal waves radiating from device */}
      {[28, 40, 52].map((r, i) => (
        <motion.path
          key={r}
          d={`M ${100 + r} 96 A ${r} ${r} 0 0 0 ${100 + r * 0.7} ${96 - r * 0.7}`}
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity={0.6 - i * 0.15}
          strokeLinecap="round"
          fill="none"
          variants={illustrationLineVariant}
          custom={i}
        />
      ))}

      {/* 3 connected nodes */}
      {[
        { cx: 160, cy: 50 },
        { cx: 170, cy: 100 },
        { cx: 155, cy: 150 },
      ].map((pos, i) => (
        <motion.circle
          key={i}
          cx={pos.cx}
          cy={pos.cy}
          r="6"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          variants={illustrationNodeVariant}
          custom={i + 2}
        >
          <animate
            attributeName="r"
            values="5;7;5"
            dur={`${3 + i * 0.5}s`}
            repeatCount="indefinite"
          />
        </motion.circle>
      ))}

      {/* Connection lines from waves to nodes */}
      {[
        "M 148 75 L 160 50",
        "M 152 96 L 170 100",
        "M 148 117 L 155 150",
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.3"
          strokeDasharray="4 4"
          fill="none"
          variants={illustrationLineVariant}
          custom={i + 2}
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
      {/* Three triangulation nodes */}
      {[
        { cx: 100, cy: 40 },
        { cx: 40, cy: 160 },
        { cx: 160, cy: 160 },
      ].map((pos, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={pos.cx}
            cy={pos.cy}
            r="10"
            stroke={color}
            strokeWidth="2"
            fill="none"
            variants={illustrationNodeVariant}
            custom={i}
          />
          <motion.circle
            cx={pos.cx}
            cy={pos.cy}
            r="4"
            fill={color}
            fillOpacity="0.6"
            variants={illustrationNodeVariant}
            custom={i}
          >
            <animate
              attributeName="fill-opacity"
              values="0.3;0.8;0.3"
              dur={`${2.5 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </motion.circle>
        </motion.g>
      ))}

      {/* Measurement lines from each node to center */}
      {[
        "M 100 52 L 100 90",
        "M 48 154 L 90 108",
        "M 152 154 L 110 108",
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="6 4"
          strokeLinecap="round"
          fill="none"
          variants={illustrationLineVariant}
          custom={i}
        />
      ))}

      {/* Triangle edges (outer frame) */}
      {[
        "M 100 40 L 40 160",
        "M 40 160 L 160 160",
        "M 160 160 L 100 40",
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.2"
          fill="none"
          variants={illustrationLineVariant}
          custom={i + 3}
        />
      ))}

      {/* Center verification point */}
      <motion.circle
        cx="100"
        cy="105"
        r="14"
        stroke={color}
        strokeWidth="2"
        fill="none"
        variants={illustrationNodeVariant}
        custom={4}
      >
        <animate
          attributeName="r"
          values="12;16;12"
          dur="3s"
          repeatCount="indefinite"
        />
      </motion.circle>

      {/* Checkmark at center */}
      <motion.path
        d="M 92 105 L 98 112 L 110 98"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={illustrationLineVariant}
        custom={5}
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
      {/* Shield outline */}
      <motion.path
        d="M 100 30 L 150 55 L 150 110 Q 150 150 100 175 Q 50 150 50 110 L 50 55 Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        variants={illustrationNodeVariant}
        custom={0}
      />

      {/* Inner shield line */}
      <motion.path
        d="M 100 45 L 138 64 L 138 108 Q 138 140 100 160 Q 62 140 62 108 L 62 64 Z"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.3"
        fill="none"
        variants={illustrationNodeVariant}
        custom={1}
      />

      {/* Lock body */}
      <motion.rect
        x="82"
        y="90"
        width="36"
        height="30"
        rx="4"
        stroke={color}
        strokeWidth="2"
        fill="none"
        variants={illustrationNodeVariant}
        custom={2}
      />

      {/* Lock shackle */}
      <motion.path
        d="M 90 90 L 90 78 A 10 10 0 0 1 110 78 L 110 90"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        variants={illustrationLineVariant}
        custom={2}
      />

      {/* Lock keyhole */}
      <motion.circle
        cx="100"
        cy="102"
        r="4"
        fill={color}
        fillOpacity="0.6"
        variants={illustrationNodeVariant}
        custom={3}
      >
        <animate
          attributeName="fill-opacity"
          values="0.4;0.9;0.4"
          dur="3s"
          repeatCount="indefinite"
        />
      </motion.circle>

      {/* Chain links — left */}
      <motion.path
        d="M 50 95 Q 30 95 30 105 Q 30 115 50 115"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.5"
        fill="none"
        variants={illustrationLineVariant}
        custom={3}
      />
      <motion.path
        d="M 38 100 Q 18 100 18 110 Q 18 120 38 120"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.3"
        fill="none"
        variants={illustrationLineVariant}
        custom={4}
      />

      {/* Chain links — right */}
      <motion.path
        d="M 150 95 Q 170 95 170 105 Q 170 115 150 115"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.5"
        fill="none"
        variants={illustrationLineVariant}
        custom={3}
      />
      <motion.path
        d="M 162 100 Q 182 100 182 110 Q 182 120 162 120"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.3"
        fill="none"
        variants={illustrationLineVariant}
        custom={4}
      />
    </svg>
  );
}

const ILLUSTRATIONS = [ConnectIllustration, VerifyIllustration, OwnIllustration];

/* ------------------------------------------------------------------ */
/*  Chain Connector (vertical between cards)                           */
/* ------------------------------------------------------------------ */

function ChainConnector({ color, index }: { color: string; index: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const pathId = `connectorPath-${index}`;

  return (
    <div className="relative flex justify-center py-2 md:py-0">
      <svg
        ref={ref}
        width="2"
        height="80"
        viewBox="0 0 2 80"
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Hidden motion path */}
        <path
          id={pathId}
          d="M 1 0 L 1 80"
          fill="none"
          stroke="none"
        />

        {/* Dashed line */}
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="80"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="6 6"
          variants={connectorVariant}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        />

        {/* Traveling dot */}
        {inView && (
          <circle r="3" fill={color}>
            <animateMotion dur="2.5s" repeatCount="indefinite">
              <mpath xlinkHref={`#${pathId}`} />
            </animateMotion>
          </circle>
        )}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step Card                                                          */
/* ------------------------------------------------------------------ */

interface StepCardProps {
  step: Step;
  index: number;
}

function StepCard({ step, index }: StepCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const IllustrationComponent = ILLUSTRATIONS[index];
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="relative"
    >
      {/* Watermark step number */}
      <motion.span
        variants={watermarkVariant}
        className={cn(
          "absolute -top-6 font-display font-black select-none pointer-events-none",
          "text-[80px] sm:text-[100px] md:text-[120px] leading-none",
          "gradient-text-accent opacity-[0.07]",
          isReversed
            ? "right-2 md:right-4 lg:right-8"
            : "left-2 md:left-4 lg:left-8"
        )}
        aria-hidden="true"
      >
        {step.number}
      </motion.span>

      {/* Card */}
      <motion.div
        variants={fadeUpBlur}
        className={cn(
          "glass-card glow-border relative overflow-hidden rounded-2xl",
          "p-6 sm:p-8 md:p-10",
          "flex flex-col gap-6",
          "md:flex-row md:items-center md:gap-10 lg:gap-16",
          isReversed && "md:flex-row-reverse"
        )}
      >
        {/* Illustration area with accent glow */}
        <div className="relative flex-shrink-0 w-full md:w-[280px] lg:w-[320px]">
          {/* Radial glow behind illustration */}
          <div
            className="absolute inset-0 rounded-2xl opacity-60 blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${step.glowColor}, transparent 70%)`,
            }}
            aria-hidden="true"
          />

          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative aspect-square max-w-[220px] mx-auto md:max-w-none"
          >
            <IllustrationComponent color={step.accentColor} />
          </motion.div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Mono step label */}
          <motion.span
            variants={fadeUpBlur}
            className="inline-block font-mono text-xs font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: step.accentColor }}
          >
            {step.label}
          </motion.span>

          <motion.h3
            variants={fadeUpBlur}
            className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-fg mb-3 tracking-tight"
          >
            {step.title}
          </motion.h3>

          <motion.p
            variants={fadeUpBlur}
            className="text-fg-secondary text-base sm:text-lg leading-relaxed max-w-xl"
          >
            {step.description}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative w-full px-5 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div variants={fadeUpBlur} className="mb-5">
            <SectionLabel>How It Works</SectionLabel>
          </motion.div>

          <motion.h2
            variants={fadeUpBlur}
            className="heading-lg text-fg mb-4"
          >
            From presence to proof in three steps
          </motion.h2>

          <motion.p
            variants={fadeUpBlur}
            className="body-lg max-w-2xl mx-auto"
          >
            No biometrics. No hardware. Just your connection.
          </motion.p>
        </motion.div>

        {/* Steps with chain connectors */}
        <div className="flex flex-col">
          {STEPS.map((step, index) => (
            <div key={step.number}>
              <StepCard step={step} index={index} />

              {/* Chain connector between cards (not after last) */}
              {index < STEPS.length - 1 && (
                <ChainConnector
                  index={index}
                  color={STEPS[index + 1].accentColor}
                />
              )}
            </div>
          ))}
        </div>

        {/* Bottom flow indicator */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="hidden md:flex items-center justify-center gap-0 mt-16"
        >
          {STEPS.map((step, i) => (
            <motion.span key={step.label} className="contents" variants={fadeUpBlur}>
              <span
                className="px-5 py-2 glass-card rounded-full font-mono text-xs font-medium tracking-wider"
                style={{ color: step.accentColor }}
              >
                {step.label}
              </span>
              {i < STEPS.length - 1 && (
                <svg
                  width="48"
                  height="2"
                  viewBox="0 0 48 2"
                  className="mx-1"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id={`flowGrad-${i}`}
                      x1="0"
                      y1="0"
                      x2="48"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor={STEPS[i].accentColor} />
                      <stop offset="1" stopColor={STEPS[i + 1].accentColor} />
                    </linearGradient>
                  </defs>
                  <line
                    x1="0"
                    y1="1"
                    x2="48"
                    y2="1"
                    stroke={`url(#flowGrad-${i})`}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="chain-flow"
                  />
                </svg>
              )}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
