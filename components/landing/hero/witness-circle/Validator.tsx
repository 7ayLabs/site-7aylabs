"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Vector3, type Mesh, type MeshBasicMaterial } from "three";

import type { ColorScheme } from "./palette";

interface ValidatorProps {
  position: [number, number, number];
  /** 0-based index in the witness circle, used to phase-offset the pulse. */
  index: number;
  /** Total number of validators — needed for stagger spacing. */
  total: number;
  cycleSeconds?: number;
  palette: ColorScheme;
}

/**
 * Single validator node in the witness circle.
 *
 * Animation phases (cycleSeconds = 6 by default):
 *   0–1.5s   : dim baseline
 *   1.5+i*Δ  : ignite (arc fires from this validator toward center)
 *              Δ ≈ (2.0s ignition window) / total
 *   3.5–6.0s : settle back to slightly elevated idle
 *
 * Adds gentle bobbing motion (per-instance phase) to give the constellation life.
 */
export default function Validator({
  position,
  index,
  total,
  cycleSeconds = 6,
  palette,
}: ValidatorProps) {
  const meshRef = useRef<Mesh>(null);
  const basePos = useRef(new Vector3(...position));
  const baseColor = useRef(new Color(palette.validatorBase));
  const peakColor = useRef(new Color(palette.validatorPeak));
  const tmpColor = useRef(new Color());

  // Stagger window: arcs ignite between t=1.5 and t=3.5 (2s window)
  const ignitionStart = 1.5 + (index / total) * 2.0;
  const ignitionDuration = 0.6;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const elapsed = clock.getElapsedTime();
    const t = elapsed % cycleSeconds;

    // Intensity: 0.15 baseline, spikes to 1.0 during ignition window
    let intensity = 0.15;
    if (t >= ignitionStart && t < ignitionStart + ignitionDuration) {
      const p = (t - ignitionStart) / ignitionDuration;
      // Bell curve: 0 -> 1 -> 0
      intensity = 0.15 + 0.85 * Math.sin(p * Math.PI);
    } else if (t >= 3.5) {
      // Slightly elevated idle after the wave
      intensity = 0.3 + 0.05 * Math.sin((t - 3.5) * 2 + index);
    }

    // Color blend
    tmpColor.current.copy(baseColor.current).lerp(peakColor.current, intensity);
    const mat = meshRef.current.material as MeshBasicMaterial;
    mat.color.copy(tmpColor.current);

    // Gentle bobbing motion, phase offset per validator
    const bobPhase = elapsed * 0.4 + (index * Math.PI * 2) / total;
    meshRef.current.position.set(
      basePos.current.x,
      basePos.current.y + Math.sin(bobPhase) * 0.05,
      basePos.current.z + Math.cos(bobPhase) * 0.05
    );

    // Slow rotation for facet glints
    meshRef.current.rotation.y = elapsed * 0.2 + index;
    meshRef.current.rotation.x = elapsed * 0.13 + index * 0.5;

    // Scale pulse on ignition — kept small so validators read as peripheral atmosphere
    const scale = 0.12 * (1 + intensity * 0.3);
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={palette.validatorBase} toneMapped={false} />
    </mesh>
  );
}
