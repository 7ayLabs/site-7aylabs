"use client";

import { useState, useCallback, memo, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Award, Loader2 } from "lucide-react";
import {
  staggerContainer,
  fadeUpItem,
} from "@/lib/constants/animations";
import { Badge } from "@/components/ui";

type FormStatus = "idle" | "loading" | "success" | "error";

const BENEFIT_ICONS = [Sparkles, MessageSquare, Award] as const;
const BENEFIT_KEYS = [0, 1, 2] as const;
const PHASE_KEYS = [0, 1, 2] as const;

function WaitlistContentComponent() {
  const t = useTranslations("waitlistPage");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email || !email.includes("@")) {
        setStatus("error");
        setErrorMessage(t("form.errorInvalidEmail"));
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
          setErrorMessage(data.message || t("form.errorGeneric"));
          return;
        }

        setStatus("success");
        setEmail("");
      } catch {
        setStatus("error");
        setErrorMessage(t("form.errorGeneric"));
      }
    },
    [email, t]
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
            <Badge variant="accent">{t("badge")}</Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpItem}
            className="mt-8 font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-fg"
          >
            {t("title")}{" "}
            <span className="gradient-text-accent">{t("titleAccent")}</span>
            {t("titleEnd")}
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUpItem}
            className="mt-6 text-fg-secondary text-lg md:text-xl max-w-2xl leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          {/* Glass form panel */}
          <motion.div
            variants={fadeUpItem}
            className="mt-10 w-full max-w-md glass-card p-8 md:p-10 glow-border"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label htmlFor="waitlist-email" className="sr-only">
                {t("form.emailLabel")}
              </label>
              <input
                id="waitlist-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("form.emailPlaceholder")}
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
                  ? t("form.submitLoading")
                  : status === "success"
                    ? t("form.submitSuccess")
                    : t("form.submitIdle")}
              </button>

              {status === "error" && (
                <p role="alert" className="text-red-400 text-sm text-center">
                  {errorMessage}
                </p>
              )}

              {status === "success" && (
                <p role="status" className="text-emerald-400 text-sm text-center">
                  {t("form.successMessage")}
                </p>
              )}
            </form>

            <p
              id="waitlist-privacy"
              className="mt-4 text-xs text-fg-faint text-center"
            >
              {t("form.privacyNote")}
            </p>
          </motion.div>

          {/* Benefit cards */}
          <motion.div
            variants={fadeUpItem}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
          >
            {BENEFIT_KEYS.map((i) => {
              const Icon = BENEFIT_ICONS[i];
              return (
                <div
                  key={i}
                  className="glass-card p-5 text-center flex flex-col items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-dim)] flex items-center justify-center">
                    <Icon
                      className="w-5 h-5 text-[var(--color-accent-primary)]"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="font-semibold text-fg text-sm">
                    {t(`benefits.${i}.title`)}
                  </h3>
                  <p className="text-fg-tertiary text-xs leading-relaxed">
                    {t(`benefits.${i}.description`)}
                  </p>
                </div>
              );
            })}
          </motion.div>

          {/* Timeline */}
          <motion.div
            variants={fadeUpItem}
            className="mt-12 flex items-center justify-center gap-0"
          >
            {PHASE_KEYS.map((i) => {
              const hasStatus = i === 0;
              return (
                <div key={i} className="flex items-center">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        hasStatus
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                          : "bg-[var(--color-border-secondary)]"
                      }`}
                    />
                    <span className={`text-xs font-mono ${hasStatus ? "text-fg" : "text-fg-muted"}`}>
                      {t(`phases.${i}.label`)}
                    </span>
                    {hasStatus && (
                      <Badge variant="success" className="text-[10px] px-2 py-0.5">
                        {t(`phases.${i}.status`)}
                      </Badge>
                    )}
                  </div>
                  {i < 2 && (
                    <div className="w-8 h-px bg-[var(--color-border-secondary)]" />
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Social proof / trust strip */}
          <motion.div
            variants={fadeUpItem}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-fg-faint"
          >
            <span>{t("socialProof.devnetLive")}</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>{t("socialProof.activeNodes")}</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>{t("socialProof.coreModules")}</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>{t("socialProof.version")}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const WaitlistContent = memo(WaitlistContentComponent);
WaitlistContent.displayName = "WaitlistContent";

export default WaitlistContent;
