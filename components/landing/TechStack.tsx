"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

const CATEGORY_KEYS = ["consensus", "privacy", "runtime", "infra", "developer"] as const;

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

export default function TechStack() {
  const t = useTranslations("techStack");

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

        <motion.div variants={stagger} className="flex flex-col gap-6">
          {CATEGORY_KEYS.map((key) => {
            const items = Object.values(
              t.raw(`categories.${key}.items`) as Record<string, string>
            );
            return (
              <motion.div key={key} variants={fadeUp}>
                <p className="text-[10px] font-mono tracking-wider text-fg-muted uppercase mb-2">
                  {t(`categories.${key}.label`)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-border-primary)] text-xs text-fg-secondary font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
