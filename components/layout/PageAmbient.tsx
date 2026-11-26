"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

/**
 * Page-specific ambient accent layer.
 *
 * Renders ON TOP of the base `.ambient-glow` (single subtle radial in
 * `globals.css`) — adding a unique multi-color fingerprint per route.
 *
 * - Locale prefix is stripped (/en/about → about)
 * - The first segment determines the variant
 * - Each variant defines 3 colored radial blobs at unique positions
 * - Theme-aware (dark/light opacity multipliers via `useTheme()`)
 */

type Blob = {
  color: string;
  /** position 0–100 */
  x: number;
  y: number;
  /** size 0–100 */
  sx: number;
  sy: number;
  /** opacity overrides (default 1) */
  darkAlpha?: number;
  lightAlpha?: number;
};

type Variant = {
  name: string;
  blobs: ReadonlyArray<Blob>;
};

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

function buildBackground(variant: Variant, theme: "dark" | "light"): string {
  const baseAlpha = theme === "dark" ? 0.11 : 0.07;
  return variant.blobs
    .map((b) => {
      const mult = theme === "dark" ? b.darkAlpha ?? 1 : b.lightAlpha ?? 1;
      const rgba = hexToRgba(b.color, baseAlpha * mult);
      return `radial-gradient(ellipse ${b.sx}% ${b.sy}% at ${b.x}% ${b.y}%, ${rgba} 0%, transparent 60%)`;
    })
    .join(", ");
}

/* ── Per-route ambient palettes (each one visibly distinct) ── */
const VARIANTS: Record<string, Variant> = {
  /* Home — top-left teal, top-right violet, bottom amber */
  home: {
    name: "home",
    blobs: [
      { color: "#178E77", x: 20, y: 18, sx: 55, sy: 50 },
      { color: "#8B5CF6", x: 80, y: 22, sx: 50, sy: 45 },
      { color: "#F59E0B", x: 50, y: 88, sx: 60, sy: 50, darkAlpha: 0.7 },
    ],
  },

  /* Technology — left teal, right violet, bottom cyan */
  technology: {
    name: "technology",
    blobs: [
      { color: "#178E77", x: 12, y: 22, sx: 60, sy: 55, darkAlpha: 1.2 },
      { color: "#8B5CF6", x: 88, y: 18, sx: 55, sy: 50, darkAlpha: 1.2 },
      { color: "#22D3EE", x: 50, y: 90, sx: 65, sy: 50 },
    ],
  },

  /* Use cases — magenta + amber + coral */
  "use-cases": {
    name: "use-cases",
    blobs: [
      { color: "#D946EF", x: 18, y: 18, sx: 55, sy: 50, darkAlpha: 1.1 },
      { color: "#F59E0B", x: 82, y: 22, sx: 55, sy: 50, darkAlpha: 1.1 },
      { color: "#EC4899", x: 50, y: 90, sx: 65, sy: 50 },
    ],
  },

  /* About — gold + teal + violet */
  about: {
    name: "about",
    blobs: [
      { color: "#F59E0B", x: 20, y: 20, sx: 55, sy: 50 },
      { color: "#178E77", x: 82, y: 18, sx: 55, sy: 50 },
      { color: "#A78BFA", x: 50, y: 90, sx: 60, sy: 50 },
    ],
  },

  /* Why presence — emerald + cyan + teal */
  "why-presence": {
    name: "why-presence",
    blobs: [
      { color: "#10B981", x: 18, y: 20, sx: 55, sy: 50, darkAlpha: 1.1 },
      { color: "#22D3EE", x: 82, y: 18, sx: 55, sy: 50 },
      { color: "#178E77", x: 50, y: 90, sx: 65, sy: 50 },
    ],
  },

  /* Devnet — cyan + electric blue + violet */
  devnet: {
    name: "devnet",
    blobs: [
      { color: "#22D3EE", x: 18, y: 20, sx: 55, sy: 50, darkAlpha: 1.2 },
      { color: "#3B82F6", x: 82, y: 22, sx: 55, sy: 50, darkAlpha: 1.1 },
      { color: "#8B5CF6", x: 50, y: 90, sx: 65, sy: 50 },
    ],
  },

  /* Validators — teal + lime + emerald */
  validators: {
    name: "validators",
    blobs: [
      { color: "#178E77", x: 20, y: 18, sx: 55, sy: 50, darkAlpha: 1.2 },
      { color: "#84CC16", x: 80, y: 22, sx: 50, sy: 45, darkAlpha: 0.9 },
      { color: "#10B981", x: 50, y: 90, sx: 65, sy: 50 },
    ],
  },

  /* Ecosystem — full rainbow accent */
  ecosystem: {
    name: "ecosystem",
    blobs: [
      { color: "#8B5CF6", x: 18, y: 15, sx: 55, sy: 50, darkAlpha: 1.1 },
      { color: "#F59E0B", x: 82, y: 20, sx: 55, sy: 50 },
      { color: "#EC4899", x: 50, y: 90, sx: 65, sy: 50, darkAlpha: 0.9 },
    ],
  },

  /* Updates — calm violet + teal + cyan */
  updates: {
    name: "updates",
    blobs: [
      { color: "#A78BFA", x: 20, y: 18, sx: 55, sy: 50 },
      { color: "#178E77", x: 82, y: 22, sx: 50, sy: 45, darkAlpha: 0.9 },
      { color: "#22D3EE", x: 50, y: 90, sx: 60, sy: 50, darkAlpha: 0.8 },
    ],
  },

  /* Newsletter — amber + violet + teal */
  newsletter: {
    name: "newsletter",
    blobs: [
      { color: "#FBBF24", x: 18, y: 20, sx: 55, sy: 50 },
      { color: "#8B5CF6", x: 82, y: 18, sx: 55, sy: 50 },
      { color: "#178E77", x: 50, y: 90, sx: 60, sy: 50, darkAlpha: 0.9 },
    ],
  },

  /* Glossary — slate + cyan + violet */
  glossary: {
    name: "glossary",
    blobs: [
      { color: "#64748B", x: 20, y: 20, sx: 55, sy: 50 },
      { color: "#22D3EE", x: 80, y: 18, sx: 55, sy: 50 },
      { color: "#A78BFA", x: 50, y: 90, sx: 60, sy: 50 },
    ],
  },

  /* Waitlist — magenta + violet + amber */
  waitlist: {
    name: "waitlist",
    blobs: [
      { color: "#D946EF", x: 18, y: 18, sx: 55, sy: 50, darkAlpha: 1.1 },
      { color: "#8B5CF6", x: 82, y: 22, sx: 55, sy: 50, darkAlpha: 1.1 },
      { color: "#F59E0B", x: 50, y: 90, sx: 65, sy: 50 },
    ],
  },
};

const ALIASES: Record<string, string> = {
  tech: "technology",
  services: "ecosystem",
};

const LOCALES = ["en", "es", "pt", "fr", "de", "zh", "ja"];

function getVariant(pathname: string): Variant {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    segments.shift();
  }
  if (segments.length === 0) return VARIANTS.home;

  const first = segments[0];
  const aliased = ALIASES[first];
  const key = aliased ?? first;
  return VARIANTS[key] ?? VARIANTS.home;
}

export default function PageAmbient() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const variant = useMemo(() => getVariant(pathname), [pathname]);

  const backgroundImage = useMemo(
    () => buildBackground(variant, theme),
    [variant, theme]
  );

  return (
    <div
      aria-hidden="true"
      data-variant={variant.name}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundImage,
        transition: "background-image 600ms ease",
      }}
    />
  );
}
