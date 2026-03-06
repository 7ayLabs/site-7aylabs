import type { Metadata } from "next";
import { PageHero, Section, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about 7ayLabs, the team building 7aychain — a Layer 1 blockchain with on-chain Proof of Presence where validators triangulate physical presence through network latency.",
  keywords: ["7ayLabs team", "blockchain company", "presence layer builders", "7aychain creators", "Web3 infrastructure team"],
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
        accentWords={["Story"]}
        description={[
          "We started 7ayLabs with a simple question: what if you could prove you were somewhere without revealing who you are?",
          "That question became 7aychain — a network that verifies presence using the physics of the internet itself.",
        ]}
      />

      <Section
        label="What We're Building"
        title="Our Mission"
        className="py-20 md:py-28"
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mt-6">
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>
              7ayLabs builds 7aychain, a new kind of blockchain. Instead of
              scanning your eyes or asking for ID, our network verifies that
              you&apos;re physically present at a location &mdash; using nothing
              more than your internet connection.
            </p>
            <p>
              Validators across the network measure connection timing to confirm
              your location. No GPS. No cameras. No special hardware.
            </p>
            <p>
              When the world can&apos;t tell real people from bots, presence
              becomes the most valuable signal. We&apos;re building the
              infrastructure to make that signal available to everyone.
            </p>
          </div>
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>
              For businesses, this means fraud drops, compliance gets simpler,
              and every process that depends on &ldquo;was this person actually
              here?&rdquo; finally gets a reliable answer.
            </p>
            <p>
              For people, it means proving you were somewhere without handing
              over your identity. No surveillance. No data harvesting. Just
              proof.
            </p>
          </div>
        </div>
      </Section>

      <Section
        label="Our Long-Term View"
        title="Our Vision"
        className="py-20 md:py-28"
      >
        <div className="space-y-5 max-w-3xl text-fg-tertiary leading-relaxed mt-2">
          <p>
            We see a future where &ldquo;being there&rdquo; is a first-class
            digital signal &mdash; not an afterthought. As AI gets better at
            faking everything else, physical presence becomes the one thing that
            can&apos;t be simulated.
          </p>
          <p>
            7ayLabs is building the infrastructure for that future. Slowly,
            carefully, and with the kind of rigor that real-world systems demand.
          </p>
        </div>
      </Section>

      <Section
        label="How We Think"
        title="Principles that guide our work"
        className="py-20 md:py-28"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {PRINCIPLES.map((principle) => (
            <Card key={principle.title} variant="interactive" padding="lg">
              <h3 className="font-sans font-semibold text-lg text-fg mb-3">
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
