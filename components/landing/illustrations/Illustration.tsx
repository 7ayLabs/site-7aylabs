/**
 * Symbolic marks for the landing page.
 *
 * Re-skin from the previous illustrative library. Each mark is now a
 * tiny geometric diagram — 2 to 6 elements, one uniform stroke weight,
 * single ink colour, no fills, no opacity hierarchy. They read as
 * editorial punctuation in a Notion / Helium / Anthropic register, not
 * as branded icons.
 *
 * Component names are preserved so the call sites in Projects / HowItWorks
 * / UseCasesPreview don't need to change.
 *
 * Sizing: marks are designed on a 64×64 viewBox with content centred in
 * the inner 48×48. Render at 28–48 px in cards.
 */

interface MarkProps {
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

const stroke = (color: string, w: number) => ({
  stroke: color,
  strokeWidth: w,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/* ─────────────────────────────────────────────────────────────────────── */
/*  WHY CHAIN                                                              */
/* ─────────────────────────────────────────────────────────────────────── */

/** Anti SIM-swap. A small SIM-shaped rectangle inside a guard ring with a
 *  single break — the gap in the ring is the *only* place a rotation can
 *  happen, and it requires quorum. */
export function SimSwapShield({ color, size = 40, strokeWidth = 1.25, className }: MarkProps) {
  const s = stroke(color, strokeWidth);
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="32" cy="32" r="22" {...s} pathLength={100} strokeDasharray="92 8" strokeDashoffset="46" />
      <rect x="22" y="22" width="20" height="20" rx="2" {...s} />
      <rect x="34" y="22" width="6" height="6" rx="1" {...s} />
    </svg>
  );
}

/** Number portability. Two small squares with a single arrow between them.
 *  Movement, no permission. */
export function NumberPortabilityMark({ color, size = 40, strokeWidth = 1.25, className }: MarkProps) {
  const s = stroke(color, strokeWidth);
  return (
    <svg {...baseProps(size, className)}>
      <rect x="6" y="22" width="16" height="20" rx="1.5" {...s} />
      <rect x="42" y="22" width="16" height="20" rx="1.5" {...s} />
      <line x1="22" y1="32" x2="42" y2="32" {...s} />
      <path d="M38 28 L42 32 L38 36" {...s} />
    </svg>
  );
}

/** Open carrier infrastructure. A 4×4 dot mesh with one node lifted out —
 *  decentralised topology where the network is its members. */
export function OpenInfrastructure({ color, size = 40, strokeWidth = 1.25, className }: MarkProps) {
  return (
    <svg {...baseProps(size, className)}>
      {[18, 28, 38, 48].map((x) =>
        [22, 32, 42].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill={color} />
        ))
      )}
      {/* Lifted node */}
      <circle cx="32" cy="12" r="2.2" fill={color} />
      <line x1="32" y1="14.2" x2="32" y2="20.4" {...stroke(color, strokeWidth)} />
    </svg>
  );
}

/** Privacy by default. A square split diagonally — one half drawn, one
 *  half implied. Commit-reveal as a typographic mark. */
export function PrivacyCommitment({ color, size = 40, strokeWidth = 1.25, className }: MarkProps) {
  const s = stroke(color, strokeWidth);
  return (
    <svg {...baseProps(size, className)}>
      <rect x="14" y="14" width="36" height="36" rx="2" {...s} />
      <line x1="14" y1="50" x2="50" y2="14" {...s} />
      {/* Lower triangle filled with hairline crosshatch — single line is enough */}
      <line x1="22" y1="50" x2="50" y2="22" {...stroke(color, strokeWidth * 0.6)} opacity="0.5" />
      <line x1="32" y1="50" x2="50" y2="32" {...stroke(color, strokeWidth * 0.6)} opacity="0.5" />
      <line x1="42" y1="50" x2="50" y2="42" {...stroke(color, strokeWidth * 0.6)} opacity="0.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  USE CASES PREVIEW                                                      */
/* ─────────────────────────────────────────────────────────────────────── */

/** Sybil-resistant onboarding. A row of dots, one of which is enclosed
 *  in a ring — the verified human among many candidates. */
export function SubscriberStack({ color, size = 40, strokeWidth = 1.25, className }: MarkProps) {
  const s = stroke(color, strokeWidth);
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="14" cy="32" r="1.6" fill={color} />
      <circle cx="22" cy="32" r="1.6" fill={color} />
      <circle cx="32" cy="32" r="2.4" fill={color} />
      <circle cx="32" cy="32" r="6" {...s} />
      <circle cx="42" cy="32" r="1.6" fill={color} />
      <circle cx="50" cy="32" r="1.6" fill={color} />
    </svg>
  );
}

/** Self-sovereign roaming. Two anchor dots with a single arc between
 *  them, no permission gates. */
export function RoamingGlobe({ color, size = 40, strokeWidth = 1.25, className }: MarkProps) {
  const s = stroke(color, strokeWidth);
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="14" cy="46" r="2.4" fill={color} />
      <circle cx="50" cy="22" r="2.4" fill={color} />
      <path d="M14 46 Q 24 14, 50 22" {...s} />
    </svg>
  );
}

/** Anti-fraud calls and SMS. Two endpoints with a verified line — single
 *  tick where the call lands. */
export function VerifiedCall({ color, size = 40, strokeWidth = 1.25, className }: MarkProps) {
  const s = stroke(color, strokeWidth);
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="14" cy="32" r="2.4" fill={color} />
      <circle cx="50" cy="32" r="2.4" fill={color} />
      <line x1="14" y1="32" x2="50" y2="32" {...s} />
      <path d="M28 28 L31 32 L37 26" {...s} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  HOW IT WORKS                                                           */
/* ─────────────────────────────────────────────────────────────────────── */

/** Step 01 — Identity binding. Three corner dots binding through a single
 *  centre point. Actor + Device + Number meet at one node. */
export function IdentityBinding({ color, size = 40, strokeWidth = 1.25, className }: MarkProps) {
  const s = stroke(color, strokeWidth);
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="14" cy="20" r="2.2" fill={color} />
      <circle cx="50" cy="20" r="2.2" fill={color} />
      <circle cx="32" cy="50" r="2.2" fill={color} />
      <line x1="14" y1="20" x2="32" y2="32" {...s} />
      <line x1="50" y1="20" x2="32" y2="32" {...s} />
      <line x1="32" y1="50" x2="32" y2="32" {...s} />
      <circle cx="32" cy="32" r="3.2" fill={color} />
    </svg>
  );
}

/** Step 02 — Witness attest. A central claim with witnesses on the ring
 *  attesting inward. Pure consensus topology. */
export function WitnessAttest({ color, size = 40, strokeWidth = 1.25, className }: MarkProps) {
  const s = stroke(color, strokeWidth);
  // Six witnesses on a circle of radius 18 around centre (32,32)
  const positions: ReadonlyArray<[number, number]> = [
    [32, 14],
    [47.6, 23],
    [47.6, 41],
    [32, 50],
    [16.4, 41],
    [16.4, 23],
  ];
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="32" cy="32" r="22" {...s} opacity="0.4" />
      {positions.map(([x, y], i) => (
        <line key={`l-${i}`} x1={x} y1={y} x2="32" y2="32" {...s} />
      ))}
      {positions.map(([x, y], i) => (
        <circle key={`p-${i}`} cx={x} cy={y} r="2" fill={color} />
      ))}
      <circle cx="32" cy="32" r="3" fill={color} />
    </svg>
  );
}

/** Step 03 — Attach sealed. A circle with a tick — the seal — anchored
 *  by a small horizontal segment representing the on-chain commitment. */
export function AttachSeal({ color, size = 40, strokeWidth = 1.25, className }: MarkProps) {
  const s = stroke(color, strokeWidth);
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="32" cy="26" r="14" {...s} />
      <path d="M25 26 L30 31 L39 22" {...s} strokeWidth={strokeWidth + 0.4} />
      <line x1="14" y1="50" x2="50" y2="50" {...s} />
      <circle cx="14" cy="50" r="1.8" fill={color} />
      <circle cx="50" cy="50" r="1.8" fill={color} />
      <line x1="32" y1="40" x2="32" y2="50" {...s} opacity="0.5" />
    </svg>
  );
}
