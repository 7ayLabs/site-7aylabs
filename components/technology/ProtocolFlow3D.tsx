"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Line, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * "Protocol Flow" 3D scene — A chain of blocks linked by hash references.
 *
 * Real blockchain primitives:
 * - 3 sequential blocks (commit → attest → finalize)
 * - Each block has a wireframe shell, label, and short hash string
 * - Blocks linked by glowing hash-pointer arrows
 * - A packet travels along the chain (the proof flowing forward)
 * - Slow camera-relative tilt
 */

const COLORS = ["#00FFC6", "#C084FC", "#22D3EE"] as const;
const LABELS = ["COMMIT", "ATTEST", "FINAL"] as const;
const HASHES = ["0xa3f1…", "0x9c4d…", "0xff02…"] as const;

/* ── Single block in the chain ── */
function ChainBlock({
  position,
  color,
  label,
  hash,
  delay,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  hash: string;
  delay: number;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime + delay;
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(t * 1.0) * 0.08;
    }
    if (inner.current) {
      inner.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Wireframe outer shell */}
      <mesh>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.45} />
      </mesh>
      {/* Solid inner block */}
      <mesh ref={inner}>
        <boxGeometry args={[1.0, 1.0, 1.0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.3}
          transparent
          opacity={0.5}
        />
        <Edges color={color} />
      </mesh>
      {/* Label above */}
      <Text
        position={[0, 1.05, 0]}
        fontSize={0.18}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      {/* Hash below */}
      <Text
        position={[0, -1.05, 0]}
        fontSize={0.13}
        color={color}
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.7}
      >
        {hash}
      </Text>
    </group>
  );
}

/* ── Hash-pointer connector between two blocks ── */
function HashPointer({
  from,
  to,
  color,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
}) {
  const points = useMemo(() => [from, to], [from, to]);
  return (
    <Line
      points={points}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.6}
    />
  );
}

/* ── Packet flowing along the chain (the proof) ── */
function FlowPacket({ y }: { y: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const positions = useMemo<Array<[number, number, number]>>(
    () => [
      [-3.0, y, 0],
      [0, y, 0],
      [3.0, y, 0],
    ],
    [y]
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime % 4.0) / 4.0;
    const segment = t * 2; // 0..2
    const seg = Math.floor(segment);
    const local = segment - seg;
    const a = positions[seg];
    const b = positions[seg + 1];
    if (a && b) {
      ref.current.position.set(
        a[0] + (b[0] - a[0]) * local,
        a[1] + (b[1] - a[1]) * local,
        a[2] + (b[2] - a[2]) * local
      );
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

function Scene() {
  const root = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (root.current) {
      root.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.25;
    }
  });

  const blocks: Array<[number, number, number]> = [
    [-3.0, 0, 0],
    [0, 0, 0],
    [3.0, 0, 0],
  ];

  return (
    <group ref={root} rotation={[0.05, -0.15, 0]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.6} color="#C084FC" />

      {blocks.map((pos, i) => (
        <ChainBlock
          key={i}
          position={pos}
          color={COLORS[i]}
          label={LABELS[i]}
          hash={HASHES[i]}
          delay={i * 0.5}
        />
      ))}

      {/* Hash pointers between blocks */}
      <HashPointer from={[-2.3, 0, 0]} to={[-0.7, 0, 0]} color={COLORS[0]} />
      <HashPointer from={[0.7, 0, 0]} to={[2.3, 0, 0]} color={COLORS[1]} />

      {/* Flowing proof packet */}
      <FlowPacket y={0} />
    </group>
  );
}

export default function ProtocolFlow3D() {
  return (
    <div className="relative w-full h-full min-h-[440px]">
      <Canvas
        camera={{ position: [0, 0.8, 7.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
