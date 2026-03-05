"use client";

import { memo } from "react";

function AmbientBackgroundComponent() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-dark" />

      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(20, 184, 166, 0.06), transparent 70%)",
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-25" />
    </div>
  );
}

const AmbientBackground = memo(AmbientBackgroundComponent);
AmbientBackground.displayName = "AmbientBackground";

export default AmbientBackground;
