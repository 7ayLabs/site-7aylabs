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
  bentoStagger,
  bentoItem,
  fadeUpItem,
} from "@/lib/constants/animations";

interface PillarVisual {
  readonly icon: LucideIcon;
}

const PILLARS_VISUAL: readonly PillarVisual[] = [
  { icon: Lock },
  { icon: EyeOff },
  { icon: Fingerprint },
] as const;

function ZKIllustration() {
  const t = useTranslations("privacyZK");

  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[320px] mx-auto">
      {/* Concentric dashed rings */}
      {[280, 220, 160].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full border border-dashed"
          style={{
            width: size,
            height: size,
            borderColor: `rgba(23, 142, 119, ${0.15 + i * 0.08})`,
            animation: `slowSpin ${20 + i * 8}s linear infinite${i % 2 === 1 ? " reverse" : ""}`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Center pin */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[var(--color-accent-dim)] border border-[var(--color-border-accent)] flex items-center justify-center shadow-glow">
          <MapPin
            className="w-7 h-7 text-[var(--color-accent-primary)]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>
        <Badge variant="accent">{t("verified")}</Badge>
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
          className="absolute w-2 h-2 rounded-full bg-[var(--color-accent-secondary)] opacity-40"
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
      className="relative w-full px-6 md:px-12 py-24 md:py-32"
      aria-labelledby="privacy-zk-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Top: Two-column layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={reduceMotion ? undefined : staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-20"
        >
          {/* Text side */}
          <motion.div variants={reduceMotion ? undefined : fadeUpItem}>
            <SectionLabel className="mb-5">{t("label")}</SectionLabel>
            <h2
              id="privacy-zk-heading"
              className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-fg tracking-tight mb-5"
            >
              {t("title")}{" "}
              <span className="gradient-text-accent">{t("titleAccent")}</span>
            </h2>
            <div className="text-fg-secondary text-base leading-relaxed space-y-4">
              <p>{t("description.0")}</p>
              <p>{t("description.1")}</p>
            </div>
          </motion.div>

          {/* Illustration side */}
          <motion.div
            variants={reduceMotion ? undefined : fadeUpItem}
            className="flex items-center justify-center rounded-2xl bg-bg-tertiary p-8 md:p-12"
          >
            <ZKIllustration />
          </motion.div>
        </motion.div>

        {/* Bottom: 3-column pillar cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={reduceMotion ? undefined : bentoStagger}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {PILLARS_VISUAL.map((pillar, i) => (
              <motion.article
                key={t(`pillars.${i}.title`)}
                variants={reduceMotion ? undefined : bentoItem}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { scale: 1.015, transition: { duration: 0.25 } }
                }
                className="glass-card glow-border p-6 md:p-8 group relative rounded-2xl"
              >
                <div className="mb-5 flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-accent-violet-dim)] transition-all duration-300 group-hover:bg-[var(--color-accent-tertiary)]/20">
                  <pillar.icon
                    className="w-5 h-5 text-[var(--color-accent-tertiary)] transition-colors duration-300"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="font-display font-semibold text-lg text-fg mb-2 tracking-tight">
                  {t(`pillars.${i}.title`)}
                </h3>

                <p className="text-fg-secondary text-sm leading-relaxed">
                  {t(`pillars.${i}.description`)}
                </p>

                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse at 30% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)",
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
