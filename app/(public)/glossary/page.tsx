import type { Metadata } from "next";
import { PageHero, Section, Card } from "@/components/ui";
import Newsletter from "@/components/landing/Newsletter";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Definitions of key 7aychain and Proof of Presence terms: witness circles, triangulation, position-bound tokens, ZK circuits, epoch lifecycle, and more.",
  keywords: [
    "proof of presence glossary",
    "blockchain presence terms",
    "witness circle definition",
    "position bound token",
    "7aychain terminology",
    "Substrate blockchain glossary",
  ],
};

interface GlossaryTerm {
  readonly term: string;
  readonly definition: string;
  readonly letter: string;
}

const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  {
    letter: "A",
    term: "Autonomous Detection",
    definition:
      "An on-chain module that automatically detects anomalous patterns in presence attestations, flagging suspicious behavior for review or dispute without requiring manual reports.",
  },
  {
    letter: "B",
    term: "Boomerang Proof",
    definition:
      "A cryptographic mechanism that verifies an actor returned to a previously attested location. Used to prove consistent presence patterns over time without revealing the location itself.",
  },
  {
    letter: "C",
    term: "Circuit Registry",
    definition:
      "The on-chain registry of ZK circuits available for proof generation and verification. Manages circuit versions, migration between proof modes, and verifier configurations.",
  },
  {
    letter: "C",
    term: "Commit-Reveal Scheme",
    definition:
      "A two-phase protocol where actors first commit a hash of their presence data (hiding it), then reveal the actual data in a later phase. Prevents front-running and ensures fair ordering of presence declarations.",
  },
  {
    letter: "D",
    term: "Device Scanner",
    definition:
      "A pallet-level module for registering and scanning devices that participate in presence attestation. Handles device identity, attestation capability, and revocation.",
  },
  {
    letter: "D",
    term: "Dispute Resolution",
    definition:
      "An on-chain process for challenging presence attestations. Disputants submit evidence, validators vote, and the protocol enforces outcomes including slashing for dishonest attestors.",
  },
  {
    letter: "E",
    term: "Epoch",
    definition:
      "A fixed time window during which presence declarations, attestations, and finalizations occur. Epochs structure the protocol lifecycle and determine validator rotation schedules.",
  },
  {
    letter: "G",
    term: "Groth16",
    definition:
      "A zero-knowledge proof system used by 7aychain for succinct, non-interactive presence proofs. Provides constant-size proofs with fast verification, enabling efficient on-chain ZK verification.",
  },
  {
    letter: "L",
    term: "Laud Networks CLI",
    definition:
      "A Python-based terminal user interface (TUI) for interacting with 7aychain pallets. Supports all 16 protocol modules for presence declaration, validator management, ZK proofs, and more.",
  },
  {
    letter: "L",
    term: "Lifecycle",
    definition:
      "The full state machine governing a presence declaration from creation to finalization: Declare, Commit, Reveal, Attest, Triangulate, and Finalize.",
  },
  {
    letter: "M",
    term: "Multilateration",
    definition:
      "A positioning technique that estimates an actor's physical location using network latency measurements from multiple validator reference points. The core triangulation algorithm in witness circles.",
  },
  {
    letter: "O",
    term: "Octopus Groups",
    definition:
      "Organizational units within the protocol that group validators and actors for coordinated presence operations. Groups can have shared governance rules and collective attestation thresholds.",
  },
  {
    letter: "P",
    term: "Position Bound Token (PBT)",
    definition:
      "A cryptographic token minted when presence is finalized. PBTs tie attestation claims to specific positions and epochs, serving as verifiable proof-of-presence credentials without revealing exact locations.",
  },
  {
    letter: "P",
    term: "Presence Lifecycle",
    definition:
      "The six-phase protocol flow: Declare (announce intent), Commit (submit presence hash), Reveal (disclose data), Attest (validators measure), Triangulate (compute position), Finalize (quorum consensus).",
  },
  {
    letter: "P",
    term: "Proof of Presence (PoP)",
    definition:
      "The consensus mechanism of 7aychain. Validators form witness circles and triangulate physical presence through network latency measurement -- no GPS, no biometrics, no external hardware.",
  },
  {
    letter: "Q",
    term: "Quorum Consensus",
    definition:
      "The threshold of validator agreement required to finalize a presence attestation. A presence declaration is only finalized when a sufficient percentage of the witness circle converges on a position estimate.",
  },
  {
    letter: "S",
    term: "Semantic Links",
    definition:
      "On-chain relationships between entities (actors, locations, organizations) that form a trust graph. Semantic links enable contextual verification and reputation based on presence history.",
  },
  {
    letter: "S",
    term: "Shamir Secret Sharing",
    definition:
      "A cryptographic scheme used in the vault system to split sensitive data across multiple parties. No single party holds enough information to reconstruct the secret, enabling secure recovery and sharing.",
  },
  {
    letter: "S",
    term: "SNARK",
    definition:
      "Succinct Non-interactive Argument of Knowledge. A zero-knowledge proof type used by 7aychain for compact, efficiently verifiable presence proofs. The protocol migrates from stub verifiers to full SNARK circuits.",
  },
  {
    letter: "S",
    term: "Storage Layer",
    definition:
      "A pallet providing on-chain and off-chain data storage for presence proofs, attestation records, and protocol state. Supports pinning, retrieval, and data availability guarantees.",
  },
  {
    letter: "T",
    term: "Triangulation",
    definition:
      "The process by which validators estimate an actor's physical position using network latency measurements from multiple reference points. Combines multilateration with centroid algorithms for position estimation.",
  },
  {
    letter: "V",
    term: "Validator",
    definition:
      "A node operator who stakes $7AY to participate in consensus, presence attestation, and witness circle triangulation. Validators earn rewards for honest behavior and face slashing for dishonesty.",
  },
  {
    letter: "V",
    term: "Vault",
    definition:
      "A secure on-chain storage system for sensitive data. Supports Shamir secret sharing for distributed key management, enabling data recovery and controlled sharing between authorized parties.",
  },
  {
    letter: "W",
    term: "Witness Circle",
    definition:
      "A pseudorandomly selected subset of validators assigned to attest a presence declaration. Circle members independently measure latency and collectively triangulate the declaring actor's position.",
  },
  {
    letter: "Z",
    term: "ZK Circuit",
    definition:
      "A zero-knowledge computation circuit that generates proofs verifying presence without revealing exact location data. 7aychain uses Groth16 circuits with an on-chain registry and migration path from stub to full SNARK verification.",
  },
] as const;

/* Group terms by letter for navigation */
function getUniqueLetters(terms: readonly GlossaryTerm[]): string[] {
  return [...new Set(terms.map((t) => t.letter))].sort();
}

export default function GlossaryPage() {
  const letters = getUniqueLetters(GLOSSARY_TERMS);

  return (
    <>
      <PageHero
        label="Glossary"
        title="7aychain Terminology"
        accentWords={["Terminology"]}
        description="Definitions of key terms, pallets, and concepts in the 7aychain Proof of Presence protocol."
      />

      {/* Letter Navigation */}
      <Section className="py-8 md:py-10">
        <nav aria-label="Glossary letter navigation" className="flex flex-wrap gap-2 justify-center">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-9 h-9 rounded-full glass-card text-fg-secondary text-sm font-medium flex items-center justify-center hover:text-fg hover:shadow-[var(--glow-cyan-sm)] transition-all duration-300"
            >
              {letter}
            </a>
          ))}
        </nav>
      </Section>

      {/* Terms grouped by letter */}
      <Section className="py-8 md:py-16">
        <div className="space-y-12">
          {letters.map((letter) => {
            const termsForLetter = GLOSSARY_TERMS.filter((t) => t.letter === letter);
            return (
              <div key={letter} id={`letter-${letter}`}>
                <h2 className="font-display font-bold text-3xl text-fg mb-6 border-b border-[var(--color-border-primary)] pb-3">
                  {letter}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {termsForLetter.map((item) => (
                    <Card key={item.term} variant="glass" padding="md" className="glow-border">
                      <h3 className="font-semibold text-fg text-lg mb-2">
                        {item.term}
                      </h3>
                      <p className="text-fg-tertiary text-sm leading-relaxed">
                        {item.definition}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Newsletter />
    </>
  );
}
