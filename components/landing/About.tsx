"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import Card from "@/components/ui/Card";

const VALUE_PROPS = [
  {
    title: "People, not bots",
    description:
      "Real users only. Presence replaces fake traffic with verified human participation. Every interaction is backed by reality.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="14" cy="10" r="5" />
        <path d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10" />
      </svg>
    ),
  },
  {
    title: "Real growth",
    description:
      "Engagement tied to physical presence. Value is earned by showing up, not gamed by scripts or automation at scale.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 22l6-8 5 4 9-14" />
        <path d="M20 4h4v4" />
      </svg>
    ),
  },
  {
    title: "Verified on-chain",
    description:
      "Validators form witness circles and triangulate presence through network latency. No GPS, no oracles. Just protocol-native verification.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2l10 5v7c0 5.25-4.25 10.15-10 11.5C8.25 24.15 4 19.25 4 14V7l10-5z" />
        <path d="M10 14l3 3 5-6" />
      </svg>
    ),
  },
] as const;

export default function About() {
  return (
    <section aria-label="Why 7aychain" className="relative w-full section-padding">
      {/* Subtle divider */}
      <div className="section-container">
        <div className="h-px w-full bg-white/[0.06] mb-20 md:mb-28" aria-hidden="true" />
      </div>

      <div className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <motion.span
            variants={fadeUpItem}
            className="label-sm block mb-4 text-center"
          >
            Why 7aychain
          </motion.span>
          <motion.h2
            variants={fadeUpItem}
            className="heading-lg text-white text-center mb-5"
          >
            Presence as infrastructure
          </motion.h2>
          <motion.p
            variants={fadeUpItem}
            className="body-lg text-center max-w-2xl mx-auto mb-16"
          >
            A blockchain where showing up is the foundational signal for trust,
            access, and coordination.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUE_PROPS.map((item) => (
              <motion.div key={item.title} variants={fadeUpItem}>
                <Card
                  variant="interactive"
                  padding="lg"
                  className="h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent/15 transition-colors duration-normal">
                    {item.icon}
                  </div>
                  <h3 className="heading-sm text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="body-base">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
