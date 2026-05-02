"use client";

import { useState, type FormEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle } from "lucide-react";

import SectionEyebrow from "@/components/ui/SectionEyebrow";
import WordStagger from "@/components/ui/WordStagger";

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const VIEWPORT = { once: true, margin: "-80px 0px" } as const;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

/* ─────────────────────────────────────────────────────────────────────── */
/*  Newsletter — editorial inline subscribe                              */
/*    No glass panel. Email input is a hairline-bordered field, button   */
/*    is solid black-on-cream (or white-on-black in dark theme).         */
/* ─────────────────────────────────────────────────────────────────────── */

export default function Newsletter() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || status === "submitting") return;
    setStatus("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setStatus("error");
        setMessage(t("errorMessage"));
        return;
      }
      setStatus("success");
      setMessage(t("successMessage"));
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(t("errorMessage"));
    }
  };

  return (
    <section
      aria-labelledby="newsletter-title"
      className="relative w-full py-24 md:py-36 border-t border-[var(--color-border-primary)]"
    >
      <motion.div
        className="max-w-3xl mx-auto px-6 sm:px-10 flex flex-col items-start text-left"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.div variants={fadeUp} className="mb-5">
          <SectionEyebrow>{t("labelEyebrow")}</SectionEyebrow>
        </motion.div>

        <motion.div variants={fadeUp}>
          <WordStagger
            as="h2"
            className="text-fg text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] tracking-[-0.02em] font-display font-medium leading-[1.05]"
            delay={0.1}
            stagger={0.07}
          >
            {t("title")}
          </WordStagger>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-fg-secondary text-base md:text-lg leading-relaxed max-w-xl"
        >
          {t("subtitle")}
        </motion.p>

        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="mt-12 w-full max-w-xl"
          aria-label="Newsletter signup"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              {t("emailPlaceholder")}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              disabled={status === "submitting" || status === "success"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="flex-1 h-12 px-4 text-base bg-[var(--color-bg-elevated)] text-fg placeholder:text-fg-muted border border-[var(--color-border-primary)] focus:border-[var(--color-fg-primary)] focus:outline-none transition-colors disabled:opacity-50"
              style={{ borderRadius: 2 }}
            />
            <button
              type="submit"
              disabled={status === "submitting" || status === "success" || !email}
              className="inline-flex items-center justify-center px-6 h-12 text-sm font-semibold bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-primary)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: 2 }}
            >
              {status === "submitting" ? "…" : t("cta")}
            </button>
          </div>

          <div
            aria-live="polite"
            className="mt-4 min-h-[1.25rem] flex items-center gap-2 text-sm"
          >
            {status === "success" && (
              <span className="inline-flex items-center gap-2 text-[var(--color-status-success)]">
                <CheckCircle2 size={14} strokeWidth={2} />
                {message}
              </span>
            )}
            {status === "error" && (
              <span className="inline-flex items-center gap-2 text-[var(--color-status-error)]">
                <AlertCircle size={14} strokeWidth={2} />
                {message}
              </span>
            )}
          </div>
        </motion.form>

        <motion.p
          variants={fadeUp}
          className="text-xs text-fg-muted mt-3 font-mono tracking-wide"
        >
          {t("trustLine")}
        </motion.p>
      </motion.div>
    </section>
  );
}
