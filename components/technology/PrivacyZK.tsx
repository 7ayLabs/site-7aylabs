"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Lock,
  EyeOff,
  Fingerprint,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
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

/* ── ZK illustration — concentric dashed rings with center pin ── */
function ZKIllustration() {
  const t = useTranslations("privacyZK");

  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[320px] mx-auto">
      {/* Concentric dashed rings (violet-themed) */}
      {[280, 220, 160].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full border border-dashed"
          style={{
            width: size,
            height: size,
            borderColor: `rgba(139, 92, 246, ${0.15 + i * 0.08})`,
            animation: `slowSpin ${20 + i * 8}s linear infinite${i % 2 === 1 ? " reverse" : ""}`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Center pin */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div
          className="w-14 h-14 rounded-full bg-[var(--color-accent-violet-dim)] border border-[rgba(139,92,246,0.3)] flex items-center justify-center"
          style={{ boxShadow: "0 0 20px rgba(139,92,246,0.2)" }}
        >
          <MapPin
            className="w-7 h-7 text-[var(--color-accent-tertiary)]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>
        <Badge variant="violet">{t("verified")}</Badge>
        <span
          className="font-mono text-xs text-fg-muted tracking-wider select-none"
          aria-label={t("redactedPositionAria")}
        >
          {t("redactedPosition")}
        </span>
      </div>

      {/* Floating validator dots */}
      {[
        { top: "12%", left: "18%", delay: "0s" },
        { top: "8%", right: "22%", delay: "0.5s" },
        { top: "75%", left: "15%", delay: "1s" },
        { top: "70%", right: "18%", delay: "1.5s" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-full bg-[var(--color-accent-tertiary)] opacity-40"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            animation: `pulse 3s ease-in-out ${pos.delay} infinite`,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

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

            {/* 3 ZK pillars list */}
            <div className="space-y-5">
              {PILLARS_VISUAL.map((pillar, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: `${pillar.color}12` }}
                  >
                    <pillar.icon
                      className="w-5 h-5"
                      style={{ color: pillar.color }}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
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

          {/* ── Visual side (right) ── */}
          <motion.div
            variants={reduceMotion ? undefined : slideInRight}
            className="relative rounded-3xl bg-bg-tertiary p-8 md:p-12 flex items-center justify-center aspect-square max-w-[520px] mx-auto lg:mx-0 w-full overflow-hidden"
          >
            <ZKIllustration />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
