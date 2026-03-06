import type { Metadata } from "next";
import { PageHero, Section, Card, Button } from "@/components/ui";
import { EXTERNAL_LINKS, ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Why Presence",
  description:
    "When bots can do everything humans can do online, the only thing left that proves you're real is being physically present. Learn how 7aychain uses physics instead of biometrics.",
  keywords: [
    "why presence matters",
    "bot prevention",
    "human verification",
    "privacy preserving identity",
    "Worldcoin alternative",
    "BrightID comparison",
    "no biometrics verification",
  ],
};

const PRESENCE_PILLARS = [
  {
    title: "Physics, Not Scans",
    description:
      "Internet signals have a speed limit — the speed of light. 7aychain uses this fact to confirm where you are. No iris scans, no selfies, no fingerprints.",
  },
  {
    title: "One Place at a Time",
    description:
      "You can create a million accounts, but you can only physically be in one spot. That's the constraint that makes faking presence nearly impossible.",
  },
  {
    title: "No Lasting Footprint",
    description:
      "Each verification is a one-time event. No persistent profile, no behavioral tracking, no data stored about you. Prove you were here, then it's done.",
  },
] as const;

const COMPARISON_TABLE = [
  {
    dimension: "Method",
    sevenychain: "Measures internet connection timing",
    worldcoin: "Scans your iris with a special device",
    brightid: "Friends vouch for you on video",
    passport: "Links your online accounts for a trust score",
  },
  {
    dimension: "Hardware Required",
    sevenychain: "None (any internet connection)",
    worldcoin: "Custom Orb device",
    brightid: "None",
    passport: "None",
  },
  {
    dimension: "Collects Body Data?",
    sevenychain: "No",
    worldcoin: "Yes (iris scan)",
    brightid: "No (but face visible)",
    passport: "No",
  },
  {
    dimension: "Privacy",
    sevenychain: "High — location only, never identity",
    worldcoin: "Low — stores iris biometric data",
    brightid: "Medium — your face is seen on video",
    passport: "Medium — links your online accounts",
  },
  {
    dimension: "What It Proves",
    sevenychain: "You're physically at a real location",
    worldcoin: "You're a unique human (biometric)",
    brightid: "People vouch that you're real",
    passport: "You have active online accounts",
  },
  {
    dimension: "Chain",
    sevenychain: "7aychain (Substrate L1)",
    worldcoin: "Optimism (L2)",
    brightid: "IDChain / multi-chain",
    passport: "Multi-chain (off-chain scoring)",
  },
  {
    dimension: "Stage",
    sevenychain: "Devnet (v0.8.26)",
    worldcoin: "Mainnet",
    brightid: "Mainnet",
    passport: "Mainnet",
  },
] as const;

const SYBIL_ARGUMENTS = [
  {
    problem: "Bots can fake behavior at scale",
    response:
      "AI can fake text, transactions, and social activity. But it can't fake being somewhere — physical presence is constrained by the laws of physics.",
  },
  {
    problem: "Anyone can create unlimited accounts",
    response:
      "Making a new wallet costs nothing. Being in two places at once is impossible. 7aychain turns a digital problem into a physical one.",
  },
  {
    problem: "Biometric systems are surveillance",
    response:
      "Iris scans and facial recognition create permanent databases of your body. 7aychain measures internet timing — it never sees your face or knows your name.",
  },
  {
    problem: "Social networks can be faked",
    response:
      "Coordinated groups can create fake social proof. Physical presence is independently verified by the network — no trust required.",
  },
] as const;

export default function WhyPresencePage() {
  return (
    <>
      <PageHero
        label="Why Presence"
        title="The Internet Lost the Human Signal"
        accentWords={["Human", "Signal"]}
        description="When bots can do everything humans can do online, the only thing left that proves you're real is being physically present."
      />

      <Section title="Presence Infrastructure" className="py-16 md:py-20">
        <div className="space-y-5 max-w-3xl text-fg-tertiary text-base sm:text-lg leading-relaxed">
          <p>
            At the heart of 7aychain is a simple idea: your internet connection
            can prove where you are. Validators across the network measure
            connection timing from multiple points, confirming your physical
            location without GPS, cameras, or special hardware.
          </p>
          <p>
            Most systems try to figure out if you&apos;re real by looking at
            your behavior, your accounts, or your credentials. At scale, all of
            those can be faked. 7aychain takes a different approach: it uses the
            laws of physics.
          </p>
        </div>
      </Section>

      {/* Core Pillars */}
      <Section maxWidth="6xl" className="py-16 md:py-24">
        <div className="mb-12">
          <span className="block text-sm uppercase tracking-widest text-accent mb-4">
            The Physics Argument
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-fg mb-4">
            Sybil resistance through physical reality
          </h2>
          <p className="max-w-3xl text-fg-tertiary text-lg leading-relaxed">
            Instead of trusting profiles, credentials, or biometrics, 7aychain
            exploits a fundamental physical constraint: you can only be in one
            place at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRESENCE_PILLARS.map((pillar) => (
            <Card key={pillar.title} variant="interactive" padding="md">
              <h3 className="font-sans font-semibold text-lg text-fg mb-3">
                {pillar.title}
              </h3>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Sybil Resistance Arguments */}
      <Section className="py-16 md:py-20">
        <Card variant="elevated" padding="lg" className="mb-12 max-w-3xl">
          <span className="block text-xs uppercase tracking-widest text-accent mb-4">
            Core Insight
          </span>
          <h3 className="font-display font-bold text-xl md:text-2xl text-fg mb-3">
            In a world of perfect simulation, physical reality becomes the scarce resource
          </h3>
          <p className="text-fg-tertiary leading-relaxed">
            AI can generate convincing text, behavior, and interaction at scale.
            But replicating physical presence &mdash; being at a specific location
            at a specific time, measurable through network physics &mdash; remains
            constrained by the laws of nature.
          </p>
        </Card>

        <div className="space-y-6 max-w-4xl">
          {SYBIL_ARGUMENTS.map((arg) => (
            <div key={arg.problem} className="grid md:grid-cols-2 gap-4 md:gap-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-fg-muted block mb-2">Problem</span>
                <p className="text-fg font-medium">{arg.problem}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-accent block mb-2">7aychain Response</span>
                <p className="text-fg-tertiary text-sm leading-relaxed">{arg.response}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Comparison Table */}
      <Section maxWidth="6xl" className="py-16 md:py-24">
        <div className="mb-12 text-center">
          <span className="block text-sm uppercase tracking-widest text-accent mb-4">
            Comparison
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-fg mb-4">
            How 7aychain compares
          </h2>
          <p className="max-w-3xl text-fg-tertiary text-lg mx-auto leading-relaxed">
            Different approaches to the human verification problem. Each makes
            different trade-offs on privacy, hardware, and what they actually prove.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[var(--color-border-primary)]">
                <th className="text-left py-3 px-4 text-fg-muted font-medium uppercase tracking-wider text-xs w-36">
                  Dimension
                </th>
                <th className="text-left py-3 px-4 text-accent font-medium text-xs uppercase tracking-wider bg-[var(--color-accent-dim)] rounded-t-lg">
                  7aychain
                </th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium text-xs uppercase tracking-wider">
                  Worldcoin
                </th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium text-xs uppercase tracking-wider">
                  BrightID
                </th>
                <th className="text-left py-3 px-4 text-fg-muted font-medium text-xs uppercase tracking-wider">
                  Gitcoin Passport
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map((row) => (
                <tr key={row.dimension} className="border-b border-[var(--color-border-primary)]">
                  <td className="py-3 px-4 font-medium text-fg whitespace-nowrap">
                    {row.dimension}
                  </td>
                  <td className="py-3 px-4 text-accent font-medium bg-[var(--color-accent-dim)]">
                    {row.sevenychain}
                  </td>
                  <td className="py-3 px-4 text-fg-tertiary">
                    {row.worldcoin}
                  </td>
                  <td className="py-3 px-4 text-fg-tertiary">
                    {row.brightid}
                  </td>
                  <td className="py-3 px-4 text-fg-tertiary">
                    {row.passport}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* CTA */}
      <Section centered className="py-20 md:py-28">
        <span className="block text-sm uppercase tracking-widest text-accent mb-4">
          Follow the Signal
        </span>
        <h3 className="font-display font-bold text-2xl md:text-3xl text-fg mb-4">
          Presence is the missing primitive
        </h3>
        <p className="mx-auto max-w-xl text-fg-tertiary text-lg leading-relaxed mb-8">
          We share progress in real time &mdash; what&apos;s being tested,
          what&apos;s breaking, and where presence actually changes outcomes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={EXTERNAL_LINKS.twitter} external size="lg">
            Follow on X
          </Button>
          <Button href={ROUTES.technology} variant="secondary" size="lg">
            Explore Technology
          </Button>
        </div>
      </Section>
    </>
  );
}
