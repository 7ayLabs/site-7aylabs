"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import Button from "@/components/ui/Button";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import WordStagger from "@/components/ui/WordStagger";
import HeroPromiseCard from "@/components/landing/hero/HeroPromiseCard";
import { heroStagger, kineticReveal } from "@/lib/constants/animations";
import MeshBackdrop from "@/components/landing/hero/MeshBackdrop";

/* ------------------------------------------------------------------ */
/*  Hero — simplified Gen-Z editorial composition                      */
/*    - Single mono eyebrow (no live dot, no extra label line)         */
/*    - Four-word serif title with word-by-word reveal                 */
/*    - One-sentence subtitle                                          */
/*    - Two CTAs                                                       │
/*    - Right column hosts the Promise Card manifesto                 │
/* ------------------------------------------------------------------ */

function HeroComponent() {
  const t = useTranslations("hero");

  return (
    <section
      className="relative w-full overflow-hidden pt-32 pb-24 md:pt-36 md:pb-32"
      aria-labelledby="hero-title"
    >
      <MeshBackdrop />

      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14"
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-16 items-start">
          {/* ───── LEFT: editorial column ───── */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div variants={kineticReveal} className="mb-10">
              <SectionEyebrow>{t("labelEyebrow")}</SectionEyebrow>
            </motion.div>

            {/* Word-stagger reveal — Gen-Z native cadence */}
            <WordStagger
              as="h1"
              className="font-display font-medium text-fg leading-[1.02] tracking-[-0.02em] text-[2.75rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.75rem] xl:text-[5.25rem] max-w-[16ch]"
              delay={0.15}
              stagger={0.085}
            >
              {t("title")}
            </WordStagger>

            <motion.p
              variants={kineticReveal}
              className="mt-8 text-fg-secondary text-base sm:text-lg leading-relaxed max-w-xl"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              variants={kineticReveal}
              className="flex flex-wrap gap-3 mt-12"
            >
              <Button href="/waitlist" variant="primary" size="lg">
                {t("ctaPrimary")}
              </Button>
              <Button
                href="#how-it-works"
                variant="secondary"
                size="lg"
                withArrow
              >
                {t("ctaSecondary")}
              </Button>
            </motion.div>
          </div>

          {/* ───── RIGHT: friendly promise manifesto ───── */}
          <motion.div
            variants={kineticReveal}
            className="lg:col-span-5 flex lg:justify-end"
          >
            <HeroPromiseCard />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

const Hero = memo(HeroComponent);
Hero.displayName = "Hero";

export default Hero;
