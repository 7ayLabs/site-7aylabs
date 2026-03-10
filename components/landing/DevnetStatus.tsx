"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { motion, useInView, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, duration = 1500, active = false) {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active || hasRun.current) return;
    hasRun.current = true;

    let start: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [active, target, duration]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

interface Stat {
  readonly key: string;
  readonly numericValue?: number;
}

const STATS: readonly Stat[] = [
  { key: "version" },
  { key: "nodes", numericValue: 6 },
  { key: "modules", numericValue: 16 },
  { key: "specVersion", numericValue: 111 },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ------------------------------------------------------------------ */
/*  Stat cell with optional count-up                                   */
/* ------------------------------------------------------------------ */

function StatCell({ stat, inView }: { stat: Stat; inView: boolean }) {
  const t = useTranslations("devnetStatus");
  const animated = useCountUp(stat.numericValue ?? 0, 1500, inView);
  const display = stat.numericValue != null ? animated : t(`stats.${stat.key}.label`);

  return (
    <motion.div
      variants={itemVariants}
      className="text-center glass-card px-4 py-4"
    >
      <span className="block text-2xl font-bold font-mono text-[var(--color-accent-primary)] mb-1">
        {display}
      </span>
      <span className="text-xs text-fg-muted uppercase tracking-wider font-mono">
        {t(`stats.${stat.key}.description`)}
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DevnetStatus() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  const t = useTranslations("devnetStatus");

  return (
    <section className="relative w-full px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-4xl mx-auto" ref={sectionRef}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          <Link
            href="/devnet"
            className="block glass-card glow-border p-8 md:p-12 group transition-all duration-300"
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
              {/* Status indicator -- animated ping dot */}
              <div className="flex items-center gap-2 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
                </span>
                <span className="text-sm font-medium text-emerald-400 font-mono">
                  {t("statusIndicator")}
                </span>
              </div>

              <h2 className="font-display font-bold text-2xl md:text-3xl text-fg mb-4">
                {t("title")}
              </h2>

              <p className="text-fg-secondary text-base leading-relaxed max-w-xl mb-8">
                {t("subtitle")}
              </p>

              {/* Stats grid -- glass panels with count-up */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg">
                {STATS.map((stat) => (
                  <StatCell key={stat.key} stat={stat} inView={inView} />
                ))}
              </div>

              {/* CTA hint */}
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-fg-muted group-hover:text-fg transition-colors">
                {t("ctaHint")}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M1 7h12M8 2l5 5-5 5" />
                </svg>
              </span>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
