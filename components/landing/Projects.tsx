"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/providers/ThemeProvider";
import { slideInLeft, slideInRight } from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Card data — accurate to the 7aychain protocol                      */
/* ------------------------------------------------------------------ */

interface CardVisual {
  readonly accent: string;
  readonly iconDark: string;
  readonly iconLight: string;
}

const CARDS_VISUAL: readonly CardVisual[] = [
  {
    accent: "#00FFC6",
    iconDark: "/icons/dark/card-physics.png",
    iconLight: "/icons/light/card-physics.png",
  },
  {
    accent: "#C084FC",
    iconDark: "/icons/dark/card-privacy.png",
    iconLight: "/icons/light/card-privacy.png",
  },
  {
    accent: "#00FFC6",
    iconDark: "/icons/dark/card-botproof.png",
    iconLight: "/icons/light/card-botproof.png",
  },
  {
    accent: "#22D3EE",
    iconDark: "/icons/dark/card-governance.png",
    iconLight: "/icons/light/card-governance.png",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const VIEWPORT = { once: true, margin: "200px 0px 0px 0px" } as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function WhyChain() {
  const { theme } = useTheme();
  const t = useTranslations("whyChain");

  return (
    <section className="relative w-full py-24 md:py-32">
      <motion.div
        className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {/* Section heading */}
        <motion.div variants={fadeUp} className="text-center mb-16 md:mb-20">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-fg mb-5">
            {t("title")}{" "}
            <span className="gradient-text-accent">{t("titleAccent")}</span>{t("titleEnd")}
          </h2>
          <p className="text-fg-secondary text-lg leading-relaxed max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 2x2 grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-y-14 gap-x-12 md:gap-x-16 max-w-4xl mx-auto"
          variants={stagger}
        >
          {CARDS_VISUAL.map((card, i) => {
            const iconSrc = theme === "light" ? card.iconLight : card.iconDark;
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={t(`cards.${i}.title`)}
                variants={isLeft ? slideInLeft : slideInRight}
                className="flex flex-col items-start"
              >
                {/* Icon */}
                <div className="mb-5">
                  <Image
                    src={iconSrc}
                    alt={t(`cards.${i}.iconAlt`)}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-lg md:text-xl text-fg mb-2 leading-snug">
                  {t(`cards.${i}.title`)}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-fg-secondary leading-relaxed">
                  {t(`cards.${i}.description`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
