import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero, Section, Card, Badge, Button } from "@/components/ui";
import { ROUTES, EXTERNAL_LINKS } from "@/lib/constants/routes";
import Newsletter from "@/components/landing/Newsletter";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.ecosystem" });
  return { title: t("title"), description: t("description") };
}

const DEVELOPER_TOOLS_KEYS = [0, 1, 2] as const;
const PALLET_GROUPS_KEYS = [0, 1, 2, 3] as const;

const SDK_EXAMPLES = [
  {
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
    code: `import { ApiPromise, WsProvider } from "@polkadot/api";

const provider = new WsProvider("ws://127.0.0.1:9944");
const api = await ApiPromise.create({ provider });

// Query presence state
const presence = await api.query.presence.declarations(accountId);
console.log("Presence:", presence.toHuman());`,
  },
  {
    code: `curl -H "Content-Type: application/json" \\
  -d '{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "state_getMetadata"
  }' \\
  http://127.0.0.1:9944`,
  },
] as const;

const SDK_KEYS = [0, 1, 2] as const;

const PALLET_DATA: Record<number, readonly string[]> = {
  0: ["presence", "epoch", "lifecycle", "device"],
  1: ["triangulation", "zk", "pbt"],
  2: ["validator", "dispute", "autonomous"],
  3: ["vault", "storage", "governance", "semantic", "boomerang", "octopus"],
};

export default async function EcosystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ecosystemPage");

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        accentWords={[t("accentWord")]}
        description={t("description")}
      />

      {/* Developer Tools */}
      <Section
        label={t("developerTools.label")}
        title={t("developerTools.title")}
        className="py-20 md:py-28"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {DEVELOPER_TOOLS_KEYS.map((i) => (
            <Card key={i} variant="interactive" padding="lg">
              <Badge variant="accent" className="mb-4">{t(`developerTools.tools.${i}.badge`)}</Badge>
              <h3 className="font-semibold text-fg text-lg mb-3">{t(`developerTools.tools.${i}.name`)}</h3>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {t(`developerTools.tools.${i}.description`)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* SDK Integration */}
      <Section
        label={t("sdkIntegration.label")}
        title={t("sdkIntegration.title")}
        className="py-20 md:py-28"
      >
        <p className="text-fg-tertiary leading-relaxed mb-8 max-w-3xl">
          {t("sdkIntegration.description")}
        </p>
        <div className="space-y-6">
          {SDK_KEYS.map((i) => (
            <Card key={i} variant="glass" padding="md" className="glow-border">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <h3 className="font-semibold text-fg">{t(`sdkIntegration.examples.${i}.language`)}</h3>
                <span className="text-fg-muted text-sm">&mdash; {t(`sdkIntegration.examples.${i}.description`)}</span>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary leading-relaxed">
                <code>{SDK_EXAMPLES[i].code}</code>
              </pre>
            </Card>
          ))}
        </div>
      </Section>

      {/* Protocol Modules */}
      <Section
        label={t("protocolModules.label")}
        title={t("protocolModules.title")}
        className="py-20 md:py-28"
      >
        <p className="text-fg-tertiary leading-relaxed mb-8 max-w-3xl">
          {t("protocolModules.description")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PALLET_GROUPS_KEYS.map((i) => (
            <Card key={i} variant="elevated" padding="lg">
              <h3 className="font-semibold text-fg text-lg mb-2">
                {t(`protocolModules.groups.${i}.category`)}
              </h3>
              <p className="text-fg-tertiary text-sm leading-relaxed mb-4">
                {t(`protocolModules.groups.${i}.description`)}
              </p>
              <div className="flex flex-wrap gap-2">
                {PALLET_DATA[i].map((pallet) => (
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
        label={t("community.label")}
        title={t("community.title")}
        className="py-20 md:py-28"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 max-w-2xl">
          <Card variant="interactive" padding="lg">
            <h3 className="font-semibold text-fg text-lg mb-2">{t("community.github.title")}</h3>
            <p className="text-fg-tertiary text-sm leading-relaxed mb-4">
              {t("community.github.description")}
            </p>
            <Button href={EXTERNAL_LINKS.githubRepo} external size="sm" variant="secondary">
              {t("community.github.cta")}
            </Button>
          </Card>

          <Card variant="interactive" padding="lg">
            <h3 className="font-semibold text-fg text-lg mb-2">{t("community.twitter.title")}</h3>
            <p className="text-fg-tertiary text-sm leading-relaxed mb-4">
              {t("community.twitter.description")}
            </p>
            <Button href={EXTERNAL_LINKS.twitter} external size="sm" variant="secondary">
              {t("community.twitter.cta")}
            </Button>
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
          <Button href={ROUTES.devnet} size="lg">
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
