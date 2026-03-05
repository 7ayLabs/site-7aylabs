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
      "Access, approvals, and workflows rely on physical reality -- not logins, timestamps, or assumptions.",
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
        description="Digital systems were built for people -- but today they are dominated by bots, automation, and synthetic activity at scale."
      />

      <Section title="Presence Infrastructure" className="py-16 md:py-20">
        <div className="space-y-5 max-w-3xl text-white/55 text-base sm:text-lg leading-relaxed">
          <p>
            At the core of 7ayLabs is 7aychain &mdash; a Layer 1 blockchain
            where validators form witness circles and triangulate physical
            presence through network latency, proving who is actually here
            without GPS or external hardware.
          </p>
          <p>
            Modern platforms rely on accounts, credentials, and inferred
            behavior to decide what counts as real. At scale, those signals fail.
          </p>
          <p>
            Proof of Presence introduces a different foundation. Instead of
            trusting profiles or activity logs, systems verify that a real person
            was actually present, at a specific moment, in a specific context.
          </p>
        </div>
      </Section>

      <Section maxWidth="6xl" className="py-16 md:py-24">
        <div className="mb-12">
          <span className="block text-sm uppercase tracking-widest text-accent mb-4">
            Real-World Signal
          </span>
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-white mb-4">
            Showing up is the new standard
          </h2>
          <p className="max-w-3xl text-white/55 text-lg leading-relaxed">
            Modern operations break when showing up is optional. Real progress
            happens when systems recognize who actually did the work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {METRICS.map((metric) => (
            <Card key={metric.label} variant="default" padding="lg">
              <span className="block text-xs uppercase tracking-widest text-accent mb-3">
                {metric.label}
              </span>
              <span className="block text-5xl md:text-6xl font-bold text-white mb-2 tabular-nums">
                {metric.value}
              </span>
              <p className="text-white/45 text-sm">{metric.description}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRESENCE_PILLARS.map((pillar) => (
            <Card key={pillar.title} variant="interactive" padding="md">
              <h3 className="font-sans font-semibold text-lg text-white mb-3">
                {pillar.title}
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="py-16 md:py-20">
        <Card variant="elevated" padding="lg" className="max-w-3xl">
          <span className="block text-xs uppercase tracking-widest text-accent mb-4">
            Fun fact
          </span>
          <h3 className="font-sans font-bold text-xl md:text-2xl text-white mb-3">
            Attendance is one of the most faked signals in software
          </h3>
          <p className="text-white/55 leading-relaxed">
            In most tools, showing up is just a checkbox. People can clock in
            remotely, approve tasks without being there, or validate presence from
            anywhere. Proof of Presence replaces that assumption with a simple
            rule: if it mattered, someone actually showed up.
          </p>
        </Card>
      </Section>

      <Section maxWidth="6xl" className="py-16 md:py-24">
        <div className="mb-12 text-center">
          <span className="block text-sm uppercase tracking-widest text-accent mb-4">
            Where Presence Unlocks Value
          </span>
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-white mb-4">
            Different problems. One missing signal.
          </h2>
          <p className="max-w-3xl text-white/55 text-lg mx-auto leading-relaxed">
            In workflows, spaces, access systems and participation tools,
            presence isn&apos;t optional &mdash; it&apos;s the signal that makes
            decisions reliable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PROGRESS_GROUPS.map((group) => (
            <Card key={group.title} variant="default" padding="md">
              <h4 className="text-white font-semibold mb-4">{group.title}</h4>
              <div className="space-y-3">
                {group.quarters.map((q) => (
                  <div key={q.label} className="flex items-center gap-3">
                    <span className="text-xs text-white/35 w-6 font-mono">
                      {q.label}
                    </span>
                    <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${q.value}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/50 w-8 text-right font-mono">
                      {q.value}%
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-4 leading-relaxed">{group.note}</p>
            </Card>
          ))}
        </div>

        <div className="space-y-5 max-w-4xl mx-auto text-white/55 text-center">
          <p>
            Teams lose time and trust when systems rely on assumptions.
            Presence-verified signals cut through noise, reduce disputes, and
            make accountability obvious.
          </p>
        </div>
      </Section>

      <Section centered className="py-20 md:py-28">
        <span className="block text-sm uppercase tracking-widest text-accent mb-4">
          Live signal
        </span>
        <h3 className="font-sans font-bold text-2xl md:text-3xl text-white mb-4">
          Follow the signal as it evolves
        </h3>
        <p className="mx-auto max-w-xl text-white/55 text-lg leading-relaxed mb-8">
          We share progress in real time &mdash; what&apos;s being tested,
          what&apos;s breaking, and where presence actually changes outcomes.
        </p>
        <Link
          href={EXTERNAL_LINKS.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-full bg-accent text-black px-8 py-3.5 min-h-[48px] text-sm font-semibold hover:bg-accent-secondary transition-colors duration-normal"
        >
          Follow on X
        </Link>
        <p className="mt-6 text-white/35 text-sm">
          Early signal only &middot; Current access wave: Phase 0
        </p>
      </Section>
    </>
  );
}
