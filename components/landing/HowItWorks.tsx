"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUpItem } from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

interface Step {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

const STEPS: readonly Step[] = [
  {
    number: "01",
    title: "Open the App",
    description:
      "Connect from any device — your phone, laptop, or tablet. No downloads, no equipment, no setup.",
  },
  {
    number: "02",
    title: "We Confirm You're There",
    description:
      "The network measures your connection from multiple points to confirm your real-world location — privately and instantly.",
  },
  {
    number: "03",
    title: "You Get Your Proof",
    description:
      "Your verified presence is recorded permanently on a public record you own. No company can change or revoke it.",
  },
] as const;

/** Flow indicator labels corresponding to each step */
const FLOW_LABELS = ["Connect", "Verify", "Own"] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative w-full px-6 md:px-12 py-24 md:py-32"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeUpItem}
            className="block text-sm uppercase tracking-widest text-fg-muted mb-6 text-center"
          >
            How It Works
          </motion.span>

          <motion.h2
            variants={fadeUpItem}
            className="font-display font-bold text-3xl md:text-4xl text-fg text-center mb-16"
          >
            From presence to proof in three steps
          </motion.h2>

          {/* Step cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {STEPS.map((step) => (
              <motion.div
                key={step.number}
                variants={fadeUpItem}
                className="glass-card p-6 md:p-8 glow-border group relative flex flex-col rounded-2xl"
              >
                {/* Step number */}
                <span className="text-5xl font-extrabold font-display gradient-text-accent mb-4 select-none block">
                  {step.number}
                </span>

                <h3 className="font-display font-semibold text-xl text-fg mb-3">
                  {step.title}
                </h3>

                <p className="text-fg-secondary text-base leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Flow indicator: glass pills connected by gradient lines */}
          <motion.div
            variants={fadeUpItem}
            className="hidden md:flex items-center justify-center gap-0 mt-12"
          >
            {FLOW_LABELS.map((label, i) => (
              <span key={label} className="contents">
                <span className="px-5 py-2 glass-card rounded-full font-mono text-[var(--color-accent-primary)] text-xs">
                  {label}
                </span>
                {i < FLOW_LABELS.length - 1 && (
                  <div
                    className={`w-12 h-px ${
                      i === 0
                        ? "bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]"
                        : "bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)]"
                    }`}
                  />
                )}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
