import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, Card } from "@/components/ui";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "Discover how Proof of Presence turns real-world presence into actionable signal across events, spaces, communities, and operations.",
};

const SIGNAL_CARDS = [
  {
    title: "Pilot-ready",
    description:
      "Built to test real-world assumptions fast, without heavy infrastructure.",
  },
  {
    title: "Bot-resistant",
    description:
      "Presence signals grounded in reality, not accounts or behavior models.",
  },
  {
    title: "Low overhead",
    description:
      "Designed for lightweight deployments and early operational scale.",
  },
  {
    title: "Privacy-first",
    description:
      "Verifies presence without identities, tracking, or surveillance.",
  },
] as const;

const USE_CASE_AREAS = [
  {
    title: "Live events",
    description:
      "Validate real attendance and participation. No inflated numbers, no fake engagement — just people who actually showed up.",
  },
  {
    title: "Physical spaces",
    description:
      "Understand real space usage and access patterns without manual check-ins or invasive tracking.",
  },
  {
    title: "Mobility ops",
    description:
      "Confirm task completion through verified human presence at the right place and time.",
  },
  {
    title: "Communities",
    description:
      "Measure participation based on presence, not wallets, rewards, or speculative incentives.",
  },
  {
    title: "Retail & brands",
    description:
      "Capture real visit data and campaign participation with signals that can't be farmed or spoofed.",
  },
  {
    title: "Public programs",
    description:
      "Track civic participation and engagement using privacy-preserving, human-verified presence data.",
  },
] as const;

const BUILD_FEATURES = [
  {
    title: "Real people",
    description:
      "Participation only counts when someone physically shows up. No accounts to game, no fake engagement to inflate.",
  },
  {
    title: "Hard to fake",
    description:
      "Presence-based signals resist bots, scripts, and automation by design. If it didn't happen in the real world, it doesn't count.",
  },
  {
    title: "Easy to test",
    description:
      "Built for MVPs: lightweight deployment, fast iteration, and clear feedback from real-world usage.",
  },
] as const;

export default function UseCasesPage() {
  return (
    <>
      <PageHero
        label="Use Cases"
        title="From Presence to Action"
        description="Proof of Presence turns real-world presence into something products can trust, measure, and act on — across events, spaces, communities, and operations where showing up actually matters."
      />

      {/* Core Use Cases */}
      <Section maxWidth="6xl" className="pb-24 md:pb-36">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <h2 className="font-serif font-bold text-xl md:text-2xl text-white mb-4">
              Show up. That&apos;s the signal.
            </h2>
            <div className="space-y-6 text-white/60 leading-relaxed">
              <p>
                Most platforms rely on accounts, clicks, or inferred behavior. At
                scale, those signals break &mdash; bots inflate numbers, farms
                game incentives, and trust disappears.
              </p>
              <p>
                Proof of Presence changes the rule: actions only matter when a
                real person physically shows up. No fake engagement, no simulated
                activity, no guessing who&apos;s real.
              </p>
              <p>
                If something happened, someone was there. That&apos;s the
                advantage &mdash; simple, verifiable, and hard to exploit.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif font-bold text-xl md:text-2xl text-white mb-4">
              Built for real-world coordination
            </h2>
            <div className="space-y-6 text-white/60 leading-relaxed">
              <p>
                Proof of Presence works wherever people move through the physical
                world &mdash; events, cities, campuses, retail, fleets, and
                shared spaces.
              </p>
              <p>
                Teams can unlock access, actions, or workflows only when people
                are actually present &mdash; visiting a place, attending an
                event, or completing something on-site.
              </p>
              <p>
                The result is a coordination layer grounded in reality:
                lightweight to deploy, easy to integrate, and resilient against
                automation at scale.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Where Presence Works */}
      <Section maxWidth="6xl" className="pb-24 md:pb-40">
        <div className="text-center mb-20">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-4">
            Where Presence Works
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Concrete scenarios where Proof of Presence solves real problems in
            early-stage products, pilots, and real-world operations.
          </p>
        </div>

        {/* Signal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-24 max-w-4xl mx-auto">
          {SIGNAL_CARDS.map((card) => (
            <Card key={card.title} variant="outline" padding="md">
              <div className="text-sm font-serif font-bold mb-1">
                {card.title}
              </div>
              <div className="text-white/50 text-xs leading-tight">
                {card.description}
              </div>
            </Card>
          ))}
        </div>

        {/* Use case areas */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {USE_CASE_AREAS.map((area) => (
            <div key={area.title}>
              <h3 className="font-serif font-bold text-xl text-white mb-4">
                {area.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Built to start small */}
      <Section maxWidth="6xl" className="pb-24 md:pb-40">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-4">
          Built to start small
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mb-16">
          Proof of Presence is designed for early pilots and real-world testing
          &mdash; clear signals, minimal setup, and no unnecessary complexity.
        </p>

        <div className="space-y-14">
          {BUILD_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="grid md:grid-cols-[260px_1fr] gap-8"
            >
              <h3 className="font-serif font-bold text-xl text-white">
                {feature.title}
              </h3>
              <p className="text-white/60 leading-relaxed max-w-3xl">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Closing */}
      <Section maxWidth="6xl" className="pb-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
              Built for real products
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Proof of Presence is designed to live inside real products &mdash;
              not as a concept, but as a practical signal teams can rely on from
              day one.
            </p>
            <p className="text-white/60 leading-relaxed">
              By anchoring actions to physical presence, products gain cleaner
              data, stronger coordination, and trust that doesn&apos;t collapse
              at scale.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
              What comes next
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              7ayLabs is starting with focused pilots and real-world deployments
              &mdash; learning where presence matters most and how teams actually
              use it.
            </p>
            <p className="text-white/60 leading-relaxed">
              The goal is simple: prove the signal, refine the protocol, and
              expand from real use into scalable infrastructure for
              human-verified systems.
            </p>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section centered className="pt-12 md:pt-16 pb-20 md:pb-28">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
          Start with presence
        </h2>
        <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          We&apos;re opening early access for teams exploring real-world
          presence as a product signal. Small pilots, real environments, clear
          feedback.
        </p>
        <Link
          href={ROUTES.waitlist}
          className="inline-flex items-center justify-center rounded-full px-10 py-4 min-h-[44px] bg-white text-black font-medium hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark transition-colors duration-normal"
        >
          Join the waitlist
        </Link>
        <p className="text-white/40 text-sm max-w-xl mx-auto mt-4">
          Early pilots only. No hype &mdash; just real signals, tested in the
          field.
        </p>
      </Section>
    </>
  );
}
