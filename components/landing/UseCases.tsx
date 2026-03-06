"use client";

import { motion } from "framer-motion";
import {
  Gift,
  Ticket,
  Store,
  Vote,
  Truck,
  Star,
  HeartPulse,
  DoorOpen,
  type LucideIcon,
} from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import {
  bentoStagger,
  bentoItem,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface UseCase {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

const USE_CASES: readonly UseCase[] = [
  {
    title: "Fair Token Drops",
    description:
      "Rewards go to real people, not bots farming thousands of accounts.",
    icon: Gift,
  },
  {
    title: "Event Ticketing",
    description:
      "Prove you attended and earn perks for being there.",
    icon: Ticket,
  },
  {
    title: "Local Business Rewards",
    description:
      "Earn loyalty points just by walking in \u2014 no apps to open.",
    icon: Store,
  },
  {
    title: "Fair Voting",
    description:
      "Every vote from a real, unique person \u2014 no one votes twice.",
    icon: Vote,
  },
  {
    title: "Anti-Fraud Deliveries",
    description:
      "Confirm drivers actually arrived at the right place.",
    icon: Truck,
  },
  {
    title: "Verified Reviews",
    description:
      "Only people who visited can review \u2014 ending fake review farms.",
    icon: Star,
  },
  {
    title: "Emergency Check-Ins",
    description:
      "Prove you\u2019re safe at a shelter \u2014 no ID or paperwork needed.",
    icon: HeartPulse,
  },
  {
    title: "Attendance-Based Access",
    description:
      "Unlock content by proving you showed up in real life.",
    icon: DoorOpen,
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */

function UseCaseCard({ useCase }: { useCase: UseCase }) {
  const Icon = useCase.icon;

  return (
    <motion.div
      variants={bentoItem}
      className="glass-card glow-border p-6 group rounded-2xl relative overflow-hidden"
    >
      {/* Hover glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 15%, var(--color-accent-dim), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-[1]">
        {/* Icon container */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-dim)] mb-4">
          <Icon
            className="h-5 w-5 text-accent"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <h3 className="font-display font-semibold text-lg text-fg mb-2">
          {useCase.title}
        </h3>

        <p className="text-fg-secondary text-sm leading-relaxed">
          {useCase.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function UseCases() {
  return (
    <section className="relative w-full px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={bentoStagger}
        >
          {/* Section header */}
          <motion.div variants={fadeUpItem} className="text-center mb-14">
            <SectionLabel className="mb-5">Real-World Applications</SectionLabel>

            <h2 className="heading-lg text-fg mb-4">
              Where{" "}
              <span className="gradient-text-accent">Presence</span>{" "}
              Matters
            </h2>

            <p className="body-lg max-w-2xl mx-auto">
              From fair voting to verified reviews &mdash; proof of presence
              changes how the real world connects to the digital one.
            </p>
          </motion.div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {USE_CASES.map((useCase) => (
              <UseCaseCard key={useCase.title} useCase={useCase} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
