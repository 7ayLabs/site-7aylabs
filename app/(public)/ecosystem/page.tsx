import type { Metadata } from "next";
import { PageHero, Section, Card, Badge, Button } from "@/components/ui";
import { ROUTES, EXTERNAL_LINKS } from "@/lib/constants/routes";
import Newsletter from "@/components/landing/Newsletter";

export const metadata: Metadata = {
  title: "Ecosystem",
  description:
    "Build on the 7aychain presence layer. Developer tools, SDK integrations, protocol modules, and community resources for the Proof of Presence ecosystem.",
  keywords: [
    "build on 7aychain",
    "Substrate SDK integration",
    "presence layer developers",
    "7aychain ecosystem",
    "blockchain developer tools",
    "Polkadot SDK",
  ],
};

const DEVELOPER_TOOLS = [
  {
    name: "Laud Networks CLI",
    description:
      "Python-based TUI for interacting with all 16 7aychain pallets. Declare presence, manage validators, submit ZK proofs, and query chain state from the terminal.",
    badge: "CLI Tool",
  },
  {
    name: "Polkadot.js Apps",
    description:
      "Full-featured web interface for browsing blocks, submitting extrinsics, and querying storage on the 7aychain devnet. Connect to ws://127.0.0.1:9944.",
    badge: "Web UI",
  },
  {
    name: "JSON-RPC API",
    description:
      "Standard Substrate JSON-RPC interface for programmatic access. Compatible with any HTTP or WebSocket client. Supports all runtime APIs and custom pallet methods.",
    badge: "API",
  },
] as const;

const SDK_EXAMPLES = [
  {
    language: "Rust (Subxt)",
    description: "Type-safe Substrate client for Rust applications",
    code: `use subxt::{OnlineClient, PolkadotConfig};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let api = OnlineClient::<PolkadotConfig>::from_url(
        "ws://127.0.0.1:9944"
    ).await?;

    let block = api.blocks().at_latest().await?;
    println!("Latest block: {}", block.number());
    Ok(())
}`,
  },
  {
    language: "JavaScript (@polkadot/api)",
    description: "Full-featured JS/TS client for browser and Node.js",
    code: `import { ApiPromise, WsProvider } from "@polkadot/api";

const provider = new WsProvider("ws://127.0.0.1:9944");
const api = await ApiPromise.create({ provider });

// Query presence state
const presence = await api.query.presence.declarations(accountId);
console.log("Presence:", presence.toHuman());`,
  },
  {
    language: "cURL (JSON-RPC)",
    description: "Direct HTTP calls for any language or tool",
    code: `curl -H "Content-Type: application/json" \\
  -d '{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "state_getMetadata"
  }' \\
  http://127.0.0.1:9944`,
  },
] as const;

const PALLET_GROUPS = [
  {
    category: "Presence Layer",
    pallets: ["presence", "epoch", "lifecycle", "device"],
    description: "Core presence declaration, epoch management, state machine, and device registration.",
  },
  {
    category: "Verification",
    pallets: ["triangulation", "zk", "pbt"],
    description: "Position estimation, zero-knowledge proofs, and position-bound token minting.",
  },
  {
    category: "Security",
    pallets: ["validator", "dispute", "autonomous"],
    description: "Validator staking, dispute resolution, and autonomous anomaly detection.",
  },
  {
    category: "Infrastructure",
    pallets: ["vault", "storage", "governance", "semantic", "boomerang", "octopus"],
    description: "Data vaults, on-chain storage, governance, trust graphs, return proofs, and group management.",
  },
] as const;

export default function EcosystemPage() {
  return (
    <>
      <PageHero
        label="Ecosystem"
        title="Build on the Presence Layer"
        description="Developer tools, SDK integrations, and protocol modules for building applications on 7aychain's Proof of Presence infrastructure."
      />

      {/* Developer Tools */}
      <Section
        label="Developer Tools"
        title="Tools for interacting with 7aychain"
        className="py-16 md:py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {DEVELOPER_TOOLS.map((tool) => (
            <Card key={tool.name} variant="interactive" padding="lg">
              <Badge variant="accent" className="mb-4">{tool.badge}</Badge>
              <h3 className="font-semibold text-fg text-lg mb-3">{tool.name}</h3>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {tool.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* SDK Integration */}
      <Section
        label="SDK Integration"
        title="Connect from any language"
        className="py-16 md:py-20"
      >
        <p className="text-fg-tertiary leading-relaxed mb-8 max-w-3xl">
          7aychain exposes a standard Substrate RPC interface. Use any Substrate-compatible
          SDK to interact with the chain programmatically.
        </p>
        <div className="space-y-6">
          {SDK_EXAMPLES.map((sdk) => (
            <Card key={sdk.language} variant="default" padding="md">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <h3 className="font-semibold text-fg">{sdk.language}</h3>
                <span className="text-fg-muted text-sm">&mdash; {sdk.description}</span>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary leading-relaxed">
                <code>{sdk.code}</code>
              </pre>
            </Card>
          ))}
        </div>
      </Section>

      {/* Protocol Modules */}
      <Section
        label="Protocol Modules"
        title="16 pallets to build with"
        className="py-16 md:py-24"
      >
        <p className="text-fg-tertiary leading-relaxed mb-8 max-w-3xl">
          7aychain&apos;s runtime is composed of 16 custom pallets organized into four
          functional groups. Each pallet exposes extrinsics, storage, and events that
          developers can interact with.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PALLET_GROUPS.map((group) => (
            <Card key={group.category} variant="elevated" padding="lg">
              <h3 className="font-semibold text-fg text-lg mb-2">
                {group.category}
              </h3>
              <p className="text-fg-tertiary text-sm leading-relaxed mb-4">
                {group.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.pallets.map((pallet) => (
                  <Badge key={pallet} variant="outline">
                    <code className="text-xs">{pallet}</code>
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Community */}
      <Section
        label="Community"
        title="Join the 7aychain community"
        className="py-16 md:py-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 max-w-2xl">
          <Card variant="interactive" padding="lg">
            <h3 className="font-semibold text-fg text-lg mb-2">GitHub</h3>
            <p className="text-fg-tertiary text-sm leading-relaxed mb-4">
              Explore the source code, file issues, and contribute to the protocol.
            </p>
            <Button href={EXTERNAL_LINKS.githubRepo} external size="sm" variant="secondary">
              View Repository
            </Button>
          </Card>

          <Card variant="interactive" padding="lg">
            <h3 className="font-semibold text-fg text-lg mb-2">X (Twitter)</h3>
            <p className="text-fg-tertiary text-sm leading-relaxed mb-4">
              Follow for protocol updates, development progress, and community news.
            </p>
            <Button href={EXTERNAL_LINKS.twitter} external size="sm" variant="secondary">
              Follow @7ayLabs
            </Button>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section centered className="py-20 md:py-28">
        <h2 className="heading-md text-fg mb-6">
          Ready to build?
        </h2>
        <p className="body-lg max-w-2xl mx-auto mb-10">
          The devnet is live. Start building on the Proof of Presence protocol today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={ROUTES.devnet} size="lg">
            Connect to Devnet
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
