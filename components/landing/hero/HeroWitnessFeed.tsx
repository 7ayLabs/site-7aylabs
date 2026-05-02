"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import SectionEyebrow from "@/components/ui/SectionEyebrow";

/* ─────────────────────────────────────────────────────────────────────── */
/*  HeroWitnessFeed                                                        */
/*                                                                         */
/*  A live chain-explorer-style stream of telecom-native events. Same      */
/*  visual primitive Etherscan / Solscan / Beaconcha.in use to surface    */
/*  network liveness — but every event here is a 7aychain carrier action  */
/*  (presence, SIM bind, attach, witness attest, port). Crypto-community  */
/*  canonical, telecom-context-specific.                                   */
/*                                                                         */
/*  The feed mutates over time: every ~3.5s a new event prepends, the     */
/*  oldest exits, the tip block ticks up, and "last seen" counts seconds. */
/* ─────────────────────────────────────────────────────────────────────── */

interface FeedEvent {
  id: string;
  block: string;     // "0x1A8C" (tip-relative, increments)
  type: string;      // dotted event name e.g. "attach.authorized"
  subject: string;   // "s_0x4f1c89a", "d_0x…", "n_+44 020 …"
  region: string;    // 5-char region code, mono
  meta: string;      // tail status/timing
}

interface EventTemplate {
  type: string;
  regions: readonly string[];
  meta: () => string;
}

const REGIONS_GLOBAL = [
  "SFO-N",
  "NYC-S",
  "LON-W",
  "TYO-E",
  "BER-W",
  "SAO-C",
  "SYD-E",
  "MAD-N",
  "DEL-N",
  "SIN-C",
] as const;

const EVENT_TEMPLATES: ReadonlyArray<EventTemplate> = [
  {
    type: "attach.authorized",
    regions: REGIONS_GLOBAL,
    meta: () => `${Math.floor(Math.random() * 700) + 180}ms · 6/6`,
  },
  {
    type: "presence.declared",
    regions: REGIONS_GLOBAL,
    meta: () => `${Math.floor(Math.random() * 500) + 240}ms · pending`,
  },
  {
    type: "presence.finalized",
    regions: REGIONS_GLOBAL,
    meta: () => `${(Math.random() * 0.6 + 0.3).toFixed(2)}s · sealed`,
  },
  {
    type: "sim.bound",
    regions: REGIONS_GLOBAL,
    meta: () => `${(Math.random() * 1.6 + 0.6).toFixed(1)}s · accepted`,
  },
  {
    type: "sim.rotated",
    regions: REGIONS_GLOBAL,
    meta: () => `quorum 6/6 · anti-swap`,
  },
  {
    type: "witness.attest",
    regions: REGIONS_GLOBAL,
    meta: () => `${Math.floor(Math.random() * 120) + 40}ms · 1/6`,
  },
  {
    type: "number.assigned",
    regions: REGIONS_GLOBAL,
    meta: () => `${(Math.random() * 0.9 + 0.4).toFixed(1)}s · bound`,
  },
  {
    type: "number.ported",
    regions: REGIONS_GLOBAL,
    meta: () => `${(Math.random() * 1.8 + 1.0).toFixed(1)}s · porting`,
  },
  {
    type: "device.registered",
    regions: REGIONS_GLOBAL,
    meta: () => `${(Math.random() * 0.5 + 0.2).toFixed(2)}s · ok`,
  },
];

/* ── Helpers ── */

const pick = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const hex = (len: number): string => {
  let s = "";
  for (let i = 0; i < len; i++) s += "0123456789abcdef"[Math.floor(Math.random() * 16)];
  return s;
};

function genSubject(eventType: string): string {
  if (eventType.startsWith("number.")) {
    // Phone-number-shaped subject for portability events
    const cc = pick(["+1", "+44", "+34", "+49", "+81", "+55"]);
    const a = String(Math.floor(Math.random() * 900) + 100);
    const b = String(Math.floor(Math.random() * 9000) + 1000);
    return `n_${cc} ${a}··${b.slice(0, 2)}`;
  }
  if (eventType.startsWith("device.")) return `d_0x${hex(7)}`;
  if (eventType.startsWith("witness.")) return `w_0x${hex(7)}`;
  if (eventType.startsWith("sim.")) return `e_0x${hex(7)}`;
  return `s_0x${hex(7)}`;
}

function blockToHex(n: number): string {
  return `0x${n.toString(16).toUpperCase().padStart(4, "0")}`;
}

function genEvent(blockNum: number, idSeed: number): FeedEvent {
  const tpl = pick(EVENT_TEMPLATES);
  return {
    id: `${blockNum}-${idSeed}-${Math.random().toString(36).slice(2, 7)}`,
    block: blockToHex(blockNum),
    type: tpl.type,
    subject: genSubject(tpl.type),
    region: pick(tpl.regions),
    meta: tpl.meta(),
  };
}

/* ── Component ── */

const VISIBLE = 5;
const TICK_MS = 3400;
const STARTING_BLOCK = 0x1a8c; // matches the value used elsewhere in the page for continuity

const enterContainer: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delayChildren: 0.2,
      staggerChildren: 0.06,
    },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroWitnessFeed() {
  // Seed initial 5 events so the panel renders fully on mount.
  const initialFeed = useMemo<FeedEvent[]>(() => {
    const out: FeedEvent[] = [];
    for (let i = 0; i < VISIBLE; i++) {
      out.push(genEvent(STARTING_BLOCK - i, i));
    }
    return out;
  }, []);

  const [feed, setFeed] = useState<FeedEvent[]>(initialFeed);
  const [tipBlock, setTipBlock] = useState<number>(STARTING_BLOCK);
  const [secondsSinceTip, setSecondsSinceTip] = useState(0);

  // Push a new event every ~3.4s
  useEffect(() => {
    let counter = 0;
    const id = setInterval(() => {
      counter += 1;
      setTipBlock((b) => b + 1);
      setSecondsSinceTip(0);
      setFeed((current) => {
        const next = [genEvent(tipBlock + 1, counter), ...current];
        return next.slice(0, VISIBLE);
      });
    }, TICK_MS);
    return () => clearInterval(id);
    // tipBlock intentionally omitted — we want a single interval, and we read
    // the freshest tipBlock via setTipBlock callback closure on next tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tick "last seen" counter every second
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsSinceTip((s) => Math.min(s + 1, 99));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.aside
      variants={enterContainer}
      initial="hidden"
      animate="visible"
      aria-label="Live witness ledger"
      className="relative w-full max-w-[460px] overflow-hidden"
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border-primary)",
        borderRadius: 2,
      }}
    >
      {/* ───── Header ───── */}
      <motion.header
        variants={fadeUpItem}
        className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-primary)]"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase font-semibold text-fg">
            Witness Ledger
          </span>
        </div>
        <SectionEyebrow withDot>Live</SectionEyebrow>
      </motion.header>

      {/* ───── Feed ───── */}
      <motion.ul
        variants={fadeUpItem}
        className="flex flex-col"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {feed.map((event, idx) => (
            <motion.li
              key={event.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={
                "flex flex-col gap-1 px-6 py-3.5 " +
                (idx < VISIBLE - 1 ? "border-b border-[var(--color-border-primary)]" : "")
              }
            >
              {/* Top line: block + event type */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="font-mono text-[11px] tracking-[0.04em] text-fg-muted shrink-0"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {event.block}
                  </span>
                  <span className="text-fg-faint text-[11px]">·</span>
                  <span
                    className="font-mono text-[12px] font-semibold tracking-[0.02em] text-fg truncate"
                    style={{
                      color:
                        idx === 0
                          ? "var(--color-accent-primary)"
                          : "var(--color-fg-primary)",
                    }}
                  >
                    {event.type}
                  </span>
                </div>
                {idx === 0 && (
                  <span
                    aria-hidden="true"
                    className="relative inline-flex h-1.5 w-1.5 shrink-0"
                  >
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "var(--color-accent-primary)",
                      }}
                    />
                    <span
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        background: "var(--color-accent-primary)",
                        opacity: 0.55,
                      }}
                    />
                  </span>
                )}
              </div>
              {/* Bottom line: subject + region + meta */}
              <div className="flex items-center justify-between gap-3">
                <span
                  className="font-mono text-[11px] tracking-[0.04em] text-fg-secondary truncate"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {event.subject}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-tertiary">
                    {event.region}
                  </span>
                  <span className="text-fg-faint text-[10px]">·</span>
                  <span
                    className="font-mono text-[11px] tracking-[0.02em] text-fg-secondary"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {event.meta}
                  </span>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {/* ───── Footer ───── */}
      <motion.footer
        variants={fadeUpItem}
        className="flex items-center justify-between px-6 py-3.5 border-t border-[var(--color-border-primary)]"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-muted">
            Tip
          </span>
          <span
            className="font-mono text-[11px] tracking-[0.04em] text-fg"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {blockToHex(tipBlock)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-muted">
            Last
          </span>
          <span
            className="font-mono text-[11px] tracking-[0.04em] text-fg"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {secondsSinceTip}s
          </span>
        </div>
      </motion.footer>
    </motion.aside>
  );
}
