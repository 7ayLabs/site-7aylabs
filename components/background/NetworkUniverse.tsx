"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

/* ─── Types ─── */
type NC = "teal" | "violet" | "cyan";
interface N { id: number; x: number; y: number; tier: 1 | 2 | 3; color: NC }
interface L { a: number; b: number }
interface Cir { path: number[]; dur: number; delay: number; sz: number; block: boolean }

/* ─── Colors ─── */
const BRIGHT: Record<NC, [number, number, number]> = {
  teal: [0, 255, 198], violet: [192, 132, 252], cyan: [34, 211, 238],
};
const DIM: Record<NC, [number, number, number]> = {
  teal: [23, 142, 119], violet: [139, 92, 246], cyan: [8, 145, 178],
};

/* ─── Deterministic PRNG (Park-Miller) ─── */
function prng(s: number) {
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

/* ─── Hero nodes (original 1200x800 viewBox → normalized) ─── */
const HR: [number, number, 1 | 2 | 3, NC][] = [
  [60, 80, 3, "teal"], [380, 100, 2, "teal"], [560, 60, 3, "cyan"], [740, 90, 2, "teal"],
  [920, 55, 3, "violet"], [1160, 210, 3, "violet"], [30, 260, 3, "cyan"], [180, 230, 3, "teal"],
  [1020, 250, 3, "teal"], [320, 320, 1, "teal"], [680, 290, 1, "teal"], [500, 490, 1, "teal"],
  [20, 430, 3, "violet"], [1180, 470, 3, "cyan"], [1050, 540, 3, "violet"], [900, 580, 2, "cyan"],
  [80, 660, 2, "teal"], [250, 720, 3, "cyan"], [620, 710, 2, "violet"], [800, 680, 3, "teal"],
  [1140, 600, 3, "teal"],
];

/* ─── Hero links ─── */
const HL: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 6], [0, 7], [4, 8], [5, 8],
  [6, 9], [7, 9], [1, 9], [8, 10], [3, 10], [2, 10], [12, 9], [6, 12],
  [13, 10], [5, 13], [9, 10], [9, 11], [10, 11], [9, 16], [11, 17], [11, 18],
  [10, 15], [10, 14], [11, 19], [12, 16], [14, 20], [15, 19], [13, 14],
  [16, 17], [17, 18], [18, 19], [19, 20], [15, 20],
];

/* ─── Hero circuits ─── */
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

/* ─── Build full-page network ─── */
function buildNetwork() {
  const r = prng(7);
  const colors: NC[] = ["teal", "violet", "cyan"];
  const nodes: N[] = HR.map((v, i) => ({ id: i, x: v[0] / 1200, y: v[1] / 800, tier: v[2], color: v[3] }));
  const links: L[] = HL.map(l => ({ a: l[0], b: l[1] }));
  let id = nodes.length;

  // Extended nodes across 14 bands below the hero (y ≈ 1.0 → 4.8 vh)
  for (let band = 0; band < 14; band++) {
    const baseY = 1.0 + band * 0.27;
    const count = 3 + Math.floor(r() * 3);
    for (let i = 0; i < count; i++) {
      nodes.push({
        id: id++,
        x: 0.06 + r() * 0.88,
        y: baseY + r() * 0.22,
        tier: (r() < 0.12 ? 1 : r() < 0.4 ? 2 : 3) as 1 | 2 | 3,
        color: colors[Math.floor(r() * 3)],
      });
    }
  }

  // Proximity-based links for extended nodes
  for (let i = 21; i < nodes.length; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = (nodes[i].y - nodes[j].y) * 0.5;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 0.22) dists.push({ j, d });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < Math.min(3, dists.length); k++) {
      if (!links.some(l => (l.a === i && l.b === dists[k].j) || (l.a === dists[k].j && l.b === i)))
        links.push({ a: i, b: dists[k].j });
    }
  }

  // Bridge hero bottom nodes to extended top nodes
  for (const bh of nodes.filter(n => n.id < 21 && n.y > 0.75)) {
    let best = -1, bestD = Infinity;
    for (const te of nodes.filter(n => n.id >= 21 && n.y < 1.4)) {
      const d = Math.hypot(bh.x - te.x, bh.y - te.y);
      if (d < bestD) { best = te.id; bestD = d; }
    }
    if (best >= 0 && bestD < 0.5) links.push({ a: bh.id, b: best });
  }

  // Adjacency map for circuit generation
  const adj = new Map<number, number[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const l of links) { adj.get(l.a)!.push(l.b); adj.get(l.b)!.push(l.a); }

  // Random-walk circuits for the extended network
  const circuits: Cir[] = [...HC];
  const cr = prng(42);
  for (let c = 0; c < 12; c++) {
    const start = 21 + Math.floor(cr() * (nodes.length - 21));
    const path = [start];
    let cur = start;
    const visited = new Set([start]);
    for (let step = 0; step < 4 + Math.floor(cr() * 5); step++) {
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
        path, dur: 4 + cr() * 8, delay: cr() * 6,
        sz: cr() < 0.3 ? 5 : cr() < 0.6 ? 4 : 3,
        block: cr() < 0.25,
      });
    }
  }

  return { nodes, links, circuits };
}

const NET = buildNetwork();

/* ─── Star field (fixed in viewport) ─── */
const STARS = (() => {
  const r = prng(99);
  return Array.from({ length: 300 }, () => ({
    x: r(), y: r(), s: 0.5 + r() * 2.0, b: 0.3 + r() * 0.7,
    phase: r() * Math.PI * 2, speed: 0.3 + r() * 1.5,
  }));
})();

/* ─── Particle state ─── */
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

/* ═══════════════════════════════════════════════════════════════════ */
/*  Component                                                         */
/* ═══════════════════════════════════════════════════════════════════ */

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
    let w = 0, h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const particles: Prt[] = NET.circuits.map((c, i) => {
      const sn = NET.nodes[c.path[0]];
      const col = [...BRIGHT[sn.color]] as [number, number, number];
      return {
        ci: i, seg: 0, t: 0,
        color: [...col] as [number, number, number],
        target: [...col] as [number, number, number],
        x: sn.x, y: sn.y, sz: c.sz, block: c.block,
        trail: [], started: false,
      };
    });

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
      const A = isDark ? 1 : 0.4; // global alpha multiplier

      // Draw solid background color (canvas IS the background)
      ctx.fillStyle = isDark ? "#050508" : "#f8f8fa";
      ctx.fillRect(0, 0, w, h);

      /* ── Stars (fixed in viewport, twinkling) ── */
      if (!prefersReduced) {
        for (const star of STARS) {
          const twinkle = 0.5 + 0.5 * Math.sin(elapsed * star.speed + star.phase);
          ctx.globalAlpha = star.b * twinkle * A;
          ctx.fillStyle = isDark ? "#fff" : "#999";
          ctx.beginPath();
          ctx.arc(star.x * w, star.y * h, star.s, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* ── Links (scroll-responsive) ── */
      for (const link of NET.links) {
        const a = NET.nodes[link.a], b = NET.nodes[link.b];
        const ay = a.y * h - scrollY, by = b.y * h - scrollY;
        if ((ay < -200 && by < -200) || (ay > h + 200 && by > h + 200)) continue;
        const [r, g, bl] = DIM[a.color];
        ctx.globalAlpha = (isDark ? 0.18 : 0.09) * A;
        ctx.strokeStyle = `rgb(${r},${g},${bl})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x * w, ay); ctx.lineTo(b.x * w, by); ctx.stroke();
      }

      /* ── Flowing dashes on links ── */
      if (!prefersReduced) {
        ctx.setLineDash([3, 9]);
        ctx.lineDashOffset = -(elapsed * 15) % 20;
        for (const link of NET.links) {
          const a = NET.nodes[link.a], b = NET.nodes[link.b];
          const ay = a.y * h - scrollY, by = b.y * h - scrollY;
          if ((ay < -200 && by < -200) || (ay > h + 200 && by > h + 200)) continue;
          const [r, g, bl] = DIM[a.color];
          ctx.globalAlpha = (isDark ? 0.08 : 0.04) * A;
          ctx.strokeStyle = `rgb(${r},${g},${bl})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(a.x * w, ay); ctx.lineTo(b.x * w, by); ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      /* ── Core triangulation zone (hero nodes 9-10-11) ── */
      const n9y = NET.nodes[9].y * h - scrollY;
      if (n9y > -200 && n9y < h + 200) {
        const n10y = NET.nodes[10].y * h - scrollY;
        const n11y = NET.nodes[11].y * h - scrollY;
        const pulse = 0.08 + 0.15 * (0.5 + 0.5 * Math.sin(elapsed * 2));
        ctx.globalAlpha = pulse * A;
        ctx.fillStyle = `rgba(0,255,198,${isDark ? 0.04 : 0.02})`;
        ctx.strokeStyle = `rgba(0,255,198,${isDark ? 0.35 : 0.18})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(NET.nodes[9].x * w, n9y);
        ctx.lineTo(NET.nodes[10].x * w, n10y);
        ctx.lineTo(NET.nodes[11].x * w, n11y);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);
      }

      /* ── Nodes ── */
      for (const node of NET.nodes) {
        const floatY = node.tier === 1 && !prefersReduced ? Math.sin(elapsed * 0.5 + node.id) * 3 : 0;
        const py = node.y * h - scrollY + floatY;
        if (py < -60 || py > h + 60) continue;
        const px = node.x * w;
        const nr = node.tier === 1 ? 10 : node.tier === 2 ? 7 : 4;
        const [r, g, b] = BRIGHT[node.color];
        const [dr, dg, db] = DIM[node.color];

        // Radial glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, nr * 5);
        grad.addColorStop(0, `rgba(${r},${g},${b},${isDark ? 0.18 : 0.08})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.globalAlpha = A;
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(px, py, nr * 5, 0, Math.PI * 2); ctx.fill();

        // Ping ripple (tier 1-2 only)
        if (node.tier <= 2 && !prefersReduced) {
          const period = node.tier === 1 ? 2 : 3.5;
          const pingP = ((elapsed + node.id * 0.3) % period) / period;
          ctx.globalAlpha = (1 - pingP) * (node.tier === 1 ? 0.35 : 0.2) * A;
          ctx.strokeStyle = `rgb(${r},${g},${b})`;
          ctx.lineWidth = node.tier === 1 ? 1.5 : 0.8;
          ctx.beginPath(); ctx.arc(px, py, nr + pingP * nr * 4, 0, Math.PI * 2); ctx.stroke();
          // Second ring for tier 1
          if (node.tier === 1) {
            const pingP2 = ((elapsed + node.id * 0.3 + 1) % 2) / 2;
            ctx.globalAlpha = (1 - pingP2) * 0.2 * A;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(px, py, nr + pingP2 * nr * 4, 0, Math.PI * 2); ctx.stroke();
          }
        }

        // Outer ring
        ctx.globalAlpha = 0.3 * A;
        ctx.strokeStyle = `rgb(${dr},${dg},${db})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(px, py, nr + 4, 0, Math.PI * 2); ctx.stroke();

        // Node body
        ctx.globalAlpha = 0.9 * A;
        ctx.fillStyle = isDark ? "#050508" : "#f8f8fa";
        ctx.strokeStyle = `rgba(${r},${g},${b},0.8)`;
        ctx.lineWidth = node.tier === 1 ? 2 : 1;
        ctx.beginPath(); ctx.arc(px, py, nr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Inner core
        ctx.globalAlpha = 0.9 * A;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath(); ctx.arc(px, py, nr * 0.45, 0, Math.PI * 2); ctx.fill();
      }

      /* ── Particles (animated along circuits, color-change on node proximity) ── */
      if (!prefersReduced) {
        for (const p of particles) {
          const circuit = NET.circuits[p.ci];

          // Respect delay
          if (!p.started) {
            if (elapsed < circuit.delay) continue;
            p.started = true;
          }

          // Advance along circuit
          const segDur = circuit.dur / circuit.path.length;
          p.t += dt / segDur;
          while (p.t >= 1) { p.t -= 1; p.seg = (p.seg + 1) % circuit.path.length; }

          // Interpolate world position
          const fromN = NET.nodes[circuit.path[p.seg]];
          const toN = NET.nodes[circuit.path[(p.seg + 1) % circuit.path.length]];
          p.x = fromN.x + (toN.x - fromN.x) * p.t;
          p.y = fromN.y + (toN.y - fromN.y) * p.t;

          const screenY = p.y * h - scrollY;
          if (screenY < -80 || screenY > h + 80) continue;
          const screenX = p.x * w;

          // ── Color change on node proximity ──
          for (const node of NET.nodes) {
            const ny = node.y * h - scrollY;
            if (Math.abs(ny - screenY) > PROXIMITY_PX * 2) continue;
            const dx = screenX - node.x * w, dy = screenY - ny;
            if (dx * dx + dy * dy < PROXIMITY_PX * PROXIMITY_PX) {
              p.target = [...BRIGHT[node.color]] as [number, number, number];
              break;
            }
          }

          // Lerp current color toward target
          for (let i = 0; i < 3; i++) p.color[i] += (p.target[i] - p.color[i]) * COLOR_LERP;

          // Trail
          p.trail.push({ x: screenX, y: screenY });
          if (p.trail.length > TRAIL_LEN) p.trail.shift();

          const [cr, cg, cb] = p.color;

          // Draw trail
          for (let i = 0; i < p.trail.length; i++) {
            ctx.globalAlpha = ((i + 1) / p.trail.length) * 0.4 * A;
            ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
            ctx.beginPath();
            ctx.arc(p.trail[i].x, p.trail[i].y, p.sz * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }

          // Outer glow
          ctx.globalAlpha = 0.12 * A;
          ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
          ctx.beginPath(); ctx.arc(screenX, screenY, p.sz * 5, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 0.25 * A;
          ctx.beginPath(); ctx.arc(screenX, screenY, p.sz * 3, 0, Math.PI * 2); ctx.fill();

          // Core shape
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
