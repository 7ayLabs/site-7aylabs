"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Text, Edges } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * "How It Works" 3D scene — Validator Network mesh.
 *
 * Real blockchain primitives:
 * - 1 central chain block (the canonical state)
 * - 6 validator nodes orbiting in 3D space (the witness circle)
 * - Connection lines between validators ↔ chain (consensus links)
 * - Animated pulse particles flowing inward (attestations)
 * - Hash strings hovering near validators
 */

const ACCENT = "#178E77";
const ACCENT_BRIGHT = "#00FFC6";
const VIOLET = "#8B5CF6";

/* ── Central chain block ── */
function ChainBlock() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (mesh.current) {
      mesh.current.rotation.y += dt * 0.25;
      mesh.current.rotation.x += dt * 0.08;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0} floatIntensity={0.4}>
      <mesh ref={mesh}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT_BRIGHT}
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.25}
          transparent
          opacity={0.55}
        />
        <Edges color={ACCENT_BRIGHT} threshold={15} />
      </mesh>
    </Float>
  );
}

/* ── A single validator node + its connection line ── */
function ValidatorNode({
  position,
  delay,
}: {
  position: [number, number, number];
  delay: number;
}) {
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime + delay;
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(t * 1.2) * 0.15;
    }
    if (pulse.current) {
      const s = 1 + Math.sin(t * 2.5) * 0.25;
      pulse.current.scale.set(s, s, s);
      const mat = pulse.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 + Math.sin(t * 2.5) * 0.25;
    }
  });

  const points: [number, number, number][] = useMemo(
    () => [position, [0, 0, 0]],
    [position]
  );

  return (
    <>
      <group ref={group} position={position}>
        {/* Solid core */}
        <mesh>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={ACCENT_BRIGHT}
            emissive={ACCENT_BRIGHT}
            emissiveIntensity={1.2}
          />
        </mesh>
        {/* Pulse halo */}
        <mesh ref={pulse}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshBasicMaterial
            color={ACCENT_BRIGHT}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      </group>
      {/* Connection line to chain */}
      <Line
        points={points}
        color={ACCENT_BRIGHT}
        lineWidth={1}
        transparent
        opacity={0.45}
        dashed
        dashSize={0.15}
        gapSize={0.1}
      />
    </>
  );
}

/* ── Attestation particles flowing inward ── */
function AttestationFlow({
  from,
  delay,
}: {
  from: [number, number, number];
  delay: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = ((state.clock.elapsedTime + delay) % 2.2) / 2.2; // 0..1
    ref.current.position.x = from[0] * (1 - t);
    ref.current.position.y = from[1] * (1 - t);
    ref.current.position.z = from[2] * (1 - t);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = t < 0.1 ? t * 10 : t > 0.85 ? (1 - t) * 6.6 : 1;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} />
    </mesh>
  );
}

/* ── Orbiting outer ring ── */
function OuterRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.15;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.2, 0, 0]}>
      <torusGeometry args={[2.6, 0.008, 8, 96]} />
      <meshBasicMaterial color={VIOLET} transparent opacity={0.3} />
    </mesh>
  );
}

/* ── Scene root with auto-rotation ── */
function Scene() {
  const root = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (root.current) root.current.rotation.y += dt * 0.12;
  });

  // 6 validators in a tilted circle
  const validators = useMemo<[number, number, number][]>(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      out.push([Math.cos(a) * 2.2, Math.sin(a * 1.3) * 0.6, Math.sin(a) * 2.2]);
    }
    return out;
  }, []);

  return (
    <group ref={root}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={ACCENT_BRIGHT} />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color={VIOLET} />

      <ChainBlock />
      <OuterRing />

      {validators.map((pos, i) => (
        <ValidatorNode key={i} position={pos} delay={i * 0.4} />
      ))}
      {validators.map((pos, i) => (
        <AttestationFlow key={`a-${i}`} from={pos} delay={i * 0.36} />
      ))}

      {/* Subtle "BLOCK" label hovering above the chain block */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.18}
        color={ACCENT_BRIGHT}
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.85}
      >
        BLOCK
      </Text>
    </group>
  );
}

export default function HowItWorks3D() {
  return (
    <div className="relative w-full h-full min-h-[440px]">
      <Canvas
        camera={{ position: [0, 1.2, 6.2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
