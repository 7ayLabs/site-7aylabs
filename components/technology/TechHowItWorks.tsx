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

/* ── Decorative illustration ── */
function HowItWorksIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Concentric rings */}
      {[240, 180, 120].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full border border-dashed"
          style={{
            width: size,
            height: size,
            borderColor: `rgba(23, 142, 119, ${0.12 + i * 0.06})`,
            animation: `slowSpin ${24 + i * 8}s linear infinite${i % 2 === 1 ? " reverse" : ""}`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Center icon */}
      <div className="relative z-10 w-16 h-16 rounded-2xl bg-[var(--color-accent-dim)] border border-[var(--color-border-accent)] flex items-center justify-center shadow-glow">
        <Radio
          className="w-8 h-8 text-[var(--color-accent-primary)]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>

      {/* Floating satellite icons */}
      {(
        [
          { Icon: ShieldCheck, top: "15%", left: "20%", delay: "0s", color: "#00FFC6" },
          { Icon: Lock, top: "12%", right: "18%", delay: "1s", color: "#8B5CF6" },
          { Icon: BrainCircuit, bottom: "18%", left: "15%", delay: "2s", color: "#22D3EE" },
        ] as const
      ).map(({ Icon, delay, color, ...pos }, i) => (
        <div
          key={i}
          className="absolute w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            ...pos,
            backgroundColor: `${color}12`,
            animation: `floatY 4s ease-in-out ${delay} infinite`,
          }}
          aria-hidden="true"
        >
          <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.75} />
        </div>
      ))}
    </div>
  );
}

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

            {/* 4 principles list */}
            <div className="space-y-6">
              {PRINCIPLES_VISUAL.map((principle, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: `${principle.color}15` }}
                  >
                    <principle.icon
                      className="w-5 h-5"
                      style={{ color: principle.color }}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
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

          {/* ── Visual side (right) ── */}
          <motion.div
            variants={reduceMotion ? undefined : slideInRight}
            className="relative rounded-3xl bg-bg-tertiary p-8 md:p-12 flex items-center justify-center aspect-square max-w-[520px] mx-auto lg:mx-0 w-full overflow-hidden"
          >
            <HowItWorksIllustration />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
