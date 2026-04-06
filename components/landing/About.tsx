"use client";

import { motion, type Variants } from "framer-motion";
import {
  Radio, ShieldCheck, ShieldBan, Smartphone, Code2, Lock,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

const CARD_ICONS: readonly LucideIcon[] = [
  Radio, ShieldCheck, ShieldBan, Smartphone, Code2, Lock,
];

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

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="relative w-full py-20 md:py-28">
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
            {t("titleEnd")}
          </h2>
          <p className="text-base text-fg-tertiary max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={stagger}
        >
          {CARD_ICONS.map((Icon, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="border border-[var(--color-border-primary)] rounded-xl p-5 flex flex-col items-center text-center"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-dim)] mb-3">
                <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-sm text-fg mb-1">
                {t(`cards.${i}.title`)}
              </h3>
              <p className="text-xs text-fg-tertiary leading-relaxed">
                {t(`cards.${i}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
