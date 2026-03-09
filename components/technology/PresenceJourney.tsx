"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UserCheck, Radar, BadgeCheck, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
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

/* ── Vertical flow diagram ── */
function ProtocolFlowIllustration() {
  return (
    <div className="flex flex-col items-center gap-0 w-full max-w-[200px] mx-auto">
      {STEPS_VISUAL.map((step, i) => (
        <div key={i} className="flex flex-col items-center">
          {/* Node */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: `${step.color}15`,
              border: `1px solid ${step.color}25`,
            }}
          >
            <step.icon
              className="w-7 h-7"
              style={{ color: step.color }}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>

          {/* Connecting line (except last) */}
          {i < STEPS_VISUAL.length - 1 && (
            <div
              className="w-[2px] h-10 my-2"
              style={{
                background: `linear-gradient(180deg, ${step.color}, ${STEPS_VISUAL[i + 1].color})`,
              }}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}

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
          {/* ── Visual side (left on desktop) ── */}
          <motion.div
            variants={reduceMotion ? undefined : slideInLeft}
            className="relative rounded-3xl bg-bg-tertiary p-8 md:p-12 flex items-center justify-center min-h-[400px] lg:min-h-[480px] overflow-hidden order-2 lg:order-1"
          >
            <ProtocolFlowIllustration />
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

            {/* 3 steps as numbered vertical flow */}
            <div className="space-y-8">
              {STEPS_VISUAL.map((step, i) => (
                <div key={i} className="flex gap-5">
                  {/* Step number */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: `${step.color}15`,
                      color: step.color,
                      border: `1px solid ${step.color}30`,
                    }}
                  >
                    {t(`steps.${i}.number`)}
                  </div>

                  <div>
                    <h3 className="font-display font-semibold text-lg text-fg mb-1 tracking-tight">
                      {t(`steps.${i}.title`)}
                    </h3>
                    <Badge variant="glass" className="mb-2">
                      {t(`steps.${i}.badge`)}
                    </Badge>
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
