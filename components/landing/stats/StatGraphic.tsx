/**
 * Inline SVG graphics for stat tiles.
 *
 * Each graphic is single-color (consumes the `color` prop) and built on a
 * 64×64 viewBox so it scales cleanly. Stroke-based, hairline-precise,
 * intentionally minimal — no fills, no gradients inside the SVG, no
 * decorative noise. Color comes from the parent.
 *
 * Naming follows the metric they accompany on the homepage:
 *   - SignalWavesGraphic     → "Native carrier" / "Devnet target"
 *   - SubscriberFlowGraphic  → "Subscriber states"
 *   - ValidatorMeshGraphic   → "Active validators"
 *   - SpecStackGraphic       → "Spec version" / "FRAME pallets"
 *   - InvariantShieldGraphic → "Protocol invariants"
 *   - FinalityBoltGraphic    → "Attach finality"
 *   - AttachLeaseGraphic     → reserved for future tiles
 *   - PortRingGraphic        → reserved for future tiles
 */

interface GraphicProps {
  color: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const baseProps = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 64 64",
  fill: "none",
  className,
  "aria-hidden": true as const,
});

/* ─────────────────────────────────────────────────────────────────────── */
/*  1. Signal waves — concentric arcs radiating from a center point        */
/* ─────────────────────────────────────────────────────────────────────── */

export function SignalWavesGraphic({
  color,
  size = 64,
  strokeWidth = 1.25,
  className,
}: GraphicProps) {
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="32" cy="40" r="2.5" fill={color} />
      <path
        d="M22 36a14 14 0 0 1 20 0"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M16 32a22 22 0 0 1 32 0"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M10 28a30 30 0 0 1 44 0"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* Base line */}
      <line
        x1="14"
        y1="48"
        x2="50"
        y2="48"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  2. Subscriber flow — dots along a flowing path                         */
/* ─────────────────────────────────────────────────────────────────────── */

export function SubscriberFlowGraphic({
  color,
  size = 64,
  strokeWidth = 1.25,
  className,
}: GraphicProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path
        d="M8 32 Q 22 18, 32 32 T 56 32"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* 11 dots scattered along path positions */}
      <circle cx="8" cy="32" r="2.2" fill={color} />
      <circle cx="14" cy="26" r="1.8" fill={color} opacity="0.85" />
      <circle cx="20" cy="22" r="1.8" fill={color} opacity="0.85" />
      <circle cx="26" cy="26" r="1.8" fill={color} opacity="0.85" />
      <circle cx="32" cy="32" r="2.4" fill={color} />
      <circle cx="38" cy="38" r="1.8" fill={color} opacity="0.85" />
      <circle cx="44" cy="38" r="1.8" fill={color} opacity="0.85" />
      <circle cx="50" cy="34" r="1.8" fill={color} opacity="0.85" />
      <circle cx="56" cy="32" r="2.2" fill={color} />
      {/* Two small terminal markers */}
      <circle cx="11" cy="44" r="1.4" fill={color} opacity="0.5" />
      <circle cx="53" cy="20" r="1.4" fill={color} opacity="0.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  3. Validator mesh — 6 nodes connected in a triangular pattern          */
/* ─────────────────────────────────────────────────────────────────────── */

export function ValidatorMeshGraphic({
  color,
  size = 64,
  strokeWidth = 1.25,
  className,
}: GraphicProps) {
  // Six positions around a hexagonal layout
  const nodes: [number, number][] = [
    [32, 12],
    [50, 22],
    [50, 42],
    [32, 52],
    [14, 42],
    [14, 22],
  ];
  return (
    <svg {...baseProps(size, className)}>
      {/* Outer ring connections */}
      {nodes.map((n, i) => {
        const next = nodes[(i + 1) % nodes.length];
        return (
          <line
            key={`r-${i}`}
            x1={n[0]}
            y1={n[1]}
            x2={next[0]}
            y2={next[1]}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity="0.3"
          />
        );
      })}
      {/* Cross-connections (every other node, partial) */}
      <line x1="32" y1="12" x2="32" y2="52" stroke={color} strokeWidth={strokeWidth} opacity="0.2" />
      <line x1="14" y1="22" x2="50" y2="42" stroke={color} strokeWidth={strokeWidth} opacity="0.2" />
      <line x1="14" y1="42" x2="50" y2="22" stroke={color} strokeWidth={strokeWidth} opacity="0.2" />
      {/* Nodes */}
      {nodes.map((n, i) => (
        <circle key={`n-${i}`} cx={n[0]} cy={n[1]} r="2.6" fill={color} />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  4. Spec stack — layered horizontal bars                                */
/* ─────────────────────────────────────────────────────────────────────── */

export function SpecStackGraphic({
  color,
  size = 64,
  strokeWidth = 1.25,
  className,
}: GraphicProps) {
  return (
    <svg {...baseProps(size, className)}>
      {/* Six pallet layers, varying widths */}
      {[
        { y: 14, w: 28 },
        { y: 21, w: 36 },
        { y: 28, w: 32 },
        { y: 35, w: 40 },
        { y: 42, w: 30 },
        { y: 49, w: 38 },
      ].map((bar, i) => (
        <rect
          key={i}
          x={32 - bar.w / 2}
          y={bar.y}
          width={bar.w}
          height="3"
          rx="1.5"
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={0.45 + i * 0.09}
        />
      ))}
      {/* Vertical thread on the left */}
      <line
        x1="10"
        y1="14"
        x2="10"
        y2="52"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  5. Invariant shield — shield outline with concentric guard rings       */
/* ─────────────────────────────────────────────────────────────────────── */

export function InvariantShieldGraphic({
  color,
  size = 64,
  strokeWidth = 1.25,
  className,
}: GraphicProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path
        d="M32 8 L52 16 V30 C52 42 44 50 32 56 C20 50 12 42 12 30 V16 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M32 16 L46 22 V31 C46 39 40 45 32 49 C24 45 18 39 18 31 V22 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity="0.55"
      />
      {/* Center confirmation */}
      <path
        d="M27 32 l4 4 l7 -8"
        stroke={color}
        strokeWidth={strokeWidth + 0.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  6. Finality bolt — lightning with two motion ticks                     */
/* ─────────────────────────────────────────────────────────────────────── */

export function FinalityBoltGraphic({
  color,
  size = 64,
  strokeWidth = 1.25,
  className,
}: GraphicProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path
        d="M36 8 L20 32 H30 L26 56 L44 30 H34 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Speed marks */}
      <line x1="50" y1="20" x2="56" y2="20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.55" />
      <line x1="48" y1="28" x2="58" y2="28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.4" />
      <line x1="50" y1="36" x2="56" y2="36" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  7. Version tag — stylized tag with hole                                */
/* ─────────────────────────────────────────────────────────────────────── */

export function VersionTagGraphic({
  color,
  size = 64,
  strokeWidth = 1.25,
  className,
}: GraphicProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path
        d="M30 10 H50 V32 L34 50 L12 28 L30 10 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <circle cx="40" cy="22" r="3" stroke={color} strokeWidth={strokeWidth} />
      {/* Inner echo */}
      <path
        d="M30 18 H44 V28 L34 38"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity="0.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  8. Pallet layers — stacked rectangles offset for depth                 */
/* ─────────────────────────────────────────────────────────────────────── */

export function PalletLayersGraphic({
  color,
  size = 64,
  strokeWidth = 1.25,
  className,
}: GraphicProps) {
  return (
    <svg {...baseProps(size, className)}>
      <rect x="14" y="38" width="36" height="14" rx="2" stroke={color} strokeWidth={strokeWidth} />
      <rect x="18" y="26" width="36" height="14" rx="2" stroke={color} strokeWidth={strokeWidth} opacity="0.6" />
      <rect x="22" y="14" width="36" height="14" rx="2" stroke={color} strokeWidth={strokeWidth} opacity="0.35" />
    </svg>
  );
}
