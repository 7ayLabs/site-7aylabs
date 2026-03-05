import type { Metadata } from "next";
import { PageHero, Section, Card, Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "Discover how Proof of Presence enables Sybil-resistant airdrops, DAO governance, presence-gated DeFi, event verification, access control, and DePIN verification.",
  keywords: [
    "Sybil resistant airdrops",
    "DAO governance presence",
    "presence gated DeFi",
    "event verification blockchain",
    "DePIN location proof",
    "human verification use cases",
  ],
};

const SIGNAL_CARDS = [
  {
    title: "Sybil-resistant",
    description:
      "Presence signals grounded in physics, not accounts or behavior models.",
  },
  {
    title: "Privacy-preserving",
    description:
      "Verifies presence without identities, tracking, or surveillance.",
  },
  {
    title: "On-chain verifiable",
    description:
      "Every attestation is finalized by validator quorum with ZK proofs.",
  },
  {
    title: "No hardware needed",
    description:
      "Works with existing network infrastructure. No iris scanners, no GPS.",
  },
] as const;

const USE_CASES = [
  {
    title: "Sybil-Resistant Airdrops",
    description:
      "Prevent airdrop farming by requiring verified physical presence. Each airdrop claim is backed by a position-bound token (PBT) that proves a real human was present -- not a bot farm or multi-account setup.",
    detail:
      "Token distributions become meaningful when every recipient is a verified, unique human actor. Proof of Presence eliminates the Sybil vectors that drain airdrop budgets.",
  },
  {
    title: "DAO Governance",
    description:
      "Enable one-person-one-vote governance where participation is tied to physical presence. Validators triangulate that each voter is a real human, preventing governance capture by wallet farms.",
    detail:
      "DAOs can gate proposal voting, quorum participation, and delegation based on presence attestations, ensuring decisions reflect genuine community members.",
  },
  {
    title: "Presence-Gated DeFi",
    description:
      "Require physical presence for specific DeFi operations. High-value transactions, vault access, or protocol governance can require a fresh presence attestation before execution.",
    detail:
      "This adds a physical security layer to on-chain finance that cannot be bypassed by compromised keys alone, since the attacker would also need to be physically present.",
  },
  {
    title: "Event Verification",
    description:
      "Validate real attendance at conferences, meetups, workshops, and on-chain events. No inflated numbers, no fake engagement -- just people who actually showed up.",
    detail:
      "POAPs backed by Proof of Presence carry real weight. Event organizers get accurate attendance data while attendees earn verifiable credentials.",
  },
  {
    title: "Access Control and Communities",
    description:
      "Gate access to physical and digital spaces based on verified presence. Communities form around earned participation rather than speculative behavior or purchased access.",
    detail:
      "Presence-gated systems ensure that access, rewards, and membership reflect real engagement, not accounts that were created to farm value.",
  },
  {
    title: "DePIN Verification",
    description:
      "Verify that decentralized physical infrastructure nodes are actually deployed at their claimed locations. Proof of Presence confirms physical presence of hardware operators.",
    detail:
      "DePIN networks can use presence attestations to validate node locations, prevent virtual spoofing, and ensure infrastructure rewards go to legitimate operators.",
  },
] as const;

export default function UseCasesPage() {
  return (
    <>
      <PageHero
        label="Use Cases"
        title="Presence as a Primitive"
        description="Proof of Presence enables crypto-native applications where Sybil resistance, physical verification, and human uniqueness matter. Built on physics, not profiles."
      />

      <Section className="py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h2 className="heading-sm text-fg mb-4">
              The Sybil problem is everywhere
            </h2>
            <div className="space-y-5 text-fg-tertiary leading-relaxed">
              <p>
                Airdrops get farmed. Governance gets captured. DeFi protocols
                cannot distinguish one person from a thousand wallets. The root
                cause is the same: there is no reliable way to verify that a
                unique human is behind an action.
              </p>
              <p>
                Proof of Presence solves this at the physics layer. Validators
                triangulate physical presence through network latency &mdash;
                creating Sybil resistance that does not depend on biometrics,
                identity documents, or hardware.
              </p>
            </div>
          </div>
          <div>
            <h2 className="heading-sm text-fg mb-4">
              Physical reality as security
            </h2>
            <div className="space-y-5 text-fg-tertiary leading-relaxed">
              <p>
                A single person can create unlimited wallets, but they can only
                be in one place at a time. Proof of Presence exploits this
                fundamental constraint to create on-chain Sybil resistance.
              </p>
              <p>
                When DeFi operations, governance votes, or token claims require
                verified physical presence, the cost of attack scales from
                near-zero to physically impractical.
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
            Where Presence Changes the Game
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Crypto-native use cases where Proof of Presence provides the missing
            Sybil resistance layer.
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

        <div className="space-y-8 max-w-4xl mx-auto">
          {USE_CASES.map((useCase, i) => (
            <Card key={useCase.title} variant="default" padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[var(--color-accent-dim)] text-accent text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <h3 className="font-serif font-bold text-xl text-fg">
                  {useCase.title}
                </h3>
              </div>
              <p className="text-fg-secondary leading-relaxed mb-3">
                {useCase.description}
              </p>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {useCase.detail}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section centered className="py-20 md:py-28">
        <h2 className="heading-md text-fg mb-6">
          Build with Proof of Presence
        </h2>
        <p className="body-lg max-w-2xl mx-auto mb-10">
          The devnet is live. Start building Sybil-resistant applications on
          7aychain today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={ROUTES.devnet} size="lg">
            Connect to Devnet
          </Button>
          <Button href={ROUTES.waitlist} variant="secondary" size="lg">
            Join the Waitlist
          </Button>
        </div>
      </Section>
    </>
  );
}
