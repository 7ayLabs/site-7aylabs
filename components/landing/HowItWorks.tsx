"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/providers/ThemeProvider";
import { scaleUpBlur } from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Step data — accurate to the 7aychain protocol                      */
/* ------------------------------------------------------------------ */

interface StepVisual {
  readonly accent: string;
  readonly iconDark: string;
  readonly iconLight: string;
}

const STEPS_VISUAL: readonly StepVisual[] = [
  {
    accent: "#00FFC6",
    iconDark: "/icons/dark/step-connect.png",
    iconLight: "/icons/light/step-connect.png",
  },
  {
    accent: "#C084FC",
    iconDark: "/icons/dark/step-witness.png",
    iconLight: "/icons/light/step-witness.png",
  },
  {
    accent: "#22D3EE",
    iconDark: "/icons/dark/step-seal.png",
    iconLight: "/icons/light/step-seal.png",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const VIEWPORT = { once: true, margin: "200px 0px 0px 0px" } as const;

/* ------------------------------------------------------------------ */
/*  Static fallback (reduced motion)                                   */
/* ------------------------------------------------------------------ */

function StaticFallback({ theme }: { theme: string }) {
  const t = useTranslations("howItWorks");

  return (
    <section
      id="how-it-works"
      className="relative w-full py-16 sm:py-24 md:py-32"
      aria-labelledby="how-it-works-heading-static"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16 md:mb-20">
          <span className="block text-xs tracking-[0.2em] uppercase text-fg-muted mb-4">
            {t("label")}
          </span>
          <h2
            id="how-it-works-heading-static"
            className="font-display font-bold text-3xl md:text-5xl tracking-tight text-fg mb-5"
          >
            {t("title")}
          </h2>
          <p className="text-fg-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {STEPS_VISUAL.map((step, i) => {
            const iconSrc = theme === "light" ? step.iconLight : step.iconDark;
            return (
              <div key={t(`steps.${i}.number`)} className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 font-mono text-sm font-bold"
                  style={{ backgroundColor: `${step.accent}14`, color: step.accent }}
                >
                  {t(`steps.${i}.number`)}
                </div>
                <div className="mb-5">
                  <Image
                    src={iconSrc}
                    alt={t(`steps.${i}.iconAlt`)}
                    width={72}
                    height={72}
                    className="w-[72px] h-[72px] object-contain"
                  />
                </div>
                <h3 className="font-display font-semibold text-lg md:text-xl text-fg mb-3 leading-snug">
                  {t(`steps.${i}.title`)}
                </h3>
                <p className="text-sm md:text-base text-fg-secondary leading-relaxed max-w-xs">
                  {t(`steps.${i}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const t = useTranslations("howItWorks");

  if (shouldReduceMotion) {
    return <StaticFallback theme={theme} />;
  }

  return (
    <section
      id="how-it-works"
      aria-label={t("aria")}
      className="relative w-full py-16 sm:py-24 md:py-32"
    >
      <motion.div
        className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {/* Section heading */}
        <motion.div variants={fadeUp} className="text-center mb-16 md:mb-20">
          <span className="block text-xs tracking-[0.2em] uppercase text-fg-muted mb-4">
            {t("label")}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-fg mb-5">
            {t("title")}
          </h2>
          <p className="text-fg-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Step grid — 3 columns on desktop */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10"
          variants={stagger}
        >
          {STEPS_VISUAL.map((step, i) => {
            const iconSrc = theme === "light" ? step.iconLight : step.iconDark;
            return (
              <motion.div
                key={t(`steps.${i}.number`)}
                variants={scaleUpBlur}
                className="flex flex-col items-center text-center"
              >
                {/* Numbered badge */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 font-mono text-sm font-bold"
                  style={{ backgroundColor: `${step.accent}14`, color: step.accent }}
                >
                  {t(`steps.${i}.number`)}
                </div>

                {/* Icon */}
                <div className="mb-5">
                  <Image
                    src={iconSrc}
                    alt={t(`steps.${i}.iconAlt`)}
                    width={72}
                    height={72}
                    className="w-[72px] h-[72px] object-contain"
                  />
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-lg md:text-xl text-fg mb-3 leading-snug">
                  {t(`steps.${i}.title`)}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-fg-secondary leading-relaxed max-w-xs">
                  {t(`steps.${i}.description`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
