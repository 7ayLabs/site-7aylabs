"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UserCheck, Radar, BadgeCheck, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import {
  staggerContainer,
  scaleUpBlur,
  fadeUpItem,
} from "@/lib/constants/animations";

interface StepVisual {
  readonly color: string;
  readonly icon: LucideIcon;
}

const STEPS_VISUAL: readonly StepVisual[] = [
  { color: "#00FFC6", icon: UserCheck },
  { color: "#C084FC", icon: Radar },
  { color: "#22D3EE", icon: BadgeCheck },
] as const;

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
  },
};

const lineRevealVertical = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
  },
};

export default function PresenceJourney() {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("presenceJourney");

  return (
    <section
      className="relative w-full px-6 md:px-12 py-24 md:py-32"
      aria-labelledby="presence-journey-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={reduceMotion ? undefined : staggerContainer}
        >
          <motion.div
            variants={reduceMotion ? undefined : fadeUpItem}
            className="flex justify-center mb-4"
          >
            <SectionLabel>{t("label")}</SectionLabel>
          </motion.div>

          <motion.h2
            id="presence-journey-heading"
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

          {/* Desktop: horizontal layout */}
          <div className="hidden lg:flex items-stretch gap-0">
            {STEPS_VISUAL.map((step, i) => (
              <div key={t(`steps.${i}.number`)} className="flex items-stretch flex-1">
                <motion.div
                  variants={reduceMotion ? undefined : scaleUpBlur}
                  className="glass-card glow-border rounded-2xl p-6 xl:p-8 flex-1 group relative"
                >
                  {/* Step number */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-5"
                    style={{
                      backgroundColor: `${step.color}15`,
                      color: step.color,
                      border: `1px solid ${step.color}30`,
                    }}
                  >
                    {t(`steps.${i}.number`)}
                  </div>

                  {/* Icon */}
                  <div
                    className="mb-4 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: `${step.color}12`,
                    }}
                  >
                    <step.icon
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: step.color }}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="font-display font-semibold text-lg text-fg mb-2 tracking-tight">
                    {t(`steps.${i}.title`)}
                  </h3>

                  <Badge variant="glass" className="mb-4">
                    {t(`steps.${i}.badge`)}
                  </Badge>

                  <p className="text-fg-secondary text-sm leading-relaxed">
                    {t(`steps.${i}.description`)}
                  </p>

                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(ellipse at 30% 0%, ${step.color}12 0%, transparent 60%)`,
                    }}
                    aria-hidden="true"
                  />
                </motion.div>

                {/* Connecting line */}
                {i < STEPS_VISUAL.length - 1 && (
                  <div className="flex items-center px-2">
                    <motion.div
                      variants={reduceMotion ? undefined : lineReveal}
                      className="w-8 xl:w-12 h-[2px] origin-left"
                      style={{
                        background: `linear-gradient(90deg, ${step.color}, ${STEPS_VISUAL[i + 1].color})`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile/Tablet: vertical layout */}
          <div className="lg:hidden flex flex-col relative">
            {/* Vertical connecting line */}
            <div className="absolute left-5 top-0 bottom-0 w-[2px]">
              <motion.div
                variants={reduceMotion ? undefined : lineRevealVertical}
                className="w-full h-full origin-top"
                style={{
                  background:
                    "linear-gradient(180deg, #00FFC6, #C084FC, #22D3EE)",
                }}
              />
            </div>

            {STEPS_VISUAL.map((step, i) => (
              <motion.div
                key={t(`steps.${i}.number`)}
                variants={reduceMotion ? undefined : scaleUpBlur}
                className="flex gap-6 mb-8 last:mb-0"
              >
                {/* Node dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: `${step.color}15`,
                      color: step.color,
                      border: `1px solid ${step.color}30`,
                      boxShadow: `0 0 12px ${step.color}25`,
                    }}
                  >
                    {t(`steps.${i}.number`)}
                  </div>
                </div>

                {/* Content */}
                <div className="glass-card glow-border rounded-2xl p-6 flex-1 group relative">
                  <div
                    className="mb-4 flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ backgroundColor: `${step.color}12` }}
                  >
                    <step.icon
                      className="w-5 h-5"
                      style={{ color: step.color }}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="font-display font-semibold text-lg text-fg mb-2 tracking-tight">
                    {t(`steps.${i}.title`)}
                  </h3>

                  <Badge variant="glass" className="mb-4">
                    {t(`steps.${i}.badge`)}
                  </Badge>

                  <p className="text-fg-secondary text-sm leading-relaxed">
                    {t(`steps.${i}.description`)}
                  </p>

                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(ellipse at 30% 0%, ${step.color}12 0%, transparent 60%)`,
                    }}
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
