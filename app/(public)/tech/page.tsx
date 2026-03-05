import type { Metadata } from "next";
import { PageHero, Section, Card } from "@/components/ui";
import Newsletter from "@/components/landing/Newsletter";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Explore 7aychain and its Proof of Presence protocol — validators form witness circles, measure network latency, and triangulate positions on-chain. No GPS, no oracles.",
};

export default function TechPage() {
  return (
    <>
      <PageHero
        label="Technology"
        title="Presence, Verified On-Chain"
        description="7aychain is a Layer 1 blockchain where validators form witness circles, measure network latency, and triangulate physical presence — no GPS, no external oracles, no special hardware."
      />

      {/* How 7aychain Works */}
      <Section title="How 7aychain Works" className="pb-20 md:pb-36">
        <p className="italic text-white/70 text-lg leading-relaxed mb-10 max-w-3xl">
          A Layer 1 blockchain built to answer one question: is this actor
          actually here?
        </p>

        <div className="space-y-6 max-w-4xl text-white/60 leading-relaxed">
          <p>
            7aychain uses the{" "}
            <strong className="text-white/80">Proof of Presence protocol</strong>{" "}
            where every presence declaration goes through an epoch-bound
            lifecycle: declared, attested by witnesses, triangulated, and
            finalized by validators with quorum consensus.
          </p>
          <p>
            Validators form witness circles, measure network latency between
            peers, and triangulate positions &mdash; no GPS, no external
            oracles, no special hardware. Presence is verified through the
            protocol itself and finalized on-chain.
          </p>
          <p>
            The chain is built on Substrate (Polkadot SDK) and includes ZK
            proof generation and on-chain verification, dispute resolution with
            evidence and voting, and a commit-reveal scheme for presence
            declarations.
          </p>
          <p className="font-medium text-white">
            When presence is real, trust follows.
          </p>
        </div>
      </Section>

      {/* Protocol Architecture */}
      <Section maxWidth="6xl" className="pb-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
              Protocol Architecture
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
              Witness Circles & Triangulation
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Validators form witness circles around presence declarations.
              Each validator measures network latency to peers and uses
              multilateration and centroid algorithms to triangulate physical
              position &mdash; without GPS or external hardware.
            </p>
            <p className="text-white/60 leading-relaxed">
              Presence claims follow an epoch-bound lifecycle with
              commit-reveal: actors commit to a presence hash, reveal during
              the active window, and validators vote to finalize with quorum
              consensus. Malicious actors face on-chain slashing.
            </p>
          </div>

          <Card variant="elevated" padding="lg">
            <p className="font-serif italic text-white/80 text-lg leading-relaxed mb-4">
              &ldquo;When participation is real, coordination becomes resilient.
              Presence creates trust that systems can build on.&rdquo;
            </p>
            <span className="block text-white/40 text-sm">
              &mdash; Proof of Presence Principle
            </span>
          </Card>
        </div>
      </Section>

      {/* ZK Proofs & On-Chain Verification */}
      <Section maxWidth="6xl" className="pt-12 pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
              Zero-Knowledge Verification
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
              Proof, Not Profiles
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              7aychain uses ZK circuits to prove presence without revealing
              exact locations. Actors generate zero-knowledge proofs that
              validators verify on-chain &mdash; no persistent identity,
              no surveillance, no data extraction.
            </p>
            <p className="text-white/60 leading-relaxed">
              The protocol includes position-bound tokens (PBTs) that tie
              cryptographic claims to attested positions, semantic linking
              for trust graphs between entities, and a vault system for
              secure data sharing and recovery.
            </p>
          </div>

          <Card variant="elevated" padding="lg">
            <p className="font-serif italic text-white/80 text-lg leading-relaxed mb-4">
              &ldquo;Verification should be minimal, contextual, and disposable
              &mdash; not extractive.&rdquo;
            </p>
            <span className="block text-white/40 text-sm">
              &mdash; Presence-Native Design
            </span>
          </Card>
        </div>
      </Section>

      {/* Earned Participation */}
      <Section maxWidth="6xl" className="pb-20 md:pb-36">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
              Incentive Design
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
              Earned Participation
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Incentive systems fail when automation can capture value faster
              than humans.
            </p>
            <p className="text-white/60 leading-relaxed">
              Proof of Presence aligns rewards with physical participation,
              ensuring value flows only to real contributors.
            </p>
          </div>

          <Card variant="elevated" padding="lg">
            <p className="font-serif italic text-white/80 text-lg leading-relaxed mb-4">
              &ldquo;If value can be farmed, it will be. If value must be
              earned, communities form.&rdquo;
            </p>
            <span className="block text-white/40 text-sm">
              &mdash; Presence Economics
            </span>
          </Card>
        </div>
      </Section>

      {/* AI-Resilient */}
      <Section maxWidth="6xl" className="pb-24 md:pb-40">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
              AI-Resilient Infrastructure
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
              Defense Through Reality
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              AI can generate text, behavior, and interaction at scale &mdash;
              but it cannot easily replicate physical presence.
            </p>
            <p className="text-white/60 leading-relaxed">
              Proof of Presence uses real-world constraints as a technological
              defense, creating AI-resilient systems without surveillance or
              identity checks.
            </p>
          </div>

          <Card variant="elevated" padding="lg">
            <p className="font-serif italic text-white/80 text-lg leading-relaxed mb-4">
              &ldquo;In a world of perfect simulation, reality becomes the
              scarce resource.&rdquo;
            </p>
            <span className="block text-white/40 text-sm">
              &mdash; Presence-First Systems
            </span>
          </Card>
        </div>
      </Section>

      {/* Built for Real Use */}
      <Section centered className="pb-24 md:pb-40" maxWidth="5xl">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
          7aychain: Presence, Built for Real Use
        </h2>
        <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
          7aychain is currently at v0.8.26 with a full protocol stack: presence
          lifecycle, validator staking, ZK verification, governance, vaults,
          semantic linking, dispute resolution, and more &mdash; all running
          on a multi-node devnet.
        </p>
        <p className="text-white font-medium text-lg">
          Built on Substrate. Licensed under BUSL-1.1. Open source at{" "}
          <a
            href="https://github.com/7ayLabs/7aychain"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-white/80 focus-visible:text-white/80 transition-colors"
          >
            github.com/7ayLabs/7aychain
          </a>.
        </p>
      </Section>

      <Newsletter />
    </>
  );
}
