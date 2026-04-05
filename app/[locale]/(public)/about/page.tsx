import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero, Section, Card, AnimatedDiv, MotionWrapper } from "@/components/ui";
import { staggerContainer, fadeUpItem, fadeUpBlur } from "@/lib/constants/animations";
import { buildPageAlternates, buildOpenGraph } from "@/lib/utils/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildPageAlternates("/about"),
    openGraph: buildOpenGraph(t("title"), t("description"), "/about"),
  };
}

const PRINCIPLES_KEYS = [0, 1, 2] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        accentWords={[t("accentWord")]}
        description={[t("description.0"), t("description.1")]}
      />

      <Section
        label={t("mission.label")}
        title={t("mission.title")}
        className="py-20 md:py-28"
      >
        <MotionWrapper variants={staggerContainer} className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mt-6">
          <AnimatedDiv variants={fadeUpBlur} className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>{t("mission.paragraph1")}</p>
            <p>{t("mission.paragraph2")}</p>
            <p>{t("mission.paragraph3")}</p>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpBlur} className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>{t("mission.paragraph4")}</p>
            <p>{t("mission.paragraph5")}</p>
          </AnimatedDiv>
        </MotionWrapper>
      </Section>

      <Section
        label={t("vision.label")}
        title={t("vision.title")}
        className="py-20 md:py-28"
      >
        <MotionWrapper variants={staggerContainer} className="space-y-5 max-w-3xl mt-2">
          <AnimatedDiv variants={fadeUpBlur} className="text-fg-tertiary leading-relaxed">
            <p>{t("vision.paragraph1")}</p>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpItem} className="text-fg-tertiary leading-relaxed">
            <p>{t("vision.paragraph2")}</p>
          </AnimatedDiv>
        </MotionWrapper>
      </Section>

      <Section
        label={t("principles.label")}
        title={t("principles.title")}
        className="py-20 md:py-28"
      >
        <MotionWrapper variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {PRINCIPLES_KEYS.map((i) => (
            <AnimatedDiv key={i} variants={fadeUpItem}>
              <Card variant="interactive" padding="lg">
                <h3 className="font-sans font-semibold text-lg text-fg mb-3">
                  {t(`principles.items.${i}.title`)}
                </h3>
                <p className="body-base">
                  {t(`principles.items.${i}.description`)}
                </p>
              </Card>
            </AnimatedDiv>
          ))}
        </MotionWrapper>
      </Section>
    </>
  );
}
