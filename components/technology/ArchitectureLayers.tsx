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
      className="relative w-full py-28 md:py-36 lg:py-40"
      aria-labelledby="architecture-heading"
    >
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

          {/* ── 2×2 minimal layer cells ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14 md:gap-x-16 md:gap-y-16">
            {LAYERS_VISUAL.map((layer, idx) => (
              <motion.div
                key={idx}
                variants={reduceMotion ? undefined : fadeUpItem}
                className="group relative pl-6"
              >
                {/* Left accent bar (full-height, thin) */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-px"
                  style={{
                    background: `linear-gradient(180deg, ${layer.color}, transparent)`,
                  }}
                  aria-hidden="true"
                />

                <div className="flex items-center gap-3 mb-3">
                  <layer.icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: layer.color }}
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <h3 className="font-display font-bold text-xl md:text-2xl text-fg tracking-tight">
                    {t(`layers.${idx}.title`)}
                  </h3>
                </div>

                <p className="text-fg-secondary text-sm md:text-base leading-relaxed mb-5">
                  {t(`layers.${idx}.description`)}
                </p>

                {/* Text-only tag list (no chips) */}
                <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                  {Array.from({ length: 4 }, (_, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="text-[11px] uppercase tracking-[0.16em] text-fg-tertiary font-medium"
                    >
                      {t(`layers.${idx}.items.${itemIdx}`)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
