import type { Metadata } from "next";
import { PageHero, Section, Card, Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Services",
  description:
    "7ayLabs helps teams integrate Proof of Presence into their products — from early pilots to production-grade deployments.",
  keywords: ["7ayLabs services", "presence infrastructure", "blockchain integration", "Proof of Presence API", "validator setup"],
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
      "Tailored presence infrastructure for specific industries -- events, logistics, access control, compliance, and community platforms.",
  },
] as const;

const PRINCIPLES = [
  {
    title: "Start small, prove fast",
    description:
      "Every engagement begins with a focused pilot -- real environments, real users, real signal.",
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
        description="We help teams integrate Proof of Presence -- from early pilots to production-grade deployments."
      />

      <Section
        label="What We Offer"
        title="Services"
        className="py-16 md:py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {SERVICES.map((service) => (
            <Card key={service.title} variant="interactive" padding="lg">
              <h3 className="font-sans font-semibold text-xl text-fg mb-3">
                {service.title}
              </h3>
              <p className="text-fg-tertiary leading-relaxed text-sm">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        label="Our Approach"
        title="How we work"
        className="py-16 md:py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {PRINCIPLES.map((principle) => (
            <Card key={principle.title} variant="default" padding="lg">
              <h3 className="font-sans font-semibold text-lg text-fg mb-3">
                {principle.title}
              </h3>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {principle.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section centered className="py-20 md:py-28">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-fg mb-6">
          Ready to explore presence?
        </h2>
        <p className="text-fg-tertiary text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          Join the waitlist to discuss how Proof of Presence can work for your
          team, product, or platform.
        </p>
        <Button href={ROUTES.waitlist} size="lg">
          Join the Waitlist
        </Button>
      </Section>
    </>
  );
}
