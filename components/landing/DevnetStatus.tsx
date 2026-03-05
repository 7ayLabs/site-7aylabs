"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STATS = [
  { label: "v0.8.26", description: "Devnet version" },
  { label: "6", description: "Validators" },
  { label: "16", description: "Pallets" },
  { label: "111", description: "Spec version" },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DevnetStatus() {
  return (
    <section className="relative w-full px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          <Link
            href="/devnet"
            className="block rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] p-8 md:p-10 hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-border-secondary)] transition-all duration-300 group"
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
              {/* Status indicator */}
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-emerald-400">
                  Devnet Running
                </span>
              </div>

              <h2 className="font-serif font-bold text-2xl md:text-3xl text-fg mb-4">
                7aychain Devnet is Live
              </h2>

              <p className="text-fg-secondary text-base leading-relaxed max-w-xl mb-8">
                A full Proof of Presence protocol stack running on a multi-node
                devnet. Clone, build, and start interacting.
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-lg">
                {STATS.map((stat) => (
                  <motion.div key={stat.description} variants={itemVariants} className="text-center">
                    <span className="block text-2xl font-bold font-mono text-accent mb-1">
                      {stat.label}
                    </span>
                    <span className="text-xs text-fg-muted uppercase tracking-wider">
                      {stat.description}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA hint */}
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-fg-muted group-hover:text-fg transition-colors">
                Connect to devnet
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M1 7h12M8 2l5 5-5 5" />
                </svg>
              </span>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
