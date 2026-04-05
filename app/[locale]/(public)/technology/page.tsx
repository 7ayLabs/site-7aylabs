import { getTranslations, setRequestLocale } from "next-intl/server";
import Button from "@/components/ui/Button";
import { MotionWrapper, AnimatedDiv } from "@/components/ui";
import { staggerContainer, fadeUpItem, fadeUpBlur, textReveal } from "@/lib/constants/animations";
import TechHowItWorks from "@/components/technology/TechHowItWorks";
import PresenceJourney from "@/components/technology/PresenceJourney";
import ArchitectureLayers from "@/components/technology/ArchitectureLayers";
import PrivacyZK from "@/components/technology/PrivacyZK";
import Newsletter from "@/components/landing/Newsletter";
import { buildPageAlternates, buildOpenGraph } from "@/lib/utils/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.technology" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildPageAlternates("/technology"),
    openGraph: buildOpenGraph(t("title"), t("description"), "/technology"),
  };
}

export default async function TechnologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("technologyPage");
  const tc = await getTranslations("common");

  /* Split title around accent word: "Proof of Presence" -> "Proof of " + "Presence" */
  const fullTitle = t("title");
  const accent = t("accentWord");
  const titleBefore = fullTitle.replace(accent, "").trimEnd();

  return (
    <>
      {/* Big Hero */}
      <section className="relative min-h-[85svh] w-full flex flex-col items-center justify-center overflow-hidden pt-24 pb-8 md:pt-20 md:pb-0">
        {/* Decorative gradient blob */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-30 blur-[120px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, var(--color-accent-primary), var(--color-accent-secondary), transparent)",
          }}
          aria-hidden="true"
        />

        <MotionWrapper variants={staggerContainer} className="relative z-10 flex flex-col items-center text-center px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto">
          {/* Label */}
          <AnimatedDiv variants={fadeUpItem}>
            <span className="block text-sm uppercase tracking-widest text-fg-muted mb-6">
              {t("label")}
            </span>
          </AnimatedDiv>

          {/* Big heading */}
          <AnimatedDiv variants={textReveal}>
            <h1 className="font-display font-extrabold text-[2.5rem] sm:text-5xl md:text-7xl tracking-tight leading-[0.95] text-fg">
              {titleBefore}{" "}
              <span className="gradient-text-accent">{accent}</span>
            </h1>
          </AnimatedDiv>

          {/* Description */}
          <AnimatedDiv variants={fadeUpBlur}>
            <p className="mt-6 mx-auto max-w-2xl text-fg-secondary text-lg md:text-xl leading-relaxed">
              {t("description.0")}
            </p>
          </AnimatedDiv>
          <AnimatedDiv variants={fadeUpBlur}>
            <p className="mt-4 mx-auto max-w-2xl text-fg-tertiary text-base md:text-lg leading-relaxed">
              {t("description.1")}
            </p>
          </AnimatedDiv>

          {/* CTA buttons */}
          <AnimatedDiv variants={fadeUpItem} className="flex flex-wrap gap-4 justify-center mt-10">
            <Button href="/waitlist" variant="primary" size="lg">
              {tc("joinWaitlist")}
            </Button>
            <Button href="#how-it-works" variant="secondary" size="lg" withArrow>
              {tc("learnMore")}
            </Button>
          </AnimatedDiv>
        </MotionWrapper>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to top, var(--color-bg-primary), transparent)",
          }}
          aria-hidden="true"
        />
      </section>

      <TechHowItWorks />
      <PresenceJourney />
      <ArchitectureLayers />
      <PrivacyZK />
      <Newsletter />
    </>
  );
}
