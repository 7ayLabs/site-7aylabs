"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Server,
  Radar,
  ShieldCheck,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import {
  staggerContainer,
  fadeUpItem,
  kineticReveal,
} from "@/lib/constants/animations";

interface LayerVisual {
  readonly icon: LucideIcon;
  readonly color: string;
}

const LAYERS_VISUAL: readonly LayerVisual[] = [
  { icon: Server, color: "#178E77" },
  { icon: Radar, color: "#00FFC6" },
  { icon: ShieldCheck, color: "#8B5CF6" },
  { icon: Layers, color: "#22D3EE" },
] as const;

export default function ArchitectureLayers() {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("architectureLayers");

  return (
    <section
      className="relative w-full py-28 md:py-36 lg:py-40 overflow-hidden"
      aria-labelledby="architecture-heading"
    >
      {/* Full-width gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(23,142,119,0.08) 0%, rgba(0,255,198,0.04) 50%, rgba(139,92,246,0.06) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Top edge fade */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{
          background: "linear-gradient(to bottom, var(--color-bg-primary), transparent)",
        }}
        aria-hidden="true"
      />
      {/* Bottom edge fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{
          background: "linear-gradient(to top, var(--color-bg-primary), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={reduceMotion ? undefined : staggerContainer}
        >
          {/* ── Centered header ── */}
          <div className="text-center mb-16 md:mb-20">
            <motion.div
              variants={reduceMotion ? undefined : fadeUpItem}
              className="flex justify-center mb-5"
            >
              <SectionLabel>{t("label")}</SectionLabel>
            </motion.div>

            <motion.h2
              id="architecture-heading"
              variants={reduceMotion ? undefined : kineticReveal}
              className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-fg tracking-tight mb-5"
            >
              {t("title")}{" "}
              <span className="gradient-text-accent">{t("titleAccent")}</span>
            </motion.h2>

            <motion.p
              variants={reduceMotion ? undefined : fadeUpItem}
              className="text-fg-secondary text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
            >
              {t("subtitle")}
            </motion.p>
          </div>

          {/* ── 2×2 layer cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {LAYERS_VISUAL.map((layer, idx) => (
              <motion.div
                key={idx}
                variants={reduceMotion ? undefined : fadeUpItem}
                className="rounded-3xl p-8 md:p-10 group relative overflow-hidden"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
                  style={{ backgroundColor: layer.color }}
                  aria-hidden="true"
                />

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${layer.color}15` }}
                  >
                    <layer.icon
                      className="w-6 h-6"
                      style={{ color: layer.color }}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-fg tracking-tight pt-2">
                    {t(`layers.${idx}.title`)}
                  </h3>
                </div>

                <p className="text-fg-secondary text-sm leading-relaxed mb-5">
                  {t(`layers.${idx}.description`)}
                </p>

                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }, (_, itemIdx) => (
                    <Badge key={itemIdx} variant="glass">
                      {t(`layers.${idx}.items.${itemIdx}`)}
                    </Badge>
                  ))}
                </div>

                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 0% 50%, ${layer.color}10 0%, transparent 60%)`,
                  }}
                  aria-hidden="true"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
