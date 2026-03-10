"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  EyeOff,
  MapPin,
  Smartphone,
  ShieldCheck,
  Zap,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import { bentoStagger, bentoItem, fadeUpItem } from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FeatureCard {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CARDS: readonly FeatureCard[] = [
  {
    title: "No Scans Needed",
    description:
      "Prove you're a real person at a real place — without scanning your face, eyes, or fingerprints.",
    icon: EyeOff,
  },
  {
    title: "Location, Not Identity",
    description:
      "We verify where you are, not who you are — your personal information stays yours.",
    icon: MapPin,
  },
  {
    title: "Works on Any Device",
    description:
      "No special hardware, no apps to download — if you have internet, you're ready.",
    icon: Smartphone,
  },
  {
    title: "Bot-Proof by Design",
    description:
      "Bots can fake a click, but they can't fake being somewhere — 7aychain knows the difference.",
    icon: ShieldCheck,
  },
  {
    title: "Instant Verification",
    description:
      "Get verified in seconds, not days — no waiting for approvals or human reviewers.",
    icon: Zap,
  },
  {
    title: "You Own Your Proof",
    description:
      "Your presence verification lives on a public record you control — no company holds the keys.",
    icon: KeyRound,
  },
] as const;

/**
 * Bento grid span classes per card index.
 * Cards 0 and 3 span 2 columns on lg for asymmetric layout.
 */
const CARD_SPANS: Record<number, string> = {
  0: "lg:col-span-2",
  3: "lg:col-span-2",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function KeyFeatures() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative w-full px-6 md:px-12 py-24 md:py-32"
      aria-labelledby="key-features-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={shouldReduceMotion ? undefined : bentoStagger}
        >
          {/* Section label */}
          <motion.div
            variants={shouldReduceMotion ? undefined : fadeUpItem}
            className="flex justify-center mb-4"
          >
            <SectionLabel>Why 7aychain</SectionLabel>
          </motion.div>

          {/* Main heading */}
          <motion.h2
            id="key-features-heading"
            variants={shouldReduceMotion ? undefined : fadeUpItem}
            className="font-display font-bold text-3xl md:text-4xl text-fg text-center mb-4"
          >
            What Makes 7aychain{" "}
            <span className="gradient-text-accent">Different</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={shouldReduceMotion ? undefined : fadeUpItem}
            className="text-fg-secondary text-lg leading-relaxed text-center max-w-2xl mx-auto mb-16"
          >
            A new kind of verification — built on physics, not promises.
          </motion.p>

          {/* Asymmetric bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {CARDS.map((card, i) => (
              <motion.article
                key={card.title}
                variants={shouldReduceMotion ? undefined : bentoItem}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { scale: 1.015, transition: { duration: 0.25 } }
                }
                className={`glass-card glow-border p-6 md:p-8 group relative rounded-2xl ${CARD_SPANS[i] ?? ""}`}
              >
                {/* Icon container */}
                <div className="mb-5 flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-accent-dim)] transition-all duration-300 group-hover:bg-[var(--color-accent-primary)]/20 group-hover:shadow-glow-sm">
                  <card.icon
                    className="w-5 h-5 text-[var(--color-accent-primary)] transition-colors duration-300 group-hover:text-[var(--color-accent-primary)]"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-lg text-fg mb-2 tracking-tight">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-fg-secondary text-sm leading-relaxed">
                  {card.description}
                </p>

                {/* Inner glow overlay on hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse at 30% 0%, rgba(23,142,119,0.08) 0%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
