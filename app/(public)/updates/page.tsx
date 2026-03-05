"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import { Badge } from "@/components/ui";

type UpdateType = "all" | "platform" | "website" | "app";

interface UpdateEntry {
  title: string;
  date: string;
  summary: string;
  content: string;
  type: Exclude<UpdateType, "all">;
}

const updatesLog: UpdateEntry[] = [
  {
    title: "MVP flow prototype",
    date: "Dec 12, 2025",
    summary: "Validating first end-to-end PoP flow.",
    content:
      "Validating first end-to-end Proof of Presence flow. This milestone represents the initial prototype that connects presence declaration, validation, and finalization into a single user journey. Testing is focused on real-world viability and edge-case handling.",
    type: "app",
  },
  {
    title: "Presence signal design",
    date: "Dec 09 - Dec 11, 2025",
    summary: "Defined first verifiable presence signal.",
    content:
      "Defined first verifiable presence signal. Established the core data model for presence events, including spatial context, temporal bounds, and actor isolation. This forms the foundation for all downstream verification logic.",
    type: "platform",
  },
  {
    title: "Assumption mapping",
    date: "Dec 06 - Dec 08, 2025",
    summary: "Mapped assumptions around presence signals.",
    content:
      "Mapped assumptions around presence signals. Documented key hypotheses about how presence should be captured, verified, and consumed. Identified critical unknowns around spoofing vectors, latency requirements, and privacy constraints.",
    type: "platform",
  },
  {
    title: "Problem validation",
    date: "Dec 01 - Dec 05, 2025",
    summary: "Validated core problem with early teams.",
    content:
      "Validated core problem with early teams. Conducted structured interviews and research across event organizers, community builders, and logistics operators. Confirmed that presence verification is a high-pain, low-solution problem space.",
    type: "platform",
  },
];

const FILTERS: UpdateType[] = ["all", "platform", "website", "app"];

export default function UpdatesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<UpdateType>("all");

  const filtered = updatesLog.filter(
    (item) => filter === "all" || item.type === filter
  );

  return (
    <>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-0">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="block mb-3 text-sm uppercase tracking-widest text-white/40">
            Updates
          </span>
          <h1 className="font-serif font-bold text-4xl md:text-5xl tracking-tight leading-tight mb-2">
            Project Status
          </h1>
          <p className="mt-1 mb-4 text-base md:text-lg text-white/45 max-w-2xl">
            Last updated &middot; Dec 12, 2025
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
            className="max-w-2xl text-base leading-relaxed text-white/45 mt-0 mb-4"
          >
            This log tracks real progress across the 7ayLabs project &mdash;
            decisions, validations, and shipped signals. Each update expands
            with full context.
          </motion.p>
        </motion.div>

        {/* Filters */}
        <div className="mt-4 mb-8 flex flex-wrap gap-2">
          {FILTERS.map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wide transition-colors duration-fast ${
                filter === key
                  ? "bg-white text-black"
                  : "border border-white/15 text-white/50 hover:border-white/30"
              }`}
            >
              {key === "all" ? "All updates" : key}
            </button>
          ))}
        </div>

        <p className="mb-4 text-sm text-white/35 max-w-2xl">
          Updates are ordered by real execution, not announcements. Click any
          entry to expand full context.
        </p>

        {/* Log entries */}
        <div>
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
                className={`border-b border-white/10 py-4 max-w-5xl ${
                  isLatest ? "bg-white/[0.02]" : ""
                }`}
              >
                <div className="flex gap-4">
                  {/* Content column */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-tight text-white leading-snug">
                        {item.title}
                      </h3>
                      {isLatest && <Badge variant="accent">Latest</Badge>}
                    </div>

                    <p className="mt-1 text-sm md:text-base text-white/35">
                      {item.date}
                    </p>

                    <button
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-white/60 hover:text-white transition-colors duration-fast"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      aria-controls={`update-content-${idx}`}
                    >
                      {isOpen ? "Close" : "View update"} &rarr;
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
                          <p className="mt-4 text-base leading-relaxed text-white/60 max-w-xl">
                            {item.content}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
