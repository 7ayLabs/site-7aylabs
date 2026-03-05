"use client";

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";

const AMBIENT_GRADIENT = `
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
`;

function AmbientBackgroundComponent() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Static fallback for reduced motion preference
  if (reducedMotion) {
    return (
      <div
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-dark" />
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: AMBIENT_GRADIENT }}
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
      <div className="absolute inset-0 bg-dark" />

      {/* Animated ambient light -- slow breathing pulse */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.55, 0.75, 0.55] }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ background: AMBIENT_GRADIENT, willChange: "opacity" }}
      />

      {/* Subtle noise texture overlay */}
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
          willChange: "opacity",
        }}
      />
    </div>
  );
}

const AmbientBackground = memo(AmbientBackgroundComponent);
AmbientBackground.displayName = "AmbientBackground";

export default AmbientBackground;
