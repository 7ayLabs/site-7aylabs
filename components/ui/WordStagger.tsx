"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface WordStaggerProps {
  children: string;
  className?: string;
  /** Delay before the first word starts revealing. Default 0. */
  delay?: number;
  /** Per-word delay. Default 0.06. */
  stagger?: number;
  /** Element type to render as. Default `h1`. */
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Word-by-word entrance. Each word fades up from below with a tiny blur
 * release — a Gen-Z-native cadence that reads like a single thought
 * unfolding rather than a typewriter or scattered glitch.
 *
 * Respects `prefers-reduced-motion`: collapses to a flat string render.
 */
export default function WordStagger({
  children,
  className,
  delay = 0,
  stagger = 0.06,
  as: Tag = "h1",
}: WordStaggerProps) {
  const reduce = useReducedMotion();
  const words = children.split(/(\s+)/); // keep whitespace tokens

  if (reduce) {
    const Static = Tag as "h1";
    return <Static className={className}>{children}</Static>;
  }

  const Wrapper = motion[Tag] as typeof motion.h1;

  return (
    <Wrapper
      className={cn(className)}
      initial="hidden"
      animate="visible"
      transition={{
        delayChildren: delay,
        staggerChildren: stagger,
      }}
    >
      {words.map((token, i) => {
        // whitespace stays inline as plain text (no animation)
        if (/^\s+$/.test(token)) {
          return <span key={i}>{token}</span>;
        }
        return (
          <motion.span
            key={i}
            variants={wordVariants}
            className="inline-block"
            style={{ willChange: "transform, filter, opacity" }}
          >
            {token}
          </motion.span>
        );
      })}
    </Wrapper>
  );
}
