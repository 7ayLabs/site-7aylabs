import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about 7ayLabs, our mission to restore trust through real presence, and our vision for presence-first infrastructure.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="Who We Are"
        title="Our Story"
        description={[
          "Built to restore trust through real presence.",
          "Presence is the foundation for accountable systems.",
        ]}
      />

      {/* Our Mission */}
      <Section
        label="What We're Building"
        title="Our Mission"
        className="pb-20 md:pb-24"
      >
        <div className="space-y-4 max-w-3xl text-white/60 leading-relaxed">
          <p>
            Presence-first infrastructure means designing software where actions
            only register when a real person is physically or digitally
            verifiably present. It&apos;s about ensuring that participation is
            genuine and that every interaction reflects actual human involvement,
            not automated or fake activity.
          </p>
          <p>
            When presence is optional or ignored, systems break down &mdash;
            processes become unreliable, trust erodes, and accountability
            disappears. Without a clear signal that someone was truly there,
            outcomes lose meaning and the entire workflow risks manipulation or
            error.
          </p>
          <p>
            Proof of Presence is not just a feature we add on; it&apos;s a
            foundational layer that underpins the integrity of digital
            coordination. We build infrastructure that makes presence
            verification a default, enabling stronger, more trustworthy systems
            across industries and use cases.
          </p>
          <p>
            For businesses, presence-first infrastructure delivers measurable
            value &mdash; reducing fraud, streamlining compliance, and improving
            operational clarity. Real-world adoption means workflows become more
            efficient, outcomes are auditable, and teams can trust the data that
            drives decisions.
          </p>
          <p>
            By anchoring digital actions to verified presence, organizations
            unlock new forms of accountability and coordination. This impact
            extends beyond technology: it transforms how people collaborate, how
            resources are allocated, and how trust is established at every
            operational level.
          </p>
        </div>
      </Section>

      {/* Our Vision */}
      <Section
        label="Our Long-Term View"
        title="Our Vision"
        className="pb-24 md:pb-32"
      >
        <div className="space-y-4 max-w-3xl text-white/60 leading-relaxed">
          <p>
            We envision a future where presence is a default system signal
            &mdash; embedded deeply in the architecture of digital ecosystems.
            Instead of being an afterthought, presence will be a primary data
            point that drives trust, access, and meaningful interaction.
          </p>
          <p>
            As AI and automation scale rapidly, distinguishing real human
            participation from synthetic behavior becomes critical. Systems
            without strong presence verification will be vulnerable to
            manipulation, making robust human verification essential for security
            and accountability.
          </p>
          <p>
            7ayLabs is building the infrastructure to support this long-term
            coordination, focusing on durable, foundational technology rather
            than chasing trends. Our goal is to enable systems that last &mdash;
            systems that maintain integrity and trust as the digital landscape
            evolves.
          </p>
          <p>
            Over time, presence-first standards will shape an ecosystem where
            interoperability and trust are built in by design. As more platforms
            and partners adopt these principles, the network effect will drive
            industry-wide improvements in reliability, compliance, and user
            experience.
          </p>
          <p>
            Eventually, presence-first approaches will become unavoidable &mdash;
            not by mandate, but because the cost of ignoring presence will be too
            high. As the digital world matures, systems that lack verifiable
            participation will be left behind, making presence a new baseline for
            meaningful engagement.
          </p>
        </div>
      </Section>

      {/* Our Principles */}
      <Section
        label="How We Think"
        title="Principles that guide our work"
        className="pb-24 md:pb-32"
      >
        <div className="space-y-4 max-w-3xl text-white/60 leading-relaxed">
          <p>
            We believe technology should reduce ambiguity, not introduce it.
            Every system we build is designed to answer a simple question
            clearly: did this actually happen?
          </p>
          <p>
            We optimize for reality over scale, clarity over complexity, and
            long-term trust over short-term growth. If a system cannot hold up
            under real-world conditions, it does not belong in production.
          </p>
          <p>
            7ayLabs builds slowly and deliberately, validating each layer before
            moving forward. This approach allows us to create infrastructure that
            businesses can rely on, even as environments, regulations, and
            technologies change.
          </p>
        </div>
      </Section>
    </>
  );
}
