import type { Metadata } from "next";
import { PageHero, Section, Card, Button } from "@/components/ui";
import { EXTERNAL_LINKS, ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Why Presence",
  description:
    "The internet lost the human signal. Learn why 7aychain uses physics-based Proof of Presence for Sybil resistance instead of biometrics, and how it compares to Worldcoin, BrightID, and Gitcoin Passport.",
  keywords: [
    "why presence matters",
    "Sybil resistance",
    "bot prevention blockchain",
    "human verification",
    "proof of humanity alternative",
    "AI resistant verification",
    "Worldcoin alternative",
    "BrightID comparison",
  ],
};

const PRESENCE_PILLARS = [
  {
    title: "Physics, not biometrics",
    description:
      "Network latency is constrained by the speed of light. 7aychain uses this physical limit to triangulate presence -- no iris scans, no selfies, no hardware.",
  },
  {
    title: "One place at a time",
    description:
      "A single person can create unlimited wallets, but they can only be physically present in one location. This is the fundamental constraint that makes Sybil attacks expensive.",
  },
  {
    title: "Disposable verification",
    description:
      "Each presence attestation is contextual and epoch-bound. No persistent identity, no behavioral profile, no data extraction. Prove you were here, then forget.",
  },
] as const;

const COMPARISON_TABLE = [
  {
    dimension: "Method",
    sevenychain: "Network latency triangulation",
    worldcoin: "Iris biometric scan",
    brightid: "Social graph analysis",
    passport: "Credential aggregation",
  },
  {
    dimension: "Hardware Required",
    sevenychain: "None (existing network)",
    worldcoin: "Custom Orb device",
    brightid: "None",
    passport: "None",
  },
  {
    dimension: "Biometrics",
    sevenychain: "No",
    worldcoin: "Yes (iris)",
    brightid: "No",
    passport: "No",
  },
  {
    dimension: "Privacy Model",
    sevenychain: "ZK proofs, no persistent identity",
    worldcoin: "Iris hash stored, World ID",
    brightid: "Social graph visible",
    passport: "Credential history visible",
  },
  {
    dimension: "What It Proves",
    sevenychain: "Physical presence at a location",
    worldcoin: "Unique human (biometric)",
    brightid: "Social vouching (human network)",
    passport: "Activity history (credentials)",
  },
  {
    dimension: "Chain",
    sevenychain: "7aychain (Substrate L1)",
    worldcoin: "Optimism (L2)",
    brightid: "IDChain / multi-chain",
    passport: "Multi-chain (off-chain scoring)",
  },
  {
    dimension: "Stage",
    sevenychain: "Devnet (v0.8.26)",
    worldcoin: "Mainnet",
    brightid: "Mainnet",
    passport: "Mainnet",
  },
] as const;

const SYBIL_ARGUMENTS = [
  {
    problem: "Bots generate behavior at scale",
    response:
      "AI can produce text, transactions, and social interactions. But generating physical presence across multiple locations simultaneously is constrained by physics.",
  },
  {
    problem: "Multi-accounting is trivially easy",
    response:
      "Creating wallets costs nothing. Being physically present in multiple places at once is impossible. Proof of Presence converts an economic problem into a physical one.",
  },
  {
    problem: "Biometric systems create surveillance risk",
    response:
      "Iris scans and facial recognition create persistent identity databases. Network latency measurement leaves no biometric trace and requires no special hardware.",
  },
  {
    problem: "Social graphs can be manufactured",
    response:
      "Social vouching systems are vulnerable to coordinated Sybil rings. Physical presence is independently verifiable by validator triangulation without trust assumptions.",
  },
] as const;

export default function WhyPresencePage() {
  return (
    <>
      <PageHero
        label="Why Presence"
        title="The Internet Lost the Human Signal"
        description="Digital systems were built for people -- but today they are dominated by bots, automation, and synthetic activity at scale. Proof of Presence restores the missing signal."
      />

      <Section title="Presence Infrastructure" className="py-16 md:py-20">
        <div className="space-y-5 max-w-3xl text-fg-tertiary text-base sm:text-lg leading-relaxed">
          <p>
            At the core of 7ayLabs is 7aychain &mdash; a Layer 1 blockchain
            where validators form witness circles and triangulate physical
            presence through network latency, proving who is actually here
            without GPS or external hardware.
          </p>
          <p>
            Modern platforms rely on accounts, credentials, and inferred
            behavior to decide what counts as real. At scale, those signals fail.
            Proof of Presence introduces a different foundation: physics-based
            Sybil resistance.
          </p>
        </div>
      </Section>

      {/* Core Pillars */}
      <Section maxWidth="6xl" className="py-16 md:py-24">
        <div className="mb-12">
          <span className="block text-sm uppercase tracking-widest text-accent mb-4">
            The Physics Argument
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-fg mb-4">
            Sybil resistance through physical reality
          </h2>
          <p className="max-w-3xl text-fg-tertiary text-lg leading-relaxed">
            Instead of trusting profiles, credentials, or biometrics, 7aychain
            exploits a fundamental physical constraint: you can only be in one
            place at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRESENCE_PILLARS.map((pillar) => (
            <Card key={pillar.title} variant="interactive" padding="md">
              <h3 className="font-sans font-semibold text-lg text-fg mb-3">
                {pillar.title}
              </h3>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Sybil Resistance Arguments */}
      <Section className="py-16 md:py-20">
        <Card variant="elevated" padding="lg" className="mb-12 max-w-3xl">
          <span className="block text-xs uppercase tracking-widest text-accent mb-4">
            Core Insight
          </span>
          <h3 className="font-serif font-bold text-xl md:text-2xl text-fg mb-3">
            In a world of perfect simulation, physical reality becomes the scarce resource
          </h3>
          <p className="text-fg-tertiary leading-relaxed">
            AI can generate convincing text, behavior, and interaction at scale.
            But replicating physical presence &mdash; being at a specific location
            at a specific time, measurable through network physics &mdash; remains
            constrained by the laws of nature.
          </p>
        </Card>

        <div className="space-y-6 max-w-4xl">
          {SYBIL_ARGUMENTS.map((arg) => (
            <div key={arg.problem} className="grid md:grid-cols-2 gap-4 md:gap-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-fg-muted block mb-2">Problem</span>
                <p className="text-fg font-medium">{arg.problem}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-accent block mb-2">7aychain Response</span>
                <p className="text-fg-tertiary text-sm leading-relaxed">{arg.response}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Comparison Table */}
      <Section maxWidth="6xl" className="py-16 md:py-24">
        <div className="mb-12 text-center">
          <span className="block text-sm uppercase tracking-widest text-accent mb-4">
            Comparison
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-fg mb-4">
            How 7aychain compares
          </h2>
          <p className="max-w-3xl text-fg-tertiary text-lg mx-auto leading-relaxed">
            Different approaches to the human verification problem. Each makes
            different trade-offs on privacy, hardware, and what they actually prove.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[var(--color-border-primary)]">
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs w-36">
                  Dimension
                </th>
                <th className="text-left py-3 px-4 text-accent font-medium text-xs uppercase tracking-wider">
                  7aychain
                </th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium text-xs uppercase tracking-wider">
                  Worldcoin
                </th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium text-xs uppercase tracking-wider">
                  BrightID
                </th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium text-xs uppercase tracking-wider">
                  Gitcoin Passport
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map((row) => (
                <tr key={row.dimension} className="border-b border-[var(--color-border-primary)]">
                  <td className="py-3 px-4 font-medium text-fg whitespace-nowrap">
                    {row.dimension}
                  </td>
                  <td className="py-3 px-4 text-fg-secondary">
                    {row.sevenychain}
                  </td>
                  <td className="py-3 px-4 text-fg-tertiary">
                    {row.worldcoin}
                  </td>
                  <td className="py-3 px-4 text-fg-tertiary">
                    {row.brightid}
                  </td>
                  <td className="py-3 px-4 text-fg-tertiary">
                    {row.passport}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* CTA */}
      <Section centered className="py-20 md:py-28">
        <span className="block text-sm uppercase tracking-widest text-accent mb-4">
          Follow the Signal
        </span>
        <h3 className="font-serif font-bold text-2xl md:text-3xl text-fg mb-4">
          Presence is the missing primitive
        </h3>
        <p className="mx-auto max-w-xl text-fg-tertiary text-lg leading-relaxed mb-8">
          We share progress in real time &mdash; what&apos;s being tested,
          what&apos;s breaking, and where presence actually changes outcomes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={EXTERNAL_LINKS.twitter} external size="lg">
            Follow on X
          </Button>
          <Button href={ROUTES.technology} variant="secondary" size="lg">
            Explore Technology
          </Button>
        </div>
      </Section>
    </>
  );
}
