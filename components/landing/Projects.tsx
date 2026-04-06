"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/providers/ThemeProvider";

interface CardVisual {
  readonly accent: string;
  readonly iconDark: string;
  readonly iconLight: string;
}

const CARDS_VISUAL: readonly CardVisual[] = [
  { accent: "#00FFC6", iconDark: "/icons/dark/card-physics.png", iconLight: "/icons/light/card-physics.png" },
  { accent: "#C084FC", iconDark: "/icons/dark/card-privacy.png", iconLight: "/icons/light/card-privacy.png" },
  { accent: "#00FFC6", iconDark: "/icons/dark/card-botproof.png", iconLight: "/icons/light/card-botproof.png" },
  { accent: "#22D3EE", iconDark: "/icons/dark/card-governance.png", iconLight: "/icons/light/card-governance.png" },
] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const VIEWPORT = { once: true, margin: "-60px" } as const;

export default function WhyChain() {
  const { theme } = useTheme();
  const t = useTranslations("whyChain");

  return (
    <section className="relative w-full py-20 md:py-28">
      <motion.div
        className="max-w-5xl mx-auto px-6 lg:px-8"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <h2 className="font-display font-bold text-2xl md:text-4xl tracking-tight text-fg mb-4">
            {t("title")}{" "}
            <span className="gradient-text-accent">{t("titleAccent")}</span>
            {t("titleEnd")}
          </h2>
          <p className="text-base text-fg-tertiary max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x-0 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border-primary)] border border-[var(--color-border-primary)] rounded-xl overflow-hidden"
          variants={stagger}
        >
          {CARDS_VISUAL.map((card, i) => {
            const iconSrc = theme === "light" ? card.iconLight : card.iconDark;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="p-5 flex flex-col items-start"
              >
                <Image
                  src={iconSrc}
                  alt=""
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain mb-4"
                />
                <h3 className="font-display font-semibold text-sm text-fg mb-1">
                  {t(`cards.${i}.title`)}
                </h3>
                <p className="text-xs text-fg-tertiary leading-relaxed">
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
