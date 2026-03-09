import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/ui";
import TechHowItWorks from "@/components/technology/TechHowItWorks";
import PresenceJourney from "@/components/technology/PresenceJourney";
import ArchitectureLayers from "@/components/technology/ArchitectureLayers";
import PrivacyZK from "@/components/technology/PrivacyZK";
import Newsletter from "@/components/landing/Newsletter";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.technology" });
  return { title: t("title"), description: t("description") };
}

export default async function TechnologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("technologyPage");

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        accentWords={[t("accentWord")]}
        description={[t("description.0"), t("description.1")]}
      />

      <TechHowItWorks />
      <PresenceJourney />
      <ArchitectureLayers />
      <PrivacyZK />
      <Newsletter />
    </>
  );
}
