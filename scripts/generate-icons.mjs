/**
 * Generate simple, clean PNG icons for 7aychain landing sections.
 * Style: minimal line art, single accent color, geometric, professional.
 * Two variants per icon: dark theme (bright on transparent) and light theme (dark on transparent).
 *
 * Run: node scripts/generate-icons.mjs
 */

import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DARK = join(ROOT, "public/icons/dark");
const OUT_LIGHT = join(ROOT, "public/icons/light");

mkdirSync(OUT_DARK, { recursive: true });
mkdirSync(OUT_LIGHT, { recursive: true });

const SIZE = 128;
const SW = "2.5"; // stroke width — clean and consistent
const CAP = "round";
const JOIN = "round";

// ─── Color palettes ──────────────────────────────────────────────
const PALETTE = {
  teal:   { dark: "#00FFC6", light: "#0F766E" },
  violet: { dark: "#C084FC", light: "#7C3AED" },
  cyan:   { dark: "#22D3EE", light: "#0E7490" },
};

// ─── SVG icon definitions ────────────────────────────────────────
// Clean line art. Single color. No fills. Just strokes.

function iconConnect(c) {
  // Simple phone with signal arcs
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 64 64" fill="none">
    <rect x="20" y="10" width="24" height="44" rx="4" stroke="${c}" stroke-width="${SW}" stroke-linecap="${CAP}" stroke-linejoin="${JOIN}" />
    <line x1="28" y1="48" x2="36" y2="48" stroke="${c}" stroke-width="${SW}" stroke-linecap="${CAP}" />
    <path d="M40 22 C44 18 44 14 40 10" stroke="${c}" stroke-width="2" stroke-linecap="${CAP}" fill="none" opacity="0.7" />
    <path d="M44 26 C50 20 50 12 44 6" stroke="${c}" stroke-width="1.5" stroke-linecap="${CAP}" fill="none" opacity="0.45" />
  </svg>`;
}

function iconVerify(c) {
  // Three dots in triangle with connecting lines — triangulation
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 64 64" fill="none">
    <line x1="32" y1="14" x2="12" y2="48" stroke="${c}" stroke-width="1.5" stroke-linecap="${CAP}" stroke-dasharray="4 3" opacity="0.5" />
    <line x1="32" y1="14" x2="52" y2="48" stroke="${c}" stroke-width="1.5" stroke-linecap="${CAP}" stroke-dasharray="4 3" opacity="0.5" />
    <line x1="12" y1="48" x2="52" y2="48" stroke="${c}" stroke-width="1.5" stroke-linecap="${CAP}" stroke-dasharray="4 3" opacity="0.5" />
    <line x1="32" y1="14" x2="32" y2="36" stroke="${c}" stroke-width="1.5" stroke-linecap="${CAP}" opacity="0.35" />
    <line x1="12" y1="48" x2="32" y2="36" stroke="${c}" stroke-width="1.5" stroke-linecap="${CAP}" opacity="0.35" />
    <line x1="52" y1="48" x2="32" y2="36" stroke="${c}" stroke-width="1.5" stroke-linecap="${CAP}" opacity="0.35" />
    <circle cx="32" cy="14" r="4" stroke="${c}" stroke-width="${SW}" fill="none" />
    <circle cx="12" cy="48" r="4" stroke="${c}" stroke-width="${SW}" fill="none" />
    <circle cx="52" cy="48" r="4" stroke="${c}" stroke-width="${SW}" fill="none" />
    <circle cx="32" cy="36" r="3" stroke="${c}" stroke-width="2" fill="${c}" fill-opacity="0.2" />
  </svg>`;
}

function iconProof(c) {
  // Hexagon with checkmark inside
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 64 64" fill="none">
    <polygon points="32,6 54,17 54,39 32,50 10,39 10,17" stroke="${c}" stroke-width="${SW}" stroke-linejoin="${JOIN}" fill="none" />
    <polyline points="22,28 29,36 42,22" stroke="${c}" stroke-width="3" stroke-linecap="${CAP}" stroke-linejoin="${JOIN}" fill="none" />
    <line x1="32" y1="50" x2="32" y2="58" stroke="${c}" stroke-width="1.5" stroke-linecap="${CAP}" opacity="0.4" />
    <line x1="32" y1="6" x2="32" y2="2" stroke="${c}" stroke-width="1.5" stroke-linecap="${CAP}" opacity="0.4" />
  </svg>`;
}

function iconPresence(c) {
  // Person with concentric signal rings
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="22" r="6" stroke="${c}" stroke-width="${SW}" fill="none" />
    <path d="M20 48 C20 38 25 33 32 33 C39 33 44 38 44 48" stroke="${c}" stroke-width="${SW}" stroke-linecap="${CAP}" fill="none" />
    <circle cx="32" cy="32" r="18" stroke="${c}" stroke-width="1.2" fill="none" opacity="0.35" />
    <circle cx="32" cy="32" r="26" stroke="${c}" stroke-width="1" fill="none" opacity="0.2" />
  </svg>`;
}

function iconLocation(c) {
  // Clean map pin with small check
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 64 64" fill="none">
    <path d="M32 56 C32 56 12 38 12 24 C12 13 21 4 32 4 C43 4 52 13 52 24 C52 38 32 56 32 56Z" stroke="${c}" stroke-width="${SW}" stroke-linejoin="${JOIN}" fill="none" />
    <circle cx="32" cy="24" r="8" stroke="${c}" stroke-width="2" fill="none" />
    <polyline points="27,24 31,28 38,20" stroke="${c}" stroke-width="2" stroke-linecap="${CAP}" stroke-linejoin="${JOIN}" fill="none" />
  </svg>`;
}

function iconPrivacy(c) {
  // Eye with slash through it
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 64 64" fill="none">
    <path d="M6 32 C6 32 16 18 32 18 C48 18 58 32 58 32 C58 32 48 46 32 46 C16 46 6 32 6 32Z" stroke="${c}" stroke-width="${SW}" stroke-linejoin="${JOIN}" fill="none" />
    <circle cx="32" cy="32" r="7" stroke="${c}" stroke-width="2" fill="none" />
    <line x1="12" y1="52" x2="52" y2="12" stroke="${c}" stroke-width="3" stroke-linecap="${CAP}" />
  </svg>`;
}

function iconCommunity(c) {
  // Three people in a row, simple
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="18" r="5" stroke="${c}" stroke-width="${SW}" fill="none" />
    <path d="M22 42 C22 34 26 30 32 30 C38 30 42 34 42 42" stroke="${c}" stroke-width="${SW}" stroke-linecap="${CAP}" fill="none" />
    <circle cx="14" cy="24" r="4" stroke="${c}" stroke-width="1.8" fill="none" opacity="0.6" />
    <path d="M6 44 C6 38 9 34 14 34 C17 34 19 35 21 37" stroke="${c}" stroke-width="1.8" stroke-linecap="${CAP}" fill="none" opacity="0.6" />
    <circle cx="50" cy="24" r="4" stroke="${c}" stroke-width="1.8" fill="none" opacity="0.6" />
    <path d="M58 44 C58 38 55 34 50 34 C47 34 45 35 43 37" stroke="${c}" stroke-width="1.8" stroke-linecap="${CAP}" fill="none" opacity="0.6" />
  </svg>`;
}

// ─── Generation ──────────────────────────────────────────────────

const ICONS = [
  { name: "step-connect",   fn: iconConnect,   palette: "teal" },
  { name: "step-verify",    fn: iconVerify,    palette: "violet" },
  { name: "step-proof",     fn: iconProof,     palette: "cyan" },
  { name: "card-presence",  fn: iconPresence,  palette: "teal" },
  { name: "card-location",  fn: iconLocation,  palette: "violet" },
  { name: "card-privacy",   fn: iconPrivacy,   palette: "teal" },
  { name: "card-community", fn: iconCommunity, palette: "cyan" },
];

async function generate() {
  console.log("Generating simple 7aychain PNG icons...\n");

  for (const icon of ICONS) {
    const pal = PALETTE[icon.palette];

    const darkSvg = icon.fn(pal.dark);
    const darkPng = await sharp(Buffer.from(darkSvg))
      .resize(SIZE, SIZE)
      .png({ quality: 100 })
      .toBuffer();
    writeFileSync(join(OUT_DARK, `${icon.name}.png`), darkPng);
    console.log(`  dark/${icon.name}.png  (${darkPng.length} bytes)`);

    const lightSvg = icon.fn(pal.light);
    const lightPng = await sharp(Buffer.from(lightSvg))
      .resize(SIZE, SIZE)
      .png({ quality: 100 })
      .toBuffer();
    writeFileSync(join(OUT_LIGHT, `${icon.name}.png`), lightPng);
    console.log(`  light/${icon.name}.png (${lightPng.length} bytes)`);
  }

  console.log(`\nDone! Generated ${ICONS.length * 2} simple PNG icons.`);
}

generate().catch(console.error);
