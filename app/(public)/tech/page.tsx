import type { Metadata } from "next";
import { PageHero, Section, Card } from "@/components/ui";
import Newsletter from "@/components/landing/Newsletter";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Explore 7aychain and its Proof of Presence protocol — validators form witness circles, measure network latency, and triangulate positions on-chain. No GPS, no oracles.",
};

const TECH_FEATURES = [
  {
    label: "Protocol Architecture",
    title: "Witness Circles & Triangulation",
    description:
      "Validators form witness circles around presence declarations. Each validator measures network latency to peers and uses multilateration and centroid algorithms to triangulate physical position -- without GPS or external hardware.",
    detail:
      "Presence claims follow an epoch-bound lifecycle with commit-reveal: actors commit to a presence hash, reveal during the active window, and validators vote to finalize with quorum consensus. Malicious actors face on-chain slashing.",
    quote:
      "When participation is real, coordination becomes resilient. Presence creates trust that systems can build on.",
    quoteSource: "Proof of Presence Principle",
  },
  {
    label: "Zero-Knowledge Verification",
    title: "Proof, Not Profiles",
    description:
      "7aychain uses ZK circuits to prove presence without revealing exact locations. Actors generate zero-knowledge proofs that validators verify on-chain -- no persistent identity, no surveillance, no data extraction.",
    detail:
      "The protocol includes position-bound tokens (PBTs) that tie cryptographic claims to attested positions, semantic linking for trust graphs between entities, and a vault system for secure data sharing and recovery.",
    quote:
      "Verification should be minimal, contextual, and disposable -- not extractive.",
    quoteSource: "Presence-Native Design",
  },
  {
    label: "Incentive Design",
    title: "Earned Participation",
    description:
      "Incentive systems fail when automation can capture value faster than humans. Proof of Presence aligns rewards with physical participation.",
    detail:
      "Value flows only to real contributors. Communities form around earned presence rather than speculative behavior.",
    quote:
      "If value can be farmed, it will be. If value must be earned, communities form.",
    quoteSource: "Presence Economics",
  },
  {
    label: "AI-Resilient Infrastructure",
    title: "Defense Through Reality",
    description:
      "AI can generate text, behavior, and interaction at scale -- but it cannot easily replicate physical presence.",
    detail:
      "Proof of Presence uses real-world constraints as a technological defense, creating AI-resilient systems without surveillance or identity checks.",
    quote:
      "In a world of perfect simulation, reality becomes the scarce resource.",
    quoteSource: "Presence-First Systems",
  },
] as const;

export default function TechPage() {
  return (
    <>
      <PageHero
        label="Technology"
        title="Presence, Verified On-Chain"
        description="7aychain is a Layer 1 blockchain where validators form witness circles, measure network latency, and triangulate physical presence -- no GPS, no external oracles, no special hardware."
      />

      <Section title="How 7aychain Works" className="py-16 md:py-20">
        <p className="text-accent text-lg leading-relaxed mb-8 max-w-3xl font-medium">
          A Layer 1 blockchain built to answer one question: is this actor
          actually here?
        </p>

        <div className="space-y-5 max-w-4xl text-fg-tertiary leading-relaxed">
          <p>
            7aychain uses the{" "}
            <strong className="text-fg-secondary">Proof of Presence protocol</strong>{" "}
            where every presence declaration goes through an epoch-bound
            lifecycle: declared, attested by witnesses, triangulated, and
            finalized by validators with quorum consensus.
          </p>
          <p>
            The chain is built on Substrate (Polkadot SDK) and includes ZK
            proof generation and on-chain verification, dispute resolution with
            evidence and voting, and a commit-reveal scheme for presence
            declarations.
          </p>
          <p className="font-medium text-fg">
            When presence is real, trust follows.
          </p>
        </div>
      </Section>

      {TECH_FEATURES.map((feature) => (
        <Section key={feature.title} className="py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <span className="label-sm block mb-4">
                {feature.label}
              </span>
              <h2 className="heading-sm text-fg mb-6">
                {feature.title}
              </h2>
              <p className="body-base mb-5">
                {feature.description}
              </p>
              <p className="body-base">
                {feature.detail}
              </p>
            </div>

            <Card variant="elevated" padding="lg">
              <p className="italic text-fg-secondary text-lg leading-relaxed mb-4">
                &ldquo;{feature.quote}&rdquo;
              </p>
              <span className="block text-fg-faint text-sm">
                &mdash; {feature.quoteSource}
              </span>
            </Card>
          </div>
        </Section>
      ))}

      <Section centered className="py-20 md:py-28">
        <h2 className="heading-md text-fg mb-6">
          7aychain: Presence, Built for Real Use
        </h2>
        <p className="body-lg mb-8 max-w-2xl mx-auto">
          7aychain is currently at v0.8.26 with a full protocol stack: presence
          lifecycle, validator staking, ZK verification, governance, vaults,
          semantic linking, dispute resolution, and more &mdash; all running
          on a multi-node devnet.
        </p>
        <p className="text-fg font-medium text-lg">
          Built on Substrate. Licensed under BUSL-1.1. Open source at{" "}
          <a
            href="https://github.com/7ayLabs/7aychain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4 hover:text-accent-secondary transition-colors"
          >
            github.com/7ayLabs/7aychain
          </a>
          .
        </p>
      </Section>

      <Newsletter />
    </>
  );
}
