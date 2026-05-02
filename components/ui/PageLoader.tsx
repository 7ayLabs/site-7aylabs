"use client";

import { motion } from "framer-motion";

/**
 * PageLoader — minimal B&W route loader shown while a route segment is loading.
 *
 * Two visuals stacked:
 *   1. A thin top progress bar that animates indeterminately.
 *   2. A centered word-mark pulse ("7AY") so the page never feels empty.
 *
 * The component is rendered by `loading.tsx` files at any route boundary,
 * so Next.js shows it automatically on navigation while the next segment
 * is still streaming.
 */
export default function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-bg"
    >
      {/* Top progress bar — indeterminate slide */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-0 h-[2px] w-1/3 bg-fg"
        initial={{ x: "-100%" }}
        animate={{ x: "300%" }}
        transition={{
          duration: 1.1,
          ease: [0.65, 0, 0.35, 1],
          repeat: Infinity,
        }}
      />

      {/* Centered word-mark pulse */}
      <motion.div
        className="font-display text-[clamp(2.5rem,8vw,5rem)] font-extrabold tracking-tight text-fg select-none"
        initial={{ opacity: 0.35, scale: 0.98 }}
        animate={{ opacity: [0.35, 1, 0.35], scale: [0.98, 1.02, 0.98] }}
        transition={{
          duration: 1.6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        7AY
      </motion.div>

      <span className="sr-only">Loading next page…</span>
    </div>
  );
}
