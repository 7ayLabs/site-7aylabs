"use client";

import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import {
  heroStagger,
  kineticReveal,
  floatIn,
  withDelay,
} from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PHRASES = [
  "Prove you're here. No biometrics.",
  "Bot-proof by design.",
  "Private by nature, not promise.",
  "Built for humans, not hardware.",
] as const;

/** Rotation interval for tagline phrases (ms) */
const INTERVAL_MS = 5200;

/** Shared transition config for the blur-fade phrase animation */
const PHRASE_TRANSITION = {
  opacity: { duration: 2.2, ease: "easeInOut" as const },
  filter: { duration: 2.6, ease: "easeInOut" as const },
};

/** Floating stat panel data */
const STAT_PANELS = [
  {
    label: "Devnet Live",
    position: "top-[22%] right-[6%]",
    delay: 1.0,
    dot: true,
  },
  {
    label: "6 Active Nodes",
    position: "top-[45%] left-[4%]",
    delay: 1.3,
    dot: false,
  },
  {
    label: "16 Modules",
    position: "bottom-[25%] right-[12%]",
    delay: 1.6,
    dot: false,
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function HeroComponent() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden">
      {/* Background handled by AmbientBackground */}

      {/* ---- Content ---- */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        {/* Section label */}
        <motion.div variants={kineticReveal}>
          <SectionLabel>Proof of Presence &middot; Layer 1</SectionLabel>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={kineticReveal}
          className="mt-8 font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95]"
        >
          <span className="text-fg">Your </span>
          <span className="gradient-text-accent">presence</span>
          <br />
          <span className="text-fg">is your </span>
          <span className="gradient-text-accent">proof</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={kineticReveal}
          className="mt-6 text-fg-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Prove you&apos;re really here — without scanning your face, sharing
          your location, or buying special hardware.
        </motion.p>

        {/* CTA row */}
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

        {/* Rotating phrases */}
        <motion.div
          variants={kineticReveal}
          className="mt-10 inline-flex items-center glass-card px-5 py-2.5 rounded-full"
        >
          <div className="h-6 sm:h-7 flex items-center justify-center overflow-hidden relative min-w-[260px] sm:min-w-[320px]">
            <AnimatePresence mode="sync" initial={false}>
              <motion.p
                key={PHRASES[index]}
                className="absolute text-sm sm:text-base text-fg-secondary tracking-wide text-center font-mono"
                style={{ willChange: "opacity, filter" }}
                initial={{ opacity: 0.001, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={PHRASE_TRANSITION}
              >
                {PHRASES[index]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Mono tagline */}
        <motion.span
          variants={kineticReveal}
          className="mt-4 font-mono text-[11px] tracking-[0.2em] uppercase text-fg-faint select-none"
        >
          Proof of Presence &middot; Layer 1
        </motion.span>
      </motion.div>

      {/* ---- Floating stat panels (lg+ only) ---- */}
      {STAT_PANELS.map((panel) => (
        <motion.div
          key={panel.label}
          className={`absolute ${panel.position} hidden lg:flex items-center gap-2.5 glass-card px-4 py-3 rounded-xl`}
          initial="hidden"
          animate="visible"
          variants={withDelay(floatIn, panel.delay)}
        >
          {panel.dot && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
          )}
          <span className="font-mono text-sm text-fg-secondary">
            {panel.label}
          </span>
        </motion.div>
      ))}

      {/* ---- Bottom gradient fade ---- */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
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
