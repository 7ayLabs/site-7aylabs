import type { Metadata } from "next";
import { PageHero, Section, Card, Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "Discover how Proof of Presence turns real-world presence into actionable signal across events, spaces, communities, and operations.",
  keywords: ["presence verification use cases", "Sybil resistant airdrops", "event attendance blockchain", "anti-bot verification", "DePIN location proof", "human verification DeFi"],
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
      "Validate real attendance and participation. No inflated numbers, no fake engagement -- just people who actually showed up.",
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
      "Capture real visit data and campaign participation with signals that cannot be farmed or spoofed.",
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
      "Presence-based signals resist bots, scripts, and automation by design. If it did not happen in the real world, it does not count.",
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
        description="Proof of Presence turns real-world presence into something products can trust, measure, and act on -- across events, spaces, communities, and operations where showing up actually matters."
      />

      <Section className="py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h2 className="heading-sm text-fg mb-4">
              Show up. That&apos;s the signal.
            </h2>
            <div className="space-y-5 text-fg-tertiary leading-relaxed">
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
            </div>
          </div>
          <div>
            <h2 className="heading-sm text-fg mb-4">
              Built for real-world coordination
            </h2>
            <div className="space-y-5 text-fg-tertiary leading-relaxed">
              <p>
                Proof of Presence works wherever people move through the physical
                world &mdash; events, cities, campuses, retail, fleets, and
                shared spaces.
              </p>
              <p>
                Teams can unlock access, actions, or workflows only when people
                are actually present &mdash; a coordination layer grounded in
                reality.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24">
        <div className="text-center mb-16">
          <span className="label-sm block mb-4">
            Applications
          </span>
          <h2 className="heading-md text-fg mb-4">
            Where Presence Works
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Concrete scenarios where Proof of Presence solves real problems in
            early-stage products, pilots, and real-world operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20 max-w-4xl mx-auto">
          {SIGNAL_CARDS.map((card) => (
            <Card key={card.title} variant="interactive" padding="md">
              <h3 className="font-sans font-semibold text-base text-fg mb-1.5">
                {card.title}
              </h3>
              <p className="text-fg-muted text-sm leading-relaxed">
                {card.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {USE_CASE_AREAS.map((area) => (
            <div key={area.title}>
              <h3 className="font-sans font-semibold text-lg text-fg mb-3">
                {area.title}
              </h3>
              <p className="body-base">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-16 md:py-20">
        <span className="label-sm block mb-4">
          Getting started
        </span>
        <h2 className="heading-md text-fg mb-4">
          Built to start small
        </h2>
        <p className="body-lg max-w-2xl mb-12">
          Proof of Presence is designed for early pilots and real-world testing
          &mdash; clear signals, minimal setup, and no unnecessary complexity.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {BUILD_FEATURES.map((feature) => (
            <Card key={feature.title} variant="default" padding="lg">
              <h3 className="font-sans font-semibold text-lg text-fg mb-3">
                {feature.title}
              </h3>
              <p className="body-base">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section centered className="py-20 md:py-28">
        <h2 className="heading-md text-fg mb-6">
          Start with presence
        </h2>
        <p className="body-lg max-w-2xl mx-auto mb-10">
          We&apos;re opening early access for teams exploring real-world
          presence as a product signal. Small pilots, real environments, clear
          feedback.
        </p>
        <Button href={ROUTES.waitlist} size="lg">
          Join the waitlist
        </Button>
        <p className="text-fg-faint text-sm max-w-xl mx-auto mt-4">
          Early pilots only. No hype &mdash; just real signals, tested in the
          field.
        </p>
      </Section>
    </>
  );
}
