"use client";

import { motion, type Variants } from "framer-motion";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { kineticReveal } from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const VIEWPORT = { once: true, margin: "200px 0px 0px 0px" } as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Newsletter() {
  const t = useTranslations("newsletter");

  return (
    <section
      aria-labelledby="newsletter-title"
      className="relative w-full py-16 sm:py-24 md:py-32"
    >
      {/* Subtle top separator */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xs h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--color-border-subtle), transparent)" }}
        aria-hidden="true"
      />

      <motion.div
        className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center text-center"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {/* Heading */}
        <motion.h2
          id="newsletter-title"
          variants={kineticReveal}
          className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-fg tracking-tight leading-tight mb-5"
        >
          {t("title")}
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          className="text-fg-secondary text-lg md:text-xl max-w-md leading-relaxed mb-8"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA button */}
        <motion.div variants={fadeUp}>
          <Button href="/newsletter" size="lg" variant="primary">
            <Mail size={16} />
            {t("cta")}
          </Button>
        </motion.div>

        {/* Trust line */}
        <motion.p
          variants={fadeUp}
          className="text-xs text-fg-faint mt-6 font-mono"
        >
          {t("trustLine")}
        </motion.p>
      </motion.div>
    </section>
  );
}
