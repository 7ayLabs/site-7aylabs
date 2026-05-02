"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

import SectionEyebrow from "@/components/ui/SectionEyebrow";
import WordStagger from "@/components/ui/WordStagger";
import {
  SubscriberStack,
  RoamingGlobe,
  VerifiedCall,
} from "@/components/landing/illustrations/Illustration";
import { ROUTES } from "@/lib/constants/routes";

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

const CARDS = [SubscriberStack, RoamingGlobe, VerifiedCall] as const;

/* ─────────────────────────────────────────────────────────────────────── */
/*  UseCasesPreview — editorial 3-cell grid                              */
/*    Same Helium/Notion register as WhyChain — hairline-divided cells, */
/*    monochrome line-art illustration, serif headline.                  */
/* ─────────────────────────────────────────────────────────────────────── */

export default function UseCasesPreview() {
  const t = useTranslations("useCasesPreview");

  return (
    <section
      aria-labelledby="use-cases-preview-title"
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
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
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
          <div className="lg:col-span-5 lg:pt-2 flex flex-col gap-6">
            <p className="text-fg-secondary text-base md:text-lg leading-relaxed max-w-xl">
              {t("subtitle")}
            </p>
            <Link
              href={ROUTES.useCases}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg hover:text-[var(--color-accent-primary)] transition-colors"
            >
              <span className="border-b border-fg/40 group-hover:border-[var(--color-accent-primary)] pb-0.5 transition-colors">
                {t("ctaSeeAll")}
              </span>
              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </motion.header>

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 border-t border-[var(--color-border-primary)] border-b border-b-[var(--color-border-primary)]"
        >
          {CARDS.map((Illustration, i) => (
            <motion.article
              key={i}
              variants={cardReveal}
              className={
                "relative flex flex-col gap-6 px-6 md:px-10 py-12 md:py-14 " +
                (i < 2
                  ? "border-b border-[var(--color-border-primary)] md:border-b-0 md:border-r md:border-r-[var(--color-border-primary)]"
                  : "")
              }
            >
              <Illustration
                color="var(--color-fg-primary)"
                size={44}
                strokeWidth={1.25}
              />
              <h3 className="font-display font-medium text-2xl tracking-[-0.01em] leading-[1.15] text-fg max-w-[20ch]">
                {t(`cards.${i}.title`)}
              </h3>
              <p className="text-fg-secondary text-base leading-relaxed">
                {t(`cards.${i}.description`)}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
