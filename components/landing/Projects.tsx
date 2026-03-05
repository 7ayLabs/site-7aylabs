"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import Card from "@/components/ui/Card";

const PILLARS = [
  {
    title: "Signal you can trust",
    description:
      "Proof of Presence turns real-world participation into high-quality signal. Platforms get cleaner data, stronger communities, and decisions backed by reality -- not inflated metrics or synthetic behavior.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Secure by physical reality",
    description:
      "By tying access and incentives to physical presence, Proof of Presence adds a natural security layer against fraud, replay attacks, and synthetic behavior -- while enabling efficient growth without burning capital.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
] as const;

const FACETS = [
  {
    label: "Presence as Signal",
    description:
      "Real participation becomes a first-class input for products, governance, and incentive systems.",
  },
  {
    label: "Operational Efficiency",
    description:
      "Rewards, access, and logistics scale with real usage -- not inflated demand or automated abuse.",
  },
  {
    label: "AI-Resilient Systems",
    description:
      "Physical presence introduces friction that synthetic agents cannot easily replicate or fake.",
  },
] as const;

export default function Projects() {
  return (
    <section
      aria-label="Projects and vision"
      className="relative w-full section-padding"
    >
      <div className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="flex flex-col items-center"
        >
          <motion.span
            variants={fadeUpItem}
            className="label-sm block mb-4"
          >
            The Vision
          </motion.span>

          <motion.h2
            variants={fadeUpItem}
            className="heading-lg text-center mb-6"
          >
            A human-verified internet layer
          </motion.h2>

          <motion.p
            variants={fadeUpItem}
            className="body-lg text-center max-w-3xl mb-16"
          >
            7aychain anchors digital systems to real human activity through
            on-chain Proof of Presence. Validators triangulate physical presence
            via network latency -- restoring trust and enabling scalable
            systems built on verified participation.
          </motion.p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-16">
            {PILLARS.map((pillar) => (
              <motion.div key={pillar.title} variants={fadeUpItem}>
                <Card variant="elevated" padding="lg" className="h-full">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-5">
                    {pillar.icon}
                  </div>
                  <h3 className="heading-sm text-white mb-4">
                    {pillar.title}
                  </h3>
                  <p className="body-base">
                    {pillar.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.p
            variants={fadeUpItem}
            className="text-center text-white/45 text-base leading-relaxed max-w-4xl mb-16"
          >
            Beyond trust and security, Proof of Presence unlocks real-world
            logistics and AI-resilient systems -- enabling fair access control,
            verifiable attendance, and human-only participation in environments
            where automation and synthetic actors would otherwise dominate.
          </motion.p>

          {/* Bottom facets */}
          <div className="w-full">
            <div aria-hidden="true" className="h-px w-full bg-white/[0.06] mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {FACETS.map((facet) => (
                <motion.div
                  key={facet.label}
                  variants={fadeUpItem}
                  className="flex flex-col gap-3"
                >
                  <span className="text-xs tracking-widest text-accent uppercase font-medium">
                    {facet.label}
                  </span>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {facet.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
