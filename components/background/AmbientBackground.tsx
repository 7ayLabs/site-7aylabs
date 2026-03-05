"use client";

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

function AmbientBackgroundComponent() {
  const { theme } = useTheme();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // In light mode, no ambient background needed
  if (theme === "light") return null;

  // Static background for users who prefer reduced motion
  if (prefersReducedMotion) {
    return (
      <div
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[#060606]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(
                900px 600px at 50% -20%,
                rgba(0, 255, 170, 0.10),
                transparent 65%
              ),
              radial-gradient(
                700px 500px at 85% 35%,
                rgba(255, 255, 255, 0.04),
                transparent 70%
              )
            `,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Base dark layer */}
      <div className="absolute inset-0 bg-[#060606]" />

      {/* Animated ambient light */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.55, 0.75, 0.55] }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `
            radial-gradient(
              900px 600px at 50% -20%,
              rgba(0, 255, 170, 0.10),
              transparent 65%
            ),
            radial-gradient(
              700px 500px at 85% 35%,
              rgba(255, 255, 255, 0.04),
              transparent 70%
            )
          `,
        }}
      />

      {/* Subtle animated noise */}
      <motion.div
        className="absolute inset-0 opacity-[0.045]"
        animate={{ opacity: [0.035, 0.06, 0.035] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
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
