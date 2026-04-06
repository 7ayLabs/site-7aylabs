"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const VIEWPORT = { once: true, margin: "-60px" } as const;

export default function Newsletter() {
  const t = useTranslations("newsletter");

  return (
    <section
      aria-labelledby="newsletter-title"
      className="relative w-full py-20 md:py-28"
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xs h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--color-border-primary), transparent)",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="max-w-md mx-auto px-6 lg:px-8 flex flex-col items-center text-center"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.h2
          id="newsletter-title"
          variants={fadeUp}
          className="font-display font-bold text-2xl md:text-4xl text-fg tracking-tight mb-4"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-base text-fg-tertiary max-w-sm mb-6"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div variants={fadeUp}>
          <Button href="/newsletter" size="sm" variant="primary">
            {t("cta")}
          </Button>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-[11px] text-fg-muted mt-4 font-mono"
        >
          {t("trustLine")}
        </motion.p>
      </motion.div>
    </section>
  );
}
