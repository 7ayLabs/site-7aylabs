import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, Card } from "@/components/ui";
import { EXTERNAL_LINKS } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Stay updated with 7ayLabs — product insights, protocol progress, and real-world presence infrastructure updates.",
};

const TOPICS = [
  {
    title: "Protocol progress",
    description:
      "Detailed updates on 7aychain development, from protocol milestones and ZK verification to devnet deployments.",
  },
  {
    title: "Product insights",
    description:
      "How real-world presence is being applied in products, pilots, and early-stage deployments.",
  },
  {
    title: "Industry analysis",
    description:
      "Perspectives on AI resilience, human verification, and the evolving landscape of trust infrastructure.",
  },
] as const;

export default function NewsletterPage() {
  return (
    <>
      <PageHero
        label="Newsletter"
        title="Stay in the Loop"
        description="Product insights, protocol progress, and real-world presence infrastructure -- delivered when it matters."
      />

      <Section
        label="What You'll Get"
        title="Signal, not noise"
        subtitle="We write when there is something worth sharing -- no filler, no weekly obligations, no marketing fluff."
        className="py-16 md:py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {TOPICS.map((topic) => (
            <Card key={topic.title} variant="interactive" padding="lg">
              <h3 className="font-sans font-semibold text-lg text-white mb-3">
                {topic.title}
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">
                {topic.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section centered className="py-20 md:py-28">
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-white mb-6">
          Follow our progress
        </h2>
        <p className="text-white/55 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          The newsletter is coming soon. In the meantime, follow us on X for
          real-time updates on 7aychain and 7ayLabs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={EXTERNAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-accent text-black px-8 py-3.5 min-h-[48px] text-sm font-semibold hover:bg-accent-secondary transition-colors duration-normal"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2H21.552L14.34 10.471L22.824 22H16.172L10.96 14.981L4.964 22H1.656L9.316 12.984L1.176 2H7.996L12.708 8.327L18.244 2ZM17.092 20H18.924L7.004 3.937H5.04L17.092 20Z" />
            </svg>
            Follow on X
          </Link>
        </div>

        <p className="mt-6 text-white/35 text-sm">
          No spam. Just signal from the team building 7aychain.
        </p>
      </Section>
    </>
  );
}
