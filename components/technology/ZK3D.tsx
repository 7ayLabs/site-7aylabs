"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Text, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * "Privacy / ZK" 3D scene — A sealed Presence ID hash inside a ZK shield.
 *
 * Real cryptographic primitives:
 * - Center: a glowing locked box (the Presence ID hash) with a hash string
 * - Surrounding: 3 nested wireframe icosahedrons (the ZK proof layers)
 * - Floating cipher characters (0/1) orbiting the structure
 * - Pulsing "VERIFIED" badge appearing periodically
 * - Slow rotation revealing the layered cryptography
 */

const VIOLET = "#8B5CF6";
const VIOLET_BRIGHT = "#C084FC";
const VIOLET_DEEP = "#7C3AED";

/* ── Center: locked Presence ID block ── */
function PresenceID() {
  const inner = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (inner.current) {
      inner.current.rotation.y += dt * 0.4;
      inner.current.rotation.x += dt * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.3}>
      <group>
        {/* Solid core */}
        <mesh ref={inner}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial
            color={VIOLET}
            emissive={VIOLET_BRIGHT}
            emissiveIntensity={0.7}
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.65}
          />
          <Edges color={VIOLET_BRIGHT} />
        </mesh>
        {/* Hash label below the core */}
        <Text
          position={[0, -0.85, 0]}
          fontSize={0.13}
          color={VIOLET_BRIGHT}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.85}
        >
          0x7a4e9f…
        </Text>
        <Text
          position={[0, -1.05, 0]}
          fontSize={0.09}
          color={VIOLET_BRIGHT}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.55}
        >
          presence_id
        </Text>
      </group>
    </Float>
  );
}

/* ── Nested ZK proof shells (3 wireframe icosahedrons) ── */
function ZKShells() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (a.current) a.current.rotation.y += dt * 0.18;
    if (b.current) {
      b.current.rotation.y -= dt * 0.12;
      b.current.rotation.x += dt * 0.08;
    }
    if (c.current) {
      c.current.rotation.x += dt * 0.1;
      c.current.rotation.z += dt * 0.05;
    }
  });

  return (
    <>
      <mesh ref={a}>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshBasicMaterial
          color={VIOLET_BRIGHT}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh ref={b}>
        <icosahedronGeometry args={[1.8, 0]} />
        <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={c}>
        <icosahedronGeometry args={[2.4, 0]} />
        <meshBasicMaterial
          color={VIOLET_DEEP}
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>
    </>
  );
}

/* ── Orbiting cipher characters (0/1 bits) ── */
function CipherBit({
  radius,
  speed,
  offset,
  yOffset,
  char,
}: {
  radius: number;
  speed: number;
  offset: number;
  yOffset: number;
  char: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = yOffset + Math.sin(t * 1.3) * 0.2;
  });
  return (
    <group ref={ref}>
      <Text
        fontSize={0.18}
        color={VIOLET_BRIGHT}
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.8}
      >
        {char}
      </Text>
    </group>
  );
}

/* ── Pulsing "VERIFIED" badge ── */
function VerifiedBadge() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const pulse = (Math.sin(t * 1.5) + 1) / 2; // 0..1
    ref.current.scale.setScalar(0.95 + pulse * 0.1);
  });
  return (
    <group ref={ref} position={[0, 2.2, 0]}>
      <Text
        fontSize={0.16}
        color="#00FFC6"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.95}
      >
        ✓ VERIFIED
      </Text>
    </group>
  );
}

function Scene() {
  const root = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (root.current) root.current.rotation.y += dt * 0.1;
  });

  const bits = useMemo(
    () => [
      { radius: 2.7, speed: 0.6, offset: 0, yOffset: 0.4, char: "0" },
      { radius: 2.7, speed: 0.6, offset: Math.PI * 0.6, yOffset: -0.3, char: "1" },
      { radius: 2.7, speed: 0.6, offset: Math.PI * 1.2, yOffset: 0.1, char: "0" },
      { radius: 2.9, speed: -0.5, offset: 0.3, yOffset: -0.5, char: "1" },
      { radius: 2.9, speed: -0.5, offset: Math.PI, yOffset: 0.6, char: "0" },
      { radius: 2.9, speed: -0.5, offset: Math.PI * 1.5, yOffset: -0.1, char: "1" },
    ],
    []
  );

  return (
    <group ref={root}>
      <ambientLight intensity={0.45} />
      <pointLight position={[4, 4, 4]} intensity={1.3} color={VIOLET_BRIGHT} />
      <pointLight position={[-4, -3, -4]} intensity={0.7} color={VIOLET_DEEP} />

      <PresenceID />
      <ZKShells />
      <VerifiedBadge />

      {bits.map((b, i) => (
        <CipherBit key={i} {...b} />
      ))}
    </group>
  );
}

export default function ZK3D() {
  return (
    <div className="relative w-full h-full min-h-[440px]">
      <Canvas
        camera={{ position: [0, 1, 6.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
