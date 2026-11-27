'use client';

/**
 * ChainField — the page's animated ground: a blockchain at work.
 *
 * Three lanes of blocks drift past at different depths, each block linked to
 * the next and stamped with a short hash. Transactions leave one block and
 * arc across to another, a ring marking where they land. Coins turn slowly
 * as they rise. Scrolling moves the lanes against each other, so the field
 * answers the page in both directions.
 *
 * Everything is generated: the hashes are random and stand for nothing. It
 * is drawn faintly in the theme's ink so the glass above has something to
 * refract and the text stays easy to read.
 *
 * Cost: one 2D canvas, device pixel ratio capped at 1.5, about 30 frames a
 * second, stopped while the tab is hidden. Under reduced motion one still
 * frame is drawn.
 */
import { useEffect, useRef, type ReactElement } from 'react';

const HEX = '0123456789abcdef';
const hash = (): string => {
  let s = '0x';
  for (let i = 0; i < 4; i++) s += HEX[(Math.random() * 16) | 0];
  s += '…';
  for (let i = 0; i < 3; i++) s += HEX[(Math.random() * 16) | 0];
  return s;
};

interface Block {
  x: number;
  hash: string;
  born: number;
}
interface Lane {
  y: number; // 0…1 of the height
  size: number;
  gap: number;
  speed: number; // px per second, sign is direction
  parallax: number;
  alpha: number;
  blocks: Block[];
}
interface Tx {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  t: number;
  dur: number;
  label: string | null;
}
interface Coin {
  x: number;
  y: number;
  r: number;
  spin: number;
  rate: number;
  rise: number;
}

export function ChainField(): ReactElement {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let scrollY = window.scrollY;

    const lanes: Lane[] = [
      { y: 0.2, size: 46, gap: 150, speed: 9, parallax: 0.05, alpha: 0.5, blocks: [] },
      { y: 0.53, size: 70, gap: 210, speed: -14, parallax: 0.11, alpha: 0.85, blocks: [] },
      { y: 0.84, size: 38, gap: 130, speed: 6, parallax: 0.03, alpha: 0.4, blocks: [] },
    ];
    const txs: Tx[] = [];
    const coins: Coin[] = [];

    const laneY = (l: Lane): number => {
      const span = h + l.size * 4;
      return ((((l.y * h - scrollY * l.parallax) % span) + span) % span) - l.size * 2;
    };

    const fill = (): void => {
      for (const l of lanes) {
        l.blocks = [];
        for (let x = -l.gap; x < w + l.gap * 2; x += l.gap) l.blocks.push({ x, hash: hash(), born: -10 });
      }
      coins.length = 0;
      const n = Math.max(4, Math.round(w / 260));
      for (let i = 0; i < n; i++) {
        coins.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 9 + Math.random() * 13,
          spin: Math.random() * 6.28,
          rate: 0.5 + Math.random() * 0.9,
          rise: 6 + Math.random() * 12,
        });
      }
    };

    const resize = (): void => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      fill();
    };

    const spawnTx = (): void => {
      const a = lanes[(Math.random() * lanes.length) | 0]!;
      let b = lanes[(Math.random() * lanes.length) | 0]!;
      if (b === a) b = lanes[(lanes.indexOf(a) + 1) % lanes.length]!;
      const pa = a.blocks[(Math.random() * a.blocks.length) | 0];
      const pb = b.blocks[(Math.random() * b.blocks.length) | 0];
      if (!pa || !pb) return;
      txs.push({
        ax: pa.x + a.size / 2,
        ay: laneY(a) + a.size / 2,
        bx: pb.x + b.size / 2,
        by: laneY(b) + b.size / 2,
        t: 0,
        dur: 2.6 + Math.random() * 2.4,
        label: Math.random() < 0.45 ? hash() : null,
      });
    };

    const rounded = (x: number, y: number, s: number, r: number): void => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + s, y, x + s, y + s, r);
      ctx.arcTo(x + s, y + s, x, y + s, r);
      ctx.arcTo(x, y + s, x, y, r);
      ctx.arcTo(x, y, x + s, y, r);
      ctx.closePath();
    };

    const draw = (now: number, dt: number): void => {
      const dark = document.documentElement.dataset.theme === 'dark';
      const ink = dark ? '255,255,255' : '0,0,0';
      const base = dark ? 0.16 : 0.13;
      const time = now / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.textBaseline = 'top';

      // Lanes of linked blocks.
      for (const l of lanes) {
        const y = laneY(l);
        const a = base * l.alpha;
        for (const b of l.blocks) b.x += l.speed * dt;
        // Recycle a block that left; the newcomer is the lane's fresh block.
        for (const b of l.blocks) {
          if (l.speed > 0 && b.x > w + l.gap) {
            b.x = Math.min(...l.blocks.map((o) => o.x)) - l.gap;
            b.hash = hash();
            b.born = time;
          } else if (l.speed < 0 && b.x < -l.gap * 2) {
            b.x = Math.max(...l.blocks.map((o) => o.x)) + l.gap;
            b.hash = hash();
            b.born = time;
          }
        }
        ctx.font = `${Math.max(9, l.size * 0.19)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        for (const b of l.blocks) {
          const age = time - b.born;
          const fresh = age < 2.2 ? 1 - age / 2.2 : 0;
          // Link to the next block.
          ctx.strokeStyle = `rgba(${ink},${a * 0.8})`;
          ctx.beginPath();
          ctx.moveTo(b.x + l.size, y + l.size / 2);
          ctx.lineTo(b.x + l.gap, y + l.size / 2);
          ctx.stroke();
          // The block: a rounded square, lit while it is new.
          rounded(b.x, y, l.size, l.size * 0.2);
          ctx.fillStyle = `rgba(${ink},${a * (0.16 + fresh * 0.5)})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${ink},${a * (1 + fresh)})`;
          ctx.stroke();
          // Rows inside it: the transactions it holds.
          ctx.strokeStyle = `rgba(${ink},${a * 0.75})`;
          for (let i = 0; i < 3; i++) {
            const ry = y + l.size * (0.3 + i * 0.2);
            ctx.beginPath();
            ctx.moveTo(b.x + l.size * 0.2, ry);
            ctx.lineTo(b.x + l.size * (0.8 - (i === 2 ? 0.25 : 0)), ry);
            ctx.stroke();
          }
          ctx.fillStyle = `rgba(${ink},${a * 1.5})`;
          ctx.fillText(b.hash, b.x, y + l.size + 7);
        }
      }

      // Transactions arcing from block to block.
      ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
      for (let i = txs.length - 1; i >= 0; i--) {
        const tx = txs[i]!;
        tx.t += dt / tx.dur;
        if (tx.t >= 1.25) {
          txs.splice(i, 1);
          continue;
        }
        const cx = (tx.ax + tx.bx) / 2;
        const cy = Math.min(tx.ay, tx.by) - 70;
        const at = (t: number): [number, number] => {
          const u = 1 - t;
          return [u * u * tx.ax + 2 * u * t * cx + t * t * tx.bx, u * u * tx.ay + 2 * u * t * cy + t * t * tx.by];
        };
        const head = Math.min(tx.t, 1);
        const e = head * head * (3 - 2 * head);
        // The trail.
        ctx.beginPath();
        for (let k = 0; k <= 14; k++) {
          const [x, y] = at(Math.max(0, e - 0.26) + (k / 14) * Math.min(e, 0.26));
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${ink},${base * 1.6 * (1 - Math.max(0, tx.t - 1) * 4)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.lineWidth = 1;
        const [hx, hy] = at(e);
        if (tx.t < 1) {
          ctx.fillStyle = `rgba(${ink},${base * 3.2})`;
          ctx.beginPath();
          ctx.arc(hx, hy, 2.4, 0, 6.283);
          ctx.fill();
          if (tx.label) {
            ctx.fillStyle = `rgba(${ink},${base * 1.9})`;
            ctx.fillText(tx.label, hx + 9, hy - 5);
          }
        } else {
          // Landed: a ring opens where it arrived.
          const p = (tx.t - 1) / 0.25;
          ctx.strokeStyle = `rgba(${ink},${base * 2.4 * (1 - p)})`;
          ctx.beginPath();
          ctx.arc(tx.bx, tx.by, 4 + p * 22, 0, 6.283);
          ctx.stroke();
        }
      }

      // Coins turning as they rise.
      for (const c of coins) {
        c.spin += c.rate * dt;
        c.y -= c.rise * dt;
        if (c.y < -40) {
          c.y = h + 40;
          c.x = Math.random() * w;
        }
        const y = ((((c.y - scrollY * 0.07) % (h + 80)) + (h + 80)) % (h + 80)) - 40;
        const rx = Math.max(0.6, Math.abs(Math.cos(c.spin)) * c.r);
        ctx.strokeStyle = `rgba(${ink},${base * 1.5})`;
        ctx.beginPath();
        ctx.ellipse(c.x, y, rx, c.r, 0, 0, 6.283);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(c.x, y, rx * 0.62, c.r * 0.62, 0, 0, 6.283);
        ctx.strokeStyle = `rgba(${ink},${base * 0.9})`;
        ctx.stroke();
      }
    };

    let sinceTx = 0;
    const frame = (now: number): void => {
      raf = 0;
      const dt = Math.min(0.06, (now - last) / 1000);
      if (now - last >= 30) {
        last = now;
        sinceTx += dt;
        if (sinceTx > 0.55 && txs.length < 9) {
          sinceTx = 0;
          spawnTx();
        }
        draw(now, dt);
      }
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };

    const still = (): void => {
      for (let i = 0; i < 5; i++) spawnTx();
      for (const tx of txs) tx.t = 0.3 + Math.random() * 0.5;
      draw(3000, 0);
    };

    const onScroll = (): void => {
      scrollY = window.scrollY;
      if (reduced) draw(3000, 0);
    };
    const onVisible = (): void => {
      if (!document.hidden && !reduced && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const onResize = (): void => {
      resize();
      if (reduced) still();
    };

    resize();
    if (reduced) still();
    else raf = requestAnimationFrame(frame);

    const mo = new MutationObserver(() => {
      if (reduced) draw(3000, 0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return <canvas ref={ref} />;
}
