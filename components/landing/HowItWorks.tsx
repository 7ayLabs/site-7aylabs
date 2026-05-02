"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

import SectionEyebrow from "@/components/ui/SectionEyebrow";
import WordStagger from "@/components/ui/WordStagger";
import {
  IdentityBinding,
  WitnessAttest,
  AttachSeal,
} from "@/components/landing/illustrations/Illustration";

/* ─────────────────────────────────────────────────────────────────────── */
/*  HowItWorks — editorial DePIN composition                             */
/*    - Section title block on top (eyebrow + serif title + body)        */
/*    - Three steps as a 3-column grid divided by vertical hairlines     */
/*    - Each step: STEP NN eyebrow, line-art illustration, h3, body      */
/*    - Single ink color throughout, no per-step accents                 */
/* ─────────────────────────────────────────────────────────────────────── */

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* Gen-Z card reveal — content "wipes" up from below with a clip-path
 * mask, paired with a subtle vertical lift. Reads as content unfolding
 * rather than a generic fade. */
const cardReveal: Variants = {
  hidden: { opacity: 0, y: 28, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const VIEWPORT = { once: true, margin: "-80px 0px" } as const;

const STEP_ILLUSTRATIONS = [
  IdentityBinding,
  WitnessAttest,
  AttachSeal,
] as const;

interface StepProps {
  index: number;
  number: string;
  title: string;
  description: string;
  isLast: boolean;
  reduce: boolean;
}

function StepCard({ index, number, title, description, isLast, reduce }: StepProps) {
  const Illustration = STEP_ILLUSTRATIONS[index];
  return (
    <motion.article
      variants={reduce ? undefined : cardReveal}
      className={
        "relative flex flex-col gap-6 px-0 lg:px-10 py-10 lg:py-12 " +
        (isLast
          ? ""
          : "border-b border-[var(--color-border-primary)] lg:border-b-0 lg:border-r lg:border-r-[var(--color-border-primary)]")
      }
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] tracking-[0.22em] uppercase font-semibold text-fg">
          Step {number}
        </span>
        <span
          aria-hidden="true"
          className="h-px flex-1 max-w-[80px]"
          style={{ background: "var(--color-border-secondary)" }}
        />
      </div>

      {/* Symbolic mark — small, editorial */}
      <div
        className="relative flex items-start"
        style={{ color: "var(--color-fg-primary)" }}
      >
        <Illustration
          color="var(--color-fg-primary)"
          size={48}
          strokeWidth={1.25}
        />
      </div>

      <h3 className="font-display font-medium text-2xl md:text-[1.75rem] tracking-[-0.01em] leading-[1.15] text-fg max-w-[20ch]">
        {title}
      </h3>

      <p className="text-fg-secondary text-base leading-relaxed max-w-md">
        {description}
      </p>

      <span className="sr-only">Step {index + 1}</span>
    </motion.article>
  );
}

function StaticFallback() {
  const t = useTranslations("howItWorks");
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading-static"
      className="relative w-full py-24 md:py-32 border-t border-[var(--color-border-primary)]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 md:mb-20">
          <div className="lg:col-span-5 flex flex-col items-start gap-5">
            <SectionEyebrow>{t("label")}</SectionEyebrow>
            <WordStagger
              as="h2"
              className="text-fg text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] tracking-[-0.02em] font-display font-medium leading-[1.05]"
              delay={0.1}
              stagger={0.07}
            >
              {t("title")}
            </WordStagger>
          </div>
          <div className="lg:col-span-7 lg:pt-2">
            <p className="text-fg-secondary text-base md:text-lg leading-relaxed max-w-xl">
              {t("subtitle")}
            </p>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-[var(--color-border-primary)] border-b border-b-[var(--color-border-primary)]">
          {[0, 1, 2].map((i) => (
            <StepCard
              key={i}
              index={i}
              number={t(`steps.${i}.number`)}
              title={t(`steps.${i}.title`)}
              description={t(`steps.${i}.description`)}
              isLast={i === 2}
              reduce
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("howItWorks");

  if (shouldReduceMotion) return <StaticFallback />;

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      aria-label={t("aria")}
      className="relative w-full py-24 md:py-32 border-t border-[var(--color-border-primary)]"
    >
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.header
          variants={fadeUp}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 md:mb-20"
        >
          <div className="lg:col-span-5 flex flex-col items-start gap-5">
            <SectionEyebrow>{t("label")}</SectionEyebrow>
            <WordStagger
              as="h2"
              className="text-fg text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] tracking-[-0.02em] font-display font-medium leading-[1.05]"
              delay={0.1}
              stagger={0.07}
            >
              {t("title")}
            </WordStagger>
          </div>
          <div className="lg:col-span-7 lg:pt-2">
            <p className="text-fg-secondary text-base md:text-lg leading-relaxed max-w-xl">
              {t("subtitle")}
            </p>
          </div>
        </motion.header>

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-3 border-t border-[var(--color-border-primary)] border-b border-b-[var(--color-border-primary)]"
        >
          {[0, 1, 2].map((i) => (
            <StepCard
              key={i}
              index={i}
              number={t(`steps.${i}.number`)}
              title={t(`steps.${i}.title`)}
              description={t(`steps.${i}.description`)}
              isLast={i === 2}
              reduce={false}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
