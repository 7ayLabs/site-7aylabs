"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Capability gate for opt-in 3D rendering.
 *
 * Returns `{ canRender3D: true }` only when ALL of these are true:
 *  - User has not requested reduced motion
 *  - `navigator.hardwareConcurrency >= 4` (excludes low-end devices)
 *  - Viewport width >= 768px (excludes mobile / small tablets)
 *  - Pointer is fine + hover is supported (excludes touch-only devices)
 *
 * SSR-safe: returns `false` on the server, recomputes on mount.
 * Re-evaluates on viewport resize and pointer-media changes.
 */
export function useDeviceCapability(): { canRender3D: boolean } {
  const reduceMotion = useReducedMotion();
  const [meetsHardware, setMeetsHardware] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const evaluate = () => {
      const cores = navigator.hardwareConcurrency ?? 0;
      const wideEnough = window.matchMedia("(min-width: 768px)").matches;
      const fineHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches;
      setMeetsHardware(cores >= 4 && wideEnough && fineHover);
    };

    evaluate();

    const widthMql = window.matchMedia("(min-width: 768px)");
    const hoverMql = window.matchMedia("(hover: hover) and (pointer: fine)");

    widthMql.addEventListener("change", evaluate);
    hoverMql.addEventListener("change", evaluate);

    return () => {
      widthMql.removeEventListener("change", evaluate);
      hoverMql.removeEventListener("change", evaluate);
    };
  }, []);

  return { canRender3D: meetsHardware && !reduceMotion };
}
