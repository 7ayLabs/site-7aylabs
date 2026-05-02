"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { type Group } from "three";

import { useTheme } from "@/components/providers/ThemeProvider";
import PresencePoint from "./witness-circle/PresencePoint";
import Validator from "./witness-circle/Validator";
import SignalArc from "./witness-circle/SignalArc";
import { DARK_PALETTE, LIGHT_PALETTE, type ColorScheme } from "./witness-circle/palette";

/* ─────────────────────────────────────────────────────────────────────── */
/*  Geometry helpers                                                       */
/* ─────────────────────────────────────────────────────────────────────── */

const VALIDATOR_COUNT = 9;
const RING_RADIUS = 6.5;     // Push to periphery so they don't compete with hero text
const RING_TILT_RAD = 0.45;  // ~26°

/**
 * Witness circle positions: N validators on a tilted ring, with subtle
 * per-node jitter so the constellation doesn't feel mechanical.
 */
function buildValidatorPositions(): Array<[number, number, number]> {
  const positions: Array<[number, number, number]> = [];
  const cosT = Math.cos(RING_TILT_RAD);
  const sinT = Math.sin(RING_TILT_RAD);

  for (let i = 0; i < VALIDATOR_COUNT; i++) {
    const angle = (i / VALIDATOR_COUNT) * Math.PI * 2;
    const x = Math.cos(angle) * RING_RADIUS;
    const y0 = 0;
    const z0 = Math.sin(angle) * RING_RADIUS;
    // Tilt around X axis
    const y = y0 * cosT - z0 * sinT;
    const z = y0 * sinT + z0 * cosT;
    // Pseudo-random jitter (deterministic, based on index)
    const jY = Math.sin(i * 7.13) * 0.18;
    const jZ = Math.cos(i * 5.71) * 0.12;
    positions.push([x, y + jY, z + jZ]);
  }
  return positions;
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Parallax wrapper                                                       */
/* ─────────────────────────────────────────────────────────────────────── */

const PARALLAX_LIMIT = 0.04; // radians
const PARALLAX_LERP = 0.06;

function ParallaxGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    // pointer.{x,y} are -1..1
    const targetY = pointer.x * PARALLAX_LIMIT;
    const targetX = -pointer.y * PARALLAX_LIMIT * 0.7;
    groupRef.current.rotation.y +=
      (targetY - groupRef.current.rotation.y) * PARALLAX_LERP;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * PARALLAX_LERP;
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Slow auto-rotation (subtle, gives life when cursor is still)           */
/* ─────────────────────────────────────────────────────────────────────── */

function SlowSpin({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.04;
  });
  return <group ref={groupRef}>{children}</group>;
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Inner scene composition                                                */
/* ─────────────────────────────────────────────────────────────────────── */

function Scene({ palette }: { palette: ColorScheme }) {
  const positions = useMemo(buildValidatorPositions, []);
  const presenceOrigin: [number, number, number] = [0, 0, 0];

  return (
    <ParallaxGroup>
      <SlowSpin>
        <PresencePoint palette={palette} />
        {positions.map((pos, i) => (
          <Validator
            key={`v-${i}`}
            position={pos}
            index={i}
            total={positions.length}
            palette={palette}
          />
        ))}
        {positions.map((pos, i) => (
          <SignalArc
            key={`a-${i}`}
            from={pos}
            to={presenceOrigin}
            index={i}
            total={positions.length}
            palette={palette}
          />
        ))}
      </SlowSpin>
    </ParallaxGroup>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Public component                                                       */
/* ─────────────────────────────────────────────────────────────────────── */

/**
 * Top-level R3F Canvas hosting the Witness Circle.
 *
 * - Theme-aware palette (cypherpunk phosphor for dark, warm-teal for light)
 * - Bloom + Vignette post-processing for emissive feel without per-material lights
 * - No OrbitControls; cursor parallax + slow auto-rotation only
 */
export default function WitnessCircleScene() {
  const { theme } = useTheme();
  const palette = theme === "light" ? LIGHT_PALETTE : DARK_PALETTE;

  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0.5, 12], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene palette={palette} />
        <EffectComposer>
          <Bloom
            intensity={0.45}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.2}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.15} darkness={0.7} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
