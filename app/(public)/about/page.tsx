import type { Metadata } from "next";
import { PageHero, Section, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about 7ayLabs, the team building 7aychain — a Layer 1 blockchain with on-chain Proof of Presence where validators triangulate physical presence through network latency.",
};

const PRINCIPLES = [
  {
    title: "Reality over scale",
    description:
      "We optimize for truth, not volume. If a system cannot hold up under real-world conditions, it does not belong in production.",
  },
  {
    title: "Clarity over complexity",
    description:
      "Every system we build is designed to answer a simple question clearly: did this actually happen?",
  },
  {
    title: "Long-term trust",
    description:
      "We build slowly and deliberately, validating each layer before moving forward. Infrastructure that businesses can rely on.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="Who We Are"
        title="Our Story"
        description={[
          "Built to restore trust through real presence.",
          "Presence is the foundation for accountable systems.",
        ]}
      />

      <Section
        label="What We're Building"
        title="Our Mission"
        className="py-16 md:py-20"
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mt-6">
          <div className="space-y-5 text-white/55 leading-relaxed">
            <p>
              7ayLabs builds 7aychain, a Layer 1 blockchain with on-chain Proof
              of Presence. Validators form witness circles, measure network
              latency between peers, and triangulate positions &mdash; no GPS,
              no external oracles, no special hardware.
            </p>
            <p>
              When presence is optional or ignored, systems break down &mdash;
              processes become unreliable, trust erodes, and accountability
              disappears. Without a clear signal that someone was truly there,
              outcomes lose meaning.
            </p>
            <p>
              On 7aychain, every presence declaration goes through an epoch-bound
              lifecycle: declared, attested by witnesses, triangulated, and
              finalized by validators. This foundational layer underpins the
              integrity of digital coordination.
            </p>
          </div>
          <div className="space-y-5 text-white/55 leading-relaxed">
            <p>
              For businesses, presence-first infrastructure delivers measurable
              value &mdash; reducing fraud, streamlining compliance, and improving
              operational clarity. Workflows become more efficient, outcomes are
              auditable, and teams can trust the data.
            </p>
            <p>
              By anchoring digital actions to verified presence, organizations
              unlock new forms of accountability and coordination. This impact
              extends beyond technology: it transforms how people collaborate
              and how trust is established at every operational level.
            </p>
          </div>
        </div>
      </Section>

      <Section
        label="Our Long-Term View"
        title="Our Vision"
        className="py-16 md:py-20"
      >
        <div className="space-y-5 max-w-3xl text-white/55 leading-relaxed mt-2">
          <p>
            We envision a future where presence is a default system signal
            &mdash; embedded deeply in the architecture of digital ecosystems.
            Instead of being an afterthought, presence will be a primary data
            point that drives trust, access, and meaningful interaction.
          </p>
          <p>
            As AI and automation scale rapidly, distinguishing real human
            participation from synthetic behavior becomes critical. Systems
            without strong presence verification will be vulnerable to
            manipulation.
          </p>
          <p>
            7ayLabs is building 7aychain to support this long-term
            coordination, focusing on durable, foundational blockchain
            technology built on Substrate (Polkadot SDK) rather than chasing
            trends. Our goal is to enable systems that last.
          </p>
        </div>
      </Section>

      <Section
        label="How We Think"
        title="Principles that guide our work"
        className="py-16 md:py-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {PRINCIPLES.map((principle) => (
            <Card key={principle.title} variant="interactive" padding="lg">
              <h3 className="font-sans font-semibold text-lg text-white mb-3">
                {principle.title}
              </h3>
              <p className="body-base">
                {principle.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
