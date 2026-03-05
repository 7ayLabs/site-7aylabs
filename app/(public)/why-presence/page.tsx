import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, Card } from "@/components/ui";
import { EXTERNAL_LINKS } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Why Presence",
  description:
    "The internet lost the human signal. Discover why 7aychain and Proof of Presence anchor digital systems to real human participation through on-chain validator triangulation.",
};

const METRICS = [
  {
    label: "Verified actions",
    value: "92%",
    description: "of recorded actions tied to real presence",
  },
  {
    label: "Automation drop",
    value: "\u221267%",
    description: "reduction in scripted or proxy activity",
  },
] as const;

const PRESENCE_PILLARS = [
  {
    title: "Work that actually happened",
    description:
      "Processes only move forward when someone is truly there. No proxies, no shortcuts, no background activity pretending to be work.",
  },
  {
    title: "Clear responsibility",
    description:
      "Presence ties actions to real people in real contexts. Teams gain clarity on who showed up, where it happened, and when it mattered.",
  },
  {
    title: "Built for real operations",
    description:
      "Access, approvals, and workflows rely on physical reality — not logins, timestamps, or assumptions.",
  },
] as const;

const PROGRESS_GROUPS = [
  {
    title: "Operational clarity",
    note: "Operational clarity improves as presence-verified signals replace assumptions.",
    quarters: [
      { label: "Q1", value: 62 },
      { label: "Q2", value: 68 },
      { label: "Q3", value: 76 },
      { label: "Q4", value: 84 },
    ],
  },
  {
    title: "Access confidence",
    note: "Access decisions become more reliable when tied to real presence.",
    quarters: [
      { label: "Q1", value: 65 },
      { label: "Q2", value: 72 },
      { label: "Q3", value: 81 },
      { label: "Q4", value: 90 },
    ],
  },
  {
    title: "Participation quality",
    note: "Participation metrics stabilize when activity reflects real people.",
    quarters: [
      { label: "Q1", value: 58 },
      { label: "Q2", value: 64 },
      { label: "Q3", value: 72 },
      { label: "Q4", value: 79 },
    ],
  },
] as const;

export default function WhyPresencePage() {
  return (
    <>
      <PageHero
        label="Why Presence"
        title="The Internet Lost the Human Signal"
        description="Digital systems were built for people — but today they are dominated by bots, automation, and synthetic activity at scale."
      />

      {/* Presence Infrastructure */}
      <Section title="Presence Infrastructure" className="pb-20 md:pb-24">
        <div className="space-y-4 md:space-y-6 max-w-3xl text-white/60 text-base sm:text-lg leading-relaxed">
          <p>
            At the core of 7ayLabs is 7aychain &mdash; a Layer 1 blockchain
            where validators form witness circles and triangulate physical
            presence through network latency, proving who is actually here
            without GPS or external hardware.
          </p>
          <p>
            Modern platforms rely on accounts, credentials, and inferred
            behavior to decide what counts as real. At scale, those signals fail
            &mdash; they can be automated, shared, or faked.
          </p>
          <p>
            Proof of Presence introduces a different foundation. Instead of
            trusting profiles or activity logs, systems verify that a real person
            was actually present, at a specific moment, in a specific context.
          </p>
          <p>
            Presence can&apos;t be copied or scaled by automation. It anchors
            digital actions to reality &mdash; creating signals that remain
            trustworthy as systems grow.
          </p>
        </div>
      </Section>

      {/* Showing up is the new standard */}
      <Section maxWidth="6xl" className="pb-24 md:pb-40">
        <div className="mb-12">
          <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
            Real-World Signal
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-4">
            Showing up is the new standard
          </h2>
          <p className="max-w-3xl text-white/60 text-base sm:text-lg leading-relaxed">
            Modern operations break when showing up is optional. Real progress
            happens when systems recognize who actually did the work &mdash; not
            who clicked a button.
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-16">
          {METRICS.map((metric) => (
            <Card key={metric.label} variant="default" padding="md">
              <div className="text-sm uppercase tracking-widest text-white/40 mb-2">
                {metric.label}
              </div>
              <div className="text-4xl md:text-5xl font-semibold text-white mb-2">
                {metric.value}
              </div>
              <p className="text-white/50 text-sm">{metric.description}</p>
            </Card>
          ))}
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRESENCE_PILLARS.map((pillar) => (
            <div key={pillar.title}>
              <h3 className="font-serif text-xl text-white mb-3">
                {pillar.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Fun Fact */}
      <Section className="pb-24 md:pb-32">
        <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
          Fun fact
        </span>
        <h3 className="font-serif font-bold text-2xl md:text-3xl text-white mb-4">
          Attendance is one of the most faked signals in software
        </h3>
        <p className="max-w-3xl text-white/60 text-base sm:text-lg leading-relaxed">
          In most tools, showing up is just a checkbox. People can clock in
          remotely, approve tasks without being there, or validate presence from
          anywhere. Proof of Presence replaces that assumption with a simple
          rule: if it mattered, someone actually showed up.
        </p>
      </Section>

      {/* Business Impact */}
      <Section maxWidth="6xl" className="pb-24 md:pb-40">
        <div className="mb-12 text-center">
          <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
            Where Presence Unlocks Value
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-4">
            Different problems. One missing signal.
          </h2>
          <p className="max-w-3xl text-white/60 text-base sm:text-lg mx-auto leading-relaxed">
            In workflows, spaces, access systems and participation tools,
            presence isn&apos;t optional &mdash; it&apos;s the signal that makes
            decisions reliable and operations accountable.
          </p>
        </div>

        {/* Progress indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {PROGRESS_GROUPS.map((group) => (
            <div key={group.title} className="text-left max-w-sm mx-auto">
              <div className="text-white font-medium mb-4">{group.title}</div>
              <div className="space-y-3">
                {group.quarters.map((q) => (
                  <div key={q.label} className="flex items-center gap-3">
                    <span className="text-xs text-white/40 w-6">
                      {q.label}
                    </span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-slow"
                        style={{ width: `${q.value}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/60 w-8">
                      {q.value}%
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-sm mt-4">{group.note}</p>
            </div>
          ))}
        </div>

        {/* Business narrative */}
        <div className="space-y-6 max-w-4xl mx-auto text-white/60">
          <p>
            Teams lose time and trust when systems rely on assumptions.
            Presence-verified signals cut through noise, reduce disputes, and
            make accountability obvious.
          </p>
          <p>
            In physical environments, knowing who actually arrived changes how
            access, compliance, and service delivery are managed &mdash; with far
            less overhead.
          </p>
          <p>
            For participation-driven products, presence turns engagement into
            something measurable and defensible, not just another metric to
            inflate.
          </p>
        </div>
      </Section>

      {/* Follow the signal */}
      <Section centered className="pb-24 md:pb-32">
        <span className="block text-sm uppercase tracking-widest text-white/40 mb-4">
          Live signal
        </span>
        <h3 className="font-serif font-bold text-2xl md:text-3xl text-white mb-3">
          Follow the signal as it evolves
        </h3>
        <p className="mx-auto max-w-xl text-white/60 text-base sm:text-lg leading-relaxed mb-8">
          We share progress in real time &mdash; what&apos;s being tested,
          what&apos;s breaking, and where presence actually changes outcomes. No
          hype. No launches-for-attention. Just signal.
        </p>
        <Link
          href={EXTERNAL_LINKS.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-full bg-white text-black px-8 py-4 min-h-[44px] text-sm font-medium hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark transition-colors duration-normal"
        >
          Follow on X
        </Link>
        <p className="mt-6 text-white/40 text-sm">
          Early signal only &middot; Current access wave: Phase 0
        </p>
      </Section>
    </>
  );
}
