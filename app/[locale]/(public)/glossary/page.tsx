import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero, Section, Card, AnimatedDiv, MotionWrapper } from "@/components/ui";
import { staggerContainer, fadeUpItem, fadeUpBlur } from "@/lib/constants/animations";
import Newsletter from "@/components/landing/Newsletter";
import { buildPageAlternates, buildOpenGraph } from "@/lib/utils/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.glossary" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildPageAlternates("/glossary"),
    openGraph: buildOpenGraph(t("title"), t("description"), "/glossary"),
  };
}

interface GlossaryTerm {
  readonly term: string;
  readonly definition: string;
  readonly letter: string;
}

/* Group terms by letter for navigation */
function getUniqueLetters(terms: GlossaryTerm[]): string[] {
  return [...new Set(terms.map((t) => t.letter))].sort();
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("glossaryPage");

  // Get all terms as a raw object and convert to array
  const termsObj = t.raw("terms") as Record<string, GlossaryTerm>;
  const glossaryTerms: GlossaryTerm[] = Object.values(termsObj);

  const letters = getUniqueLetters(glossaryTerms);

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        accentWords={[t("accentWord")]}
        description={t("description")}
      />

      {/* Letter Navigation */}
      <Section className="py-8 md:py-10">
        <MotionWrapper variants={staggerContainer} as="div" className="flex flex-wrap gap-2 justify-center">
          {letters.map((letter) => (
            <AnimatedDiv key={letter} variants={fadeUpItem}>
              <a
                href={`#letter-${letter}`}
                className="w-9 h-9 rounded-full glass-card text-fg-secondary text-sm font-medium flex items-center justify-center hover:text-fg hover:shadow-[var(--glow-cyan-sm)] transition-all duration-300"
              >
                {letter}
              </a>
            </AnimatedDiv>
          ))}
        </MotionWrapper>
      </Section>

      {/* Terms grouped by letter */}
      <Section className="py-8 md:py-16">
        <div className="space-y-12">
          {letters.map((letter) => {
            const termsForLetter = glossaryTerms.filter((term) => term.letter === letter);
            return (
              <MotionWrapper key={letter} variants={staggerContainer} as="div" className="scroll-mt-24" id={`letter-${letter}`}>
                <AnimatedDiv variants={fadeUpBlur}>
                  <h2 className="font-display font-bold text-3xl text-fg mb-6 border-b border-[var(--color-border-primary)] pb-3">
                    {letter}
                  </h2>
                </AnimatedDiv>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {termsForLetter.map((item) => (
                    <AnimatedDiv key={item.term} variants={fadeUpItem}>
                      <Card variant="glass" padding="md" className="glow-border">
                        <h3 className="font-semibold text-fg text-lg mb-2">
                          {item.term}
                        </h3>
                        <p className="text-fg-tertiary text-sm leading-relaxed">
                          {item.definition}
                        </p>
                      </Card>
                    </AnimatedDiv>
                  ))}
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </Section>

      <Newsletter />
    </>
  );
}
