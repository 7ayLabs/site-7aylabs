"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { heroStagger, kineticReveal } from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Hero Component                                                     */
/* ------------------------------------------------------------------ */

function HeroComponent() {
  const t = useTranslations("hero");
  const trustItems = Object.values(t.raw("trustBar")) as string[];

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden pt-24 pb-8 md:pt-20 md:pb-0">
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        {/* Heading — title case, single gradient on "proof" only */}
        <motion.h1
          variants={kineticReveal}
          className="font-display font-black text-[2.5rem] sm:text-5xl md:text-7xl lg:text-8xl xl:text-[8.5rem] tracking-tighter leading-[0.9]"
        >
          <span className="text-fg">{t("titleLine1Start")}</span>
          <span className="text-fg">{t("titleLine1Accent")}</span>
          <br />
          <span className="text-fg">{t("titleLine2Start")}</span>
          <span className="gradient-text-hero">{t("titleLine2Accent")}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={kineticReveal}
          className="mt-8 md:mt-10 text-fg-secondary text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={kineticReveal}
          className="flex flex-wrap gap-5 justify-center mt-10 md:mt-12"
        >
          <Button href="/waitlist" variant="primary" size="lg">
            {t("ctaPrimary")}
          </Button>
          <Button href="#how-it-works" variant="secondary" size="lg" withArrow>
            {t("ctaSecondary")}
          </Button>
        </motion.div>

        {/* Static tagline — monospaced, replaces typewriter */}
        <motion.div
          variants={kineticReveal}
          className="mt-6 md:mt-8 flex items-center justify-center"
        >
          <span className="font-mono text-sm sm:text-base text-fg-muted tracking-wide">
            &gt; {t("tagline")}
          </span>
        </motion.div>

        {/* Trust / metrics bar */}
        <motion.div
          variants={kineticReveal}
          className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
        >
          {trustItems.map((item, i) => (
            <span key={i} className="flex items-center">
              {i > 0 && (
                <span
                  className="mx-2 inline-block h-1 w-1 rounded-full bg-fg-faint shrink-0"
                  aria-hidden="true"
                />
              )}
              <span className="text-xs sm:text-sm text-fg-muted tracking-wide whitespace-nowrap">
                {item}
              </span>
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

const Hero = memo(HeroComponent);
Hero.displayName = "Hero";

export default Hero;
