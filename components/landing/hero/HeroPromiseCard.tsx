"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

import SectionEyebrow from "@/components/ui/SectionEyebrow";

/* ─────────────────────────────────────────────────────────────────────── */
/*  HeroPromiseCard                                                        */
/*                                                                         */
/*  An editorial manifesto card. Replaces the previous technical lease /  */
/*  ledger artifacts with a human-language statement of what 7aychain     */
/*  exists to do — written for someone who has never heard of presence    */
/*  consensus and may never need to.                                       */
/*                                                                         */
/*  Design moves:                                                          */
/*    - Single column, generous leading                                   │
/*    - Newsreader serif at display size for the four-line manifesto      │
/*    - Inter sans for the closing prose paragraph (lighter colour)       │
/*    - Mono eyebrow at top, mono "live" indicator at bottom              │
/*    - Each manifesto line fades up sequentially (220ms apart) — the     │
/*      sentences are paced like a spoken statement, not a paragraph.     │
/* ─────────────────────────────────────────────────────────────────────── */

const enterContainer: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delayChildren: 0.2,
      staggerChildren: 0.07,
    },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroPromiseCard() {
  const t = useTranslations("heroPromise");

  // The four short manifesto lines + a reveal cadence that feels spoken.
  const manifestoLines = ["line1", "line2", "line3", "line4"] as const;

  return (
    <motion.aside
      variants={enterContainer}
      initial="hidden"
      animate="visible"
      aria-label={t("eyebrow")}
      className="relative w-full max-w-[460px] overflow-hidden"
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border-primary)",
        borderRadius: 2,
      }}
    >
      {/* Eyebrow */}
      <motion.div
        variants={fadeUpItem}
        className="px-7 sm:px-9 pt-7 sm:pt-9 pb-2"
      >
        <SectionEyebrow>{t("eyebrow")}</SectionEyebrow>
      </motion.div>

      {/* Manifesto — four short serif lines, sequential reveal */}
      <div className="px-7 sm:px-9 pt-2 pb-8 sm:pb-10">
        <ol className="font-display font-medium text-fg leading-[1.18] tracking-[-0.012em] text-[1.5rem] sm:text-[1.75rem] md:text-[1.9rem] space-y-2.5">
          {manifestoLines.map((key, idx) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.45 + idx * 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="block"
            >
              {t(key)}
            </motion.li>
          ))}
        </ol>

        {/* Closing prose — lighter sans, smaller */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.45 + manifestoLines.length * 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-7 text-[0.95rem] leading-relaxed text-fg-secondary max-w-[40ch]"
        >
          {t("prose")}
        </motion.p>
      </div>

      {/* Footer: editorial section mark — no live indicator */}
      <motion.footer
        variants={fadeUpItem}
        className="flex items-center justify-between px-7 sm:px-9 py-4 border-t border-[var(--color-border-primary)]"
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-fg-muted">
          7AY · 01
        </span>
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-fg-muted">
          —
        </span>
      </motion.footer>
    </motion.aside>
  );
}
