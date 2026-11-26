"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UserCheck, Radar, BadgeCheck, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionLabel from "@/components/ui/SectionLabel";
import ProtocolFlow3D from "./ProtocolFlow3D";
import {
  staggerContainer,
  slideInLeft,
  slideInRight,
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

export default function PresenceJourney() {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("presenceJourney");

  return (
    <section
      className="relative w-full px-6 md:px-12 py-28 md:py-36 lg:py-40"
      aria-labelledby="presence-journey-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={reduceMotion ? undefined : staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* ── Visual side (left on desktop) — transparent, 3D illustration ── */}
          <motion.div
            variants={reduceMotion ? undefined : slideInLeft}
            className="relative flex items-center justify-center min-h-[440px] lg:min-h-[520px] order-2 lg:order-1"
          >
            <ProtocolFlow3D />
          </motion.div>

          {/* ── Text side (right on desktop) ── */}
          <motion.div
            variants={reduceMotion ? undefined : slideInRight}
            className="order-1 lg:order-2"
          >
            <SectionLabel className="mb-5">{t("label")}</SectionLabel>

            <h2
              id="presence-journey-heading"
              className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-fg tracking-tight mb-4"
            >
              {t("title")}{" "}
              <span className="gradient-text-accent">{t("titleAccent")}</span>
            </h2>

            <p className="text-fg-secondary text-lg leading-relaxed mb-10">
              {t("subtitle")}
            </p>

            {/* 3 steps — minimal: number + icon + text-only badge */}
            <div className="space-y-8">
              {STEPS_VISUAL.map((step, i) => (
                <div key={i} className="flex gap-5">
                  {/* Step number — text-only */}
                  <div
                    className="flex-shrink-0 font-mono text-sm font-bold tracking-wider pt-1"
                    style={{ color: step.color }}
                  >
                    {t(`steps.${i}.number`)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <step.icon
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: step.color }}
                        strokeWidth={1.25}
                        aria-hidden="true"
                      />
                      <h3 className="font-display font-semibold text-lg text-fg tracking-tight">
                        {t(`steps.${i}.title`)}
                      </h3>
                    </div>
                    <span
                      className="block text-[11px] uppercase tracking-[0.18em] mb-2 font-medium opacity-80"
                      style={{ color: step.color }}
                    >
                      {t(`steps.${i}.badge`)}
                    </span>
                    <p className="text-fg-secondary text-sm leading-relaxed">
                      {t(`steps.${i}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
