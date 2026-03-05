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
    title: "7aychain v0.8.26 released",
    date: "Feb 28, 2026",
    summary: "Latest stable release with full protocol stack.",
    content:
      "Released 7aychain v0.8.26, the latest stable version of the Layer 1 blockchain. This release includes the complete protocol stack: presence lifecycle with commit-reveal, witness-circle triangulation, ZK proof verification, validator staking and slashing, governance, vaults, semantic linking, dispute resolution, device scanning, and autonomous detection. Multi-node devnet running with 6 validators.",
    type: "platform",
  },
  {
    title: "Governance and vault system",
    date: "Feb 2026",
    summary: "On-chain governance and secure vault infrastructure shipped.",
    content:
      "Shipped on-chain governance with proposals, voting, and delegation. Implemented the vault system with create, share, recover, register-file, request-unlock, and authorize-unlock operations. Added semantic linking for trust graphs between on-chain entities.",
    type: "platform",
  },
  {
    title: "ZK circuits and triangulation",
    date: "Jan 2026",
    summary: "Zero-knowledge proofs and multilateration algorithms integrated.",
    content:
      "Integrated ZK proof generation and on-chain verification for privacy-preserving presence attestation. Implemented multilateration and centroid triangulation algorithms that allow validators to determine position from network latency measurements without GPS. Added position-bound tokens (PBTs) for cryptographic position claims.",
    type: "platform",
  },
  {
    title: "Validator system and dispute resolution",
    date: "Jan 2026",
    summary: "Full validator lifecycle with staking, slashing, and disputes.",
    content:
      "Implemented the complete validator system: registration, activation, deactivation, withdrawal, staking, and slashing. Added dispute resolution with evidence submission, voting, and on-chain resolution. Validators form witness circles and participate in quorum-based presence finalization.",
    type: "platform",
  },
  {
    title: "Multi-node devnet and CLI",
    date: "Jan 2026",
    summary: "Hybrid devnet with Laud Networks CLI for protocol interaction.",
    content:
      "Launched multi-node hybrid devnet with Alice running natively and remaining validators (Bob, Charlie, Dave, Eve, Ferdie) in Docker. Released the Laud Networks CLI with interactive commands for all protocol modules: presence, epoch, validator, triangulation, ZK, governance, vault, semantic, and more.",
    type: "platform",
  },
  {
    title: "Presence and epoch core",
    date: "Dec 2025",
    summary: "Foundational presence lifecycle and epoch management shipped.",
    content:
      "Built the core presence state machine (Declared, Attested, Triangulated, Finalized) with epoch-bound lifecycle. Implemented the 5-state epoch model with dynamic state derivation from block timestamps. Established actor/epoch isolation and authority-controlled mutations. This formed the foundation for the full 7aychain protocol.",
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
            Last updated &middot; Feb 28, 2026
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
            This log tracks real progress across 7aychain and the 7ayLabs
            project &mdash; protocol milestones, shipped features, and
            infrastructure updates. Each update expands with full context.
          </motion.p>
        </motion.div>

        {/* Filters */}
        <div className="mt-4 mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter updates by type">
          {FILTERS.map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`rounded-full px-4 py-1.5 min-h-[36px] text-xs uppercase tracking-wide transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-white/60 ${
                filter === key
                  ? "bg-white text-black"
                  : "border border-white/15 text-white/50 hover:border-white/30 hover:text-white/70"
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
                      className="mt-2 inline-flex items-center gap-1 py-1 text-sm font-medium text-white/60 hover:text-white focus-visible:text-white transition-colors duration-fast"
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
