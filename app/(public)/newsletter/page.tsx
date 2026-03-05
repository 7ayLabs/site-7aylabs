import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
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
      "Detailed updates on Proof of Presence development, from smart contract milestones to testnet deployments.",
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
        description="Product insights, protocol progress, and real-world presence infrastructure — delivered when it matters."
      />

      {/* What to expect */}
      <Section
        label="What You'll Get"
        title="Signal, not noise"
        subtitle="We write when there's something worth sharing — no filler, no weekly obligations, no marketing fluff."
        className="pb-24 md:pb-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {TOPICS.map((topic) => (
            <Card key={topic.title} variant="default" padding="md">
              <h3 className="font-serif font-semibold text-lg text-white mb-2">
                {topic.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {topic.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section centered className="pb-24 md:pb-32">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
          Follow our progress
        </h2>
        <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          The newsletter is coming soon. In the meantime, follow us on X for
          real-time updates on Proof of Presence and 7ayLabs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={EXTERNAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-white text-black px-8 py-3 min-h-[44px] text-sm font-medium hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark transition-colors duration-normal"
          >
            <Mail size={16} aria-hidden="true" />
            Follow on X
          </Link>
        </div>

        <p className="mt-6 text-white/40 text-sm">
          No spam. Just signal from the team building presence infrastructure.
        </p>
      </Section>
    </>
  );
}
