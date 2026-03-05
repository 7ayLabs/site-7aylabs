import type { Metadata } from "next";
import { PageHero, Section, Card } from "@/components/ui";
import Newsletter from "@/components/landing/Newsletter";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Explore Proof of Presence — a simple way to verify real human presence so digital products work with people, not bots.",
};

export default function TechPage() {
  return (
    <>
      <PageHero
        label="Technology"
        title="Presence, Verified"
        description="A simple way to verify real human presence — so digital products work with people, not bots."
      />

      {/* Real World Presence */}
      <Section title="Real World Presence" className="pb-36">
        <p className="italic text-white/70 text-lg leading-relaxed mb-10 max-w-3xl">
          As automation grows, products need a reliable way to know when people
          actually show up.
        </p>

        <div className="space-y-6 max-w-4xl text-white/60 leading-relaxed">
          <p>
            Digital products rely on signals &mdash; clicks, accounts, activity.
            At scale, those signals break. Bots, farms, and automation overwhelm
            systems designed for people.
          </p>
          <p>
            As AI accelerates this problem, it becomes harder to know what
            activity is real, what metrics can be trusted, and who is actually
            participating.
          </p>
          <p>
            Proof of Presence introduces a simple shift: actions only count when
            a real person is physically present. No guessing, no inference
            &mdash; just real participation.
          </p>
          <p className="font-medium text-white">
            When presence is real, trust follows.
          </p>
        </div>
      </Section>

      {/* Security Through Presence */}
      <Section maxWidth="6xl" className="pb-24">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
              Core Technology
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
              Security Through Presence
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Security models based on reputation, heuristics, and accounts
              collapse under automation and coordinated abuse.
            </p>
            <p className="text-white/60 leading-relaxed">
              Proof of Presence secures systems by requiring real-world human
              participation &mdash; not assumptions, scores, or identity
              profiles.
            </p>
          </div>

          <Card variant="elevated" padding="lg">
            <p className="font-serif italic text-white/80 text-lg leading-relaxed mb-4">
              &ldquo;When participation is real, coordination becomes resilient.
              Presence creates trust that systems can build on.&rdquo;
            </p>
            <span className="block text-white/40 text-sm">
              &mdash; Proof of Presence Principle
            </span>
          </Card>
        </div>
      </Section>

      {/* Proof, Not Profiles */}
      <Section maxWidth="6xl" className="pt-12 pb-28">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
              Human Verification
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
              Proof, Not Profiles
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Identity-based verification relies on credentials, accounts, and
              behavioral inference &mdash; all increasingly exploitable by
              synthetic actors.
            </p>
            <p className="text-white/60 leading-relaxed">
              Proof of Presence verifies moments, events, and participation
              &mdash; without persistent identity, surveillance, or data
              extraction.
            </p>
          </div>

          <Card variant="elevated" padding="lg">
            <p className="font-serif italic text-white/80 text-lg leading-relaxed mb-4">
              &ldquo;Verification should be minimal, contextual, and disposable
              &mdash; not extractive.&rdquo;
            </p>
            <span className="block text-white/40 text-sm">
              &mdash; Presence-Native Design
            </span>
          </Card>
        </div>
      </Section>

      {/* Earned Participation */}
      <Section maxWidth="6xl" className="pb-36">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
              Incentive Design
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
              Earned Participation
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Incentive systems fail when automation can capture value faster
              than humans.
            </p>
            <p className="text-white/60 leading-relaxed">
              Proof of Presence aligns rewards with physical participation,
              ensuring value flows only to real contributors.
            </p>
          </div>

          <Card variant="elevated" padding="lg">
            <p className="font-serif italic text-white/80 text-lg leading-relaxed mb-4">
              &ldquo;If value can be farmed, it will be. If value must be
              earned, communities form.&rdquo;
            </p>
            <span className="block text-white/40 text-sm">
              &mdash; Presence Economics
            </span>
          </Card>
        </div>
      </Section>

      {/* AI-Resilient */}
      <Section maxWidth="6xl" className="pb-40">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
              AI-Resilient Infrastructure
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
              Defense Through Reality
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              AI can generate text, behavior, and interaction at scale &mdash;
              but it cannot easily replicate physical presence.
            </p>
            <p className="text-white/60 leading-relaxed">
              Proof of Presence uses real-world constraints as a technological
              defense, creating AI-resilient systems without surveillance or
              identity checks.
            </p>
          </div>

          <Card variant="elevated" padding="lg">
            <p className="font-serif italic text-white/80 text-lg leading-relaxed mb-4">
              &ldquo;In a world of perfect simulation, reality becomes the
              scarce resource.&rdquo;
            </p>
            <span className="block text-white/40 text-sm">
              &mdash; Presence-First Systems
            </span>
          </Card>
        </div>
      </Section>

      {/* Built for Real Use */}
      <Section centered className="pb-40" maxWidth="5xl">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-6">
          Presence, Built for Real Use
        </h2>
        <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
          Proof of Presence enables products to reward real participation, not
          automated activity.
        </p>
        <p className="text-white font-medium text-lg">
          7ayLabs helps teams build systems where real people matter.
        </p>
      </Section>

      <Newsletter />
    </>
  );
}
