"use client";

import { motion, type Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

interface PalletGroup {
  readonly category: string;
  readonly pallets: readonly string[];
}

const PALLET_GROUPS: readonly PalletGroup[] = [
  {
    category: "Presence Layer",
    pallets: ["presence", "epoch", "lifecycle", "device"],
  },
  {
    category: "Verification",
    pallets: ["triangulation", "zk", "pbt"],
  },
  {
    category: "Security",
    pallets: ["validator", "dispute", "autonomous"],
  },
  {
    category: "Infrastructure",
    pallets: ["vault", "storage", "governance", "semantic", "boomerang", "octopus"],
  },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProtocolModules() {
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
            Protocol Architecture
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="font-serif font-bold text-3xl md:text-4xl text-fg text-center mb-6"
          >
            16 pallets. 4 layers. One protocol.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-fg-secondary text-lg leading-relaxed text-center max-w-2xl mx-auto mb-16"
          >
            7aychain&apos;s runtime is composed of purpose-built Substrate pallets
            that handle every aspect of the Proof of Presence protocol.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PALLET_GROUPS.map((group) => (
              <motion.div
                key={group.category}
                variants={itemVariants}
                className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] p-6 md:p-8"
              >
                <h3 className="font-serif font-semibold text-lg text-fg mb-4">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.pallets.map((pallet) => (
                    <span
                      key={pallet}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--color-bg-card-hover)] border border-[var(--color-border-primary)] text-xs font-mono text-fg-secondary"
                    >
                      {pallet}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
