"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

type NC = "teal" | "violet" | "cyan";
interface N { id: number; x: number; y: number; tier: 1 | 2 | 3; color: NC }
interface L { a: number; b: number }
interface Cir { path: number[]; dur: number; delay: number; sz: number; block: boolean }

const BRIGHT: Record<NC, [number, number, number]> = {
  teal: [0, 255, 198], violet: [192, 132, 252], cyan: [34, 211, 238],
};
const DIM: Record<NC, [number, number, number]> = {
  teal: [23, 142, 119], violet: [139, 92, 246], cyan: [8, 145, 178],
};

function prng(s: number) {
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

const HR: [number, number, 1 | 2 | 3, NC][] = [
  [60, 80, 3, "teal"], [380, 100, 2, "teal"], [560, 60, 3, "cyan"], [740, 90, 2, "teal"],
  [920, 55, 3, "violet"], [1160, 210, 3, "violet"], [30, 260, 3, "cyan"], [180, 230, 3, "teal"],
  [1020, 250, 3, "teal"], [320, 320, 1, "teal"], [680, 290, 1, "teal"], [500, 490, 1, "teal"],
  [20, 430, 3, "violet"], [1180, 470, 3, "cyan"], [1050, 540, 3, "violet"], [900, 580, 2, "cyan"],
  [80, 660, 2, "teal"], [250, 720, 3, "cyan"], [620, 710, 2, "violet"], [800, 680, 3, "teal"],
  [1140, 600, 3, "teal"],
];

const HL: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 6], [0, 7], [4, 8], [5, 8],
  [6, 9], [7, 9], [1, 9], [8, 10], [3, 10], [2, 10], [12, 9], [6, 12],
  [13, 10], [5, 13], [9, 10], [9, 11], [10, 11], [9, 16], [11, 17], [11, 18],
  [10, 15], [10, 14], [11, 19], [12, 16], [14, 20], [15, 19], [13, 14],
  [16, 17], [17, 18], [18, 19], [19, 20], [15, 20],
];

const HC: Cir[] = [
  { path: [9, 10, 11], dur: 2.5, delay: 0, sz: 4, block: false },
  { path: [11, 10, 9], dur: 3, delay: 1.2, sz: 5, block: false },
  { path: [0, 7, 9, 11, 17, 16, 12, 6], dur: 7, delay: 0.4, sz: 4, block: true },
  { path: [4, 8, 10, 15, 19, 20, 14, 13, 5], dur: 8, delay: 0.2, sz: 4, block: false },
  { path: [0, 1, 2, 3, 4, 8, 10, 9, 7], dur: 6, delay: 1, sz: 4, block: false },
  { path: [16, 17, 18, 19, 15, 10, 9], dur: 5.5, delay: 0.7, sz: 4, block: true },
  { path: [0, 1, 2, 3, 4, 5, 13, 14, 20, 19, 18, 17, 16, 12, 6], dur: 13, delay: 0, sz: 3, block: false },
  { path: [6, 12, 16, 17, 18, 19, 20, 14, 13, 5, 4, 3, 2, 1, 0], dur: 15, delay: 4, sz: 3, block: false },
  { path: [6, 9, 10, 8, 5], dur: 4.5, delay: 0.6, sz: 4, block: false },
  { path: [13, 10, 11, 17, 16, 12], dur: 5, delay: 1.8, sz: 4, block: true },
  { path: [7, 9, 11, 18, 19, 15, 10, 3, 2, 10, 9], dur: 8, delay: 0.3, sz: 4, block: false },
  { path: [9, 16, 17, 11, 18, 19, 15, 10], dur: 6.5, delay: 1.5, sz: 5, block: false },
];

function buildNetwork() {
  const r = prng(7);
  const colors: NC[] = ["teal", "violet", "cyan"];
  const nodes: N[] = HR.map((v, i) => ({ id: i, x: v[0] / 1200, y: v[1] / 800, tier: v[2], color: v[3] }));
  const links: L[] = HL.map(l => ({ a: l[0], b: l[1] }));
  let id = nodes.length;

  for (let band = 0; band < 24; band++) {
    const baseY = 1.0 + band * 0.25;
    const count = 5 + Math.floor(r() * 4);
    for (let i = 0; i < count; i++) {
      nodes.push({
        id: id++,
        x: 0.04 + r() * 0.92,
        y: baseY + r() * 0.20,
        tier: (r() < 0.15 ? 1 : r() < 0.45 ? 2 : 3) as 1 | 2 | 3,
        color: colors[Math.floor(r() * 3)],
      });
    }
  }

  for (let i = 21; i < nodes.length; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = (nodes[i].y - nodes[j].y) * 0.45;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 0.28) dists.push({ j, d });
    }
    dists.sort((a, b) => a.d - b.d);
    const maxLinks = r() < 0.3 ? 5 : 4;
    for (let k = 0; k < Math.min(maxLinks, dists.length); k++) {
      if (!links.some(l => (l.a === i && l.b === dists[k].j) || (l.a === dists[k].j && l.b === i)))
        links.push({ a: i, b: dists[k].j });
    }
  }

  for (const bh of nodes.filter(n => n.id < 21 && n.y > 0.7)) {
    const candidates: { id: number; d: number }[] = [];
    for (const te of nodes.filter(n => n.id >= 21 && n.y < 1.5)) {
      const d = Math.hypot(bh.x - te.x, bh.y - te.y);
      if (d < 0.6) candidates.push({ id: te.id, d });
    }
    candidates.sort((a, b) => a.d - b.d);
    for (let k = 0; k < Math.min(2, candidates.length); k++) {
      if (!links.some(l => (l.a === bh.id && l.b === candidates[k].id) || (l.a === candidates[k].id && l.b === bh.id)))
        links.push({ a: bh.id, b: candidates[k].id });
    }
  }

  const adj = new Map<number, number[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const l of links) { adj.get(l.a)!.push(l.b); adj.get(l.b)!.push(l.a); }

  const circuits: Cir[] = [...HC];
  const cr = prng(42);
  for (let c = 0; c < 30; c++) {
    const start = 21 + Math.floor(cr() * (nodes.length - 21));
    const path = [start];
    let cur = start;
    const visited = new Set([start]);
    for (let step = 0; step < 5 + Math.floor(cr() * 6); step++) {
      const nbrs = adj.get(cur) || [];
      const unv = nbrs.filter(n => !visited.has(n));
      const next = unv.length > 0 ? unv[Math.floor(cr() * unv.length)]
        : nbrs.length > 0 ? nbrs[Math.floor(cr() * nbrs.length)] : -1;
      if (next === -1) break;
      path.push(next);
      visited.add(next);
      cur = next;
    }
    if (path.length >= 3) {
      circuits.push({
        path, dur: 3 + cr() * 7, delay: cr() * 8,
        sz: cr() < 0.2 ? 5 : cr() < 0.5 ? 4 : 3,
        block: cr() < 0.2,
      });
    }
  }

  return { nodes, links, circuits };
}

const NET = buildNetwork();

const STARS_DIM = (() => {
  const r = prng(88);
  return Array.from({ length: 400 }, () => ({
    x: r(), y: r(), s: 0.3 + r() * 0.7, b: 0.08 + r() * 0.2,
    phase: r() * Math.PI * 2, speed: 0.1 + r() * 0.5,
  }));
})();

const STARS_MED = (() => {
  const r = prng(99);
  return Array.from({ length: 250 }, () => ({
    x: r(), y: r(), s: 0.6 + r() * 1.5, b: 0.3 + r() * 0.5,
    phase: r() * Math.PI * 2, speed: 0.3 + r() * 1.2,
  }));
})();

const STARS_BRIGHT = (() => {
  const r = prng(77);
  return Array.from({ length: 60 }, () => ({
    x: r(), y: r(), s: 1.2 + r() * 2.5, b: 0.6 + r() * 0.4,
    phase: r() * Math.PI * 2, speed: 0.5 + r() * 2.0,
    hasSparkle: r() < 0.4,
  }));
})();

const NEBULAE = (() => {
  const r = prng(55);
  const colors: NC[] = ["teal", "violet", "cyan"];
  return Array.from({ length: 8 }, () => ({
    x: r(), y: r(),
    rx: 80 + r() * 200, ry: 60 + r() * 150,
    color: colors[Math.floor(r() * 3)],
    alpha: 0.015 + r() * 0.025,
    phase: r() * Math.PI * 2,
  }));
})();

interface ShootingStar {
  x: number; y: number; angle: number; speed: number; len: number;
  life: number; maxLife: number; active: boolean; brightness: number;
}

interface Prt {
  ci: number; seg: number; t: number;
  color: [number, number, number]; target: [number, number, number];
  x: number; y: number; sz: number; block: boolean;
  trail: { x: number; y: number }[];
  started: boolean;
}

const PROXIMITY_PX = 30;
const TRAIL_LEN = 10;
const COLOR_LERP = 0.05;

export default function NetworkUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const themeRef = useRef("dark");
  const { theme } = useTheme();

  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, mobile = false;

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      mobile = w < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 2 : 3);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const mobileNodeSet = new Set<number>();
    for (const n of NET.nodes) {
      if (n.id < 21 || n.tier <= 2) mobileNodeSet.add(n.id);
      else if (n.id % 3 === 0) mobileNodeSet.add(n.id);
    }
    const mobileLinkFilter = NET.links.filter(l => mobileNodeSet.has(l.a) && mobileNodeSet.has(l.b));
    const mobileStarsDim = STARS_DIM.filter((_, i) => i % 3 === 0);
    const mobileStarsMed = STARS_MED.filter((_, i) => i % 2 === 0);
    const mobileStarsBright = STARS_BRIGHT.filter((_, i) => i % 2 === 0);

    const circuitsToUse = mobile
      ? NET.circuits.filter((_, i) => i < 6 || i % 3 === 0)
      : NET.circuits;
    const particles: Prt[] = circuitsToUse.map((c) => {
      const sn = NET.nodes[c.path[0]];
      const col = [...BRIGHT[sn.color]] as [number, number, number];
      return {
        ci: NET.circuits.indexOf(c), seg: 0, t: 0,
        color: [...col] as [number, number, number],
        target: [...col] as [number, number, number],
        x: sn.x, y: sn.y, sz: c.sz, block: c.block,
        trail: [], started: false,
      };
    });

    const shootingStars: ShootingStar[] = Array.from({ length: mobile ? 2 : 4 }, () => ({
      x: 0, y: 0, angle: 0, speed: 0, len: 0,
      life: 0, maxLife: 0, active: false, brightness: 0,
    }));
    const shootRng = prng(123);
    let nextShoot = 2 + shootRng() * 4;

    const startTime = performance.now();
    let lastTime = startTime;
    let running = true;

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;
      const scrollY = window.scrollY;
      const isDark = themeRef.current === "dark";
      const A = isDark ? 1 : 0.85;

      ctx.fillStyle = isDark ? "#050508" : "#FDF5E2";
      ctx.fillRect(0, 0, w, h);

      /* Nebulae */
      for (const neb of NEBULAE) {
        const breathe = 1 + 0.15 * Math.sin(elapsed * 0.3 + neb.phase);
        const [nr, ng, nb] = DIM[neb.color];
        const alphaScale = isDark ? 1 : 0.6;
        const grad = ctx.createRadialGradient(
          neb.x * w, neb.y * h, 0,
          neb.x * w, neb.y * h, neb.rx * breathe
        );
        grad.addColorStop(0, `rgba(${nr},${ng},${nb},${neb.alpha * alphaScale})`);
        grad.addColorStop(0.5, `rgba(${nr},${ng},${nb},${neb.alpha * 0.4 * alphaScale})`);
        grad.addColorStop(1, `rgba(${nr},${ng},${nb},0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(neb.x * w, neb.y * h, neb.rx * breathe, neb.ry * breathe, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Stars */
      if (!prefersReduced) {
        const dimStars = mobile ? mobileStarsDim : STARS_DIM;
        const medStars = mobile ? mobileStarsMed : STARS_MED;
        const brtStars = mobile ? mobileStarsBright : STARS_BRIGHT;

        ctx.fillStyle = isDark ? "#a0a0b0" : "#c8b87a";
        for (const star of dimStars) {
          const twinkle = 0.6 + 0.4 * Math.sin(elapsed * star.speed + star.phase);
          ctx.globalAlpha = star.b * twinkle * A;
          ctx.beginPath();
          ctx.arc(star.x * w, star.y * h, star.s, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = isDark ? "#d4d4e0" : "#b5a060";
        for (const star of medStars) {
          const twinkle = 0.5 + 0.5 * Math.sin(elapsed * star.speed + star.phase);
          ctx.globalAlpha = star.b * twinkle * A;
          ctx.beginPath();
          ctx.arc(star.x * w, star.y * h, star.s, 0, Math.PI * 2);
          ctx.fill();
        }

        for (const star of brtStars) {
          const twinkle = 0.4 + 0.6 * Math.sin(elapsed * star.speed + star.phase);
          const sx = star.x * w, sy = star.y * h;
          ctx.globalAlpha = star.b * twinkle * A;
          ctx.fillStyle = isDark ? "#fff" : "#9a8540";
          ctx.beginPath();
          ctx.arc(sx, sy, star.s, 0, Math.PI * 2);
          ctx.fill();

          if (!mobile) {
            const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.s * 4);
            glow.addColorStop(0, `rgba(255,255,255,${0.08 * twinkle})`);
            glow.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(sx, sy, star.s * 4, 0, Math.PI * 2);
            ctx.fill();

            if (star.hasSparkle) {
              const sparkLen = star.s * 3 * twinkle;
              ctx.globalAlpha = star.b * twinkle * 0.4 * A;
              ctx.strokeStyle = isDark ? "#fff" : "#9a8540";
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(sx - sparkLen, sy); ctx.lineTo(sx + sparkLen, sy);
              ctx.moveTo(sx, sy - sparkLen); ctx.lineTo(sx, sy + sparkLen);
              ctx.stroke();
            }
          }
        }

        /* Shooting stars */
        nextShoot -= dt;
        if (nextShoot <= 0) {
          nextShoot = 3 + shootRng() * 6;
          const inactive = shootingStars.find(s => !s.active);
          if (inactive) {
            inactive.x = shootRng() * w;
            inactive.y = shootRng() * h * 0.6;
            inactive.angle = Math.PI * 0.15 + shootRng() * Math.PI * 0.3;
            inactive.speed = 300 + shootRng() * 500;
            inactive.len = 40 + shootRng() * 80;
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
          const alpha = fadeIn * fadeOut * ss.brightness;

          const tailX = ss.x - Math.cos(ss.angle) * ss.len;
          const tailY = ss.y - Math.sin(ss.angle) * ss.len;

          const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
          grad.addColorStop(0, `rgba(255,255,255,0)`);
          grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

          ctx.globalAlpha = A;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(ss.x, ss.y);
          ctx.stroke();

          ctx.globalAlpha = alpha * A;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* Links */
      const activeLinks = mobile ? mobileLinkFilter : NET.links;
      for (const link of activeLinks) {
        const a = NET.nodes[link.a], b = NET.nodes[link.b];
        const ay = a.y * h - scrollY, by = b.y * h - scrollY;
        if ((ay < -200 && by < -200) || (ay > h + 200 && by > h + 200)) continue;
        const [r, g, bl] = DIM[a.color];
        ctx.globalAlpha = (isDark ? 0.16 : 0.22) * A;
        ctx.strokeStyle = `rgb(${r},${g},${bl})`;
        ctx.lineWidth = isDark ? 0.8 : 1;
        ctx.beginPath(); ctx.moveTo(a.x * w, ay); ctx.lineTo(b.x * w, by); ctx.stroke();
      }

      /* Flowing dashes (desktop only) */
      if (!prefersReduced && !mobile) {
        ctx.setLineDash([3, 9]);
        ctx.lineDashOffset = -(elapsed * 15) % 20;
        for (const link of NET.links) {
          const a = NET.nodes[link.a], b = NET.nodes[link.b];
          const ay = a.y * h - scrollY, by = b.y * h - scrollY;
          if ((ay < -200 && by < -200) || (ay > h + 200 && by > h + 200)) continue;
          const [r, g, bl] = DIM[a.color];
          ctx.globalAlpha = (isDark ? 0.07 : 0.1) * A;
          ctx.strokeStyle = `rgb(${r},${g},${bl})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(a.x * w, ay); ctx.lineTo(b.x * w, by); ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      /* Triangulation zone (hero nodes 9-10-11) */
      const n9y = NET.nodes[9].y * h - scrollY;
      if (n9y > -200 && n9y < h + 200) {
        const n10y = NET.nodes[10].y * h - scrollY;
        const n11y = NET.nodes[11].y * h - scrollY;
        const pulse = 0.08 + 0.15 * (0.5 + 0.5 * Math.sin(elapsed * 2));
        ctx.globalAlpha = pulse * A;
        ctx.fillStyle = `rgba(0,255,198,${isDark ? 0.04 : 0.06})`;
        ctx.strokeStyle = `rgba(0,255,198,${isDark ? 0.35 : 0.4})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(NET.nodes[9].x * w, n9y);
        ctx.lineTo(NET.nodes[10].x * w, n10y);
        ctx.lineTo(NET.nodes[11].x * w, n11y);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);
      }

      /* Nodes */
      for (const node of NET.nodes) {
        if (mobile && !mobileNodeSet.has(node.id)) continue;
        const floatY = node.tier === 1 && !prefersReduced ? Math.sin(elapsed * 0.5 + node.id) * 3 : 0;
        const py = node.y * h - scrollY + floatY;
        if (py < -60 || py > h + 60) continue;
        const px = node.x * w;
        const nr = node.tier === 1 ? 10 : node.tier === 2 ? 7 : 4;
        const [r, g, b] = BRIGHT[node.color];
        const [dr, dg, db] = DIM[node.color];

        if (!mobile || node.tier <= 2) {
          const grad = ctx.createRadialGradient(px, py, 0, px, py, nr * 5);
          grad.addColorStop(0, `rgba(${r},${g},${b},${isDark ? 0.18 : 0.2})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.globalAlpha = A;
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(px, py, nr * 5, 0, Math.PI * 2); ctx.fill();
        }

        if (node.tier <= (mobile ? 1 : 2) && !prefersReduced) {
          const period = node.tier === 1 ? 2 : 3.5;
          const pingP = ((elapsed + node.id * 0.3) % period) / period;
          ctx.globalAlpha = (1 - pingP) * (node.tier === 1 ? 0.35 : 0.2) * A;
          ctx.strokeStyle = `rgb(${r},${g},${b})`;
          ctx.lineWidth = node.tier === 1 ? 1.5 : 0.8;
          ctx.beginPath(); ctx.arc(px, py, nr + pingP * nr * 4, 0, Math.PI * 2); ctx.stroke();
          if (node.tier === 1 && !mobile) {
            const pingP2 = ((elapsed + node.id * 0.3 + 1) % 2) / 2;
            ctx.globalAlpha = (1 - pingP2) * 0.2 * A;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(px, py, nr + pingP2 * nr * 4, 0, Math.PI * 2); ctx.stroke();
          }
        }

        if (!mobile) {
          ctx.globalAlpha = 0.3 * A;
          ctx.strokeStyle = `rgb(${dr},${dg},${db})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.arc(px, py, nr + 4, 0, Math.PI * 2); ctx.stroke();
        }

        ctx.globalAlpha = 0.9 * A;
        ctx.fillStyle = isDark ? "#050508" : "#FDF5E2";
        ctx.strokeStyle = `rgba(${r},${g},${b},0.8)`;
        ctx.lineWidth = node.tier === 1 ? 2 : 1;
        ctx.beginPath(); ctx.arc(px, py, nr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        ctx.globalAlpha = 0.9 * A;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath(); ctx.arc(px, py, nr * 0.45, 0, Math.PI * 2); ctx.fill();
      }

      /* Particles */
      if (!prefersReduced) {
        for (const p of particles) {
          const circuit = NET.circuits[p.ci];

          if (!p.started) {
            if (elapsed < circuit.delay) continue;
            p.started = true;
          }

          const segDur = circuit.dur / circuit.path.length;
          p.t += dt / segDur;
          while (p.t >= 1) { p.t -= 1; p.seg = (p.seg + 1) % circuit.path.length; }

          const fromN = NET.nodes[circuit.path[p.seg]];
          const toN = NET.nodes[circuit.path[(p.seg + 1) % circuit.path.length]];
          p.x = fromN.x + (toN.x - fromN.x) * p.t;
          p.y = fromN.y + (toN.y - fromN.y) * p.t;

          const screenY = p.y * h - scrollY;
          if (screenY < -80 || screenY > h + 80) continue;
          const screenX = p.x * w;

          for (const node of NET.nodes) {
            const ny = node.y * h - scrollY;
            if (Math.abs(ny - screenY) > PROXIMITY_PX * 2) continue;
            const dx = screenX - node.x * w, dy = screenY - ny;
            if (dx * dx + dy * dy < PROXIMITY_PX * PROXIMITY_PX) {
              p.target = [...BRIGHT[node.color]] as [number, number, number];
              break;
            }
          }

          for (let i = 0; i < 3; i++) p.color[i] += (p.target[i] - p.color[i]) * COLOR_LERP;

          const maxTrail = mobile ? 5 : TRAIL_LEN;
          p.trail.push({ x: screenX, y: screenY });
          if (p.trail.length > maxTrail) p.trail.shift();

          const [cr, cg, cb] = p.color;

          for (let i = 0; i < p.trail.length; i++) {
            ctx.globalAlpha = ((i + 1) / p.trail.length) * 0.4 * A;
            ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
            ctx.beginPath();
            ctx.arc(p.trail[i].x, p.trail[i].y, p.sz * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }

          if (!mobile) {
            ctx.globalAlpha = 0.12 * A;
            ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
            ctx.beginPath(); ctx.arc(screenX, screenY, p.sz * 5, 0, Math.PI * 2); ctx.fill();
          }
          ctx.globalAlpha = 0.25 * A;
          ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
          ctx.beginPath(); ctx.arc(screenX, screenY, p.sz * 3, 0, Math.PI * 2); ctx.fill();

          ctx.globalAlpha = 0.9 * A;
          if (p.block) {
            ctx.fillRect(screenX - p.sz, screenY - p.sz, p.sz * 2, p.sz * 2);
          } else {
            ctx.beginPath(); ctx.arc(screenX, screenY, p.sz, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
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
      style={{ zIndex: -10 }}
      aria-hidden="true"
    />
  );
}
