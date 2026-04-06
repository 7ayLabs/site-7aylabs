"use client";

import { memo } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Gift,
  Ticket,
  Store,
  Vote,
  Star,
  HeartPulse,
  Wallet,
  Package,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

const SLUG_ICONS: Record<string, LucideIcon> = {
  "fair-drops": Gift,
  "event-proof": Ticket,
  "local-rewards": Store,
  "fair-voting": Vote,
  "verified-reviews": Star,
  "emergency-checkin": HeartPulse,
  "presence-defi": Wallet,
  "delivery-proof": Package,
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const VIEWPORT = { once: true, margin: "-60px" } as const;

interface AppCard {
  slug: string;
  name: string;
  description: string;
}

const MarqueeCard = memo(function MarqueeCard({ app }: { app: AppCard }) {
  const Icon = SLUG_ICONS[app.slug] ?? Sparkles;
  return (
    <Link
      href={`/use-cases/${app.slug}`}
      prefetch={false}
      aria-label={app.name}
      className="group border border-[var(--color-border-primary)] hover:border-[var(--color-border-hover)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-5 min-w-[220px] w-[220px] flex-shrink-0 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-dim)] mb-3 transition-colors duration-300 group-hover:bg-[var(--color-accent-primary)]/20">
        <Icon
          className="h-4 w-4 text-fg-muted group-hover:text-accent transition-colors duration-300"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
      <h3 className="font-display font-semibold text-sm text-fg mb-1 group-hover:text-accent transition-colors duration-300">
        {app.name}
      </h3>
      <p className="text-xs text-fg-tertiary leading-relaxed">
        {app.description}
      </p>
    </Link>
  );
});

interface MarqueeRowProps {
  readonly items: readonly AppCard[];
  readonly direction: "left" | "right";
  readonly duration: number;
  readonly rowKey: string;
}

const MarqueeRow = memo(function MarqueeRow({
  items,
  direction,
  duration,
  rowKey,
}: MarqueeRowProps) {
  const animationName = direction === "left" ? "marqueeLeft" : "marqueeRight";
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex gap-3 marquee-track"
        style={{
          animation: `${animationName} ${duration}s linear infinite`,
          width: "max-content",
        }}
      >
        {/* First set */}
        {items.map((app) => (
          <MarqueeCard key={`${rowKey}-a-${app.slug}`} app={app} />
        ))}
        {/* Duplicate set for seamless loop */}
        {items.map((app) => (
          <MarqueeCard key={`${rowKey}-b-${app.slug}`} app={app} />
        ))}
      </div>
    </div>
  );
});

export default function Ecosystem() {
  const t = useTranslations("ecosystem");
  const apps = Object.values(t.raw("apps")) as AppCard[];

  // Split 8 unique apps into 2 non-overlapping rows of 4 — no repeats across rows
  const row1 = apps.slice(0, 4);
  const row2 = apps.slice(4, 8);

  return (
    <section className="relative w-full py-20 md:py-28">
      <motion.div
        className="max-w-5xl mx-auto px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <p className="text-[11px] tracking-[0.15em] uppercase text-fg-muted mb-3">
            {t("label")}
          </p>
          <h2 className="font-display font-bold text-2xl md:text-4xl tracking-tight text-fg mb-4">
            {t("title")}{" "}
            <span className="gradient-text-accent">{t("titleAccent")}</span>
          </h2>
          <p className="text-base text-fg-tertiary max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 2-row infinite marquee — 8 unique apps, 4 per row, GPU-accelerated */}
        <motion.div
          variants={fadeUp}
          className="relative flex flex-col gap-3 rounded-xl overflow-hidden"
        >
          <MarqueeRow items={row1} direction="left" duration={38} rowKey="r1" />
          <MarqueeRow items={row2} direction="right" duration={44} rowKey="r2" />

          {/* Edge fades across both rows */}
          <div
            className="pointer-events-none absolute top-0 left-0 bottom-0 w-12 sm:w-16 z-10"
            style={{
              background:
                "linear-gradient(to right, var(--color-bg-primary), transparent)",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 sm:w-16 z-10"
            style={{
              background:
                "linear-gradient(to left, var(--color-bg-primary), transparent)",
            }}
            aria-hidden="true"
          />
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-center mt-8">
          <Button href="/use-cases" variant="secondary" size="sm" withArrow>
            {t("cta")}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
