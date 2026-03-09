import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero, Section, Card, Badge, Button } from "@/components/ui";
import { ROUTES, EXTERNAL_LINKS } from "@/lib/constants/routes";
import Newsletter from "@/components/landing/Newsletter";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.devnet" });
  return { title: t("title"), description: t("description") };
}

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

const QUICK_START_KEYS = [0, 1, 2] as const;
const EXPLORER_ITEM_KEYS = [0, 1, 2, 3, 4] as const;

export default async function DevnetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("devnetPage");

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        accentWords={[t("accentWord")]}
        description={t("description")}
      />

      {/* Quick Start */}
      <Section
        label={t("quickStart.label")}
        title={t("quickStart.title")}
        className="py-16 md:py-20"
      >
        <div className="mt-4 space-y-4 max-w-3xl">
          {QUICK_START_KEYS.map((i) => (
            <Card key={i} variant="default" padding="md">
              <div className="flex items-baseline gap-3 mb-2">
                <Badge variant="accent">{t(`quickStart.steps.${i}.badge`)}</Badge>
                <span className="text-fg font-semibold">{t(`quickStart.steps.${i}.title`)}</span>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
                <code>{t(`quickStart.steps.${i}.code`)}</code>
              </pre>
            </Card>
          ))}
        </div>
      </Section>

      {/* Network Info */}
      <Section
        label={t("networkInfo.label")}
        title={t("networkInfo.title")}
        className="py-16 md:py-20"
      >
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <Card variant="elevated" padding="lg">
            <h3 className="text-fg font-semibold text-lg mb-4">{t("networkInfo.connection.title")}</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-fg-muted">{t("networkInfo.connection.rpcEndpoint")}</dt>
                <dd className="font-mono text-accent">{t("networkInfo.connection.rpcEndpointValue")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">{t("networkInfo.connection.chainSpec")}</dt>
                <dd className="font-mono text-fg-secondary">{t("networkInfo.connection.chainSpecValue")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">{t("networkInfo.connection.specVersion")}</dt>
                <dd className="font-mono text-fg-secondary">{t("networkInfo.connection.specVersionValue")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">{t("networkInfo.connection.binary")}</dt>
                <dd className="font-mono text-fg-secondary">{t("networkInfo.connection.binaryValue")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">{t("networkInfo.connection.sdk")}</dt>
                <dd className="font-mono text-fg-secondary">{t("networkInfo.connection.sdkValue")}</dd>
              </div>
            </dl>
          </Card>

          <Card variant="elevated" padding="lg">
            <h3 className="text-fg font-semibold text-lg mb-4">{t("networkInfo.preFundedAccounts.title")}</h3>
            <p className="text-fg-tertiary text-sm mb-4">
              {t("networkInfo.preFundedAccounts.description")}
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
        label={t("multiNodeSetup.label")}
        title={t("multiNodeSetup.title")}
        className="py-16 md:py-20"
      >
        <p className="text-fg-tertiary leading-relaxed mb-6 max-w-3xl">
          {t("multiNodeSetup.description")}
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-primary)]">
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">{t("multiNodeSetup.tableHeaders.node")}</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">{t("multiNodeSetup.tableHeaders.rpcPort")}</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">{t("multiNodeSetup.tableHeaders.role")}</th>
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
          <h4 className="text-fg font-semibold mb-2">{t("multiNodeSetup.dockerHybrid.title")}</h4>
          <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
            <code>{t("multiNodeSetup.dockerHybrid.code")}</code>
          </pre>
        </Card>
      </Section>

      {/* Laud CLI */}
      <Section
        label={t("laudCli.label")}
        title={t("laudCli.title")}
        className="py-16 md:py-20"
      >
        <p className="text-fg-tertiary leading-relaxed mb-4 max-w-3xl">
          {t("laudCli.description")}
        </p>

        <Card variant="default" padding="md" className="mb-8 max-w-3xl">
          <h4 className="text-fg font-semibold mb-2">{t("laudCli.installTitle")}</h4>
          <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
            <code>{t("laudCli.installCode")}</code>
          </pre>
        </Card>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-primary)]">
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">{t("laudCli.tableHeaders.module")}</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">{t("laudCli.tableHeaders.operations")}</th>
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
        label={t("hardware.label")}
        title={t("hardware.title")}
        className="py-16 md:py-20"
      >
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-primary)]">
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">{t("hardware.tableHeaders.spec")}</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">{t("hardware.tableHeaders.minimum")}</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">{t("hardware.tableHeaders.recommended")}</th>
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
        label={t("explorer.label")}
        title={t("explorer.title")}
        className="py-16 md:py-20"
      >
        <div className="grid md:grid-cols-2 gap-8 mt-4 items-start">
          <div className="space-y-4 text-fg-tertiary leading-relaxed">
            <p>
              {t("explorer.description")}
            </p>
            <ol className="list-decimal list-inside space-y-2 text-fg-secondary">
              <li>
                {t("explorer.steps.0")}{" "}
                <a
                  href="https://polkadot.js.org/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-4 hover:text-accent-secondary transition-colors"
                >
                  {t("explorer.steps.0link")}
                </a>
              </li>
              <li>{t("explorer.steps.1")}</li>
              <li>{t("explorer.steps.2")}</li>
              <li>
                {t("explorer.steps.3")}{" "}
                <code className="font-mono text-accent text-sm">{t("explorer.steps.3value")}</code>
              </li>
              <li>{t("explorer.steps.4")}</li>
            </ol>
          </div>

          <Card variant="default" padding="lg">
            <h4 className="text-fg font-semibold mb-3">{t("explorer.whatYouCanDo.title")}</h4>
            <ul className="space-y-2 text-fg-tertiary text-sm">
              {EXPLORER_ITEM_KEYS.map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent mt-1 shrink-0">&bull;</span>
                  {t(`explorer.whatYouCanDo.items.${i}`)}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section centered className="py-20 md:py-28">
        <h2 className="heading-md text-fg mb-6">
          {t("cta.title")}
        </h2>
        <p className="body-lg max-w-2xl mx-auto mb-10">
          {t("cta.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={EXTERNAL_LINKS.githubRepo} external size="lg">
            {t("cta.primary")}
          </Button>
          <Button href={ROUTES.validators} variant="secondary" size="lg">
            {t("cta.secondary")}
          </Button>
        </div>
      </Section>

      <Newsletter />
    </>
  );
}
