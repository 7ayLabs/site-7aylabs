"use client";

import { motion, type Variants } from "framer-motion";

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
    title: "Declare Presence",
    description:
      "An actor commits a cryptographic hash of their presence data to the chain. The actual location remains hidden during the commit phase.",
  },
  {
    number: "02",
    title: "Witness Circle Validates",
    description:
      "A pseudorandom set of validators forms a witness circle. Each validator independently measures network latency and triangulates the actor\u2019s physical position.",
  },
  {
    number: "03",
    title: "On-Chain Finality",
    description:
      "A ZK proof is generated, the witness circle reaches quorum, and the presence attestation is finalized on-chain. A position-bound token (PBT) is minted.",
  },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HowItWorks() {
  return (
    <section className="relative w-full px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          <motion.span
            variants={itemVariants}
            className="block text-sm uppercase tracking-widest text-fg-muted mb-6 text-center"
          >
            How It Works
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="font-serif font-bold text-3xl md:text-4xl text-fg text-center mb-16"
          >
            From presence to proof in three steps
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {STEPS.map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative flex flex-col"
              >
                {/* Step number */}
                <span className="text-5xl font-bold text-[var(--color-accent-dim)] font-mono mb-4 select-none">
                  {step.number}
                </span>

                <h3 className="font-serif font-semibold text-xl text-fg mb-3">
                  {step.title}
                </h3>

                <p className="text-fg-secondary text-base leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Arrow flow indicator */}
          <motion.div
            variants={itemVariants}
            className="hidden md:flex items-center justify-center gap-4 mt-12 text-fg-muted text-sm"
          >
            <span className="px-4 py-1.5 rounded-full border border-[var(--color-border-primary)] text-fg-secondary">
              Declare
            </span>
            <span>&rarr;</span>
            <span className="px-4 py-1.5 rounded-full border border-[var(--color-border-primary)] text-fg-secondary">
              Validate
            </span>
            <span>&rarr;</span>
            <span className="px-4 py-1.5 rounded-full border border-[var(--color-border-primary)] text-fg-secondary">
              Finalize
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
