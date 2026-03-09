"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { slideInLeft, slideInRight } from "@/lib/constants/animations";

/* ------------------------------------------------------------------ */
/*  Card data — accurate to the 7aychain protocol                      */
/* ------------------------------------------------------------------ */

interface ValueCard {
  readonly title: string;
  readonly description: string;
  readonly accent: string;
  readonly iconDark: string;
  readonly iconLight: string;
  readonly iconAlt: string;
}

const CARDS: readonly ValueCard[] = [
  {
    title: "Physics Over Biometrics",
    description:
      "No iris scans. No fingerprints. Validators measure network latency and signal timing to verify you\u2019re physically present\u00A0\u2014\u00A0physics that bots can\u2019t fake.",
    accent: "#00FFC6",
    iconDark: "/icons/dark/card-physics.png",
    iconLight: "/icons/light/card-physics.png",
    iconAlt: "Signal wave with measurement nodes",
  },
  {
    title: "Commit\u2011Reveal Privacy Architecture",
    description:
      "Your secret never touches the chain. Commit a hash, reveal later. Nullifiers prevent replay across epochs. ZK proofs let you prove presence without exposing identity.",
    accent: "#C084FC",
    iconDark: "/icons/dark/card-privacy.png",
    iconLight: "/icons/light/card-privacy.png",
    iconAlt: "Lock with zero-knowledge proof rings",
  },
  {
    title: "Autonomous Sybil Scoring",
    description:
      "The autonomous pallet scores every actor 0\u2013100 on behavioral patterns. No CAPTCHAs, no orbs\u00A0\u2014\u00A0the protocol separates humans from machines automatically.",
    accent: "#00FFC6",
    iconDark: "/icons/dark/card-botproof.png",
    iconLight: "/icons/light/card-botproof.png",
    iconAlt: "Shield with human verification checkmark",
  },
  {
    title: "Presence\u2011Weighted Governance",
    description:
      "Capability-based permissions, not token voting. Delegations cascade up to 5 levels deep. Revoke a root capability and every child revokes with it\u00A0\u2014\u00A0all on-chain.",
    accent: "#22D3EE",
    iconDark: "/icons/dark/card-governance.png",
    iconLight: "/icons/light/card-governance.png",
    iconAlt: "Delegation tree with capability nodes",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const VIEWPORT = { once: true, margin: "200px 0px 0px 0px" } as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function WhyChain() {
  const { theme } = useTheme();

  return (
    <section className="relative w-full py-24 md:py-32">
      <motion.div
        className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {/* Section heading */}
        <motion.div variants={fadeUp} className="text-center mb-16 md:mb-20">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-fg mb-5">
            Why{" "}
            <span className="gradient-text-accent">7aychain</span>?
          </h2>
          <p className="text-fg-secondary text-lg leading-relaxed max-w-2xl mx-auto">
            Every other chain trusts cryptography alone. 7aychain anchors identity to physical reality&nbsp;&mdash;
            the one primitive AI, bots, and Sybil farms cannot forge.
          </p>
        </motion.div>

        {/* 2x2 grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-y-14 gap-x-12 md:gap-x-16 max-w-4xl mx-auto"
          variants={stagger}
        >
          {CARDS.map((card, i) => {
            const iconSrc = theme === "light" ? card.iconLight : card.iconDark;
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={card.title}
                variants={isLeft ? slideInLeft : slideInRight}
                className="flex flex-col items-start"
              >
                {/* Icon */}
                <div className="mb-5">
                  <Image
                    src={iconSrc}
                    alt={card.iconAlt}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-lg md:text-xl text-fg mb-2 leading-snug">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-fg-secondary leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
