"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

import SectionEyebrow from "@/components/ui/SectionEyebrow";
import WordStagger from "@/components/ui/WordStagger";
import {
  SimSwapShield,
  NumberPortabilityMark,
  OpenInfrastructure,
  PrivacyCommitment,
} from "@/components/landing/illustrations/Illustration";

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* Gen-Z card reveal — clip-path wipe + lift. */
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

const CARDS = [
  SimSwapShield,
  NumberPortabilityMark,
  OpenInfrastructure,
  PrivacyCommitment,
] as const;

/* ─────────────────────────────────────────────────────────────────────── */
/*  WhyChain — Helium-style 4-cell grid                                  */
/*    - Cells separated by hairline borders only (no panels, no glass)   */
/*    - Line-art illustration in single ink at top-left of each cell     */
/*    - Title in serif display, body in sans                             */
/* ─────────────────────────────────────────────────────────────────────── */

export default function WhyChain() {
  const t = useTranslations("whyChain");

  return (
    <section
      aria-labelledby="why-chain-title"
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
            <SectionEyebrow>{t("labelEyebrow")}</SectionEyebrow>
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

        {/* 2x2 grid divided by hairlines only */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 border-t border-[var(--color-border-primary)] border-b border-b-[var(--color-border-primary)]"
        >
          {CARDS.map((Illustration, i) => {
            const isRightCol = i % 2 === 1;
            const isBottomRow = i >= 2;
            return (
              <motion.article
                key={i}
                variants={cardReveal}
                className={[
                  "relative flex flex-col gap-7 px-6 md:px-10 py-12 md:py-14",
                  // vertical hairline between left/right on desktop
                  !isRightCol ? "md:border-r md:border-r-[var(--color-border-primary)]" : "",
                  // horizontal hairline between top/bottom rows
                  !isBottomRow ? "border-b border-[var(--color-border-primary)] md:border-b-[var(--color-border-primary)]" : "border-b border-[var(--color-border-primary)] md:border-b-0",
                ].join(" ")}
              >
                <Illustration
                  color="var(--color-fg-primary)"
                  size={44}
                  strokeWidth={1.25}
                />
                <h3 className="font-display font-medium text-2xl md:text-[1.75rem] tracking-[-0.01em] leading-[1.15] text-fg max-w-[20ch]">
                  {t(`cards.${i}.title`)}
                </h3>
                <p className="text-fg-secondary text-base leading-relaxed max-w-md">
                  {t(`cards.${i}.description`)}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
