"use client";

import { useState, useCallback, memo, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import { Badge, Card } from "@/components/ui";

type FormStatus = "idle" | "loading" | "success" | "error";

interface Phase {
  number: number;
  label: string;
  title: string;
  description: string;
  status?: string;
  active?: boolean;
  isLast?: boolean;
}

const PHASES: Phase[] = [
  {
    number: 0,
    label: "Phase 0",
    title: "Early production access",
    description:
      "Small teams validating Proof of Presence in real environments, with direct feedback loops and hands-on support.",
    status: "Live",
    active: true,
  },
  {
    number: 1,
    label: "Phase 1",
    title: "Expanded pilots",
    description:
      "Broader access for teams running pilots across multiple locations, workflows, or communities.",
  },
  {
    number: 2,
    label: "Phase 2",
    title: "Broader availability",
    description:
      "Wider access as the protocol stabilizes and teams deploy at higher scale with minimal onboarding friction.",
    isLast: true,
  },
];

function WaitlistPageComponent() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email || !email.includes("@")) {
        setStatus("error");
        setErrorMessage("Please enter a valid email address");
        return;
      }

      setStatus("loading");
      setErrorMessage("");

      try {
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setErrorMessage(data.message || "Something went wrong. Please try again.");
          return;
        }

        setStatus("success");
        setEmail("");
      } catch {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    },
    [email]
  );

  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left column - Form */}
        <div className="relative flex flex-col">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left"
          >
            <motion.div
              variants={fadeUpItem}
              className="flex items-center gap-3 mb-6"
            >
              <Badge variant="accent">Phase 0 -- Live</Badge>
            </motion.div>

            <motion.span
              variants={fadeUpItem}
              className="block text-sm uppercase tracking-widest text-accent mb-4"
            >
              Waitlist
            </motion.span>

            <motion.h1
              variants={fadeUpItem}
              className="font-sans font-bold text-4xl md:text-5xl tracking-tight mb-4"
            >
              Get early access
            </motion.h1>

            <motion.p
              variants={fadeUpItem}
              className="text-fg-tertiary max-w-md mb-10 text-lg"
            >
              Private access for teams testing real-world presence in
              production.
            </motion.p>

            <motion.form
              variants={fadeUpItem}
              onSubmit={handleSubmit}
              className="flex w-full max-w-md flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label htmlFor="waitlist-email" className="sr-only">
                  Work email address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="work@email.com"
                  disabled={status === "loading" || status === "success"}
                  aria-describedby="waitlist-privacy"
                  className="flex-1 bg-[var(--color-bg-card)] border border-[var(--color-border-primary)] rounded-xl px-4 py-3 min-h-[48px] text-fg placeholder:text-fg-faint focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="bg-accent text-black rounded-xl px-6 py-3 min-h-[48px] text-sm font-semibold hover:bg-accent-secondary transition-colors duration-normal disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {status === "loading"
                    ? "Joining..."
                    : status === "success"
                      ? "Joined!"
                      : "Join Waitlist"}
                </button>
              </div>

              {status === "error" && (
                <p role="alert" className="text-red-400 text-sm">
                  {errorMessage}
                </p>
              )}

              {status === "success" && (
                <p role="status" className="text-emerald-400 text-sm">
                  You&apos;re on the list! We&apos;ll reach out when access
                  opens.
                </p>
              )}
            </motion.form>

            <motion.p
              id="waitlist-privacy"
              variants={fadeUpItem}
              className="mt-6 text-xs text-fg-faint"
            >
              We only store your email to contact you about access. No sharing,
              no tracking, no marketing lists.
            </motion.p>
          </motion.div>
        </div>

        {/* Right column - Access waves */}
        <div className="relative w-full pb-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="flex flex-col items-start"
          >
            <motion.span
              variants={fadeUpItem}
              className="block text-sm uppercase tracking-widest text-accent mb-4"
            >
              Access waves
            </motion.span>

            <motion.h2
              variants={fadeUpItem}
              className="font-sans font-bold text-3xl md:text-4xl tracking-tight text-fg mb-6"
            >
              How early access works
            </motion.h2>

            <motion.p
              variants={fadeUpItem}
              className="text-fg-tertiary max-w-lg leading-relaxed mb-10"
            >
              We&apos;re opening Proof of Presence in controlled waves &mdash;
              prioritizing teams that need real-world validation today.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="relative flex flex-col gap-6 w-full"
            >
              {PHASES.map((phase) => (
                <motion.div key={phase.number} variants={fadeUpItem}>
                  <Card
                    variant={phase.active ? "interactive" : "default"}
                    padding="md"
                    className={phase.active ? "border-accent/20" : ""}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          phase.active
                            ? "bg-accent text-black"
                            : "border border-[var(--color-border-secondary)] text-fg-muted"
                        }`}
                      >
                        {phase.number}
                      </div>
                      <span className="text-xs uppercase tracking-widest text-fg-muted">
                        {phase.label}
                      </span>
                      {phase.status && (
                        <Badge variant="success">{phase.status}</Badge>
                      )}
                    </div>
                    <h3 className="text-fg font-semibold mb-1 ml-11">
                      {phase.title}
                    </h3>
                    <p className="text-sm text-fg-tertiary leading-relaxed ml-11">
                      {phase.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const WaitlistPage = memo(WaitlistPageComponent);
WaitlistPage.displayName = "WaitlistPage";

export default WaitlistPage;
