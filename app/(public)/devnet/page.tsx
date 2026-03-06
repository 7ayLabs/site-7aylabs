import type { Metadata } from "next";
import { PageHero, Section, Card, Badge, Button } from "@/components/ui";
import { ROUTES, EXTERNAL_LINKS } from "@/lib/constants/routes";
import Newsletter from "@/components/landing/Newsletter";

export const metadata: Metadata = {
  title: "Devnet",
  description:
    "Connect to the 7aychain devnet. Clone, build, and run a Substrate-based Proof of Presence node with 6 validators, 16 modules, and the full protocol stack.",
  keywords: [
    "7aychain devnet",
    "Substrate devnet setup",
    "proof of presence devnet",
    "7aychain node setup",
    "Substrate node tutorial",
    "blockchain devnet",
  ],
};

const VALIDATOR_NODES = [
  { name: "Alice", port: 9944, role: "Boot node" },
  { name: "Bob", port: 9945, role: "Validator" },
  { name: "Charlie", port: 9946, role: "Validator" },
  { name: "Dave", port: 9947, role: "Validator" },
  { name: "Eve", port: 9948, role: "Validator" },
  { name: "Ferdie", port: 9949, role: "Validator" },
] as const;

const LAUD_MODULES = [
  { module: "presence", operations: "declare, commit, reveal, query status" },
  { module: "epoch", operations: "current epoch, history, config" },
  { module: "validator", operations: "register, activate, stake, slash info" },
  { module: "pbt", operations: "mint, bind, verify position-bound tokens" },
  { module: "triangulation", operations: "submit latency, compute position, verify" },
  { module: "dispute", operations: "open, submit evidence, vote, resolve" },
  { module: "device", operations: "register, scan, attest, revoke" },
  { module: "lifecycle", operations: "query state, transition, finalize" },
  { module: "vault", operations: "create, deposit, share, recover" },
  { module: "zk", operations: "generate proof, verify, migrate circuit" },
  { module: "governance", operations: "propose, vote, execute, cancel" },
  { module: "semantic", operations: "link entities, query graph, unlink" },
  { module: "boomerang", operations: "create proof, verify return, query" },
  { module: "autonomous", operations: "detect anomaly, report, query status" },
  { module: "octopus", operations: "create group, join, leave, query" },
  { module: "storage", operations: "store, retrieve, pin, unpin" },
] as const;

const HARDWARE_REQUIREMENTS = [
  { spec: "CPU Cores", minimum: "4 cores", recommended: "8+ cores" },
  { spec: "RAM", minimum: "8 GB", recommended: "16 GB" },
  { spec: "Storage", minimum: "50 GB SSD", recommended: "100 GB NVMe" },
  { spec: "Network", minimum: "10 Mbps", recommended: "100+ Mbps" },
] as const;

export default function DevnetPage() {
  return (
    <>
      <PageHero
        label="Devnet"
        title="Connect to 7aychain"
        accentWords={["7aychain"]}
        description="The 7aychain devnet is live with 6 nodes, 16 core modules, and the full verification stack. Clone the repo, build, and start interacting."
      />

      {/* Quick Start */}
      <Section
        label="Quick Start"
        title="Build and run in three steps"
        className="py-16 md:py-20"
      >
        <div className="mt-4 space-y-4 max-w-3xl">
          <Card variant="default" padding="md">
            <div className="flex items-baseline gap-3 mb-2">
              <Badge variant="accent">1</Badge>
              <span className="text-fg font-semibold">Clone the repository</span>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
              <code>git clone https://github.com/7ayLabs/7aychain.git{"\n"}cd 7aychain</code>
            </pre>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-baseline gap-3 mb-2">
              <Badge variant="accent">2</Badge>
              <span className="text-fg font-semibold">Build the node</span>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
              <code>cargo build --release</code>
            </pre>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-baseline gap-3 mb-2">
              <Badge variant="accent">3</Badge>
              <span className="text-fg font-semibold">Run a dev node</span>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
              <code>./target/release/seveny-node --dev</code>
            </pre>
          </Card>
        </div>
      </Section>

      {/* Network Info */}
      <Section
        label="Network Info"
        title="Devnet configuration"
        className="py-16 md:py-20"
      >
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <Card variant="elevated" padding="lg">
            <h3 className="text-fg font-semibold text-lg mb-4">Connection</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-fg-muted">RPC Endpoint</dt>
                <dd className="font-mono text-accent">ws://127.0.0.1:9944</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">Chain Spec</dt>
                <dd className="font-mono text-fg-secondary">local_testnet</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">Spec Version</dt>
                <dd className="font-mono text-fg-secondary">111</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">Binary</dt>
                <dd className="font-mono text-fg-secondary">seveny-node</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">SDK</dt>
                <dd className="font-mono text-fg-secondary">polkadot-stable2503</dd>
              </div>
            </dl>
          </Card>

          <Card variant="elevated" padding="lg">
            <h3 className="text-fg font-semibold text-lg mb-4">Pre-funded Accounts</h3>
            <p className="text-fg-tertiary text-sm mb-4">
              All development accounts (Alice through Ferdie) are pre-funded on the devnet with test tokens for immediate use.
            </p>
            <div className="flex flex-wrap gap-2">
              {VALIDATOR_NODES.map((node) => (
                <Badge key={node.name} variant="outline">
                  {node.name}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* Multi-Node Setup */}
      <Section
        label="Multi-Node Setup"
        title="6-Node Network Setup"
        className="py-16 md:py-20"
      >
        <p className="text-fg-tertiary leading-relaxed mb-6 max-w-3xl">
          Run a full 6-validator devnet locally. Alice runs as the native boot node while
          the remaining validators can run via Docker in hybrid mode.
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-primary)]">
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">Node</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">RPC Port</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">Role</th>
              </tr>
            </thead>
            <tbody>
              {VALIDATOR_NODES.map((node) => (
                <tr key={node.name} className="border-b border-[var(--color-border-primary)]">
                  <td className="py-3 px-4 font-medium text-fg">{node.name}</td>
                  <td className="py-3 px-4 font-mono text-accent">{node.port}</td>
                  <td className="py-3 px-4 text-fg-secondary">{node.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Card variant="default" padding="md" className="mt-8 max-w-3xl">
          <h4 className="text-fg font-semibold mb-2">Docker hybrid mode</h4>
          <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
            <code>{`# Start Alice natively
./target/release/seveny-node \\
  --chain local \\
  --alice \\
  --port 30333 \\
  --rpc-port 9944 \\
  --validator

# Start remaining nodes via Docker
docker-compose up bob charlie dave eve ferdie`}</code>
          </pre>
        </Card>
      </Section>

      {/* Laud CLI */}
      <Section
        label="Laud Networks CLI"
        title="Interact with Every Module"
        className="py-16 md:py-20"
      >
        <p className="text-fg-tertiary leading-relaxed mb-4 max-w-3xl">
          The Laud Networks CLI is a Python-based TUI tool for interacting with 7aychain
          modules directly from the command line.
        </p>

        <Card variant="default" padding="md" className="mb-8 max-w-3xl">
          <h4 className="text-fg font-semibold mb-2">Installation</h4>
          <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
            <code>{`pip install substrate-interface
python3 laud-cli.py`}</code>
          </pre>
        </Card>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-primary)]">
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">Module</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">Operations</th>
              </tr>
            </thead>
            <tbody>
              {LAUD_MODULES.map((mod) => (
                <tr key={mod.module} className="border-b border-[var(--color-border-primary)]">
                  <td className="py-3 px-4 font-mono font-medium text-accent">{mod.module}</td>
                  <td className="py-3 px-4 text-fg-secondary">{mod.operations}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Polkadot.js Apps */}
      <Section
        label="Explorer"
        title="Connect with Polkadot.js Apps"
        className="py-16 md:py-20"
      >
        <div className="grid md:grid-cols-2 gap-8 mt-4 items-start">
          <div className="space-y-4 text-fg-tertiary leading-relaxed">
            <p>
              Use the Polkadot.js Apps interface to explore blocks, submit extrinsics,
              and query chain state on the 7aychain devnet.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-fg-secondary">
              <li>
                Navigate to{" "}
                <a
                  href="https://polkadot.js.org/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-4 hover:text-accent-secondary transition-colors"
                >
                  polkadot.js.org/apps
                </a>
              </li>
              <li>Click the network selector (top-left)</li>
              <li>Choose &ldquo;Development&rdquo; &rarr; &ldquo;Local Node&rdquo;</li>
              <li>
                Set the endpoint to{" "}
                <code className="font-mono text-accent text-sm">ws://127.0.0.1:9944</code>
              </li>
              <li>Click &ldquo;Switch&rdquo; to connect</li>
            </ol>
          </div>

          <Card variant="default" padding="lg">
            <h4 className="text-fg font-semibold mb-3">What you can do</h4>
            <ul className="space-y-2 text-fg-tertiary text-sm">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 shrink-0">&bull;</span>
                Browse blocks and extrinsics in real time
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 shrink-0">&bull;</span>
                Submit presence declarations and attestations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 shrink-0">&bull;</span>
                Query module storage (presence, epoch, validator, etc.)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 shrink-0">&bull;</span>
                Monitor validator staking and slashing events
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 shrink-0">&bull;</span>
                Inspect ZK proof submissions and verification results
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section centered className="py-20 md:py-28">
        <h2 className="heading-md text-fg mb-6">
          Ready to build on 7aychain?
        </h2>
        <p className="body-lg max-w-2xl mx-auto mb-10">
          Explore the source code, run a local node, and start building on the Proof of Presence protocol.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={EXTERNAL_LINKS.githubRepo} external size="lg">
            View on GitHub
          </Button>
          <Button href={ROUTES.validators} variant="secondary" size="lg">
            Run a Validator
          </Button>
        </div>
      </Section>

      <Newsletter />
    </>
  );
}
