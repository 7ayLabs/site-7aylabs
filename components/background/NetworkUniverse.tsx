"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

/* ── Types ── */
export type BackgroundVariant =
  | "default"
  | "technology"
  | "presence"
  | "usecases"
  | "glossary"
  | "waitlist"
  | "newsletter"
  | "updates"
  | "devnet"
  | "validators"
  | "ecosystem";

type NC = "teal" | "violet" | "cyan";
interface N { id: number; x: number; y: number; tier: 1 | 2 | 3; color: NC }

/* ── Variant configs ── */
interface VariantConfig {
  nebulaHues: NC[];
  nebulaAlphaMult: number;
  starDensityMult: number;
  shootFreqMult: number;
}

const VARIANT_CONFIGS: Record<BackgroundVariant, VariantConfig> = {
  default:    { nebulaHues: ["teal", "violet", "cyan"], nebulaAlphaMult: 1.0,  starDensityMult: 1.0,  shootFreqMult: 1.0 },
  technology: { nebulaHues: ["teal", "cyan", "teal"],   nebulaAlphaMult: 1.2,  starDensityMult: 1.3,  shootFreqMult: 1.2 },
  presence:   { nebulaHues: ["teal", "teal", "cyan"],   nebulaAlphaMult: 1.0,  starDensityMult: 0.9,  shootFreqMult: 0.8 },
  usecases:   { nebulaHues: ["violet", "teal", "violet"], nebulaAlphaMult: 1.1, starDensityMult: 1.0, shootFreqMult: 1.0 },
  glossary:   { nebulaHues: ["cyan", "teal", "cyan"],   nebulaAlphaMult: 0.7,  starDensityMult: 0.6,  shootFreqMult: 0.5 },
  waitlist:   { nebulaHues: ["teal", "violet", "teal"], nebulaAlphaMult: 1.3,  starDensityMult: 1.2,  shootFreqMult: 1.5 },
  newsletter: { nebulaHues: ["cyan", "cyan", "teal"],   nebulaAlphaMult: 0.6,  starDensityMult: 0.7,  shootFreqMult: 0.4 },
  updates:    { nebulaHues: ["violet", "cyan", "violet"], nebulaAlphaMult: 1.1, starDensityMult: 1.1, shootFreqMult: 1.2 },
  devnet:     { nebulaHues: ["cyan", "teal", "cyan"],   nebulaAlphaMult: 1.2,  starDensityMult: 1.2,  shootFreqMult: 1.0 },
  validators: { nebulaHues: ["teal", "teal", "teal"],   nebulaAlphaMult: 1.0,  starDensityMult: 1.0,  shootFreqMult: 0.8 },
  ecosystem:  { nebulaHues: ["teal", "violet", "cyan"], nebulaAlphaMult: 1.3,  starDensityMult: 1.3,  shootFreqMult: 1.3 },
};

/* ── Color palettes ── */
const BRIGHT: Record<NC, [number, number, number]> = {
  teal: [0, 255, 198], violet: [192, 132, 252], cyan: [34, 211, 238],
};
const DIM: Record<NC, [number, number, number]> = {
  teal: [23, 142, 119], violet: [139, 92, 246], cyan: [8, 145, 178],
};
const LIGHT_BRIGHT: Record<NC, [number, number, number]> = {
  teal: [15, 110, 90], violet: [110, 70, 200], cyan: [6, 115, 142],
};
const LIGHT_DIM: Record<NC, [number, number, number]> = {
  teal: [100, 80, 40], violet: [90, 60, 50], cyan: [70, 90, 45],
};

/* ── PRNG ── */
function prng(s: number) {
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

/* ── Pixel scale factor ── */
const PX = 4;

/* ── Content exclusion zone (half-width in px at 1200 design width) ── */
const CONTENT_HALF = 576; // max-w-6xl / 2

/* ── Build side-only nodes ── */
function buildNodes() {
  const r = prng(7);
  const colors: NC[] = ["teal", "violet", "cyan"];
  const nodes: N[] = [];
  let id = 0;

  /* Hero-area side nodes (y 0–1 normalized to 800px design) */
  const heroSide: [number, number, 1 | 2 | 3, NC][] = [
    /* Left edge */
    [50, 150, 3, "teal"], [30, 450, 3, "cyan"], [80, 700, 2, "teal"],
    /* Right edge */
    [1150, 120, 3, "violet"], [1170, 500, 3, "cyan"], [1130, 680, 2, "teal"],
  ];

  for (const [px, py, tier, color] of heroSide) {
    nodes.push({ id: id++, x: px / 1200, y: py / 800, tier, color });
  }

  /* Procedural side nodes in bands below the hero — sparse */
  for (let band = 0; band < 24; band++) {
    const baseY = 1.0 + band * 0.25;
    const count = 1 + Math.floor(r() * 2); // 1–2 per band
    for (let i = 0; i < count; i++) {
      const side = r() < 0.5;
      const x = side ? 0.02 + r() * 0.12 : 0.88 + r() * 0.10;
      nodes.push({
        id: id++, x, y: baseY + r() * 0.20,
        tier: (r() < 0.1 ? 1 : r() < 0.35 ? 2 : 3) as 1 | 2 | 3,
        color: colors[Math.floor(r() * 3)],
      });
    }
  }

  return nodes;
}

const NODES = buildNodes();

/* ── Static star data ── */
const STARS_DIM = (() => {
  const r = prng(88);
  return Array.from({ length: 400 }, () => ({
    x: r(), y: r(), b: 0.08 + r() * 0.2, phase: r() * Math.PI * 2, speed: 0.1 + r() * 0.5,
  }));
})();

const STARS_MED = (() => {
  const r = prng(99);
  return Array.from({ length: 250 }, () => ({
    x: r(), y: r(), b: 0.3 + r() * 0.5, phase: r() * Math.PI * 2, speed: 0.3 + r() * 1.2,
  }));
})();

const STARS_BRIGHT = (() => {
  const r = prng(77);
  return Array.from({ length: 60 }, () => ({
    x: r(), y: r(), b: 0.6 + r() * 0.4, phase: r() * Math.PI * 2, speed: 0.5 + r() * 2.0,
    hasSparkle: r() < 0.4,
  }));
})();

const NEBULAE = (() => {
  const r = prng(55);
  return Array.from({ length: 8 }, (_, i) => ({
    x: r(), y: r(), rx: 20 + r() * 50, ry: 15 + r() * 38, colorIdx: i % 3,
    alpha: 0.015 + r() * 0.025, phase: r() * Math.PI * 2,
  }));
})();

interface ShootingStar {
  x: number; y: number; angle: number; speed: number; len: number;
  life: number; maxLife: number; active: boolean; brightness: number;
}

/* ── Component ── */
export default function NetworkUniverse({ variant = "default" }: { variant?: BackgroundVariant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const themeRef = useRef("dark");
  const variantRef = useRef(variant);
  const { theme } = useTheme();

  useEffect(() => { themeRef.current = theme; }, [theme]);
  useEffect(() => { variantRef.current = variant; }, [variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, ow = 0, oh = 0, mobile = false;

    /* Offscreen canvas for pixel art */
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d")!;
    offCtx.imageSmoothingEnabled = false;

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      mobile = w < 768;
      canvas.width = w; canvas.height = h;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ow = Math.ceil(w / PX); oh = Math.ceil(h / PX);
      offscreen.width = ow; offscreen.height = oh;
      offCtx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    /* Mobile subset: show only ~1 in 3 nodes */
    const mobileNodeSet = new Set<number>();
    for (const n of NODES) {
      if (n.tier === 1) mobileNodeSet.add(n.id);
      else if (n.id % 3 === 0) mobileNodeSet.add(n.id);
    }
    const mobileStarsDim = STARS_DIM.filter((_, i) => i % 3 === 0);
    const mobileStarsMed = STARS_MED.filter((_, i) => i % 2 === 0);
    const mobileStarsBright = STARS_BRIGHT.filter((_, i) => i % 2 === 0);

    /* Shooting stars */
    const shootingStars: ShootingStar[] = Array.from({ length: mobile ? 2 : 4 }, () => ({
      x: 0, y: 0, angle: 0, speed: 0, len: 0,
      life: 0, maxLife: 0, active: false, brightness: 0,
    }));
    const shootRng = prng(123);
    let nextShoot = 2 + shootRng() * 4;

    const startTime = performance.now();
    let lastTime = startTime;
    let running = true;

    /* Center exclusion boundaries in offscreen px */
    const centerL = () => Math.round((w / 2 - CONTENT_HALF) / PX);
    const centerR = () => Math.round((w / 2 + CONTENT_HALF) / PX);

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;
      const scrollY = window.scrollY;
      const isDark = themeRef.current === "dark";
      const vc = VARIANT_CONFIGS[variantRef.current];
      const A = 1;

      const bright = isDark ? BRIGHT : LIGHT_BRIGHT;
      const dim = isDark ? DIM : LIGHT_DIM;

      /* Clear offscreen */
      offCtx.clearRect(0, 0, ow, oh);

      /* ── Nebulae (flat pixel blobs) ── */
      for (let ni = 0; ni < NEBULAE.length; ni++) {
        const neb = NEBULAE[ni];
        const nebColor = vc.nebulaHues[neb.colorIdx % vc.nebulaHues.length];
        const breathe = 1 + 0.15 * Math.sin(elapsed * 0.3 + neb.phase);
        const [nr, ng, nb] = dim[nebColor];
        const alphaScale = isDark ? 1.0 : 0.8;
        const baseAlpha = neb.alpha * alphaScale * vc.nebulaAlphaMult;

        const cx = Math.round(neb.x * ow);
        const cy = Math.round(neb.y * oh);
        const rx = Math.round(neb.rx * breathe);
        const ry = Math.round(neb.ry * breathe);

        const blockSize = mobile ? 4 : 3;
        for (let bx = -rx; bx <= rx; bx += blockSize) {
          for (let by = -ry; by <= ry; by += blockSize) {
            const dx = bx / rx, dy = by / ry;
            const dist = dx * dx + dy * dy;
            if (dist > 1) continue;
            const fade = 1 - dist;
            const a = baseAlpha * fade;
            if (a < 0.003) continue;
            offCtx.globalAlpha = a;
            offCtx.fillStyle = `rgb(${nr},${ng},${nb})`;
            offCtx.fillRect(cx + bx, cy + by, blockSize, blockSize);
          }
        }
      }

      /* ── Stars (pixel squares) ── */
      if (!prefersReduced) {
        const dimStars = mobile ? mobileStarsDim : STARS_DIM;
        const medStars = mobile ? mobileStarsMed : STARS_MED;
        const brtStars = mobile ? mobileStarsBright : STARS_BRIGHT;
        const densityMult = vc.starDensityMult;

        offCtx.fillStyle = isDark ? "#a0a0b0" : "#8a7030";
        for (let i = 0; i < dimStars.length * densityMult && i < dimStars.length; i++) {
          const star = dimStars[i];
          const twinkle = 0.6 + 0.4 * Math.sin(elapsed * star.speed + star.phase);
          offCtx.globalAlpha = star.b * twinkle * A;
          offCtx.fillRect(Math.round(star.x * ow), Math.round(star.y * oh), 1, 1);
        }

        offCtx.fillStyle = isDark ? "#d4d4e0" : "#6d5520";
        for (let i = 0; i < medStars.length * densityMult && i < medStars.length; i++) {
          const star = medStars[i];
          const twinkle = 0.5 + 0.5 * Math.sin(elapsed * star.speed + star.phase);
          offCtx.globalAlpha = star.b * twinkle * A;
          offCtx.fillRect(Math.round(star.x * ow), Math.round(star.y * oh), 1, 1);
        }

        for (let i = 0; i < brtStars.length * densityMult && i < brtStars.length; i++) {
          const star = brtStars[i];
          const twinkle = 0.4 + 0.6 * Math.sin(elapsed * star.speed + star.phase);
          const sx = Math.round(star.x * ow), sy = Math.round(star.y * oh);
          offCtx.globalAlpha = star.b * twinkle * A;
          offCtx.fillStyle = isDark ? "#ffffff" : "#544010";
          offCtx.fillRect(sx, sy, 2, 2);

          if (star.hasSparkle && !mobile) {
            const arm = Math.round(2 * twinkle);
            offCtx.globalAlpha = star.b * twinkle * 0.5 * A;
            offCtx.fillRect(sx - arm, sy, 1, 1);
            offCtx.fillRect(sx + 2 + arm - 1, sy, 1, 1);
            offCtx.fillRect(sx, sy - arm, 1, 1);
            offCtx.fillRect(sx, sy + 2 + arm - 1, 1, 1);
          }
        }

        /* ── Shooting stars ── */
        const freqMult = vc.shootFreqMult;
        nextShoot -= dt * freqMult;
        if (nextShoot <= 0) {
          nextShoot = 3 + shootRng() * 6;
          const inactive = shootingStars.find(s => !s.active);
          if (inactive) {
            inactive.x = shootRng() * ow;
            inactive.y = shootRng() * oh * 0.6;
            inactive.angle = Math.PI * 0.15 + shootRng() * Math.PI * 0.3;
            inactive.speed = 80 + shootRng() * 120;
            inactive.len = 10 + shootRng() * 20;
            inactive.life = 0;
            inactive.maxLife = 0.4 + shootRng() * 0.6;
            inactive.active = true;
            inactive.brightness = 0.5 + shootRng() * 0.5;
          }
        }

        for (const ss of shootingStars) {
          if (!ss.active) continue;
          ss.life += dt;
          if (ss.life >= ss.maxLife) { ss.active = false; continue; }

          ss.x += Math.cos(ss.angle) * ss.speed * dt;
          ss.y += Math.sin(ss.angle) * ss.speed * dt;

          const fadeIn = Math.min(ss.life / 0.1, 1);
          const fadeOut = Math.max(1 - (ss.life - ss.maxLife + 0.2) / 0.2, 0);
          const alpha = fadeIn * fadeOut * ss.brightness * A;

          const hx = Math.round(ss.x), hy = Math.round(ss.y);
          const steps = Math.round(ss.len);
          offCtx.fillStyle = isDark ? "#ffffff" : "#9a8540";
          for (let s = 0; s < steps; s++) {
            const t = s / steps;
            const tx = Math.round(hx - Math.cos(ss.angle) * s);
            const ty = Math.round(hy - Math.sin(ss.angle) * s);
            offCtx.globalAlpha = alpha * (1 - t);
            offCtx.fillRect(tx, ty, 1, 1);
          }
          offCtx.globalAlpha = alpha;
          offCtx.fillRect(hx, hy, 2, 2);
        }
      }

      /* ── Nodes (sides only — skip center content zone) ── */
      const cL = centerL();
      const cR = centerR();

      for (const node of NODES) {
        if (mobile && !mobileNodeSet.has(node.id)) continue;
        const floatY = node.tier === 1 && !prefersReduced ? Math.sin(elapsed * 0.5 + node.id) * 0.8 : 0;
        const py = Math.round(node.y * oh - scrollY / PX + floatY);
        if (py < -15 || py > oh + 15) continue;
        const px = Math.round(node.x * ow);

        /* Skip nodes in center content zone */
        if (px > cL && px < cR) continue;

        const [r, g, b] = bright[node.color];
        const [dr, dg, db] = dim[node.color];

        const sz = node.tier === 1 ? 4 : node.tier === 2 ? 3 : 2;

        /* Glow */
        if (!mobile || node.tier <= 2) {
          offCtx.globalAlpha = (isDark ? 0.12 : 0.2) * A;
          offCtx.fillStyle = `rgb(${r},${g},${b})`;
          offCtx.fillRect(px - sz - 1, py - sz - 1, sz * 2 + 2, sz * 2 + 2);
        }

        /* Ping pulse */
        if (node.tier <= (mobile ? 1 : 2) && !prefersReduced) {
          const period = node.tier === 1 ? 2 : 3.5;
          const pingP = ((elapsed + node.id * 0.3) % period) / period;
          const pingSize = Math.round(sz + pingP * sz * 3);
          offCtx.globalAlpha = (1 - pingP) * 0.25 * A;
          offCtx.fillStyle = `rgb(${r},${g},${b})`;
          offCtx.fillRect(px - pingSize, py - pingSize, pingSize * 2, 1);
          offCtx.fillRect(px - pingSize, py + pingSize, pingSize * 2, 1);
          offCtx.fillRect(px - pingSize, py - pingSize, 1, pingSize * 2);
          offCtx.fillRect(px + pingSize, py - pingSize, 1, pingSize * 2);
        }

        /* Outer border */
        offCtx.globalAlpha = 0.8 * A;
        offCtx.fillStyle = `rgb(${dr},${dg},${db})`;
        offCtx.fillRect(px - sz, py - sz, sz * 2, sz * 2);

        /* Inner fill */
        offCtx.globalAlpha = 0.9 * A;
        offCtx.fillStyle = isDark ? "#050508" : "#FDF5E2";
        offCtx.fillRect(px - sz + 1, py - sz + 1, sz * 2 - 2, sz * 2 - 2);

        /* Center dot */
        offCtx.globalAlpha = 0.9 * A;
        offCtx.fillStyle = `rgb(${r},${g},${b})`;
        const cd = node.tier === 1 ? 2 : 1;
        offCtx.fillRect(px - Math.floor(cd / 2), py - Math.floor(cd / 2), cd, cd);
      }

      /* ── Blit offscreen → display canvas (nearest-neighbor upscale) ── */
      offCtx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = isDark ? "#050508" : "#FDF5E2";
      ctx.fillRect(0, 0, w, h);

      ctx.drawImage(offscreen, 0, 0, ow, oh, 0, 0, w, h);

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -10, imageRendering: "pixelated" }}
      aria-hidden="true"
    />
  );
}
