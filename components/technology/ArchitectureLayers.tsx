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
} from "@/lib/constants/animations";

interface LayerVisual {
  readonly level: number;
  readonly color: string;
  readonly icon: LucideIcon;
  readonly itemCount: number;
}

const LAYERS_VISUAL: readonly LayerVisual[] = [
  { level: 1, color: "#178E77", icon: Server, itemCount: 4 },
  { level: 2, color: "#00FFC6", icon: Radar, itemCount: 4 },
  { level: 3, color: "#8B5CF6", icon: ShieldCheck, itemCount: 4 },
  { level: 4, color: "#22D3EE", icon: Layers, itemCount: 4 },
] as const;

export default function ArchitectureLayers() {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("architectureLayers");

  return (
    <section
      className="relative w-full px-6 md:px-12 py-24 md:py-32"
      aria-labelledby="architecture-heading"
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
            id="architecture-heading"
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

          {/* Layer stack with connecting line */}
          <div className="relative">
            {/* Vertical gradient line */}
            <div
              className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] hidden md:block"
              style={{
                background:
                  "linear-gradient(180deg, #178E77, #00FFC6, #8B5CF6, #22D3EE)",
              }}
              aria-hidden="true"
            />

            <div className="space-y-5 md:space-y-6">
              {LAYERS_VISUAL.map((layer, layerIdx) => (
                <motion.div
                  key={layer.level}
                  variants={reduceMotion ? undefined : fadeUpItem}
                  className="glass-card glow-border rounded-2xl overflow-hidden group relative"
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 rounded-l-2xl"
                    style={{ backgroundColor: layer.color }}
                    aria-hidden="true"
                  />

                  <div className="p-6 md:p-8 pl-8 md:pl-14">
                    <div className="flex items-start gap-4 md:gap-6">
                      {/* Level number + icon */}
                      <div className="flex-shrink-0 flex flex-col items-center gap-3">
                        <div
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{
                            backgroundColor: `${layer.color}15`,
                            color: layer.color,
                            border: `1px solid ${layer.color}30`,
                          }}
                        >
                          {layer.level}
                        </div>
                        <div
                          className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${layer.color}12` }}
                        >
                          <layer.icon
                            className="w-5 h-5 md:w-6 md:h-6"
                            style={{ color: layer.color }}
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-lg md:text-xl text-fg mb-2 tracking-tight">
                          {t(`layers.${layerIdx}.title`)}
                        </h3>
                        <p className="text-fg-secondary text-sm leading-relaxed mb-4">
                          {t(`layers.${layerIdx}.description`)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: layer.itemCount }, (_, itemIdx) => (
                            <Badge key={itemIdx} variant="glass">
                              {t(`layers.${layerIdx}.items.${itemIdx}`)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(ellipse at 0% 50%, ${layer.color}10 0%, transparent 50%)`,
                    }}
                    aria-hidden="true"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
