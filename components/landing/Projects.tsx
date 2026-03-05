"use client";

import PopReveal from "@/components/ui/PopReveal";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StatItem {
  readonly label: string;
  readonly description: string;
}

interface ColumnItem {
  readonly heading: string;
  readonly description: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const COLUMNS: readonly ColumnItem[] = [
  {
    heading: "Signal you can trust",
    description:
      "Proof of Presence turns real\u2011world participation into high\u2011quality signal. Platforms get cleaner data, stronger communities, and decisions backed by reality \u2014 not inflated metrics or synthetic behavior.",
  },
  {
    heading: "Secure by physical reality",
    description:
      "By tying access and incentives to physical presence, Proof of Presence adds a natural security layer against fraud, replay attacks, and synthetic behavior \u2014 while enabling efficient growth without burning capital.",
  },
] as const;

const STATS: readonly StatItem[] = [
  {
    label: "No Hardware Needed",
    description:
      "Unlike iris scanners or DePIN sensors, 7aychain uses existing network infrastructure. Any device, any validator.",
  },
  {
    label: "On-Chain Finality",
    description:
      "Presence attestations are finalized by validator quorum with commit\u2011reveal \u2014 not stored in a centralized database.",
  },
  {
    label: "Cryptoeconomic Security",
    description:
      "Validators stake $7AY and face slashing for dishonest triangulation. Manipulation costs real capital.",
  },
] as const;

/** Stagger delay multiplier for PopReveal items */
const DELAY_STEP = 0.06;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Projects() {
  return (
    <section className="relative w-full mx-auto px-6 py-24 text-fg">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        {/* Main heading */}
        <PopReveal delay={0}>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold leading-snug tracking-tight text-center mb-1">
            A human&#x2011;verified internet layer
          </h2>
        </PopReveal>

        {/* Main description */}
        <PopReveal delay={DELAY_STEP}>
          <p className="text-fg-secondary text-lg leading-relaxed text-center max-w-3xl mb-2 mt-0">
            Proof of Presence anchors digital systems to real human activity. It
            restores trust, reduces noise from automation, and enables scalable
            business models built on verified participation&nbsp;&mdash; not bots
            or synthetic engagement.
          </p>
        </PopReveal>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {COLUMNS.map((col, i) => (
            <div key={col.heading} className="flex flex-col gap-3 sm:gap-4">
              <PopReveal delay={DELAY_STEP * (3 + i * 2)}>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold">
                  {col.heading}
                </h3>
              </PopReveal>
              <PopReveal delay={DELAY_STEP * (4 + i * 2)}>
                <p className="text-fg-secondary leading-relaxed">
                  {col.description}
                </p>
              </PopReveal>
            </div>
          ))}
        </div>

        {/* Extra paragraph */}
        <PopReveal delay={DELAY_STEP * 7}>
          <p className="mt-6 text-center text-fg-secondary text-base leading-relaxed max-w-4xl">
            Beyond trust and security, Proof of Presence unlocks real&#x2011;world
            logistics and AI&#x2011;resilient systems&nbsp;&mdash; enabling fair
            access control, verifiable attendance, and human&#x2011;only
            participation in environments where automation and synthetic actors
            would otherwise dominate.
          </p>
        </PopReveal>

        {/* Stats section */}
        <div className="w-full max-w-4xl mt-6 flex flex-col gap-6">
          <div className="h-px w-full bg-[var(--color-border-primary)]" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex flex-col gap-2">
                <PopReveal delay={DELAY_STEP * (8 + i * 2)}>
                  <p className="text-sm tracking-wide text-fg-muted uppercase">
                    {stat.label}
                  </p>
                </PopReveal>
                <PopReveal delay={DELAY_STEP * (9 + i * 2)}>
                  <p className="text-fg-secondary text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </PopReveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
