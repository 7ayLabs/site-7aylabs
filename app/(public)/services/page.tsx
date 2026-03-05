import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, Card } from "@/components/ui";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Services",
  description:
    "7ayLabs helps teams integrate Proof of Presence into their products — from early pilots to production-grade deployments.",
};

const SERVICES = [
  {
    title: "Presence Integration",
    description:
      "Embed Proof of Presence into your product or platform. We help teams design, implement, and validate presence-based signals from day one.",
  },
  {
    title: "Pilot Programs",
    description:
      "Run a controlled pilot to test presence verification in real environments. Clear outcomes, fast iteration, and hands-on support throughout.",
  },
  {
    title: "Protocol Consulting",
    description:
      "Technical guidance on presence-first architecture, 7aychain integration, and infrastructure decisions for teams building on the Proof of Presence protocol.",
  },
  {
    title: "Custom Solutions",
    description:
      "Tailored presence infrastructure for specific industries — events, logistics, access control, compliance, and community platforms.",
  },
] as const;

const PRINCIPLES = [
  {
    title: "Start small, prove fast",
    description:
      "Every engagement begins with a focused pilot — real environments, real users, real signal.",
  },
  {
    title: "No black boxes",
    description:
      "Transparent architecture, open communication, and clear documentation at every step.",
  },
  {
    title: "Built to last",
    description:
      "Infrastructure designed for long-term reliability, not short-term demos.",
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Services"
        title="Presence Infrastructure for Your Product"
        description="We help teams integrate Proof of Presence — from early pilots to production-grade deployments."
      />

      {/* Service offerings */}
      <Section
        label="What We Offer"
        title="Services"
        className="pb-24 md:pb-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {SERVICES.map((service) => (
            <Card key={service.title} variant="default" padding="md">
              <h3 className="font-serif font-semibold text-xl text-white mb-3">
                {service.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* How we work */}
      <Section
        label="Our Approach"
        title="How we work"
        className="pb-24 md:pb-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {PRINCIPLES.map((principle) => (
            <div key={principle.title}>
              <h3 className="font-serif font-semibold text-lg text-white mb-2">
                {principle.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section centered className="pb-24 md:pb-32">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
          Ready to explore presence?
        </h2>
        <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          Join the waitlist to discuss how Proof of Presence can work for your
          team, product, or platform.
        </p>
        <Link
          href={ROUTES.waitlist}
          className="inline-flex items-center justify-center rounded-full px-10 py-4 min-h-[44px] bg-white text-black font-medium hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark transition-colors duration-normal"
        >
          Join the Waitlist
        </Link>
      </Section>
    </>
  );
}
