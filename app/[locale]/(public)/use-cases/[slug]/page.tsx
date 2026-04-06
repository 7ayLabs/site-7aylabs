import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  PageHero,
  Section,
  Card,
  Button,
  AnimatedDiv,
  MotionWrapper,
} from "@/components/ui";
import { ROUTES } from "@/lib/constants/routes";
import {
  staggerContainer,
  fadeUpItem,
  fadeUpBlur,
  listStagger,
} from "@/lib/constants/animations";
import { routing } from "@/i18n/routing";
import { buildPageAlternates, buildOpenGraph } from "@/lib/utils/seo";

const USE_CASE_SLUGS = [
  "fair-drops",
  "event-proof",
  "local-rewards",
  "fair-voting",
  "verified-reviews",
  "emergency-checkin",
  "presence-defi",
  "delivery-proof",
] as const;

type UseCaseSlug = (typeof USE_CASE_SLUGS)[number];

const FEATURE_KEYS = [0, 1, 2, 3] as const;

function isValidSlug(slug: string): slug is UseCaseSlug {
  return (USE_CASE_SLUGS as readonly string[]).includes(slug);
}

export function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of routing.locales) {
    for (const slug of USE_CASE_SLUGS) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isValidSlug(slug)) {
    return { title: "Use Case Not Found" };
  }

  const t = await getTranslations({ locale, namespace: "useCaseDetails" });
  const title = t(`items.${slug}.title`);
  const description = t(`items.${slug}.subtitle`);
  const path = `/use-cases/${slug}`;

  return {
    title,
    description,
    alternates: buildPageAlternates(path),
    openGraph: buildOpenGraph(title, description, path),
  };
}

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isValidSlug(slug)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations("useCaseDetails");

  const itemPath = `items.${slug}`;

  return (
    <>
      <PageHero
        label={t("common.label")}
        title={t(`${itemPath}.title`)}
        description={t(`${itemPath}.subtitle`)}
      />

      <Section className="pb-8 -mt-8 md:-mt-12">
        <AnimatedDiv variants={fadeUpItem}>
          <Link
            href={ROUTES.useCases}
            className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent transition-colors duration-200 group"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {t("common.backLink")}
          </Link>
        </AnimatedDiv>
      </Section>

      <Section className="py-16 md:py-20">
        <MotionWrapper
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 md:gap-16"
        >
          <AnimatedDiv variants={fadeUpBlur}>
            <span className="block text-[11px] tracking-[0.15em] uppercase text-fg-muted mb-3">
              {t("common.problemLabel")}
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-fg mb-4">
              {t(`${itemPath}.title`)}
            </h2>
            <p className="text-fg-tertiary leading-relaxed">
              {t(`${itemPath}.problem`)}
            </p>
          </AnimatedDiv>

          <AnimatedDiv variants={fadeUpBlur}>
            <span className="block text-[11px] tracking-[0.15em] uppercase text-fg-muted mb-3">
              {t("common.solutionLabel")}
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-fg mb-4">
              <span className="gradient-text-accent">7aychain</span>
            </h2>
            <p className="text-fg-tertiary leading-relaxed">
              {t(`${itemPath}.solution`)}
            </p>
          </AnimatedDiv>
        </MotionWrapper>
      </Section>

      <Section className="py-16 md:py-20">
        <MotionWrapper variants={staggerContainer} className="text-center mb-12">
          <AnimatedDiv variants={fadeUpItem}>
            <span className="block text-[11px] tracking-[0.15em] uppercase text-fg-muted mb-3">
              {t("common.featuresLabel")}
            </span>
          </AnimatedDiv>
        </MotionWrapper>

        <MotionWrapper
          variants={listStagger}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto"
        >
          {FEATURE_KEYS.map((i) => (
            <AnimatedDiv key={i} variants={fadeUpItem}>
              <Card variant="default" padding="md">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 h-6 w-6 rounded-full bg-[var(--color-accent-dim)] text-accent text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm text-fg-secondary leading-relaxed">
                    {t(`${itemPath}.features.${i}`)}
                  </p>
                </div>
              </Card>
            </AnimatedDiv>
          ))}
        </MotionWrapper>
      </Section>

      <Section centered className="py-20 md:py-28">
        <AnimatedDiv variants={fadeUpBlur}>
          <h2 className="font-display font-bold text-2xl md:text-4xl tracking-tight text-fg mb-6">
            {t("common.ctaTitle")}
          </h2>
        </AnimatedDiv>
        <AnimatedDiv variants={fadeUpItem}>
          <p className="text-base text-fg-tertiary max-w-2xl mx-auto mb-10">
            {t("common.ctaSubtitle")}
          </p>
        </AnimatedDiv>
        <MotionWrapper
          variants={staggerContainer}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <AnimatedDiv variants={fadeUpItem}>
            <Button href={ROUTES.devnet} size="lg">
              {t("common.ctaPrimary")}
            </Button>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpItem}>
            <Button href={ROUTES.waitlist} variant="secondary" size="lg">
              {t("common.ctaSecondary")}
            </Button>
          </AnimatedDiv>
        </MotionWrapper>
      </Section>
    </>
  );
}
