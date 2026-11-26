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
import HowItWorks3D from "./HowItWorks3D";
import {
  staggerContainer,
  slideInLeft,
  slideInRight,
} from "@/lib/constants/animations";

interface PrincipleVisual {
  readonly icon: LucideIcon;
  readonly color: string;
}

const PRINCIPLES_VISUAL: readonly PrincipleVisual[] = [
  { icon: Radio, color: "#178E77" },
  { icon: ShieldCheck, color: "#00FFC6" },
  { icon: Lock, color: "#8B5CF6" },
  { icon: BrainCircuit, color: "#22D3EE" },
] as const;

export default function TechHowItWorks() {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("techHowItWorks");

  return (
    <section
      id="how-it-works"
      className="relative w-full px-6 md:px-12 py-28 md:py-36 lg:py-40"
      aria-labelledby="tech-principles-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={reduceMotion ? undefined : staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* ── Text side (left) ── */}
          <motion.div variants={reduceMotion ? undefined : slideInLeft}>
            <SectionLabel className="mb-5">{t("label")}</SectionLabel>

            <h2
              id="tech-principles-heading"
              className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-fg tracking-tight mb-4"
            >
              {t("title")}{" "}
              <span className="gradient-text-accent">{t("titleAccent")}</span>
            </h2>

            <p className="text-fg-secondary text-lg leading-relaxed mb-10">
              {t("subtitle")}
            </p>

            {/* 4 principles list — minimal icons, no chips */}
            <div className="space-y-7">
              {PRINCIPLES_VISUAL.map((principle, i) => (
                <div key={i} className="flex gap-4">
                  <principle.icon
                    className="flex-shrink-0 w-5 h-5 mt-1"
                    style={{ color: principle.color }}
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display font-semibold text-base text-fg mb-1 tracking-tight">
                      {t(`principles.${i}.title`)}
                    </h3>
                    <p className="text-fg-secondary text-sm leading-relaxed">
                      {t(`principles.${i}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Visual side (right) — transparent, 3D illustration ── */}
          <motion.div
            variants={reduceMotion ? undefined : slideInRight}
            className="relative flex items-center justify-center aspect-square max-w-[520px] mx-auto lg:mx-0 w-full"
          >
            <HowItWorks3D />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
