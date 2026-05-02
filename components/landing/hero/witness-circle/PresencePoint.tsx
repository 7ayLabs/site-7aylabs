"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type Mesh, type MeshBasicMaterial } from "three";

import type { ColorScheme } from "./palette";

/**
 * Central node being verified by the witness circle.
 *
 * Visual states across the 6s cycle:
 *  - 0-1.5s   : faint flicker (low-amplitude sine, dim base color)
 *  - 1.5-3.5s : steady idle, slight breathing
 *  - 3.5-4.5s : ramp to peak emissive (arcs converging)
 *  - 4.5s     : seal flash (single peak white-hot)
 *  - 4.5-6.0s : settle back to idle
 */
export default function PresencePoint({
  cycleSeconds = 6,
  palette,
}: {
  cycleSeconds?: number;
  palette: ColorScheme;
}) {
  const meshRef = useRef<Mesh>(null);
  const baseColor = useRef(new Color(palette.presenceBase));
  const peakColor = useRef(new Color(palette.presencePeak));
  const tmpColor = useRef(new Color());

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() % cycleSeconds;

    // Compute intensity 0..1 across the cycle.
    let intensity: number;
    if (t < 1.5) {
      // Flicker phase: small sine oscillation around 0.25
      intensity = 0.25 + 0.08 * Math.sin(t * 12);
    } else if (t < 3.5) {
      // Idle breathing
      intensity = 0.45 + 0.05 * Math.sin((t - 1.5) * 3);
    } else if (t < 4.5) {
      // Ramp to peak
      const p = (t - 3.5) / 1.0;
      intensity = 0.5 + p * p * 0.5; // ease-in
    } else if (t < 4.6) {
      // Seal flash window (~100ms)
      intensity = 1.0;
    } else {
      // Settle back over 1.4s
      const p = (t - 4.6) / 1.4;
      intensity = 1.0 - p * (1.0 - 0.45);
    }

    // Blend base->peak by intensity
    tmpColor.current.copy(baseColor.current).lerp(peakColor.current, intensity);
    const mat = meshRef.current.material as MeshBasicMaterial;
    mat.color.copy(tmpColor.current);

    // Subtle scale pulse synced with intensity
    const scale = 0.4 * (1 + intensity * 0.18);
    meshRef.current.scale.setScalar(scale);

    // Slow rotation for life
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.07;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color={palette.presenceBase} toneMapped={false} />
    </mesh>
  );
}
