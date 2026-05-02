"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

import SectionEyebrow from "@/components/ui/SectionEyebrow";
import WordStagger from "@/components/ui/WordStagger";
import AnimatedStatValue from "@/components/landing/stats/AnimatedStatValue";
import { EXTERNAL_LINKS } from "@/lib/constants/routes";

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const VIEWPORT = { once: true, margin: "-80px 0px" } as const;

export default function StatsBand() {
  const t = useTranslations("statsBand");
  const stats = [0, 1, 2, 3].map((i) => ({
    value: t(`stats.${i}.value`),
    label: t(`stats.${i}.label`),
  }));

  return (
    <section
      aria-labelledby="stats-band-title"
      className="relative w-full py-24 md:py-32 border-t border-[var(--color-border-primary)]"
    >
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.div
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
          <div className="lg:col-span-7 lg:pt-2 flex flex-col gap-6">
            <p className="text-fg-secondary text-base md:text-lg leading-relaxed max-w-xl">
              {t("subtitle")}
            </p>
            <a
              href={EXTERNAL_LINKS.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg hover:text-[var(--color-accent-primary)] transition-colors"
            >
              <span className="border-b border-fg/40 group-hover:border-[var(--color-accent-primary)] pb-0.5 transition-colors">
                {t("ctaPrimary")}
              </span>
              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </motion.div>

        {/* Metric strip — animated count-up on viewport entry */}
        <motion.dl
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 border-t border-[var(--color-border-primary)]"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="flex flex-col gap-3 py-8 md:py-10 px-2 md:px-6 border-b border-[var(--color-border-primary)] lg:border-b-0 lg:border-r lg:border-r-[var(--color-border-primary)] last:border-r-0"
            >
              <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-muted">
                {s.label}
              </dt>
              <dd className="font-display font-medium text-fg text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] leading-none tracking-[-0.02em]">
                <AnimatedStatValue
                  value={s.value}
                  className="block"
                />
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
