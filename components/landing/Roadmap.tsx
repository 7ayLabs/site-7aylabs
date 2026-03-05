"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import type { RoadmapPhase, PhaseStatus } from "@/types/components";

const phases: RoadmapPhase[] = [
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

const statusConfig: Record<
  PhaseStatus,
  { badgeVariant: "success" | "warning" | "muted"; label: string; dotColor: string; barColor: string }
> = {
  completed: {
    badgeVariant: "success",
    label: "Completed",
    dotColor: "bg-emerald-400",
    barColor: "bg-gradient-to-r from-emerald-500 to-emerald-400",
  },
  "in-progress": {
    badgeVariant: "warning",
    label: "In Progress",
    dotColor: "bg-amber-400",
    barColor: "bg-gradient-to-r from-amber-500 to-amber-400",
  },
  planned: {
    badgeVariant: "muted",
    label: "Planned",
    dotColor: "bg-white/30",
    barColor: "",
  },
};

export default function Roadmap() {
  return (
    <section
      id="roadmap"
      aria-label="Roadmap"
      className="relative section-padding"
    >
      <div className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUpItem}
            className="label-sm block mb-4"
          >
            Development
          </motion.span>
          <motion.h2
            variants={fadeUpItem}
            className="heading-lg text-white mb-4"
          >
            Roadmap
          </motion.h2>
          <motion.p
            variants={fadeUpItem}
            className="body-lg max-w-2xl mx-auto"
          >
            Building the infrastructure for verifiable human presence on-chain
          </motion.p>
        </motion.div>

        {/* Phase cards grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {phases.map((phase) => {
            const config = statusConfig[phase.status];

            return (
              <motion.div key={phase.version} variants={fadeUpItem}>
                <Card
                  variant="default"
                  padding="lg"
                  className={cn(
                    "h-full relative overflow-hidden",
                    phase.status === "in-progress" &&
                      "border-amber-400/20"
                  )}
                >
                  {/* Progress indicator bar */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute top-0 left-0 h-0.5 rounded-full",
                      phase.status === "completed"
                        ? "w-full"
                        : phase.status === "in-progress"
                          ? "w-2/3"
                          : "w-0",
                      config.barColor
                    )}
                  />

                  <div className="flex items-center justify-between mb-5">
                    <span className="text-sm font-mono text-white/35">
                      {phase.version}
                    </span>
                    <Badge variant={config.badgeVariant}>{config.label}</Badge>
                  </div>

                  <h3 className="heading-sm text-white mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-white/45 text-sm mb-6">
                    {phase.description}
                  </p>

                  <ul className="space-y-3" role="list">
                    {phase.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-white/40"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                            config.dotColor
                          )}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
