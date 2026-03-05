"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { PhaseStatus } from "@/types/components";

/* ─── Phase data ─── */

interface Phase {
  version: string;
  title: string;
  description: string;
  status: PhaseStatus;
  items: string[];
}

const phases: Phase[] = [
  {
    version: "v0.1\u2013v0.3",
    title: "Presence & Epoch Core",
    description: "Foundational presence lifecycle and epoch management",
    status: "completed",
    items: [
      "Presence state machine (Declared \u2192 Attested \u2192 Triangulated \u2192 Finalized)",
      "Epoch lifecycle with commit-reveal scheme",
      "Actor/epoch isolation and quorum consensus",
    ],
  },
  {
    version: "v0.4\u2013v0.6",
    title: "Validators, ZK & Triangulation",
    description:
      "Decentralized validation with witness circles and zero-knowledge proofs",
    status: "completed",
    items: [
      "Validator registration, staking, and slashing",
      "Witness-circle triangulation via network latency",
      "ZK proof generation and on-chain verification",
      "Dispute resolution with evidence and voting",
    ],
  },
  {
    version: "v0.7\u2013v0.8",
    title: "Governance, Vaults & Semantic Layer",
    description: "On-chain governance, secure vaults, and semantic linking",
    status: "completed",
    items: [
      "Governance proposals, voting, and delegation",
      "Vault creation, sharing, and recovery",
      "Semantic linking and trust graphs",
      "Device scanning and autonomous detection",
    ],
  },
  {
    version: "v1.0",
    title: "Testnet & Network Expansion",
    description: "Public testnet launch and ecosystem growth",
    status: "in-progress",
    items: [
      "Public testnet deployment",
      "Multi-node devnet stabilization",
      "Developer SDK and tooling",
      "Ecosystem integrations and partnerships",
    ],
  },
];

/* ─── Status configuration ─── */

const statusConfig: Record<
  PhaseStatus,
  {
    icon: typeof CheckCircle2;
    color: string;
    bg: string;
    border: string;
    label: string;
  }
> = {
  completed: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
    label: "Completed",
  },
  "in-progress": {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    label: "In Progress",
  },
  planned: {
    icon: Circle,
    color: "text-white/40",
    bg: "bg-white/5",
    border: "border-white/10",
    label: "Planned",
  },
};

/* ─── Timeline component ─── */

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24 sm:py-32 bg-[#060606]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Roadmap
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Building the infrastructure for verifiable human presence on-chain
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[22px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent sm:-translate-x-px" />

          <div className="space-y-12">
            {phases.map((phase, idx) => {
              const config = statusConfig[phase.status];
              const Icon = config.icon;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={phase.version}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex flex-col sm:flex-row ${
                    isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                  } items-start sm:items-center gap-6 sm:gap-12`}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-11 h-11 rounded-full ${config.bg} ${config.border} border flex items-center justify-center z-10`}
                  >
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>

                  {/* Content card */}
                  <div
                    className={`ml-16 sm:ml-0 sm:w-[calc(50%-3rem)] ${
                      isEven ? "sm:text-right sm:pr-0" : "sm:text-left sm:pl-0"
                    }`}
                  >
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${config.bg} ${config.color} ${config.border} border`}
                    >
                      {phase.version} — {config.label}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {phase.title}
                    </h3>
                    <p className="text-white/50 text-sm mb-4">
                      {phase.description}
                    </p>
                    <ul
                      className={`space-y-2 ${
                        isEven ? "sm:text-right" : "sm:text-left"
                      }`}
                    >
                      {phase.items.map((item, i) => (
                        <li
                          key={i}
                          className={`text-sm text-white/40 flex items-center gap-2 ${
                            isEven ? "sm:justify-end" : "sm:justify-start"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              phase.status === "completed"
                                ? "bg-emerald-400/60"
                                : "bg-white/20"
                            }`}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden sm:block sm:w-[calc(50%-3rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
