"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Radio,
  ShieldCheck,
  Lock,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import SectionLabel from "@/components/ui/SectionLabel";
import {
  bentoStagger,
  bentoItem,
  fadeUpItem,
} from "@/lib/constants/animations";

interface PrincipleVisual {
  readonly icon: LucideIcon;
}

const PRINCIPLES_VISUAL: readonly PrincipleVisual[] = [
  { icon: Radio },
  { icon: ShieldCheck },
  { icon: Lock },
  { icon: BrainCircuit },
] as const;

const CARD_SPANS: Record<number, string> = {
  0: "md:col-span-2",
};

export default function TechHowItWorks() {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("techHowItWorks");

  return (
    <section
      className="relative w-full px-6 md:px-12 py-24 md:py-32"
      aria-labelledby="tech-principles-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={reduceMotion ? undefined : bentoStagger}
        >
          <motion.div
            variants={reduceMotion ? undefined : fadeUpItem}
            className="flex justify-center mb-4"
          >
            <SectionLabel>{t("label")}</SectionLabel>
          </motion.div>

          <motion.h2
            id="tech-principles-heading"
            variants={reduceMotion ? undefined : fadeUpItem}
            className="font-display font-bold text-3xl md:text-4xl text-fg text-center mb-4"
          >
            {t("title")}{" "}
            <span className="gradient-text-accent">{t("titleAccent")}</span>
          </motion.h2>

          <motion.p
            variants={reduceMotion ? undefined : fadeUpItem}
            className="text-fg-secondary text-lg leading-relaxed text-center max-w-2xl mx-auto mb-16"
          >
            {t("subtitle")}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {PRINCIPLES_VISUAL.map((card, i) => (
              <motion.article
                key={t(`principles.${i}.title`)}
                variants={reduceMotion ? undefined : bentoItem}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { scale: 1.015, transition: { duration: 0.25 } }
                }
                className={`glass-card glow-border p-6 md:p-8 group relative rounded-2xl ${CARD_SPANS[i] ?? ""}`}
              >
                <div className="mb-5 flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-accent-dim)] transition-all duration-300 group-hover:bg-[var(--color-accent-primary)]/20 group-hover:shadow-glow-sm">
                  <card.icon
                    className="w-5 h-5 text-[var(--color-accent-primary)] transition-colors duration-300"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="font-display font-semibold text-lg text-fg mb-2 tracking-tight">
                  {t(`principles.${i}.title`)}
                </h3>

                <p className="text-fg-secondary text-sm leading-relaxed">
                  {t(`principles.${i}.description`)}
                </p>

                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse at 30% 0%, rgba(23,142,119,0.08) 0%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
