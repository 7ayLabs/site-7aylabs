"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CatmullRomCurve3,
  Color,
  TubeGeometry,
  Vector3,
  type Mesh,
  type ShaderMaterial,
} from "three";

import type { ColorScheme } from "./palette";

interface SignalArcProps {
  /** Start point — typically a validator position. */
  from: [number, number, number];
  /** End point — typically the presence point (origin). */
  to: [number, number, number];
  index: number;
  total: number;
  cycleSeconds?: number;
  palette: ColorScheme;
}

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  uniform float uIgnite;
  uniform float uPulseHead;
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;

  varying vec2 vUv;

  void main() {
    // Gradient along the tube length (start → end)
    vec3 baseColor = mix(uColorStart, uColorEnd, vUv.x);

    // Traveling pulse — bell shape around uPulseHead
    float pulseWidth = 0.18;
    float dist = abs(vUv.x - uPulseHead);
    float pulse = smoothstep(pulseWidth, 0.0, dist);

    // Faint baseline visibility while ignited, plus the bright pulse
    float baseAlpha = 0.22 * uIgnite;
    float pulseAlpha = pulse * uIgnite;
    float alpha = max(baseAlpha, pulseAlpha);

    // Brighten color at pulse peak
    vec3 color = baseColor * (1.0 + pulse * 1.6);

    if (alpha < 0.005) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * Animated signal arc connecting a validator to the presence point.
 *
 * Built on a CatmullRomCurve3 with a single midpoint pushed slightly outward
 * to give the arc a natural curve (rather than straight line). The traveling
 * pulse runs from the validator side (uv.x = 0) to the center (uv.x = 1).
 *
 * Lifecycle inside one cycle (default 6s):
 *   - Arcs ignite at staggered offsets between t=1.5 and t=3.5
 *   - During ignition (~0.6s), pulse head sweeps 0 → 1
 *   - Outside ignition, fully transparent (uIgnite = 0)
 */
export default function SignalArc({
  from,
  to,
  index,
  total,
  cycleSeconds = 6,
  palette,
}: SignalArcProps) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<ShaderMaterial>(null);

  // Build tube geometry once per (from, to) pair.
  const geometry = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const mid = a
      .clone()
      .lerp(b, 0.5)
      // Bow the midpoint slightly outward from origin for a natural arc
      .add(a.clone().normalize().multiplyScalar(0.45));
    const curve = new CatmullRomCurve3([a, mid, b], false, "catmullrom", 0.5);
    return new TubeGeometry(curve, 32, 0.012, 6, false);
  }, [from, to]);

  // Memoised uniforms — referenced by both the shader and useFrame writer.
  const uniforms = useMemo(
    () => ({
      uIgnite: { value: 0 },
      uPulseHead: { value: 0 },
      uColorStart: { value: new Color(palette.arcStart) },
      uColorEnd: { value: new Color(palette.arcEnd) },
    }),
    [palette.arcStart, palette.arcEnd]
  );

  // Stagger matches Validator's ignition window (1.5..3.5 across the set)
  const ignitionStart = 1.5 + (index / total) * 2.0;
  const ignitionDuration = 0.6;

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.getElapsedTime() % cycleSeconds;

    if (t < ignitionStart || t >= ignitionStart + ignitionDuration) {
      matRef.current.uniforms.uIgnite.value = 0;
      return;
    }

    const p = (t - ignitionStart) / ignitionDuration;
    // Pulse sweeps 0 -> 1; ignition fades in then out (bell)
    matRef.current.uniforms.uPulseHead.value = p;
    matRef.current.uniforms.uIgnite.value = Math.sin(p * Math.PI);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
      />
    </mesh>
  );
}
