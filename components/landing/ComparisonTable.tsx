"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface ComparisonRow {
  readonly dimension: string;
  readonly values: readonly [string, string, string, string];
}

const PLATFORMS = ["7aychain", "Worldcoin", "BrightID", "Gitcoin Passport"] as const;

const ROWS: readonly ComparisonRow[] = [
  {
    dimension: "How it verifies you",
    values: [
      "Internet connection speed from multiple points",
      "Scans your iris with special device",
      "Friends vouch for you via video",
      "Connect social accounts for trust score",
    ],
  },
  {
    dimension: "Privacy",
    values: [
      "High \u2014 only location, never identity",
      "Low \u2014 collects iris biometrics",
      "Medium \u2014 face visible on video",
      "Medium \u2014 links online accounts",
    ],
  },
  {
    dimension: "Hardware needed?",
    values: ["None", "Yes \u2014 Orb device", "None", "None"],
  },
  {
    dimension: "Bot resistance",
    values: ["Very High", "Very High", "Medium", "Low-Medium"],
  },
  {
    dimension: "Who controls your data",
    values: [
      "You",
      "Worldcoin Foundation",
      "BrightID network",
      "You (but depends on platforms)",
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Desktop Table                                                      */
/* ------------------------------------------------------------------ */

function DesktopTable() {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[var(--color-border-primary)]">
            <th className="py-4 pr-6 text-xs font-medium uppercase tracking-wider text-fg-muted w-[18%]">
              Dimension
            </th>
            {PLATFORMS.map((platform, i) => (
              <th
                key={platform}
                className={cn(
                  "py-4 px-4 text-sm font-semibold w-[20.5%]",
                  i === 0
                    ? "text-accent font-bold"
                    : "text-fg-secondary"
                )}
              >
                {platform}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, rowIndex) => (
            <tr
              key={row.dimension}
              className={cn(
                rowIndex < ROWS.length - 1 &&
                  "border-b border-[var(--color-border-primary)]"
              )}
            >
              <td className="py-4 pr-6 text-sm font-medium text-fg">
                {row.dimension}
              </td>
              {row.values.map((value, colIndex) => (
                <td
                  key={`${row.dimension}-${colIndex}`}
                  className={cn(
                    "py-4 px-4 text-sm leading-relaxed",
                    colIndex === 0
                      ? "text-accent font-medium"
                      : "text-fg-secondary"
                  )}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Card Layout                                                 */
/* ------------------------------------------------------------------ */

function MobileCards() {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {ROWS.map((row) => (
        <motion.div
          key={row.dimension}
          variants={fadeUpItem}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-base text-fg mb-3">
            {row.dimension}
          </h3>

          <div className="flex flex-col gap-2.5">
            {PLATFORMS.map((platform, i) => (
              <div
                key={platform}
                className={cn(
                  "flex flex-col gap-0.5 rounded-xl px-3.5 py-2.5 text-sm",
                  i === 0
                    ? "bg-[var(--color-accent-dim)] border border-[var(--color-border-accent)]"
                    : "bg-[var(--color-bg-card)]"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    i === 0 ? "text-accent" : "text-fg-muted"
                  )}
                >
                  {platform}
                </span>
                <span
                  className={cn(
                    "leading-relaxed",
                    i === 0 ? "text-accent font-medium" : "text-fg-secondary"
                  )}
                >
                  {row.values[i]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ComparisonTable() {
  return (
    <section className="relative w-full px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {/* Section header */}
          <motion.div variants={fadeUpItem} className="text-center mb-14">
            <SectionLabel className="mb-5">Comparison</SectionLabel>

            <h2 className="heading-lg text-fg mb-4">
              How We{" "}
              <span className="gradient-text-accent">Compare</span>
            </h2>

            <p className="body-lg max-w-2xl mx-auto">
              Different approaches to proving you&apos;re human. Here&apos;s
              how they stack up.
            </p>
          </motion.div>

          {/* Glass card wrapper for desktop table */}
          <motion.div
            variants={fadeUpItem}
            className="glass-card rounded-2xl p-6 md:p-8 hidden md:block"
          >
            <DesktopTable />
          </motion.div>

          {/* Mobile card layout (outside glass wrapper) */}
          <MobileCards />
        </motion.div>
      </div>
    </section>
  );
}
