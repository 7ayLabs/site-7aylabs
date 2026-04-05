import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero, Section, Card, Button, AnimatedDiv, MotionWrapper } from "@/components/ui";
import { EXTERNAL_LINKS, ROUTES } from "@/lib/constants/routes";
import { staggerContainer, fadeUpItem, fadeUpBlur, listStagger, scrollFadeIn } from "@/lib/constants/animations";
import { buildPageAlternates, buildOpenGraph } from "@/lib/utils/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.whyPresence" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildPageAlternates("/why-presence"),
    openGraph: buildOpenGraph(t("title"), t("description"), "/why-presence"),
  };
}

const PILLAR_KEYS = [0, 1, 2] as const;
const SYBIL_KEYS = [0, 1, 2, 3] as const;
const COMPARISON_KEYS = [0, 1, 2, 3, 4, 5, 6] as const;

export default async function WhyPresencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("whyPresencePage");

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        accentWords={t.raw("accentWords")}
        description={t("description")}
      />

      <Section title={t("presenceInfrastructure.sectionTitle")} className="py-16 md:py-20">
        <MotionWrapper variants={staggerContainer} className="space-y-5 max-w-3xl text-fg-tertiary text-base sm:text-lg leading-relaxed">
          <AnimatedDiv variants={fadeUpBlur}>
            <p>{t("presenceInfrastructure.paragraph1")}</p>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpItem}>
            <p>{t("presenceInfrastructure.paragraph2")}</p>
          </AnimatedDiv>
        </MotionWrapper>
      </Section>

      {/* Core Pillars */}
      <Section maxWidth="6xl" className="py-16 md:py-24">
        <MotionWrapper variants={staggerContainer} className="mb-12">
          <AnimatedDiv variants={fadeUpItem}>
            <span className="block text-sm uppercase tracking-widest text-accent mb-4">
              {t("physicsArgument.label")}
            </span>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpBlur}>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-fg mb-4">
              {t("physicsArgument.title")}
            </h2>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpItem}>
            <p className="max-w-3xl text-fg-tertiary text-lg leading-relaxed">
              {t("physicsArgument.subtitle")}
            </p>
          </AnimatedDiv>
        </MotionWrapper>

        <MotionWrapper variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLAR_KEYS.map((i) => (
            <AnimatedDiv key={i} variants={fadeUpItem}>
              <Card variant="interactive" padding="md">
                <h3 className="font-sans font-semibold text-lg text-fg mb-3">
                  {t(`pillars.${i}.title`)}
                </h3>
                <p className="text-fg-tertiary text-sm leading-relaxed">
                  {t(`pillars.${i}.description`)}
                </p>
              </Card>
            </AnimatedDiv>
          ))}
        </MotionWrapper>
      </Section>

      {/* Sybil Resistance Arguments */}
      <Section className="py-16 md:py-20">
        <MotionWrapper variants={fadeUpBlur}>
          <Card variant="elevated" padding="lg" className="mb-12 max-w-3xl">
            <span className="block text-xs uppercase tracking-widest text-accent mb-4">
              {t("coreInsight.label")}
            </span>
            <h3 className="font-display font-bold text-xl md:text-2xl text-fg mb-3">
              {t("coreInsight.title")}
            </h3>
            <p className="text-fg-tertiary leading-relaxed">
              {t("coreInsight.description")}
            </p>
          </Card>
        </MotionWrapper>

        <MotionWrapper variants={listStagger} className="space-y-6 max-w-4xl">
          {SYBIL_KEYS.map((i) => (
            <AnimatedDiv key={i} variants={fadeUpItem} className="grid md:grid-cols-2 gap-4 md:gap-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-fg-muted block mb-2">
                  {t("sybilArguments.problemLabel")}
                </span>
                <p className="text-fg font-medium">
                  {t(`sybilArguments.items.${i}.problem`)}
                </p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-accent block mb-2">
                  {t("sybilArguments.responseLabel")}
                </span>
                <p className="text-fg-tertiary text-sm leading-relaxed">
                  {t(`sybilArguments.items.${i}.response`)}
                </p>
              </div>
            </AnimatedDiv>
          ))}
        </MotionWrapper>
      </Section>

      {/* Comparison Table */}
      <Section maxWidth="6xl" className="py-16 md:py-24">
        <MotionWrapper variants={staggerContainer} className="mb-12 text-center">
          <AnimatedDiv variants={fadeUpItem}>
            <span className="block text-sm uppercase tracking-widest text-accent mb-4">
              {t("comparison.label")}
            </span>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpBlur}>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-fg mb-4">
              {t("comparison.title")}
            </h2>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpItem}>
            <p className="max-w-3xl text-fg-tertiary text-lg mx-auto leading-relaxed">
              {t("comparison.subtitle")}
            </p>
          </AnimatedDiv>
        </MotionWrapper>

        <MotionWrapper variants={scrollFadeIn} className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[var(--color-border-primary)]">
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs w-36">
                  {t("comparison.headers.dimension")}
                </th>
                <th className="text-left py-3 px-4 text-accent font-medium text-xs uppercase tracking-wider bg-[var(--color-accent-dim)] rounded-t-lg">
                  {t("comparison.headers.sevenychain")}
                </th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium text-xs uppercase tracking-wider">
                  {t("comparison.headers.worldcoin")}
                </th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium text-xs uppercase tracking-wider">
                  {t("comparison.headers.brightid")}
                </th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium text-xs uppercase tracking-wider">
                  {t("comparison.headers.passport")}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_KEYS.map((i) => (
                <tr key={i} className="border-b border-[var(--color-border-primary)]">
                  <td className="py-3 px-4 font-medium text-fg whitespace-nowrap">
                    {t(`comparison.rows.${i}.dimension`)}
                  </td>
                  <td className="py-3 px-4 text-accent font-medium bg-[var(--color-accent-dim)]">
                    {t(`comparison.rows.${i}.sevenychain`)}
                  </td>
                  <td className="py-3 px-4 text-fg-tertiary">
                    {t(`comparison.rows.${i}.worldcoin`)}
                  </td>
                  <td className="py-3 px-4 text-fg-tertiary">
                    {t(`comparison.rows.${i}.brightid`)}
                  </td>
                  <td className="py-3 px-4 text-fg-tertiary">
                    {t(`comparison.rows.${i}.passport`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </MotionWrapper>
      </Section>

      {/* CTA */}
      <Section centered className="py-20 md:py-28">
        <MotionWrapper variants={staggerContainer}>
          <AnimatedDiv variants={fadeUpItem}>
            <span className="block text-sm uppercase tracking-widest text-accent mb-4">
              {t("cta.label")}
            </span>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpBlur}>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-fg mb-4">
              {t("cta.title")}
            </h3>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpItem}>
            <p className="mx-auto max-w-xl text-fg-tertiary text-lg leading-relaxed mb-8">
              {t("cta.subtitle")}
            </p>
          </AnimatedDiv>
        </MotionWrapper>
        <MotionWrapper variants={staggerContainer} className="flex flex-col sm:flex-row gap-4 justify-center">
          <AnimatedDiv variants={fadeUpItem}>
            <Button href={EXTERNAL_LINKS.twitter} external size="lg">
              {t("cta.primary")}
            </Button>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpItem}>
            <Button href={ROUTES.technology} variant="secondary" size="lg">
              {t("cta.secondary")}
            </Button>
          </AnimatedDiv>
        </MotionWrapper>
      </Section>
    </>
  );
}
