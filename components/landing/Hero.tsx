"use client";

import { memo, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { heroStagger, kineticReveal } from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TYPE_SPEED = 45;
const DELETE_SPEED = 25;
const PAUSE_AFTER_TYPE = 2800;
const PAUSE_AFTER_DELETE = 400;

/* ------------------------------------------------------------------ */
/*  Typewriter Hook                                                    */
/* ------------------------------------------------------------------ */

function useTypewriter(phrases: readonly string[]) {
  const [display, setDisplay] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = phrases[phraseIdx];
    if (!isDeleting) {
      if (display.length < current.length) {
        return { next: current.slice(0, display.length + 1), delay: TYPE_SPEED };
      }
      return { next: display, delay: PAUSE_AFTER_TYPE, startDelete: true };
    }
    if (display.length > 0) {
      return { next: display.slice(0, -1), delay: DELETE_SPEED };
    }
    return { next: "", delay: PAUSE_AFTER_DELETE, nextPhrase: true };
  }, [display, phraseIdx, isDeleting, phrases]);

  useEffect(() => {
    const result = tick();
    const timeout = setTimeout(() => {
      setDisplay(result.next);
      if (result.startDelete) setIsDeleting(true);
      if (result.nextPhrase) {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % phrases.length);
      }
    }, result.delay);
    return () => clearTimeout(timeout);
  }, [tick, phrases.length]);

  return display;
}

/* ------------------------------------------------------------------ */
/*  Hero Component                                                     */
/* ------------------------------------------------------------------ */

function HeroComponent() {
  const t = useTranslations("hero");
  const phrases = Object.values(t.raw("typewriterPhrases")) as string[];
  const typed = useTypewriter(phrases);

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden pt-24 pb-8 md:pt-20 md:pb-0">
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        <motion.h1
          variants={kineticReveal}
          className="font-display font-black text-[2.5rem] sm:text-5xl md:text-7xl lg:text-8xl xl:text-[8.5rem] tracking-tighter leading-[0.9] uppercase"
        >
          <span className="text-fg">{t("titleLine1Start")}</span>
          <span className="gradient-text-hero">{t("titleLine1Accent")}</span>
          <br />
          <span className="text-fg">{t("titleLine2Start")}</span>
          <span className="gradient-text-hero">{t("titleLine2Accent")}</span>
        </motion.h1>

        <motion.p
          variants={kineticReveal}
          className="mt-8 md:mt-10 text-fg-secondary text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
        >
          {t("subtitle")}
        </motion.p>

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

        <motion.div
          variants={kineticReveal}
          className="mt-6 md:mt-8 h-8 flex items-center justify-center"
        >
          <span className="font-mono text-base sm:text-lg md:text-xl text-fg tracking-wider">
            {typed}
          </span>
          <span
            className="inline-block w-[2px] h-[1.2em] ml-1 bg-[var(--color-accent-secondary)]"
            style={{ animation: "cursorBlink 1s step-end infinite" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

const Hero = memo(HeroComponent);
Hero.displayName = "Hero";

export default Hero;
