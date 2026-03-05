import type { Metadata } from "next";
import { PageHero, Section, Card, Badge, Button } from "@/components/ui";
import { ROUTES, EXTERNAL_LINKS } from "@/lib/constants/routes";
import Newsletter from "@/components/landing/Newsletter";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Deep dive into 7aychain's Proof of Presence protocol. Explore 16 pallets, the presence lifecycle, ZK proof migration, witness circle triangulation, and Substrate-based architecture.",
  keywords: [
    "proof of presence protocol",
    "network latency triangulation blockchain",
    "ZK presence proofs",
    "Substrate blockchain pallets",
    "7aychain technology",
    "witness circle triangulation",
    "commit-reveal blockchain",
  ],
};

const PALLET_GROUPS = [
  {
    category: "Presence Layer",
    description:
      "The core protocol: actors declare presence, epochs structure time windows, the lifecycle state machine governs transitions, and devices are registered for attestation.",
    pallets: [
      { name: "presence", role: "Presence declaration, commit-reveal, finalization" },
      { name: "epoch", role: "Time-bounded windows for protocol phases" },
      { name: "lifecycle", role: "State machine: Declare > Commit > Reveal > Attest > Triangulate > Finalize" },
      { name: "device", role: "Device registration, scanning, attestation capability" },
    ],
  },
  {
    category: "Verification",
    description:
      "Position estimation through multilateration, zero-knowledge proof generation and verification, and position-bound token minting for portable presence credentials.",
    pallets: [
      { name: "triangulation", role: "Multilateration from validator latency measurements" },
      { name: "zk", role: "SNARK circuit registry, Groth16 verifier, proof mode migration" },
      { name: "pbt", role: "Position-bound tokens tied to finalized presence" },
    ],
  },
  {
    category: "Security",
    description:
      "Validator staking and consensus, on-chain dispute resolution with evidence and voting, and autonomous anomaly detection to flag suspicious patterns.",
    pallets: [
      { name: "validator", role: "Registration, activation, staking, slashing, rotation" },
      { name: "dispute", role: "Open disputes, submit evidence, vote, enforce outcomes" },
      { name: "autonomous", role: "Automated anomaly detection and reporting" },
    ],
  },
  {
    category: "Infrastructure",
    description:
      "Data vaults with Shamir secret sharing, on-chain storage, governance proposals and voting, semantic trust graphs, boomerang return proofs, and octopus group management.",
    pallets: [
      { name: "vault", role: "Secure storage with Shamir secret sharing and recovery" },
      { name: "storage", role: "On-chain and off-chain data pinning and retrieval" },
      { name: "governance", role: "Proposals, voting, execution, cancellation" },
      { name: "semantic", role: "Entity linking, trust graphs, contextual verification" },
      { name: "boomerang", role: "Return proofs for consistent presence patterns" },
      { name: "octopus", role: "Group management for coordinated operations" },
    ],
  },
] as const;

const LIFECYCLE_PHASES = [
  {
    phase: "Declare",
    description: "Actor announces intent to prove presence in a specific context and epoch window.",
  },
  {
    phase: "Commit",
    description: "Actor submits a cryptographic hash of their presence data. The actual data remains hidden.",
  },
  {
    phase: "Reveal",
    description: "Actor reveals the original presence data. The protocol verifies it matches the committed hash.",
  },
  {
    phase: "Attest",
    description: "Witness circle validators independently measure network latency to the actor and each other.",
  },
  {
    phase: "Triangulate",
    description: "Latency measurements are processed through multilateration algorithms to estimate physical position.",
  },
  {
    phase: "Finalize",
    description: "Quorum of validators agrees on position. Presence is finalized on-chain and a PBT is minted.",
  },
] as const;

const ZK_MIGRATION = [
  {
    stage: "StubVerifier",
    status: "Complete",
    description: "Development-only verifier that accepts all proofs. Used during initial protocol development and testing.",
  },
  {
    stage: "Transitional",
    status: "Current",
    description: "Hybrid mode supporting both stub and real proofs. Allows gradual migration of circuits to full SNARK verification.",
  },
  {
    stage: "SNARK-only",
    status: "Target",
    description: "Full Groth16 verification for all presence proofs. No stub proofs accepted. Production-grade ZK security.",
  },
] as const;

const TECH_PILLARS = [
  {
    title: "Physics-Based Verification",
    description:
      "Network latency between peers is constrained by the speed of light. 7aychain exploits this physical limit to triangulate position without GPS or external sensors.",
  },
  {
    title: "Zero-Knowledge Privacy",
    description:
      "Actors prove they were present without revealing where. ZK circuits generate compact proofs that validators verify on-chain -- no persistent identity, no surveillance.",
  },
  {
    title: "Cryptoeconomic Security",
    description:
      "Validators stake $7AY and face slashing for dishonest attestations. The cost of attack scales with the number of colluding validators required.",
  },
  {
    title: "AI-Resilient Design",
    description:
      "AI can generate text, behavior, and interaction at scale -- but it cannot replicate physical presence bound by the laws of physics.",
  },
] as const;

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        label="Technology"
        title="Presence, Verified On-Chain"
        description="7aychain is a Layer 1 blockchain where validators form witness circles, measure network latency, and triangulate physical presence. No GPS, no external oracles, no special hardware."
      />

      {/* Overview */}
      <Section title="How 7aychain Works" className="py-16 md:py-20">
        <p className="text-accent text-lg leading-relaxed mb-8 max-w-3xl font-medium">
          A Layer 1 blockchain built to answer one question: is this actor
          actually here?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {TECH_PILLARS.map((pillar) => (
            <Card key={pillar.title} variant="interactive" padding="lg">
              <h3 className="font-semibold text-fg text-lg mb-3">
                {pillar.title}
              </h3>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Presence Lifecycle */}
      <Section
        label="Protocol Flow"
        title="Presence lifecycle"
        className="py-16 md:py-24"
      >
        <p className="text-fg-tertiary leading-relaxed mb-8 max-w-3xl">
          Every presence declaration on 7aychain follows a six-phase epoch-bound lifecycle.
          Each phase is enforced by the protocol &mdash; skipping steps or submitting out
          of order is rejected at the runtime level.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIFECYCLE_PHASES.map((item, i) => (
            <Card key={item.phase} variant="default" padding="md">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[var(--color-accent-dim)] text-accent text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-fg text-lg">{item.phase}</h3>
              </div>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Visual flow arrow */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-fg-muted">
          {LIFECYCLE_PHASES.map((item, i) => (
            <span key={item.phase} className="flex items-center gap-2">
              <Badge variant="accent">{item.phase}</Badge>
              {i < LIFECYCLE_PHASES.length - 1 && (
                <span className="text-fg-muted">&rarr;</span>
              )}
            </span>
          ))}
        </div>
      </Section>

      {/* Pallet Groups */}
      <Section
        label="Runtime Architecture"
        title="16 protocol pallets"
        className="py-16 md:py-20"
      >
        <p className="text-fg-tertiary leading-relaxed mb-8 max-w-3xl">
          7aychain&apos;s runtime is built on Substrate (Polkadot SDK, polkadot-stable2503)
          with 16 custom pallets organized into four functional groups.
        </p>

        <div className="space-y-8">
          {PALLET_GROUPS.map((group) => (
            <Card key={group.category} variant="elevated" padding="lg">
              <h3 className="font-serif font-bold text-xl text-fg mb-2">
                {group.category}
              </h3>
              <p className="text-fg-tertiary text-sm leading-relaxed mb-5">
                {group.description}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-primary)]">
                      <th className="text-left py-2 px-3 text-fg-muted font-medium uppercase tracking-wider text-xs">Pallet</th>
                      <th className="text-left py-2 px-3 text-fg-muted font-medium uppercase tracking-wider text-xs">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.pallets.map((pallet) => (
                      <tr key={pallet.name} className="border-b border-[var(--color-border-primary)]">
                        <td className="py-2 px-3 font-mono text-accent">{pallet.name}</td>
                        <td className="py-2 px-3 text-fg-secondary">{pallet.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ZK Proof Migration */}
      <Section
        label="Zero-Knowledge"
        title="ZK proof migration path"
        className="py-16 md:py-24"
      >
        <p className="text-fg-tertiary leading-relaxed mb-8 max-w-3xl">
          7aychain implements a three-stage migration for ZK verification, moving from
          development stubs to full Groth16 SNARK verification in production.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ZK_MIGRATION.map((stage, i) => (
            <Card key={stage.stage} variant="default" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant={
                    stage.status === "Complete"
                      ? "success"
                      : stage.status === "Current"
                        ? "accent"
                        : "outline"
                  }
                >
                  {stage.status}
                </Badge>
                <span className="text-fg-muted text-xs font-mono">Stage {i + 1}/3</span>
              </div>
              <h3 className="font-semibold text-fg text-lg mb-3">{stage.stage}</h3>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {stage.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Stack Info */}
      <Section centered className="py-16 md:py-20">
        <h2 className="heading-md text-fg mb-6">
          7aychain: Presence, Built for Real Use
        </h2>
        <p className="body-lg mb-8 max-w-2xl mx-auto">
          Currently at v0.8.26 with a full protocol stack: presence lifecycle, validator
          staking, ZK verification, governance, vaults, semantic linking, dispute resolution,
          and more &mdash; all running on a multi-node devnet.
        </p>
        <p className="text-fg font-medium text-lg mb-10">
          Built on Substrate. Licensed under BUSL-1.1. Open source at{" "}
          <a
            href={EXTERNAL_LINKS.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4 hover:text-accent-secondary transition-colors"
          >
            github.com/7ayLabs/7aychain
          </a>
          .
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={ROUTES.devnet} size="lg">
            Connect to Devnet
          </Button>
          <Button href={ROUTES.glossary} variant="secondary" size="lg">
            View Glossary
          </Button>
        </div>
      </Section>

      <Newsletter />
    </>
  );
}
