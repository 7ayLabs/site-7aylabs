"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Shield, Eye, Smartphone } from "lucide-react";
import Button from "@/components/ui/Button";
import { heroStagger, kineticReveal, fadeUpBlur } from "@/lib/constants/animations";

const FEATURE_ICONS = [Shield, Eye, Smartphone] as const;

function HeroComponent() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden px-6 lg:px-8">
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        <motion.h1
          variants={kineticReveal}
          className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9]"
        >
          <span className="text-fg">{t("titleLine1Start")}</span>
          <span className="text-fg">{t("titleLine1Accent")}</span>
          <br />
          <span className="text-fg">{t("titleLine2Start")}</span>
          <span className="gradient-text-hero">{t("titleLine2Accent")}</span>
        </motion.h1>

        <motion.p
          variants={kineticReveal}
          className="mt-6 md:mt-8 text-fg-tertiary text-base md:text-lg max-w-2xl leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          variants={kineticReveal}
          className="flex flex-wrap gap-4 justify-center mt-8 md:mt-10"
        >
          <Button href="/waitlist" variant="primary" size="md">
            {t("ctaPrimary")}
          </Button>
          <Button href="#about" variant="secondary" size="md" withArrow>
            {t("ctaSecondary")}
          </Button>
        </motion.div>

        <motion.div
          variants={fadeUpBlur}
          className="mt-12 grid grid-cols-3 gap-3 w-full max-w-lg"
        >
          {FEATURE_ICONS.map((Icon, i) => (
            <div
              key={i}
              className="border border-[var(--color-border-primary)] rounded-xl p-4 flex flex-col items-center text-center gap-2"
            >
              <Icon
                className="h-4 w-4 text-fg-muted"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="font-medium text-xs text-fg">
                {t(`features.${i}.label`)}
              </p>
              <p className="text-[11px] text-fg-muted leading-tight hidden sm:block">
                {t(`features.${i}.description`)}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

const Hero = memo(HeroComponent);
Hero.displayName = "Hero";

export default Hero;
