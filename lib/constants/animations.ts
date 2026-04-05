import type { Variants } from "framer-motion";

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 35, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const defaultViewport = {
  once: true,
  margin: "-50px",
};

export const EASING = {
  smooth: [0.22, 1, 0.36, 1],
  bounce: [0.18, 0.7, 0.3, 1.1],
  snappy: [0.16, 1, 0.3, 1],
} as const;

export const DURATION = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
  slower: 0.6,
} as const;

export const STAGGER_DELAY = {
  fast: 0.04,
  normal: 0.08,
  slow: 0.12,
} as const;

/** Glass card reveal: scales up with blur-to-sharp */
export const glassReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Bento stagger container */
export const bentoStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/** Bento item: fade up with scale */
export const bentoItem: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.93 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Glow pulse animation variant */
export const glowPulseVariant: Variants = {
  idle: { boxShadow: "0 0 0px rgba(23, 142, 119, 0)" },
  glow: {
    boxShadow: [
      "0 0 12px rgba(23, 142, 119, 0.18)",
      "0 0 24px rgba(23, 142, 119, 0.3)",
      "0 0 12px rgba(23, 142, 119, 0.18)",
    ],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

/** Kinetic text reveal */
export const kineticReveal: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Hero stagger (longer delays) */
export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

/** Float-in from side for floating glass panels */
export const floatIn: Variants = {
  hidden: { opacity: 0, x: 30, y: 10 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.7, delay: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Navbar entrance — slides down from top */
export const navbarSlideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Footer reveal — fades up when scrolled into view */
export const footerReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Scale up with blur — for differentiated section entrances */
export const scaleUpBlur: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─────────────────────────────────────────────────────
// Web3-inspired animation variants
// ─────────────────────────────────────────────────────

/** Text reveal — slides up from clipped position with blur dissolve. For headings. */
export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(4px)",
    clipPath: "inset(100% 0% 0% 0%)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Counter up — for stat/number animations. Scales from small with opacity. */
export const counterUp: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Card hover — use with whileHover on motion elements */
export const cardHover = {
  y: -3,
  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
};

/** List stagger — faster stagger for list items */
export const listStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

/** Scroll fade in — very subtle entrance for supporting content */
export const scrollFadeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

/** Glow pulse — CSS-driven glow for live/active indicators (use with animate prop) */
export const glowPulse: Variants = {
  idle: {
    boxShadow: "0 0 0px rgba(23, 142, 119, 0)",
  },
  pulse: {
    boxShadow: [
      "0 0 4px rgba(23, 142, 119, 0.15)",
      "0 0 12px rgba(23, 142, 119, 0.3)",
      "0 0 4px rgba(23, 142, 119, 0.15)",
    ],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** Table row — subtle fade in from left for table rows */
export const tableRowFade: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

/** Code block reveal — scale up with soft blur for code/pre blocks */
export const codeBlockReveal: Variants = {
  hidden: { opacity: 0, scale: 0.97, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function withDelay(variants: Variants, delay: number): Variants {
  return {
    ...variants,
    visible: {
      ...(variants.visible as object),
      transition: {
        ...((variants.visible as { transition?: object })?.transition ?? {}),
        delay,
      },
    },
  };
}
