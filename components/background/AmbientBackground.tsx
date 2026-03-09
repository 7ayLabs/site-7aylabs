"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useAmbientColor } from "@/components/providers/AmbientColorProvider";

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

const LIGHT_ORB = {
  teal: "radial-gradient(circle, rgba(18,107,90,0.10), transparent 70%)",
  violet: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)",
  cyan: "radial-gradient(circle, rgba(8,145,178,0.08), transparent 70%)",
  default: "radial-gradient(circle, rgba(18,107,90,0.06), transparent 70%)",
} as const;

const TRANSITION = "background 1.2s ease-in-out";

/**
 * Site-wide ambient background.
 * Reacts to activeColor from AmbientColorProvider (node clicks in Hero).
 */
export default function AmbientBackground({ children }: { children?: React.ReactNode }) {
  const { theme } = useTheme();
  const { activeColor } = useAmbientColor();

  const colorKey = activeColor ?? "default";

  /* ───── Light theme ───── */
  if (theme === "light") {
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -5 }}
        aria-hidden="true"
      >
        <div
          className="absolute w-[600px] h-[400px] rounded-full top-[-10%] left-[40%] opacity-40"
          style={{
            background: LIGHT_ORB[colorKey],
            transition: TRANSITION,
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
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
      className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -5 }}
      aria-hidden="true"
    >
      {/* Animated gradient mesh orbs — pure CSS, runs on compositor thread */}
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

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />

      {/* Noise grain — pure CSS opacity pulse */}
      <div
        className="absolute inset-0 animate-[noisePulse_15s_ease-in-out_infinite]"
        style={{
          backgroundImage: "url(/noise.png)",
          backgroundRepeat: "repeat",
        }}
      />
      {children}
    </div>
  );
}
