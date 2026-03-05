"use client";

import PopReveal from "@/components/ui/PopReveal";

const PILLARS = [
  {
    title: "Signal you can trust",
    description:
      "Proof of Presence turns real-world participation into high-quality signal. Platforms get cleaner data, stronger communities, and decisions backed by reality \u2014 not inflated metrics or synthetic behavior.",
  },
  {
    title: "Secure by physical reality",
    description:
      "By tying access and incentives to physical presence, Proof of Presence adds a natural security layer against fraud, replay attacks, and synthetic behavior \u2014 while enabling efficient growth without burning capital.",
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
      "Rewards, access, and logistics scale with real usage \u2014 not inflated demand or automated abuse.",
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
      className="relative w-full mx-auto px-6 py-24 text-white"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        <PopReveal>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold leading-snug tracking-tight text-center mb-1">
            A human-verified internet layer
          </h2>
        </PopReveal>

        <PopReveal delay={0.08}>
          <p className="text-white/65 text-lg leading-relaxed text-center max-w-3xl mb-2 mt-0">
            7aychain anchors digital systems to real human activity through
            on-chain Proof of Presence. Validators triangulate physical presence
            via network latency &mdash; restoring trust and enabling scalable
            systems built on verified participation.
          </p>
        </PopReveal>

        {/* Two-column pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {PILLARS.map((pillar, i) => (
            <div key={pillar.title} className="flex flex-col gap-3 sm:gap-4">
              <PopReveal delay={0.16 + i * 0.12}>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold">
                  {pillar.title}
                </h3>
              </PopReveal>
              <PopReveal delay={0.22 + i * 0.12}>
                <p className="text-white/65 leading-relaxed">
                  {pillar.description}
                </p>
              </PopReveal>
            </div>
          ))}
        </div>

        <PopReveal delay={0.4}>
          <p className="mt-6 text-center text-white/60 text-base leading-relaxed max-w-4xl">
            Beyond trust and security, Proof of Presence unlocks real-world
            logistics and AI-resilient systems &mdash; enabling fair access
            control, verifiable attendance, and human-only participation in
            environments where automation and synthetic actors would otherwise
            dominate.
          </p>
        </PopReveal>

        {/* Bottom facets */}
        <div className="w-full max-w-4xl mt-6 flex flex-col gap-6">
          <div aria-hidden="true" className="h-px w-full bg-white/10" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            {FACETS.map((facet, i) => (
              <div key={facet.label} className="flex flex-col gap-2">
                <PopReveal delay={0.46 + i * 0.06}>
                  <p className="text-sm tracking-wide text-white/40 uppercase">
                    {facet.label}
                  </p>
                </PopReveal>
                <PopReveal delay={0.5 + i * 0.06}>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {facet.description}
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
