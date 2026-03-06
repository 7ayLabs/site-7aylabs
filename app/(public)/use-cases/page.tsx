import type { Metadata } from "next";
import { PageHero, Section, Card, Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "Discover how Proof of Presence enables fair token drops, verified voting, secure transactions, event ticketing, verified communities, and honest reviews.",
  keywords: [
    "fair airdrops",
    "one person one vote",
    "human verification",
    "event ticketing blockchain",
    "verified reviews",
    "bot prevention",
  ],
};

const SIGNAL_CARDS = [
  {
    title: "Uniquely Human",
    description:
      "Every verification is grounded in the physics of your real-world presence.",
  },
  {
    title: "Private by Default",
    description:
      "Verifies you're present without knowing who you are or tracking you.",
  },
  {
    title: "Permanently Recorded",
    description:
      "Every proof is stored on a public record that anyone can verify.",
  },
  {
    title: "Works Everywhere",
    description:
      "Any device with internet. No special equipment required.",
  },
] as const;

const USE_CASES = [
  {
    title: "Fair Token Drops",
    description:
      "Rewards go to real people, not bots farming thousands of accounts. Every recipient is verified as a unique human who was actually present.",
    detail:
      "Token distributions become meaningful when every recipient is a real, verified person. No more drained budgets from fake accounts and automated farming.",
  },
  {
    title: "Fair Voting",
    description:
      "One person, one vote — guaranteed by physics. No wallet farms, no vote buying, no governance capture by fake accounts.",
    detail:
      "Communities can run votes, proposals, and elections knowing that each participant is a real person — not a collection of wallets controlled by one actor.",
  },
  {
    title: "Secure Transactions",
    description:
      "Add a physical security layer to high-value operations. Even if someone steals your password, they'd need to be physically present to act.",
    detail:
      "Critical financial operations gain a layer of protection that no hacker can bypass remotely — they would need to physically be at the right place.",
  },
  {
    title: "Event Ticketing",
    description:
      "Prove you attended a conference, meetup, or workshop. Earn rewards for actually being there — not just claiming you were.",
    detail:
      "Event organizers get accurate attendance data while attendees earn verifiable credentials that carry real weight.",
  },
  {
    title: "Verified Communities",
    description:
      "Build communities around people who actually show up. No fake members, no bots padding the numbers.",
    detail:
      "Membership and access are earned through real participation, not manufactured accounts or purchased credentials.",
  },
  {
    title: "Verified Reviews & Deliveries",
    description:
      "Only people who actually visited can leave reviews. Drivers prove they arrived at the right address. End fake reviews and delivery fraud.",
    detail:
      "Physical verification ensures that reviews, deliveries, and service confirmations come from people who were actually there.",
  },
] as const;

export default function UseCasesPage() {
  return (
    <>
      <PageHero
        label="Use Cases"
        title="Where Presence Changes Everything"
        accentWords={["Presence"]}
        description="From fair voting to verified reviews — real-world problems that only physical presence can solve."
      />

      <Section className="py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h2 className="heading-sm text-fg mb-4">
              The Sybil problem is everywhere
            </h2>
            <div className="space-y-5 text-fg-tertiary leading-relaxed">
              <p>
                The same person can create a thousand fake accounts in minutes.
                Bots farm rewards. Fake users capture votes. And most systems
                have no way to tell the difference.
              </p>
              <p>
                The root cause is simple: there&apos;s no reliable way to prove
                a unique human is behind an action.
              </p>
            </div>
          </div>
          <div>
            <h2 className="heading-sm text-fg mb-4">
              Physics as the solution
            </h2>
            <div className="space-y-5 text-fg-tertiary leading-relaxed">
              <p>
                7aychain solves this with physics. You can create unlimited
                accounts &mdash; but you can only be in one place at a time. By
                measuring internet connection timing from multiple points, the
                network confirms you&apos;re real and present.
              </p>
              <p>
                No eye scans. No special devices.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24">
        <div className="text-center mb-16">
          <span className="label-sm block mb-4">
            Applications
          </span>
          <h2 className="heading-md text-fg mb-4">
            Where Presence Changes the Game
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Real-world problems that only physical presence can solve.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20 max-w-4xl mx-auto">
          {SIGNAL_CARDS.map((card) => (
            <Card key={card.title} variant="interactive" padding="md">
              <h3 className="font-sans font-semibold text-base text-fg mb-1.5">
                {card.title}
              </h3>
              <p className="text-fg-muted text-sm leading-relaxed">
                {card.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {USE_CASES.map((useCase, i) => (
            <Card key={useCase.title} variant="default" padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[var(--color-accent-dim)] text-accent text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <h3 className="font-display font-bold text-xl text-fg">
                  {useCase.title}
                </h3>
              </div>
              <p className="text-fg-secondary leading-relaxed mb-3">
                {useCase.description}
              </p>
              <p className="text-fg-tertiary text-sm leading-relaxed">
                {useCase.detail}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section centered className="py-20 md:py-28">
        <h2 className="heading-md text-fg mb-6">
          Build with Proof of Presence
        </h2>
        <p className="body-lg max-w-2xl mx-auto mb-10">
          The devnet is live. Start building applications on
          7aychain today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={ROUTES.devnet} size="lg">
            Connect to Devnet
          </Button>
          <Button href={ROUTES.waitlist} variant="secondary" size="lg">
            Join the Waitlist
          </Button>
        </div>
      </Section>
    </>
  );
}
