"use client";

import { Mail } from "lucide-react";
import { motion, type Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

/** Per-item variant with staggered delay based on custom index */
const itemVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/** Shared viewport config for whileInView triggers */
const VIEWPORT = { once: true, margin: "-80px" } as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Newsletter() {
  return (
    <section
      aria-labelledby="newsletter-title"
      className="relative w-full px-6 py-24 md:py-32 flex items-center justify-center text-center"
    >
      {/* Teal ambient orb */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className="absolute w-[600px] h-[400px] rounded-full top-[20%] left-[30%]"
          style={{ background: "radial-gradient(circle, rgba(23,142,119,0.08), transparent 70%)" }}
        />
      </div>

      {/* Glass panel */}
      <div className="relative z-10 glass-card max-w-2xl mx-auto p-10 md:p-14 flex flex-col items-center gap-6 text-center glow-border">
        {/* Heading */}
        <motion.h2
          id="newsletter-title"
          className="text-3xl md:text-4xl font-semibold text-fg tracking-tight font-display leading-tight"
          variants={itemVariant}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          custom={0}
        >
          Stay in the Loop
        </motion.h2>

        {/* Description */}
        <motion.p
          className="font-normal text-fg-secondary text-lg md:text-xl max-w-xl leading-relaxed"
          variants={itemVariant}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          custom={1}
        >
          Protocol updates, presence insights, and early access
          announcements&nbsp;&mdash; straight to your inbox.
        </motion.p>

        {/* CTA button */}
        <motion.a
          href="/newsletter"
          aria-label="Subscribe to 7ayLabs updates"
          className="mt-4 inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[var(--color-accent-primary)] text-white font-semibold text-base hover:shadow-glow transition-all duration-300"
          variants={itemVariant}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          custom={2}
        >
          <Mail size={16} />
          Subscribe to Updates
        </motion.a>

        {/* Trust line */}
        <motion.p
          className="font-mono text-xs text-fg-faint mt-6"
          variants={itemVariant}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          custom={3}
        >
          No spam. Unsubscribe anytime.
        </motion.p>
      </div>
    </section>
  );
}
