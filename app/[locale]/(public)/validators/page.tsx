import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero, Section, Card, Badge, Button } from "@/components/ui";
import { ROUTES, EXTERNAL_LINKS } from "@/lib/constants/routes";
import Newsletter from "@/components/landing/Newsletter";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.validators" });
  return { title: t("title"), description: t("description") };
}

const HARDWARE_REQUIREMENTS = [
  { spec: "CPU Cores", minimum: "4 cores", recommended: "8+ cores" },
  { spec: "RAM", minimum: "8 GB", recommended: "16 GB" },
  { spec: "Storage", minimum: "50 GB SSD", recommended: "100 GB NVMe" },
  { spec: "Network", minimum: "10 Mbps", recommended: "100+ Mbps" },
] as const;

const PREREQUISITES_KEYS = [0, 1, 2, 3] as const;
const SETUP_KEYS = [0, 1, 2] as const;
const CLI_FLAGS_KEYS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const STAKING_KEYS = [0, 1, 2, 3, 4] as const;

export default async function ValidatorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("validatorsPage");

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        accentWords={[t("accentWord")]}
        description={t("description")}
      />

      {/* Role Overview */}
      <Section
        label={t("roleOverview.label")}
        title={t("roleOverview.title")}
        className="py-16 md:py-20"
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mt-4">
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>{t("roleOverview.paragraph1")}</p>
            <p>{t("roleOverview.paragraph2")}</p>
          </div>
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>{t("roleOverview.paragraph3")}</p>
            <p>{t("roleOverview.paragraph4")}</p>
          </div>
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

      {/* Prerequisites */}
      <Section
        label={t("prerequisites.label")}
        title={t("prerequisites.title")}
        className="py-16 md:py-20"
      >
        <p className="text-fg-tertiary leading-relaxed mb-6 max-w-3xl">
          {t("prerequisites.description")}
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {PREREQUISITES_KEYS.map((i) => (
            <Card key={i} variant="default" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="accent">{t(`prerequisites.systems.${i}.os`)}</Badge>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-xs font-mono text-fg-secondary leading-relaxed">
                <code>{t(`prerequisites.systems.${i}.commands`)}</code>
              </pre>
            </Card>
          ))}
        </div>
      </Section>

      {/* Setup Guide */}
      <Section
        label={t("setup.label")}
        title={t("setup.title")}
        className="py-16 md:py-20"
      >
        <div className="space-y-4 mt-4 max-w-3xl">
          {SETUP_KEYS.map((i) => (
            <Card key={i} variant="default" padding="md">
              <div className="flex items-baseline gap-3 mb-2">
                <Badge variant="accent">{t(`setup.steps.${i}.badge`)}</Badge>
                <span className="text-fg font-semibold">{t(`setup.steps.${i}.title`)}</span>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-[var(--color-bg-card-hover)] p-4 text-sm font-mono text-fg-secondary">
                <code>{t(`setup.steps.${i}.code`)}</code>
              </pre>
            </Card>
          ))}
        </div>
      </Section>

      {/* CLI Configuration */}
      <Section
        label={t("configuration.label")}
        title={t("configuration.title")}
        className="py-16 md:py-20"
      >
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-primary)]">
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">{t("configuration.tableHeaders.flag")}</th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs">{t("configuration.tableHeaders.description")}</th>
              </tr>
            </thead>
            <tbody>
              {CLI_FLAGS_KEYS.map((i) => (
                <tr key={i} className="border-b border-[var(--color-border-primary)]">
                  <td className="py-3 px-4 font-mono text-accent whitespace-nowrap">{t(`configuration.flags.${i}.flag`)}</td>
                  <td className="py-3 px-4 text-fg-secondary">{t(`configuration.flags.${i}.description`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Staking & Slashing */}
      <Section
        label={t("economics.label")}
        title={t("economics.title")}
        className="py-16 md:py-24"
      >
        <p className="text-fg-tertiary leading-relaxed mb-8 max-w-3xl">
          {t("economics.description")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STAKING_KEYS.map((i) => (
            <Card key={i} variant="interactive" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-full bg-[var(--color-accent-dim)] text-accent text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-fg">{t(`economics.steps.${i}.step`)}</h3>
              </div>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {t(`economics.steps.${i}.description`)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Witness Circles */}
      <Section
        label={t("witnessCircles.label")}
        title={t("witnessCircles.title")}
        className="py-16 md:py-20"
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mt-4">
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>
              {t("witnessCircles.paragraph1")}{" "}
              <strong className="text-fg-secondary">{t("witnessCircles.witnessCircleHighlight")}</strong>
              {t("witnessCircles.paragraph1cont")}
            </p>
            <p>{t("witnessCircles.paragraph2")}</p>
          </div>
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>{t("witnessCircles.paragraph3")}</p>
            <p>{t("witnessCircles.paragraph4")}</p>
          </div>
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
          <Button href={ROUTES.devnet} variant="secondary" size="lg">
            {t("cta.secondary")}
          </Button>
        </div>
      </Section>

      <Newsletter />
    </>
  );
}
