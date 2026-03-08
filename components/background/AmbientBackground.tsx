"use client";

import { memo } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

/**
 * Site-wide ambient background.
 * Uses pure CSS animations (compositor-optimized) instead of
 * Framer Motion infinite loops to avoid dev-server overhead.
 */
function AmbientBackgroundComponent() {
  const { theme } = useTheme();

  /* ───── Light theme ───── */
  if (theme === "light") {
    return (
      <div
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[var(--color-bg-primary)]" />
        <div
          className="absolute w-[600px] h-[400px] rounded-full top-[-10%] left-[40%] opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(18,107,90,0.06), transparent 70%)",
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
      </div>
    );
  }

  /* ───── Dark theme ───── */
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Base dark layer */}
      <div className="absolute inset-0 bg-[var(--color-bg-primary)]" />

      {/* Animated gradient mesh orbs — pure CSS, runs on compositor thread */}
      <div className="absolute inset-0 animate-[orbBreath_20s_ease-in-out_infinite]">
        <div
          className="absolute w-[800px] h-[600px] rounded-full top-[-15%] left-[30%] animate-orbFloat"
          style={{
            background:
              "radial-gradient(circle, rgba(23,142,119,0.1), transparent 70%)",
          }}
        />
        <div
          className="absolute w-[600px] h-[500px] rounded-full top-[30%] right-[5%] animate-orbFloat"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)",
            animationDelay: "-7s",
          }}
        />
        <div
          className="absolute w-[500px] h-[400px] rounded-full bottom-[5%] left-[10%] animate-orbFloat"
          style={{
            background:
              "radial-gradient(circle, rgba(0,255,198,0.05), transparent 70%)",
            animationDelay: "-14s",
          }}
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
    </div>
  );
}

const AmbientBackground = memo(AmbientBackgroundComponent);
AmbientBackground.displayName = "AmbientBackground";

export default AmbientBackground;
