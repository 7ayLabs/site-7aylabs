"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import { Badge, Card } from "@/components/ui";

type UpdateType = "all" | "platform" | "website" | "app";

const ENTRY_KEYS = [0, 1, 2, 3, 4, 5, 6] as const;
const FILTER_KEYS: UpdateType[] = ["all", "platform", "website", "app"];

export default function UpdatesContent() {
  const t = useTranslations("updatesPage");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<UpdateType>("all");

  const entries = ENTRY_KEYS.map((i) => ({
    title: t(`entries.${i}.title`),
    date: t(`entries.${i}.date`),
    summary: t(`entries.${i}.summary`),
    content: t(`entries.${i}.content`),
    type: t(`entries.${i}.type`) as Exclude<UpdateType, "all">,
  }));

  const filtered = entries.filter(
    (item) => filter === "all" || item.type === filter
  );

  return (
    <>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-8">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="block mb-4 text-sm uppercase tracking-widest text-accent">
            {t("label")}
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight mb-3">
            {t("title")} <span className="gradient-text-accent">{t("titleAccent")}</span>
          </h1>
          <p className="text-base md:text-lg text-fg-muted max-w-2xl">
            {t("lastUpdated")}
          </p>
        </motion.div>
      </section>

      {/* Updates Log */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUpItem}
            className="max-w-2xl text-base leading-relaxed text-fg-muted mb-6"
          >
            {t("intro")}
          </motion.p>
        </motion.div>

        {/* Filters */}
        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label={t("filterAria")}
        >
          {FILTER_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`rounded-full px-4 py-1.5 min-h-[36px] text-xs uppercase tracking-wide transition-all duration-300 ${
                filter === key
                  ? "glass-card border-[var(--color-border-accent)] text-accent font-semibold"
                  : "border border-[var(--color-border-primary)] text-fg-muted hover:border-[var(--color-border-secondary)] hover:text-fg-tertiary"
              }`}
            >
              {t(`filters.${key}`)}
            </button>
          ))}
        </div>

        {/* Log entries */}
        <div className="space-y-1">
          {filtered.map((item, idx) => {
            const isOpen = openIndex === idx;
            const isLatest = idx === 0;

            return (
              <motion.div
                key={`${item.title}-${item.date}`}
                variants={fadeUpItem}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
              >
                <Card
                  variant="default"
                  padding="md"
                  className={
                    isLatest ? "border-l-2 border-l-[var(--color-accent-primary)] border-[var(--color-border-accent)]" : ""
                  }
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-sans text-lg md:text-xl font-semibold tracking-tight text-fg leading-snug">
                        {item.title}
                      </h3>
                      {isLatest && <Badge variant="accent">{t("latest")}</Badge>}
                    </div>
                    <span className="text-sm text-fg-faint whitespace-nowrap shrink-0 mt-1">
                      {item.date}
                    </span>
                  </div>

                  <p className="text-sm text-fg-muted mb-3">{item.summary}</p>

                  <button
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-secondary transition-colors duration-fast"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`update-content-${idx}`}
                  >
                    {isOpen ? t("close") : t("viewDetails")}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                      aria-hidden="true"
                    >
                      <path d="M4 2l4 4-4 4" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        id={`update-content-${idx}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 pt-4 border-t border-[var(--color-border-primary)] text-sm leading-relaxed text-fg-tertiary">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
