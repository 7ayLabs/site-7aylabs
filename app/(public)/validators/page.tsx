import type { Metadata } from "next";
import { PageHero, Section, Card, Badge, Button } from "@/components/ui";
import { ROUTES, EXTERNAL_LINKS } from "@/lib/constants/routes";
import Newsletter from "@/components/landing/Newsletter";

export const metadata: Metadata = {
  title: "Validators",
  description:
    "Run a 7aychain validator node. Learn how to set up hardware, build from source, configure staking, and participate in witness circle triangulation.",
  keywords: [
    "blockchain validator guide",
    "7aychain validator setup",
    "witness circle validator",
    "proof of presence validator",
    "Substrate validator node",
    "validator staking guide",
  ],
};

const HARDWARE_REQUIREMENTS = [
  { spec: "CPU Cores", minimum: "4 cores", recommended: "8+ cores" },
  { spec: "RAM", minimum: "8 GB", recommended: "16 GB" },
  { spec: "Storage", minimum: "50 GB SSD", recommended: "100 GB NVMe" },
  { spec: "Network", minimum: "10 Mbps", recommended: "100+ Mbps" },
] as const;

const PREREQUISITES = [
  {
    os: "macOS",
    commands: `brew install cmake pkg-config openssl git llvm protobuf
rustup default stable
rustup target add wasm32-unknown-unknown`,
  },
  {
    os: "Ubuntu / Debian",
    commands: `sudo apt update && sudo apt install -y \\
  cmake pkg-config libssl-dev git clang \\
  libclang-dev protobuf-compiler
rustup default stable
rustup target add wasm32-unknown-unknown`,
  },
  {
    os: "Fedora",
    commands: `sudo dnf install -y cmake openssl-devel git clang \\
  clang-devel protobuf-compiler
rustup default stable
rustup target add wasm32-unknown-unknown`,
  },
  {
    os: "Windows (WSL2)",
    commands: `# Install WSL2 with Ubuntu, then follow Ubuntu steps
wsl --install -d Ubuntu
# Inside WSL2:
sudo apt update && sudo apt install -y \\
  cmake pkg-config libssl-dev git clang \\
  libclang-dev protobuf-compiler`,
  },
] as const;

const CLI_FLAGS = [
  { flag: "--dev", description: "Run in development mode with temporary storage" },
  { flag: "--chain <spec>", description: "Specify chain spec (local, dev, or path to JSON)" },
  { flag: "--validator", description: "Enable validator mode for block production" },
  { flag: "--base-path <path>", description: "Set the data directory for the node" },
  { flag: "--rpc-port <port>", description: "Set the JSON-RPC port (default: 9944)" },
  { flag: "--port <port>", description: "Set the p2p networking port (default: 30333)" },
  { flag: "--name <name>", description: "Human-readable name for the node" },
  { flag: "--telemetry-url <url>", description: "Telemetry server endpoint" },
  { flag: "--bootnodes <addr>", description: "Specify boot node multiaddress(es)" },
  { flag: "--rpc-cors all", description: "Allow all CORS origins for RPC" },
] as const;

const STAKING_STEPS = [
  {
    step: "Register",
    description:
      "Submit a validator registration extrinsic with your session keys. The registration enters a pending queue until the next epoch.",
  },
  {
    step: "Activate",
    description:
      "Once your registration is accepted by governance, your node enters the active validator set and begins participating in consensus.",
  },
  {
    step: "Stake",
    description:
      "Bond $7AY tokens as collateral. Higher stake increases your chance of being selected for witness circles and earning rewards.",
  },
  {
    step: "Earn",
    description:
      "Validators earn rewards for honest triangulation, presence attestation, and block production. Rewards are distributed per epoch.",
  },
  {
    step: "Slash",
    description:
      "Dishonest behavior (false attestations, downtime, equivocation) triggers slashing. A portion of your staked $7AY is burned.",
  },
] as const;

export default function ValidatorsPage() {
  return (
    <>
      <PageHero
        label="Validators"
        title="Run a 7aychain Validator"
        description="Validators are the backbone of 7aychain. They form witness circles, measure network latency, triangulate physical presence, and finalize attestations with quorum consensus."
      />

      {/* Role Overview */}
      <Section
        label="Role Overview"
        title="What validators do"
        className="py-16 md:py-20"
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mt-4">
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>
              On 7aychain, validators do more than produce blocks. They actively
              participate in the Proof of Presence protocol by forming{" "}
              <strong className="text-fg-secondary">witness circles</strong> around
              presence declarations.
            </p>
            <p>
              Each validator in a witness circle measures network latency to the
              declaring actor and to other validators. These measurements feed into
              multilateration algorithms that triangulate physical position &mdash;
              without GPS or external hardware.
            </p>
          </div>
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>
              Once a sufficient quorum of validators agrees on a position estimate,
              the presence declaration is finalized on-chain. Validators that provide
              honest attestations earn staking rewards, while dishonest behavior
              triggers slashing.
            </p>
            <p>
              The validator set rotates per epoch, ensuring no single group of
              validators can collude to falsify presence attestations over time.
            </p>
          </div>
        </div>
      </Section>

      {/* Hardware Requirements */}
      <Section
        label="Hardware"
        title="System requirements"
        className="py-16 md:py-20"
      >
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-primary)]">
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">Spec</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">Minimum</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">Recommended</th>
              </tr>
            </thead>
            <tbody>
              {HARDWARE_REQUIREMENTS.map((req) => (
                <tr key={req.spec} className="border-b border-[var(--color-border-primary)]">
                  <td className="py-3 px-4 font-medium text-fg">{req.spec}</td>
                  <td className="py-3 px-4 text-fg-secondary">{req.minimum}</td>
                  <td className="py-3 px-4 text-fg-secondary">{req.recommended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Prerequisites */}
      <Section
        label="Prerequisites"
        title="Install dependencies"
        className="py-16 md:py-20"
      >
        <p className="text-fg-tertiary leading-relaxed mb-6 max-w-3xl">
          7aychain requires Rust (stable), the WASM compilation target, Clang/LLVM,
          and protobuf. Choose your operating system below.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {PREREQUISITES.map((prereq) => (
            <Card key={prereq.os} variant="default" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="accent">{prereq.os}</Badge>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-xs font-mono text-fg-secondary leading-relaxed">
                <code>{prereq.commands}</code>
              </pre>
            </Card>
          ))}
        </div>
      </Section>

      {/* Setup Guide */}
      <Section
        label="Setup"
        title="Build and run your validator"
        className="py-16 md:py-20"
      >
        <div className="space-y-4 mt-4 max-w-3xl">
          <Card variant="default" padding="md">
            <div className="flex items-baseline gap-3 mb-2">
              <Badge variant="accent">1</Badge>
              <span className="text-fg font-semibold">Clone and build</span>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
              <code>{`git clone https://github.com/7ayLabs/7aychain.git
cd 7aychain
cargo build --release`}</code>
            </pre>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-baseline gap-3 mb-2">
              <Badge variant="accent">2</Badge>
              <span className="text-fg font-semibold">Generate session keys</span>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
              <code>{`# Start node first, then rotate keys via RPC
curl -H "Content-Type: application/json" \\
  -d '{"id":1, "jsonrpc":"2.0", "method":"author_rotateKeys"}' \\
  http://localhost:9944`}</code>
            </pre>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-baseline gap-3 mb-2">
              <Badge variant="accent">3</Badge>
              <span className="text-fg font-semibold">Run with validator flag</span>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
              <code>{`./target/release/seveny-node \\
  --chain local \\
  --validator \\
  --name "my-validator" \\
  --base-path /data/7aychain \\
  --rpc-port 9944 \\
  --rpc-cors all`}</code>
            </pre>
          </Card>
        </div>
      </Section>

      {/* CLI Configuration */}
      <Section
        label="Configuration"
        title="Node CLI flags"
        className="py-16 md:py-20"
      >
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-primary)]">
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">Flag</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">Description</th>
              </tr>
            </thead>
            <tbody>
              {CLI_FLAGS.map((item) => (
                <tr key={item.flag} className="border-b border-[var(--color-border-primary)]">
                  <td className="py-3 px-4 font-mono text-accent whitespace-nowrap">{item.flag}</td>
                  <td className="py-3 px-4 text-fg-secondary">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Staking & Slashing */}
      <Section
        label="Economics"
        title="Staking and slashing lifecycle"
        className="py-16 md:py-24"
      >
        <p className="text-fg-tertiary leading-relaxed mb-8 max-w-3xl">
          Validators must stake $7AY to participate. Honest behavior earns rewards
          while dishonest attestations trigger slashing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STAKING_STEPS.map((item, i) => (
            <Card key={item.step} variant="interactive" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-full bg-[var(--color-accent-dim)] text-accent text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-fg">{item.step}</h3>
              </div>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Witness Circles */}
      <Section
        label="Protocol"
        title="Witness circle participation"
        className="py-16 md:py-20"
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mt-4">
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>
              When an actor declares presence, the protocol selects a subset of
              active validators to form a{" "}
              <strong className="text-fg-secondary">witness circle</strong>.
              Selection is pseudorandom, weighted by stake and constrained by
              network topology.
            </p>
            <p>
              Each validator in the circle independently measures round-trip latency
              to the declaring actor and to other circle members. These measurements
              are submitted as signed attestations during the commit phase.
            </p>
          </div>
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>
              During the reveal phase, latency measurements are used for
              multilateration &mdash; a triangulation algorithm that estimates
              the actor&apos;s physical position based on network timing data
              from multiple reference points.
            </p>
            <p>
              If the position estimate from a quorum of validators converges
              within an acceptable threshold, the presence is finalized. Outlier
              measurements trigger the dispute resolution process, and validators
              providing false attestations face slashing.
            </p>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section centered className="py-20 md:py-28">
        <h2 className="heading-md text-fg mb-6">
          Start validating on 7aychain
        </h2>
        <p className="body-lg max-w-2xl mx-auto mb-10">
          The devnet is live and accepting validators. Clone the repo, build the
          node, and join the network.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={EXTERNAL_LINKS.githubRepo} external size="lg">
            View on GitHub
          </Button>
          <Button href={ROUTES.devnet} variant="secondary" size="lg">
            Devnet Setup
          </Button>
        </div>
      </Section>

      <Newsletter />
    </>
  );
}
