import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero, Section, Card } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });
  return { title: t("title"), description: t("description") };
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
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mt-6">
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>{t("mission.paragraph1")}</p>
            <p>{t("mission.paragraph2")}</p>
            <p>{t("mission.paragraph3")}</p>
          </div>
          <div className="space-y-5 text-fg-tertiary leading-relaxed">
            <p>{t("mission.paragraph4")}</p>
            <p>{t("mission.paragraph5")}</p>
          </div>
        </div>
      </Section>

      <Section
        label={t("vision.label")}
        title={t("vision.title")}
        className="py-20 md:py-28"
      >
        <div className="space-y-5 max-w-3xl text-fg-tertiary leading-relaxed mt-2">
          <p>{t("vision.paragraph1")}</p>
          <p>{t("vision.paragraph2")}</p>
        </div>
      </Section>

      <Section
        label={t("principles.label")}
        title={t("principles.title")}
        className="py-20 md:py-28"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {PRINCIPLES_KEYS.map((i) => (
            <Card key={i} variant="interactive" padding="lg">
              <h3 className="font-sans font-semibold text-lg text-fg mb-3">
                {t(`principles.items.${i}.title`)}
              </h3>
              <p className="body-base">
                {t(`principles.items.${i}.description`)}
              </p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
