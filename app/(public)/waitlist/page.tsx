"use client";

import { useState, useCallback, memo, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import { Badge } from "@/components/ui";

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
        // Simulate API call - replace with actual endpoint
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
    <section className="relative min-h-[70vh] md:min-h-[85vh] px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start pt-16 md:pt-28">
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
              className="absolute top-0 right-0 flex flex-col items-end gap-1 text-xs text-white/50"
            >
              <div className="uppercase tracking-widest">Access status</div>
              <div className="text-white/80 font-medium">
                Phase 0 &mdash; Live
              </div>
            </motion.div>

            <motion.span
              variants={fadeUpItem}
              className="block text-sm uppercase tracking-widest text-white/40 mb-4"
            >
              Waitlist
            </motion.span>

            <motion.h1
              variants={fadeUpItem}
              className="font-serif font-bold text-4xl md:text-5xl tracking-tight mb-4"
            >
              Get early access
            </motion.h1>

            <motion.p
              variants={fadeUpItem}
              className="text-white/60 max-w-md mb-10"
            >
              Private access for teams testing real-world presence in
              production.
            </motion.p>

            <motion.form
              variants={fadeUpItem}
              onSubmit={handleSubmit}
              className="flex w-full max-w-md flex-col gap-3"
            >
              <div className="flex items-center gap-3">
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
                  className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="bg-white text-black rounded-xl px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors duration-normal disabled:opacity-50 disabled:cursor-not-allowed"
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
                <p role="status" className="text-green-400 text-sm">
                  You&apos;re on the list! We&apos;ll reach out when access
                  opens.
                </p>
              )}
            </motion.form>

            <motion.p
              variants={fadeUpItem}
              className="mt-6 text-xs text-white/40"
            >
              We only store your email to contact you about access. No sharing,
              no tracking, no marketing lists.
            </motion.p>
          </motion.div>
        </div>

        {/* Right column - Access waves */}
        <div className="relative w-full px-0 md:pl-12 pb-28">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="flex flex-col items-start"
          >
            <motion.span
              variants={fadeUpItem}
              className="block text-sm uppercase tracking-widest text-white/40 mb-4"
            >
              Access waves
            </motion.span>

            <motion.h2
              variants={fadeUpItem}
              className="font-serif font-bold text-3xl md:text-4xl text-white mb-6"
            >
              How early access works
            </motion.h2>

            <motion.p
              variants={fadeUpItem}
              className="text-white/60 max-w-2xl leading-relaxed mb-10"
            >
              We&apos;re opening Proof of Presence in controlled waves &mdash;
              prioritizing teams that need real-world validation today, not
              someday.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="relative flex flex-col gap-10 max-w-2xl"
            >
              {PHASES.map((phase) => (
                <motion.div
                  key={phase.number}
                  variants={fadeUpItem}
                  className="flex gap-6"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        phase.active
                          ? "bg-white text-black"
                          : "border border-white/20 text-white"
                      }`}
                    >
                      {phase.number}
                    </div>
                    {!phase.isLast && (
                      <div className="flex-1 w-px bg-white/10 mt-2" />
                    )}
                  </div>

                  <div className="pt-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs uppercase tracking-widest text-white/40">
                        {phase.label}
                      </span>
                      {phase.status && (
                        <Badge variant="muted">{phase.status}</Badge>
                      )}
                    </div>
                    <div className="text-white font-medium mb-1">
                      {phase.title}
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed max-w-md">
                      {phase.description}
                    </p>
                  </div>
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
