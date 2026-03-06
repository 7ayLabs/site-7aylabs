"use client";

import { useState, useCallback, memo, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Award, Loader2 } from "lucide-react";
import {
  staggerContainer,
  fadeUpItem,
} from "@/lib/constants/animations";
import { Badge } from "@/components/ui";

type FormStatus = "idle" | "loading" | "success" | "error";

const BENEFITS = [
  {
    icon: Sparkles,
    title: "First to verify",
    description: "Access the network before anyone else and be among the first to prove your presence.",
  },
  {
    icon: MessageSquare,
    title: "Shape the network",
    description: "Your feedback directly influences what we build and how the protocol evolves.",
  },
  {
    icon: Award,
    title: "Founding member status",
    description: "Permanent on-chain record as a founding participant of the 7aychain network.",
  },
] as const;

const PHASES = [
  { label: "Phase 0", title: "Early access", status: "Live", active: true },
  { label: "Phase 1", title: "Expanded pilots", status: null, active: false },
  { label: "Phase 2", title: "Broader availability", status: null, active: false },
] as const;

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
    <section className="relative min-h-[80svh] flex items-center justify-center px-6 py-24 md:py-32">
      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute w-[600px] h-[600px] rounded-full top-[10%] left-[20%]"
          style={{ background: "radial-gradient(circle, rgba(23,142,119,0.06), transparent 70%)" }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full bottom-[10%] right-[15%]"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.04), transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUpItem}>
            <Badge variant="accent">Early Access — Phase 0 Live</Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpItem}
            className="mt-8 font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-fg"
          >
            The network is{" "}
            <span className="gradient-text-accent">waking up</span>.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUpItem}
            className="mt-6 text-fg-secondary text-lg md:text-xl max-w-2xl leading-relaxed"
          >
            Be among the first to prove you&apos;re here — join the people
            building a world where presence matters more than passwords.
          </motion.p>

          {/* Glass form panel */}
          <motion.div
            variants={fadeUpItem}
            className="mt-10 w-full max-w-md glass-card p-8 md:p-10 glow-border"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label htmlFor="waitlist-email" className="sr-only">
                Email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                disabled={status === "loading" || status === "success"}
                aria-describedby="waitlist-privacy"
                className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border-primary)] rounded-xl px-4 py-3.5 min-h-[48px] text-fg placeholder:text-fg-faint focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 focus:border-[var(--color-accent-primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full bg-[var(--color-accent-primary)] text-white rounded-xl px-6 py-3.5 min-h-[48px] text-base font-semibold hover:brightness-110 hover:shadow-[var(--shadow-glow)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "loading"
                  ? "Joining..."
                  : status === "success"
                    ? "You're in!"
                    : "Get Early Access"}
              </button>

              {status === "error" && (
                <p role="alert" className="text-red-400 text-sm text-center">
                  {errorMessage}
                </p>
              )}

              {status === "success" && (
                <p role="status" className="text-emerald-400 text-sm text-center">
                  Welcome aboard! We&apos;ll reach out when access opens.
                </p>
              )}
            </form>

            <p
              id="waitlist-privacy"
              className="mt-4 text-xs text-fg-faint text-center"
            >
              We only need your email. No biometrics, no personal ID, no location data.
            </p>
          </motion.div>

          {/* Benefit cards */}
          <motion.div
            variants={fadeUpItem}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
          >
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="glass-card p-5 text-center flex flex-col items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-dim)] flex items-center justify-center">
                  <benefit.icon
                    className="w-5 h-5 text-[var(--color-accent-primary)]"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="font-semibold text-fg text-sm">
                  {benefit.title}
                </h3>
                <p className="text-fg-tertiary text-xs leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Timeline */}
          <motion.div
            variants={fadeUpItem}
            className="mt-12 flex items-center justify-center gap-0"
          >
            {PHASES.map((phase, i) => (
              <div key={phase.label} className="flex items-center">
                <div className="flex items-center gap-2 px-4 py-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      phase.active
                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                        : "bg-[var(--color-border-secondary)]"
                    }`}
                  />
                  <span className={`text-xs font-mono ${phase.active ? "text-fg" : "text-fg-muted"}`}>
                    {phase.label}
                  </span>
                  {phase.status && (
                    <Badge variant="success" className="text-[10px] px-2 py-0.5">
                      {phase.status}
                    </Badge>
                  )}
                </div>
                {i < PHASES.length - 1 && (
                  <div className="w-8 h-px bg-[var(--color-border-secondary)]" />
                )}
              </div>
            ))}
          </motion.div>

          {/* Social proof / trust strip */}
          <motion.div
            variants={fadeUpItem}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-fg-faint"
          >
            <span>Devnet live</span>
            <span className="hidden sm:inline">·</span>
            <span>6 active nodes</span>
            <span className="hidden sm:inline">·</span>
            <span>16 core modules</span>
            <span className="hidden sm:inline">·</span>
            <span>v0.8.26</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const WaitlistPage = memo(WaitlistPageComponent);
WaitlistPage.displayName = "WaitlistPage";

export default WaitlistPage;
