import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero, Section, Card, Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants/routes";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.useCases" });
  return { title: t("title"), description: t("description") };
}

const SIGNAL_CARD_KEYS = [0, 1, 2, 3] as const;
const USE_CASE_KEYS = [0, 1, 2, 3, 4, 5] as const;

export default async function UseCasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("useCasesPage");

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        accentWords={[t("accentWord")]}
        description={t("description")}
      />

      <Section className="py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h2 className="heading-sm text-fg mb-4">
              {t("sybilProblem.title")}
            </h2>
            <div className="space-y-5 text-fg-tertiary leading-relaxed">
              <p>{t("sybilProblem.paragraph1")}</p>
              <p>{t("sybilProblem.paragraph2")}</p>
            </div>
          </div>
          <div>
            <h2 className="heading-sm text-fg mb-4">
              {t("physicsSolution.title")}
            </h2>
            <div className="space-y-5 text-fg-tertiary leading-relaxed">
              <p>{t("physicsSolution.paragraph1")}</p>
              <p>{t("physicsSolution.paragraph2")}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24">
        <div className="text-center mb-16">
          <span className="label-sm block mb-4">
            {t("applicationsLabel")}
          </span>
          <h2 className="heading-md text-fg mb-4">
            {t("applicationsTitle")}
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            {t("applicationsSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20 max-w-4xl mx-auto">
          {SIGNAL_CARD_KEYS.map((i) => (
            <Card key={i} variant="interactive" padding="md">
              <h3 className="font-sans font-semibold text-base text-fg mb-1.5">
                {t(`signalCards.${i}.title`)}
              </h3>
              <p className="text-fg-muted text-sm leading-relaxed">
                {t(`signalCards.${i}.description`)}
              </p>
            </Card>
          ))}
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {USE_CASE_KEYS.map((i) => (
            <Card key={i} variant="default" padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[var(--color-accent-dim)] text-accent text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <h3 className="font-display font-bold text-xl text-fg">
                  {t(`useCases.${i}.title`)}
                </h3>
              </div>
              <p className="text-fg-secondary leading-relaxed mb-3">
                {t(`useCases.${i}.description`)}
              </p>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {t(`useCases.${i}.detail`)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section centered className="py-20 md:py-28">
        <h2 className="heading-md text-fg mb-6">
          {t("ctaTitle")}
        </h2>
        <p className="body-lg max-w-2xl mx-auto mb-10">
          {t("ctaSubtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={ROUTES.devnet} size="lg">
            {t("ctaPrimary")}
          </Button>
          <Button href={ROUTES.waitlist} variant="secondary" size="lg">
            {t("ctaSecondary")}
          </Button>
        </div>
      </Section>
    </>
  );
}
