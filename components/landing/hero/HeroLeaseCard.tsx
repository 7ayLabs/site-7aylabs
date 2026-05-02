"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";

import SectionEyebrow from "@/components/ui/SectionEyebrow";

/* ─────────────────────────────────────────────────────────────────────── */
/*  HeroLeaseCard                                                          */
/*                                                                         */
/*  Editorial DePIN re-skin — pure white surface, hairline borders,        */
/*  black ink, single accent reserved for the LIVE dot. The card frames    */
/*  a single live attach lease, not a stats roll-up — so it complements    */
/*  the StatsBand below instead of duplicating it.                         */
/* ─────────────────────────────────────────────────────────────────────── */

const enterContainer: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delayChildren: 0.25,
      staggerChildren: 0.07,
    },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const PROOF_ROWS: ReadonlyArray<{ label: string; value: string }> = [
  { label: "Actor",             value: "0xA47F··3F2C" },
  { label: "Device",            value: "0xD2A1··7B0E" },
  { label: "Presence quorum",   value: "6 / 6" },
  { label: "Witness finality",  value: "<1s" },
];

const SIGNAL_BARS = [4, 7, 10, 13];

const INITIAL_LEASE_SECONDS = 47 * 60 + 32;

function formatLease(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function HeroLeaseCard() {
  const [seconds, setSeconds] = useState(INITIAL_LEASE_SECONDS);
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s <= 0 ? 60 * 60 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.aside
      variants={enterContainer}
      initial="hidden"
      animate="visible"
      aria-label="Live attach lease"
      className="relative w-full max-w-[440px] rounded-[2px] overflow-hidden"
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border-primary)",
      }}
    >
      {/* ───── Header: signal bars + carrier + LIVE ───── */}
      <motion.header
        variants={fadeUpItem}
        className="flex items-center justify-between px-7 pt-6 pb-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-[3px] h-[14px]">
            {SIGNAL_BARS.map((h, i) => (
              <motion.span
                key={i}
                className="w-[3px] origin-bottom"
                style={{
                  height: h,
                  background: "var(--color-fg-primary)",
                  opacity: 0.55 + i * 0.15,
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.35,
                  delay: 0.45 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase font-semibold text-fg">
            7AY
          </span>
          <span className="text-fg-faint">·</span>
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-fg-tertiary">
            5G
          </span>
        </div>

        <SectionEyebrow withDot>Live</SectionEyebrow>
      </motion.header>

      <Divider />

      {/* ───── Number block ───── */}
      <motion.div variants={fadeUpItem} className="px-7 py-7">
        <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-fg-muted mb-4">
          Attach lease
        </span>
        <div className="font-display font-medium text-[2rem] md:text-[2.25rem] leading-[1.02] tracking-[-0.02em] text-fg">
          +1 (650){" "}
          <span className="text-fg-tertiary mx-0.5">·</span>{" "}
          7AY{" "}
          <span className="text-fg-tertiary mx-0.5">·</span>{" "}
          9007
        </div>
        <span className="mt-3 block font-mono text-[11px] tracking-[0.08em] text-fg-tertiary">
          subscriber #s_0x4f1c89a
        </span>
      </motion.div>

      <Divider />

      {/* ───── Verification rows ───── */}
      <motion.ul variants={fadeUpItem} className="px-7 py-5 space-y-3.5">
        {PROOF_ROWS.map((row, i) => (
          <motion.li
            key={row.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.65 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-2.5 text-[13px] text-fg-secondary">
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full"
                style={{
                  background: "var(--color-accent-soft)",
                  color: "var(--color-accent-primary)",
                }}
              >
                <Check size={10} strokeWidth={3} aria-hidden="true" />
              </span>
              <span>{row.label}</span>
            </span>
            <span
              className="font-mono text-[11px] tracking-[0.04em] text-fg"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {row.value}
            </span>
          </motion.li>
        ))}
      </motion.ul>

      <Divider />

      {/* ───── Footer: region + countdown ───── */}
      <motion.footer
        variants={fadeUpItem}
        className="px-7 pt-5 pb-6 flex items-end justify-between gap-3"
      >
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-muted">
            Region
          </span>
          <span className="font-mono text-[12px] tracking-[0.04em] text-fg-secondary">
            SFO-N · Block <span className="text-fg">0x1A8C</span>
          </span>
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-muted">
            Expires in
          </span>
          <span
            className="font-display font-medium text-[20px] leading-none tracking-tight text-fg"
            style={{ fontVariantNumeric: "tabular-nums" }}
            aria-live="off"
          >
            {formatLease(seconds)}
          </span>
        </div>
      </motion.footer>
    </motion.aside>
  );
}

function Divider() {
  return (
    <motion.div
      aria-hidden="true"
      className="h-px origin-left"
      style={{ background: "var(--color-border-primary)" }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
