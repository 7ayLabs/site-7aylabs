/**
 * Generate themed PNG icons for 7aychain landing sections.
 * Uses sharp to convert detailed SVGs → high-quality PNGs.
 *
 * Style: Filled geometric shapes with gradient accents,
 *        layered depth, and subtle glow effects.
 *
 * Run: node scripts/generate-pngs.mjs
 */

import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DARK = join(ROOT, "public/icons/dark");
const OUT_LIGHT = join(ROOT, "public/icons/light");

mkdirSync(OUT_DARK, { recursive: true });
mkdirSync(OUT_LIGHT, { recursive: true });

const SIZE = 256;

/* ------------------------------------------------------------------ */
/*  Color palette                                                      */
/* ------------------------------------------------------------------ */

const PALETTE = {
  teal: {
    dark: { main: "#00FFC6", sub: "#00CC9E", glow: "#00FFC640", bg: "#00FFC612" },
    light: { main: "#0F766E", sub: "#0D9488", glow: "#0F766E30", bg: "#0F766E10" },
  },
  violet: {
    dark: { main: "#C084FC", sub: "#A855F7", glow: "#C084FC40", bg: "#C084FC12" },
    light: { main: "#7C3AED", sub: "#8B5CF6", glow: "#7C3AED30", bg: "#7C3AED10" },
  },
  cyan: {
    dark: { main: "#22D3EE", sub: "#06B6D4", glow: "#22D3EE40", bg: "#22D3EE12" },
    light: { main: "#0E7490", sub: "#0891B2", glow: "#0E749030", bg: "#0E749010" },
  },
};

/* ------------------------------------------------------------------ */
/*  Icon SVG generators — filled geometric style                       */
/* ------------------------------------------------------------------ */

/**
 * Step 1: Connect — Phone with radiating signal arcs
 */
function stepConnect(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 256 256" fill="none">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.main}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${c.main}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Ambient glow -->
  <circle cx="128" cy="128" r="120" fill="url(#glow)"/>
  <!-- Phone body -->
  <rect x="88" y="48" width="80" height="160" rx="16" fill="${c.bg}" stroke="${c.main}" stroke-width="3"/>
  <rect x="96" y="64" width="64" height="108" rx="4" fill="${c.main}" fill-opacity="0.08"/>
  <!-- Home indicator -->
  <rect x="112" y="188" width="32" height="4" rx="2" fill="${c.main}" fill-opacity="0.5"/>
  <!-- Signal arcs -->
  <path d="M176 88C188 76 188 56 176 44" stroke="${c.main}" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.9"/>
  <path d="M188 100C206 82 206 48 188 30" stroke="${c.main}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>
  <path d="M200 112C224 88 224 40 200 16" stroke="${c.main}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.35"/>
  <!-- Connection dot -->
  <circle cx="170" cy="66" r="6" fill="${c.main}"/>
  <circle cx="170" cy="66" r="10" fill="${c.main}" fill-opacity="0.2"/>
</svg>`;
}

/**
 * Step 2: Witness — Triangulation with witness circles
 */
function stepWitness(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 256 256" fill="none">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.main}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${c.main}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="120" fill="url(#glow)"/>
  <!-- Triangulation lines (dashed) -->
  <line x1="128" y1="52" x2="56" y2="192" stroke="${c.main}" stroke-width="2" stroke-dasharray="8 5" opacity="0.35"/>
  <line x1="128" y1="52" x2="200" y2="192" stroke="${c.main}" stroke-width="2" stroke-dasharray="8 5" opacity="0.35"/>
  <line x1="56" y1="192" x2="200" y2="192" stroke="${c.main}" stroke-width="2" stroke-dasharray="8 5" opacity="0.35"/>
  <!-- Lines to center -->
  <line x1="128" y1="52" x2="128" y2="140" stroke="${c.main}" stroke-width="1.5" opacity="0.2"/>
  <line x1="56" y1="192" x2="128" y2="140" stroke="${c.main}" stroke-width="1.5" opacity="0.2"/>
  <line x1="200" y1="192" x2="128" y2="140" stroke="${c.main}" stroke-width="1.5" opacity="0.2"/>
  <!-- Witness circles (range) -->
  <circle cx="128" cy="52" r="36" fill="${c.main}" fill-opacity="0.05" stroke="${c.main}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.4"/>
  <circle cx="56" cy="192" r="36" fill="${c.main}" fill-opacity="0.05" stroke="${c.main}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.4"/>
  <circle cx="200" cy="192" r="36" fill="${c.main}" fill-opacity="0.05" stroke="${c.main}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.4"/>
  <!-- Validator nodes -->
  <circle cx="128" cy="52" r="14" fill="${c.bg}" stroke="${c.main}" stroke-width="3"/>
  <circle cx="128" cy="52" r="6" fill="${c.main}"/>
  <circle cx="56" cy="192" r="14" fill="${c.bg}" stroke="${c.main}" stroke-width="3"/>
  <circle cx="56" cy="192" r="6" fill="${c.main}"/>
  <circle cx="200" cy="192" r="14" fill="${c.bg}" stroke="${c.main}" stroke-width="3"/>
  <circle cx="200" cy="192" r="6" fill="${c.main}"/>
  <!-- Center target (you) -->
  <circle cx="128" cy="140" r="18" fill="${c.main}" fill-opacity="0.15"/>
  <circle cx="128" cy="140" r="10" fill="${c.main}" fill-opacity="0.3"/>
  <circle cx="128" cy="140" r="5" fill="${c.main}"/>
</svg>`;
}

/**
 * Step 3: Seal — Hexagonal proof with chain link
 */
function stepSeal(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 256 256" fill="none">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.main}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${c.main}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="120" fill="url(#glow)"/>
  <!-- Outer hexagon -->
  <polygon points="128,32 208,76 208,164 128,208 48,164 48,76" fill="${c.bg}" stroke="${c.main}" stroke-width="3" stroke-linejoin="round"/>
  <!-- Inner hexagon -->
  <polygon points="128,64 176,92 176,148 128,176 80,148 80,92" fill="${c.main}" fill-opacity="0.08" stroke="${c.main}" stroke-width="2" stroke-linejoin="round" opacity="0.5"/>
  <!-- Checkmark -->
  <polyline points="100,124 120,146 160,100" stroke="${c.main}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Chain link below -->
  <line x1="128" y1="208" x2="128" y2="232" stroke="${c.main}" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
  <rect x="118" y="230" width="20" height="12" rx="4" fill="none" stroke="${c.main}" stroke-width="2" opacity="0.4"/>
  <!-- Chain link above -->
  <line x1="128" y1="32" x2="128" y2="14" stroke="${c.main}" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
  <rect x="118" y="4" width="20" height="12" rx="4" fill="none" stroke="${c.main}" stroke-width="2" opacity="0.4"/>
</svg>`;
}

/**
 * Card 1: Physics — Wave with measurement nodes
 */
function cardPhysics(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 256 256" fill="none">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.main}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${c.main}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="120" fill="url(#glow)"/>
  <!-- Signal wave -->
  <path d="M32 128 Q64 56 96 128 Q128 200 160 128 Q192 56 224 128" stroke="${c.main}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <!-- Measurement baseline -->
  <line x1="32" y1="128" x2="224" y2="128" stroke="${c.main}" stroke-width="1" opacity="0.15"/>
  <!-- RTT measurement markers -->
  <line x1="64" y1="118" x2="64" y2="138" stroke="${c.main}" stroke-width="2" opacity="0.4"/>
  <line x1="128" y1="118" x2="128" y2="138" stroke="${c.main}" stroke-width="2" opacity="0.4"/>
  <line x1="192" y1="118" x2="192" y2="138" stroke="${c.main}" stroke-width="2" opacity="0.4"/>
  <!-- Measurement nodes -->
  <circle cx="64" cy="92" r="8" fill="${c.bg}" stroke="${c.main}" stroke-width="2.5"/>
  <circle cx="64" cy="92" r="3" fill="${c.main}"/>
  <circle cx="128" cy="198" r="8" fill="${c.bg}" stroke="${c.main}" stroke-width="2.5"/>
  <circle cx="128" cy="198" r="3" fill="${c.main}"/>
  <circle cx="192" cy="92" r="8" fill="${c.bg}" stroke="${c.main}" stroke-width="2.5"/>
  <circle cx="192" cy="92" r="3" fill="${c.main}"/>
  <!-- Timing arcs -->
  <path d="M70 86C90 66 102 66 122 86" stroke="${c.main}" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.3" stroke-dasharray="3 3"/>
  <path d="M134 192C154 212 166 212 186 192" stroke="${c.main}" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.3" stroke-dasharray="3 3"/>
</svg>`;
}

/**
 * Card 2: Privacy — Lock with ZK proof rings
 */
function cardPrivacy(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 256 256" fill="none">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.main}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${c.main}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="120" fill="url(#glow)"/>
  <!-- ZK proof rings -->
  <circle cx="128" cy="128" r="96" stroke="${c.main}" stroke-width="1.5" fill="none" opacity="0.12" stroke-dasharray="6 4"/>
  <circle cx="128" cy="128" r="76" stroke="${c.main}" stroke-width="1.5" fill="none" opacity="0.2" stroke-dasharray="4 3"/>
  <!-- Lock shackle -->
  <path d="M96 112V88C96 70 110 56 128 56C146 56 160 70 160 88V112" stroke="${c.main}" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- Lock body -->
  <rect x="84" y="112" width="88" height="72" rx="12" fill="${c.bg}" stroke="${c.main}" stroke-width="3"/>
  <!-- Keyhole -->
  <circle cx="128" cy="142" r="10" fill="${c.main}" fill-opacity="0.3"/>
  <circle cx="128" cy="142" r="5" fill="${c.main}"/>
  <rect x="125" y="148" width="6" height="16" rx="2" fill="${c.main}" fill-opacity="0.5"/>
  <!-- Nullifier indicators -->
  <circle cx="68" cy="78" r="4" fill="${c.main}" opacity="0.4"/>
  <circle cx="188" cy="78" r="4" fill="${c.main}" opacity="0.4"/>
  <circle cx="68" cy="178" r="4" fill="${c.main}" opacity="0.4"/>
  <circle cx="188" cy="178" r="4" fill="${c.main}" opacity="0.4"/>
</svg>`;
}

/**
 * Card 3: Bot-proof — Shield with detection pattern
 */
function cardBotproof(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 256 256" fill="none">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.main}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${c.main}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="120" fill="url(#glow)"/>
  <!-- Shield outline -->
  <path d="M128 28L208 64V136C208 180 172 216 128 236C84 216 48 180 48 136V64L128 28Z" fill="${c.bg}" stroke="${c.main}" stroke-width="3" stroke-linejoin="round"/>
  <!-- Inner shield -->
  <path d="M128 56L184 80V136C184 168 160 196 128 212C96 196 72 168 72 136V80L128 56Z" fill="${c.main}" fill-opacity="0.06" stroke="${c.main}" stroke-width="1.5" stroke-linejoin="round" opacity="0.4"/>
  <!-- Detection scan lines -->
  <line x1="96" y1="112" x2="160" y2="112" stroke="${c.main}" stroke-width="2" opacity="0.3"/>
  <line x1="96" y1="128" x2="160" y2="128" stroke="${c.main}" stroke-width="2" opacity="0.5"/>
  <line x1="96" y1="144" x2="160" y2="144" stroke="${c.main}" stroke-width="2" opacity="0.3"/>
  <!-- Human checkmark -->
  <polyline points="110,128 122,142 148,112" stroke="${c.main}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Detection score dots -->
  <circle cx="104" cy="82" r="3" fill="${c.main}" opacity="0.5"/>
  <circle cx="120" cy="78" r="3" fill="${c.main}" opacity="0.7"/>
  <circle cx="136" cy="76" r="3" fill="${c.main}" opacity="0.9"/>
  <circle cx="152" cy="78" r="3" fill="${c.main}" opacity="0.7"/>
</svg>`;
}

/**
 * Card 4: Governance — Capability nodes with delegation links
 */
function cardGovernance(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 256 256" fill="none">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.main}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${c.main}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="120" fill="url(#glow)"/>
  <!-- Delegation lines -->
  <line x1="128" y1="72" x2="68" y2="148" stroke="${c.main}" stroke-width="2" opacity="0.3"/>
  <line x1="128" y1="72" x2="188" y2="148" stroke="${c.main}" stroke-width="2" opacity="0.3"/>
  <line x1="68" y1="148" x2="68" y2="208" stroke="${c.main}" stroke-width="1.5" opacity="0.2"/>
  <line x1="188" y1="148" x2="188" y2="208" stroke="${c.main}" stroke-width="1.5" opacity="0.2"/>
  <line x1="128" y1="72" x2="128" y2="148" stroke="${c.main}" stroke-width="2" opacity="0.3"/>
  <line x1="128" y1="148" x2="128" y2="208" stroke="${c.main}" stroke-width="1.5" opacity="0.2"/>
  <!-- Root node (top) -->
  <circle cx="128" cy="72" r="20" fill="${c.bg}" stroke="${c.main}" stroke-width="3"/>
  <circle cx="128" cy="72" r="8" fill="${c.main}" fill-opacity="0.4"/>
  <circle cx="128" cy="72" r="4" fill="${c.main}"/>
  <!-- Level 1 nodes -->
  <circle cx="68" cy="148" r="16" fill="${c.bg}" stroke="${c.main}" stroke-width="2.5"/>
  <circle cx="68" cy="148" r="6" fill="${c.main}" fill-opacity="0.5"/>
  <circle cx="128" cy="148" r="16" fill="${c.bg}" stroke="${c.main}" stroke-width="2.5"/>
  <circle cx="128" cy="148" r="6" fill="${c.main}" fill-opacity="0.5"/>
  <circle cx="188" cy="148" r="16" fill="${c.bg}" stroke="${c.main}" stroke-width="2.5"/>
  <circle cx="188" cy="148" r="6" fill="${c.main}" fill-opacity="0.5"/>
  <!-- Level 2 nodes (smaller) -->
  <circle cx="68" cy="208" r="10" fill="${c.bg}" stroke="${c.main}" stroke-width="2" opacity="0.6"/>
  <circle cx="68" cy="208" r="4" fill="${c.main}" opacity="0.4"/>
  <circle cx="128" cy="208" r="10" fill="${c.bg}" stroke="${c.main}" stroke-width="2" opacity="0.6"/>
  <circle cx="128" cy="208" r="4" fill="${c.main}" opacity="0.4"/>
  <circle cx="188" cy="208" r="10" fill="${c.bg}" stroke="${c.main}" stroke-width="2" opacity="0.6"/>
  <circle cx="188" cy="208" r="4" fill="${c.main}" opacity="0.4"/>
  <!-- Permission badge on root -->
  <rect x="140" y="56" width="20" height="12" rx="3" fill="${c.main}" fill-opacity="0.2" stroke="${c.main}" stroke-width="1.5" opacity="0.6"/>
</svg>`;
}

/* ------------------------------------------------------------------ */
/*  Icon registry                                                      */
/* ------------------------------------------------------------------ */

const ICONS = [
  { name: "step-connect",   fn: stepConnect,    palette: "teal" },
  { name: "step-witness",   fn: stepWitness,    palette: "violet" },
  { name: "step-seal",      fn: stepSeal,       palette: "cyan" },
  { name: "card-physics",   fn: cardPhysics,    palette: "teal" },
  { name: "card-privacy",   fn: cardPrivacy,    palette: "violet" },
  { name: "card-botproof",  fn: cardBotproof,   palette: "teal" },
  { name: "card-governance",fn: cardGovernance, palette: "cyan" },
];

/* ------------------------------------------------------------------ */
/*  Generate                                                           */
/* ------------------------------------------------------------------ */

console.log("Generating themed PNG icons...\n");

for (const icon of ICONS) {
  const pal = PALETTE[icon.palette];

  // Dark variant
  const darkSvg = icon.fn(pal.dark);
  const darkPng = await sharp(Buffer.from(darkSvg))
    .resize(SIZE, SIZE)
    .png({ quality: 90 })
    .toBuffer();
  writeFileSync(join(OUT_DARK, `${icon.name}.png`), darkPng);
  console.log(`  dark/${icon.name}.png  (${(darkPng.length / 1024).toFixed(1)} KB)`);

  // Light variant
  const lightSvg = icon.fn(pal.light);
  const lightPng = await sharp(Buffer.from(lightSvg))
    .resize(SIZE, SIZE)
    .png({ quality: 90 })
    .toBuffer();
  writeFileSync(join(OUT_LIGHT, `${icon.name}.png`), lightPng);
  console.log(`  light/${icon.name}.png  (${(lightPng.length / 1024).toFixed(1)} KB)`);
}

console.log(`\nDone! Generated ${ICONS.length * 2} PNG icons.`);
