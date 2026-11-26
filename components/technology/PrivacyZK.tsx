"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Lock,
  EyeOff,
  Fingerprint,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import SectionLabel from "@/components/ui/SectionLabel";
import ZK3D from "./ZK3D";
import {
  staggerContainer,
  slideInLeft,
  slideInRight,
} from "@/lib/constants/animations";

interface PillarVisual {
  readonly icon: LucideIcon;
  readonly color: string;
}

const PILLARS_VISUAL: readonly PillarVisual[] = [
  { icon: Lock, color: "#8B5CF6" },
  { icon: EyeOff, color: "#C084FC" },
  { icon: Fingerprint, color: "#A78BFA" },
] as const;

export default function PrivacyZK() {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("privacyZK");

  return (
    <section
      className="relative w-full px-6 md:px-12 py-28 md:py-36 lg:py-40"
      aria-labelledby="privacy-zk-heading"
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
              id="privacy-zk-heading"
              className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-fg tracking-tight mb-4"
            >
              {t("title")}{" "}
              <span className="gradient-text-accent">{t("titleAccent")}</span>
            </h2>

            <div className="text-fg-secondary text-base md:text-lg leading-relaxed space-y-4 mb-10">
              <p>{t("description.0")}</p>
              <p>{t("description.1")}</p>
            </div>

            {/* 3 ZK pillars — minimal icons, no chips */}
            <div className="space-y-6">
              {PILLARS_VISUAL.map((pillar, i) => (
                <div key={i} className="flex gap-4">
                  <pillar.icon
                    className="flex-shrink-0 w-5 h-5 mt-1"
                    style={{ color: pillar.color }}
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display font-semibold text-base text-fg mb-1 tracking-tight">
                      {t(`pillars.${i}.title`)}
                    </h3>
                    <p className="text-fg-secondary text-sm leading-relaxed">
                      {t(`pillars.${i}.description`)}
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
            <ZK3D />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
