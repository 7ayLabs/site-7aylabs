"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useAmbientColor } from "@/components/providers/AmbientColorProvider";
import type { BackgroundVariant } from "@/components/background/NetworkUniverse";

/* ── Orb color sets keyed by active color ── */
const ORB_COLORS = {
  teal: {
    primary: "radial-gradient(circle, rgba(23,142,119,0.15), transparent 70%)",
    secondary: "radial-gradient(circle, rgba(0,255,198,0.10), transparent 70%)",
    tertiary: "radial-gradient(circle, rgba(23,142,119,0.08), transparent 70%)",
  },
  violet: {
    primary: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)",
    secondary: "radial-gradient(circle, rgba(192,132,252,0.10), transparent 70%)",
    tertiary: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)",
  },
  cyan: {
    primary: "radial-gradient(circle, rgba(8,145,178,0.15), transparent 70%)",
    secondary: "radial-gradient(circle, rgba(34,211,238,0.10), transparent 70%)",
    tertiary: "radial-gradient(circle, rgba(8,145,178,0.08), transparent 70%)",
  },
  default: {
    primary: "radial-gradient(circle, rgba(23,142,119,0.1), transparent 70%)",
    secondary: "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)",
    tertiary: "radial-gradient(circle, rgba(0,255,198,0.05), transparent 70%)",
  },
} as const;

/* ── Light mode orb sets (3 orbs, higher opacity) ── */
const LIGHT_ORB_COLORS = {
  teal: {
    primary: "radial-gradient(circle, rgba(18,107,90,0.14), transparent 70%)",
    secondary: "radial-gradient(circle, rgba(0,180,140,0.10), transparent 70%)",
    tertiary: "radial-gradient(circle, rgba(18,107,90,0.08), transparent 70%)",
  },
  violet: {
    primary: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)",
    secondary: "radial-gradient(circle, rgba(170,120,255,0.08), transparent 70%)",
    tertiary: "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)",
  },
  cyan: {
    primary: "radial-gradient(circle, rgba(8,145,178,0.12), transparent 70%)",
    secondary: "radial-gradient(circle, rgba(20,180,210,0.08), transparent 70%)",
    tertiary: "radial-gradient(circle, rgba(8,145,178,0.06), transparent 70%)",
  },
  default: {
    primary: "radial-gradient(circle, rgba(18,107,90,0.10), transparent 70%)",
    secondary: "radial-gradient(circle, rgba(100,80,50,0.06), transparent 70%)",
    tertiary: "radial-gradient(circle, rgba(0,140,110,0.05), transparent 70%)",
  },
} as const;

/* ── Variant → dominant color mapping ── */
const VARIANT_COLOR: Record<BackgroundVariant, keyof typeof ORB_COLORS> = {
  default: "default",
  technology: "teal",
  presence: "teal",
  usecases: "violet",
  glossary: "cyan",
  waitlist: "teal",
  newsletter: "cyan",
  updates: "violet",
  devnet: "cyan",
  validators: "teal",
  ecosystem: "default",
};

const TRANSITION = "background 1.2s ease-in-out";

export default function AmbientBackground({
  children,
  variant = "default",
}: {
  children?: React.ReactNode;
  variant?: BackgroundVariant;
}) {
  const { theme } = useTheme();
  const { activeColor } = useAmbientColor();

  /* Active click color overrides variant color */
  const colorKey = activeColor ?? VARIANT_COLOR[variant];

  /* ───── Light theme (now 3 animated orbs + grid) ───── */
  if (theme === "light") {
    const orbs = LIGHT_ORB_COLORS[colorKey];

    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: -5, imageRendering: "pixelated" }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 animate-[orbBreath_20s_ease-in-out_infinite]" style={{ opacity: 0.55 }}>
          <div
            className="absolute w-[800px] h-[600px] rounded-full top-[-15%] left-[30%] animate-orbFloat"
            style={{ background: orbs.primary, transition: TRANSITION }}
          />
          <div
            className="absolute w-[600px] h-[500px] rounded-full top-[30%] right-[5%] animate-orbFloat"
            style={{ background: orbs.secondary, transition: TRANSITION, animationDelay: "-7s" }}
          />
          <div
            className="absolute w-[500px] h-[400px] rounded-full bottom-[5%] left-[10%] animate-orbFloat"
            style={{ background: orbs.tertiary, transition: TRANSITION, animationDelay: "-14s" }}
          />
        </div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {children}
      </div>
    );
  }

  /* ───── Dark theme ───── */
  const orbs = ORB_COLORS[colorKey];

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -5, imageRendering: "pixelated" }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-[orbBreath_20s_ease-in-out_infinite]">
        <div
          className="absolute w-[800px] h-[600px] rounded-full top-[-15%] left-[30%] animate-orbFloat"
          style={{ background: orbs.primary, transition: TRANSITION }}
        />
        <div
          className="absolute w-[600px] h-[500px] rounded-full top-[30%] right-[5%] animate-orbFloat"
          style={{ background: orbs.secondary, transition: TRANSITION, animationDelay: "-7s" }}
        />
        <div
          className="absolute w-[500px] h-[400px] rounded-full bottom-[5%] left-[10%] animate-orbFloat"
          style={{ background: orbs.tertiary, transition: TRANSITION, animationDelay: "-14s" }}
        />
      </div>
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div
        className="absolute inset-0 animate-[noisePulse_15s_ease-in-out_infinite]"
        style={{ backgroundImage: "url(/noise.png)", backgroundRepeat: "repeat" }}
      />
      {children}
    </div>
  );
}
