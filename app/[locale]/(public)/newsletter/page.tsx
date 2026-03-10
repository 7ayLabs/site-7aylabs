import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero, Section, Card, Button } from "@/components/ui";
import { EXTERNAL_LINKS } from "@/lib/constants/routes";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.newsletter" });
  return { title: t("title"), description: t("description") };
}

const TOPIC_KEYS = [0, 1, 2] as const;

export default async function NewsletterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("newsletterPage");

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        accentWords={[t("accentWord")]}
        description={t("description")}
      />

      <Section
        label={t("whatYouGet.label")}
        title={t("whatYouGet.title")}
        subtitle={t("whatYouGet.subtitle")}
        className="py-16 md:py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {TOPIC_KEYS.map((i) => (
            <Card key={i} variant="interactive" padding="lg">
              <h3 className="font-sans font-semibold text-lg text-fg mb-3">
                {t(`topics.${i}.title`)}
              </h3>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {t(`topics.${i}.description`)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section centered className="py-20 md:py-28">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-fg mb-6">
          {t("followTitle")}
        </h2>
        <p className="text-fg-tertiary text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          {t("followSubtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href={EXTERNAL_LINKS.twitter} external size="lg">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2H21.552L14.34 10.471L22.824 22H16.172L10.96 14.981L4.964 22H1.656L9.316 12.984L1.176 2H7.996L12.708 8.327L18.244 2ZM17.092 20H18.924L7.004 3.937H5.04L17.092 20Z" />
            </svg>
            {t("followCta")}
          </Button>
        </div>

        <p className="mt-6 text-fg-faint text-sm">
          {t("noSpam")}
        </p>
      </Section>
    </>
  );
}
