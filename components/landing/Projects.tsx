"use client";

import PopReveal from "@/components/ui/PopReveal";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

interface ValueCard {
  readonly title: string;
  readonly description: string;
}

const CARDS: readonly ValueCard[] = [
  {
    title: "Your presence is your proof",
    description:
      "In a world full of bots and fake accounts, prove something no one can fake: that you were actually there.",
  },
  {
    title: "Be somewhere. Prove it. Own it.",
    description:
      "Turn the simple act of being at a place into a verifiable digital record you control\u00A0\u2014\u00A0forever.",
  },
  {
    title: "Private by nature, not by promise",
    description:
      "We don\u2019t scan your body. We don\u2019t track your identity. We verify where you are\u00A0\u2014\u00A0that\u2019s all we need.",
  },
  {
    title: "Built for humans, not hardware",
    description:
      "No special devices. No eye scans. No fingerprint readers. Phone\u00A0+\u00A0internet\u00A0=\u00A0you\u2019re in.",
  },
] as const;

/** Stagger delay multiplier for PopReveal items */
const DELAY_STEP = 0.06;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function WhyChain() {
  return (
    <section className="relative w-full mx-auto px-6 py-24 text-fg">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        {/* Section heading */}
        <PopReveal delay={0}>
          <h2 className="heading-lg text-center">
            Why{" "}
            <span className="gradient-text-accent">7aychain</span>?
          </h2>
        </PopReveal>

        {/* Section description */}
        <PopReveal delay={DELAY_STEP}>
          <p className="text-fg-secondary text-lg leading-relaxed text-center max-w-3xl mt-0">
            In a world of bots and fake accounts, presence is the one thing
            that can&rsquo;t be faked.
          </p>
        </PopReveal>

        {/* 2-column value proposition grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {CARDS.map((card, i) => (
            <PopReveal key={card.title} delay={DELAY_STEP * (2 + i)}>
              <div className="glass-card glow-border p-6 md:p-8 flex flex-col gap-3 h-full">
                <h3 className="heading-sm text-fg">
                  {card.title}
                </h3>
                <p className="text-fg-secondary leading-relaxed">
                  {card.description}
                </p>
              </div>
            </PopReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
