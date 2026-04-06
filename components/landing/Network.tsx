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

const STAT_KEYS = ["validators", "finality", "modules", "privacy"] as const;
const PROTOCOL_KEYS = ["pop", "multilateration", "zkp", "onchain"] as const;

export default function Network() {
  const t = useTranslations("network");

  return (
    <section className="relative w-full py-20 md:py-28">
      <motion.div
        className="max-w-5xl mx-auto px-6 lg:px-8"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <p className="text-[11px] tracking-[0.15em] uppercase text-fg-muted mb-3">
            {t("label")}
          </p>
          <h2 className="font-display font-bold text-2xl md:text-4xl tracking-tight text-fg mb-4">
            {t("title")}{" "}
            <span className="gradient-text-accent">{t("titleAccent")}</span>
          </h2>
          <p className="text-base text-fg-tertiary max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
        >
          {STAT_KEYS.map((key) => (
            <motion.div
              key={key}
              variants={fadeUp}
              className="flex flex-col items-center text-center border border-[var(--color-border-primary)] rounded-xl p-4"
            >
              <span className="font-display font-bold text-xl md:text-2xl tracking-tight gradient-text-accent">
                {t(`stats.${key}.value`)}
              </span>
              <span className="mt-1 text-[11px] text-fg-muted tracking-wide">
                {t(`stats.${key}.label`)}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Protocol grid */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x-0 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border-primary)] border border-[var(--color-border-primary)] rounded-xl overflow-hidden"
        >
          {PROTOCOL_KEYS.map((key) => (
            <motion.div
              key={key}
              variants={fadeUp}
              className="p-5 flex flex-col items-start"
            >
              <span className="text-[10px] font-mono tracking-wider text-accent mb-2">
                {t(`protocols.${key}.tag`)}
              </span>
              <h3 className="font-display font-semibold text-sm text-fg mb-1">
                {t(`protocols.${key}.title`)}
              </h3>
              <p className="text-xs text-fg-tertiary leading-relaxed">
                {t(`protocols.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-center mt-8">
          <Button href="/devnet" variant="secondary" size="sm" withArrow>
            {t("cta")}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
