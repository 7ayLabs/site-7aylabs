"use client";

import { motion, type Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AboutCard {
  readonly heading: string;
  readonly description: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CARDS: readonly AboutCard[] = [
  {
    heading: "No biometrics required",
    description:
      "Validators triangulate your presence through network latency. No iris scans, no selfies, no GPS — just physics.",
  },
  {
    heading: "Sybil resistant by design",
    description:
      "One person, one presence. Witness circles make it cryptoeconomically irrational to fake physical location at scale.",
  },
  {
    heading: "Privacy preserving",
    description:
      "ZK proofs verify you were present without revealing where. No tracking, no surveillance, no persistent identity.",
  },
] as const;

/** Container variant: stagger children on viewport entry */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

/** Individual card variant: fade up from y:24 */
const cardVariants: Variants = {
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

export default function About() {
  return (
    <section className="relative w-full">
      <div className="w-full px-8 md:px-20 lg:px-32 py-14 md:py-16">
        <div className="max-w-[960px] mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 text-fg text-center place-items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={containerVariants}
          >
            {CARDS.map((card) => (
              <motion.div
                key={card.heading}
                className="flex flex-col items-center justify-center text-center"
                variants={cardVariants}
              >
                <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-1 tracking-tight min-h-[2.5rem] md:min-h-[3rem]">
                  {card.heading}
                </h3>
                <p className="text-base md:text-lg text-fg-secondary leading-tight max-w-[20rem] min-h-[3.75rem] md:min-h-[4.75rem]">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
