"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Globe,
  Blocks,
  Link2,
  Terminal,
  Plug,
  Code2,
  Cog,
  Cpu,
  Box,
  ShieldCheck,
  Lock,
  KeyRound,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ConnectionItem {
  readonly label: string;
  readonly icon: LucideIcon;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PROTOCOL_ITEMS: readonly ConnectionItem[] = [
  { label: "Polkadot", icon: Globe },
  { label: "Substrate", icon: Blocks },
  { label: "Polkadot.js", icon: Link2 },
  { label: "JSON-RPC", icon: Terminal },
  { label: "WebSocket", icon: Plug },
  { label: "Subxt", icon: Code2 },
] as const;

const ECOSYSTEM_ITEMS: readonly ConnectionItem[] = [
  { label: "Rust", icon: Cog },
  { label: "WASM", icon: Cpu },
  { label: "Docker", icon: Box },
  { label: "ZK/SNARK", icon: ShieldCheck },
  { label: "Groth16", icon: Lock },
  { label: "AES-256", icon: KeyRound },
] as const;

/** Container: orchestrates staggered children */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Header: fade up */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ------------------------------------------------------------------ */
/*  Marquee Row                                                        */
/* ------------------------------------------------------------------ */

interface MarqueeRowProps {
  items: readonly ConnectionItem[];
  category: string;
  direction: "left" | "right";
  /** Variant: cyan (protocol) or violet (ecosystem) */
  variant: "cyan" | "violet";
  duration?: number;
}

function MarqueeRow({
  items,
  category,
  direction,
  variant,
  duration = 30,
}: MarqueeRowProps) {
  const doubled = [...items, ...items];
  const animationStyle =
    direction === "left"
      ? { animation: `marqueeLeft ${duration}s linear infinite` }
      : { animation: `marqueeRight ${duration}s linear infinite` };

  const glowClass = variant === "cyan" ? "glow-border" : "glow-border-violet";
  const iconColor =
    variant === "cyan"
      ? "text-[var(--color-accent-primary)]"
      : "text-[var(--color-accent-tertiary)]";

  return (
    <div className="mb-6" role="marquee" aria-label={`${category} technologies`}>
      {/* Row label */}
      <span className="block text-xs uppercase tracking-widest text-fg-muted mb-4 text-center font-mono">
        {category}
      </span>

      <div className="relative overflow-hidden">
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4" style={animationStyle}>
          {doubled.map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              className={`flex-none glass-card px-5 py-3 flex items-center gap-2.5 ${glowClass}`}
            >
              <item.icon
                className={`w-4 h-4 ${iconColor}`}
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="text-sm font-mono text-fg-secondary whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Static Grid Fallback (reduced motion)                              */
/* ------------------------------------------------------------------ */

interface StaticGridProps {
  items: readonly ConnectionItem[];
  category: string;
  variant: "cyan" | "violet";
}

function StaticGrid({ items, category, variant }: StaticGridProps) {
  const glowClass = variant === "cyan" ? "glow-border" : "glow-border-violet";
  const iconColor =
    variant === "cyan"
      ? "text-[var(--color-accent-primary)]"
      : "text-[var(--color-accent-tertiary)]";

  return (
    <div className="mb-6">
      <span className="block text-xs uppercase tracking-widest text-fg-muted mb-4 text-center font-mono">
        {category}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`glass-card px-5 py-3 flex items-center gap-2.5 ${glowClass}`}
          >
            <item.icon
              className={`w-4 h-4 ${iconColor}`}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="text-sm font-mono text-fg-secondary whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Connections() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative w-full px-6 md:px-12 py-24 md:py-32"
      aria-labelledby="connections-heading"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={shouldReduceMotion ? undefined : containerVariants}
        >
          {/* Section label */}
          <motion.div
            variants={shouldReduceMotion ? undefined : headerVariants}
            className="flex justify-center mb-4"
          >
            <SectionLabel>Connections</SectionLabel>
          </motion.div>

          {/* Main heading */}
          <motion.h2
            id="connections-heading"
            variants={shouldReduceMotion ? undefined : headerVariants}
            className="font-display font-bold text-3xl md:text-4xl text-fg text-center mb-14"
          >
            Works with everything you need
          </motion.h2>

          {/* Marquee rows (or static grid for reduced motion) */}
          <motion.div variants={shouldReduceMotion ? undefined : headerVariants}>
            {shouldReduceMotion ? (
              <>
                <StaticGrid
                  items={PROTOCOL_ITEMS}
                  category="Protocol Layer"
                  variant="cyan"
                />
                <StaticGrid
                  items={ECOSYSTEM_ITEMS}
                  category="Ecosystem"
                  variant="violet"
                />
              </>
            ) : (
              <>
                <MarqueeRow
                  items={PROTOCOL_ITEMS}
                  category="Protocol Layer"
                  direction="left"
                  variant="cyan"
                  duration={30}
                />
                <MarqueeRow
                  items={ECOSYSTEM_ITEMS}
                  category="Ecosystem"
                  direction="right"
                  variant="violet"
                  duration={35}
                />
              </>
            )}
          </motion.div>

          {/* CTA Link */}
          <motion.div
            variants={shouldReduceMotion ? undefined : headerVariants}
            className="mt-12 text-center"
          >
            <Link
              href="/ecosystem"
              className="inline-flex items-center gap-1.5 text-[var(--color-accent-primary)] font-mono text-sm
                transition-all duration-300 hover:gap-2.5
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-primary)]"
            >
              Explore the ecosystem
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
