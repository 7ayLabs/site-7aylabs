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
      className="w-full px-6 py-24 md:py-32 flex items-center justify-center text-center relative"
    >
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
        {/* Heading */}
        <motion.h2
          id="newsletter-title"
          className="text-3xl md:text-4xl font-semibold text-fg tracking-tight font-serif leading-tight"
          variants={itemVariant}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          custom={0}
        >
          Stay Updated
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
          Product insights, launches, and real&#x2011;world presence
          infrastructure.
        </motion.p>

        {/* CTA button */}
        <motion.a
          href="/newsletter"
          aria-label="Read the 7ayLabs newsletter"
          className="mt-6 inline-flex items-center gap-3 px-8 py-3 rounded-full bg-fg text-bg font-medium text-base md:text-lg transition-colors duration-200 hover:opacity-90"
          variants={itemVariant}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          custom={2}
        >
          <Mail size={16} />
          Read the Newsletter
        </motion.a>
      </div>
    </section>
  );
}
