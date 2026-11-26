/**
 * Glass renderer — the landing's 3D glass objects, from ONE WebGL context.
 *
 * Every <GlassIcon> owns a plain 2D canvas. This module keeps a single
 * offscreen WebGL canvas, raymarches each visible icon's shape into it in
 * turn and copies the frame across with drawImage. One context for the whole
 * page, so a dozen icons never hit the browser's context limit, and icons
 * that are offscreen cost nothing.
 *
 * The look is clear glass in a dark studio: the shape is a signed distance
 * field; a ray refracts in, marches through the body, and refracts out at
 * three slightly different indices (red, green, blue) so edges split the
 * light the way thick glass does. Reflection is mixed in by Fresnel. No
 * colour is added — what reads as colour at the edges is dispersion of a
 * white studio.
 */

export type GlassShape =
  | 'orb'
  | 'trace'
  | 'candles'
  | 'key'
  | 'ping'
  | 'stack'
  | 'shield'
  | 'lens'
  | 'drop'
  | 'arrow'
  | 'blocks'
  | 'pnl';

const SHAPE_ID: Record<GlassShape, number> = {
  orb: 0,
  trace: 1,
  candles: 2,
  key: 3,
  ping: 4,
  stack: 5,
  shield: 6,
  lens: 7,
  drop: 8,
  arrow: 9,
  blocks: 10,
  pnl: 11,
};

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uShape;
uniform vec2 uTilt;
uniform float uDark;

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c); }

float sdSphere(vec3 p, float r) { return length(p) - r; }
float sdTorus(vec3 p, vec2 t) { vec2 q = vec2(length(p.xz) - t.x, p.y); return length(q) - t.y; }
float sdRBox(vec3 p, vec3 b, float r) { vec3 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r; }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
float sdRoundCyl(vec3 p, float r, float h, float rr) {
  vec2 d = vec2(length(p.xz) - r + rr, abs(p.y) - h + rr);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - rr;
}
float sdRoundCone(vec3 p, float r1, float r2, float h) {
  float b = (r1 - r2) / h;
  float a = sqrt(1.0 - b * b);
  vec2 q = vec2(length(p.xz), p.y);
  float k = dot(q, vec2(-b, a));
  if (k < 0.0) return length(q) - r1;
  if (k > a * h) return length(q - vec2(0.0, h)) - r2;
  return dot(q, vec2(a, b)) - r1;
}
float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }

float map(vec3 p) {
  if (uShape < 0.5) {
    // Orb with a tilted ring: the ChronoVisor eye.
    vec3 q = p;
    float c = cos(0.55), s = sin(0.55);
    q.yz = vec2(c * q.y - s * q.z, s * q.y + c * q.z);
    return min(sdSphere(p, 0.42), sdTorus(q, vec2(0.7, 0.065)));
  } else if (uShape < 1.5) {
    // Three wallets joined by flows: on-chain intel.
    vec3 a = vec3(-0.52, -0.3, 0.0), b = vec3(0.46, -0.18, 0.12), c = vec3(0.02, 0.5, -0.06);
    float d = min(min(sdSphere(p - a, 0.2), sdSphere(p - b, 0.25)), sdSphere(p - c, 0.17));
    d = smin(d, sdCapsule(p, a, b, 0.055), 0.08);
    d = smin(d, sdCapsule(p, b, c, 0.055), 0.08);
    d = smin(d, sdCapsule(p, a, c, 0.055), 0.08);
    return d;
  } else if (uShape < 2.5) {
    // Three candles with wicks: markets.
    float d = sdRBox(p - vec3(-0.42, -0.12, 0.0), vec3(0.12, 0.28, 0.12), 0.05);
    d = min(d, sdRBox(p - vec3(0.0, 0.1, 0.0), vec3(0.12, 0.42, 0.12), 0.05));
    d = min(d, sdRBox(p - vec3(0.42, -0.02, 0.0), vec3(0.12, 0.22, 0.12), 0.05));
    d = min(d, sdCapsule(p, vec3(-0.42, -0.58, 0.0), vec3(-0.42, 0.34, 0.0), 0.028));
    d = min(d, sdCapsule(p, vec3(0.0, -0.5, 0.0), vec3(0.0, 0.72, 0.0), 0.028));
    d = min(d, sdCapsule(p, vec3(0.42, -0.42, 0.0), vec3(0.42, 0.38, 0.0), 0.028));
    return d;
  } else if (uShape < 3.5) {
    // A key: execution with a key that can only trade.
    vec3 q = p - vec3(-0.38, 0.0, 0.0);
    q = vec3(q.x, q.z, -q.y);
    float d = sdTorus(q, vec2(0.25, 0.085));
    d = smin(d, sdRBox(p - vec3(0.24, 0.0, 0.0), vec3(0.4, 0.065, 0.065), 0.03), 0.05);
    d = min(d, sdRBox(p - vec3(0.54, -0.13, 0.0), vec3(0.055, 0.11, 0.065), 0.02));
    d = min(d, sdRBox(p - vec3(0.34, -0.11, 0.0), vec3(0.045, 0.085, 0.065), 0.02));
    return d;
  }
  if (uShape > 4.5 && uShape < 5.5) {
    // Three stacked discs: a record, kept.
    float d = sdRoundCyl(p - vec3(0.0, -0.32, 0.0), 0.55, 0.075, 0.05);
    d = min(d, sdRoundCyl(p, 0.55, 0.075, 0.05));
    d = min(d, sdRoundCyl(p - vec3(0.0, 0.32, 0.0), 0.55, 0.075, 0.05));
    return d;
  }
  if (uShape > 5.5 && uShape < 6.5) {
    // A shield: hack watch.
    float d = sdRBox(p - vec3(0.0, 0.18, 0.0), vec3(0.46, 0.34, 0.09), 0.08);
    vec3 q = p - vec3(0.0, -0.18, 0.0);
    float c = cos(0.785), s = sin(0.785);
    q.xy = vec2(c * q.x - s * q.y, s * q.x + c * q.y);
    d = smin(d, sdRBox(q, vec3(0.33, 0.33, 0.09), 0.08), 0.06);
    return d;
  }
  if (uShape > 6.5 && uShape < 7.5) {
    // A magnifier: forensics.
    vec3 q = p - vec3(-0.12, 0.14, 0.0);
    q = vec3(q.x, q.z, -q.y);
    float d = sdTorus(q, vec2(0.36, 0.075));
    d = smin(d, sdCapsule(p, vec3(0.16, -0.14, 0.0), vec3(0.52, -0.5, 0.0), 0.075), 0.06);
    return d;
  }
  if (uShape > 7.5 && uShape < 8.5) {
    // A drop: size moving, whale flow.
    return sdRoundCone(p - vec3(0.0, -0.28, 0.0), 0.42, 0.05, 0.78);
  }
  if (uShape > 8.5 && uShape < 9.5) {
    // A rising arrow: smart money.
    vec3 tip = vec3(0.42, 0.42, 0.0);
    float d = sdCapsule(p, vec3(-0.5, -0.46, 0.0), tip, 0.075);
    d = smin(d, sdCapsule(p, tip, vec3(0.06, 0.44, 0.0), 0.075), 0.05);
    d = smin(d, sdCapsule(p, tip, vec3(0.44, 0.06, 0.0), 0.075), 0.05);
    return d;
  }
  if (uShape > 9.5 && uShape < 10.5) {
    // Blocks that fit together: skills.
    float d = sdRBox(p - vec3(-0.26, -0.24, 0.0), vec3(0.22), 0.07);
    d = min(d, sdRBox(p - vec3(0.26, -0.24, 0.0), vec3(0.22), 0.07));
    d = min(d, sdRBox(p - vec3(0.0, 0.24, 0.0), vec3(0.22), 0.07));
    return d;
  }
  if (uShape > 10.5 && uShape < 11.5) {
    // A P&L line climbing, with a dip on the way and a bead on today: track record.
    vec3 a = vec3(-0.62, -0.38, 0.0), b = vec3(-0.3, -0.02, 0.04), c = vec3(-0.02, -0.18, -0.02);
    vec3 e = vec3(0.3, 0.2, 0.03), g = vec3(0.6, 0.5, 0.0);
    float d = sdCapsule(p, a, b, 0.06);
    d = smin(d, sdCapsule(p, b, c, 0.06), 0.05);
    d = smin(d, sdCapsule(p, c, e, 0.06), 0.05);
    d = smin(d, sdCapsule(p, e, g, 0.06), 0.05);
    d = smin(d, sdSphere(p - g, 0.13), 0.06);
    // The baseline the curve is read against.
    d = min(d, sdCapsule(p, vec3(-0.66, -0.62, 0.0), vec3(0.66, -0.62, 0.0), 0.026));
    return d;
  }
  // Signal rings around a point: alerts.
  vec3 q = vec3(p.x, p.z, -p.y);
  float d = sdSphere(p, 0.17);
  d = min(d, sdTorus(q, vec2(0.4, 0.05)));
  d = min(d, sdTorus(q, vec2(0.66, 0.042)));
  return d;
}

mat3 R;
float f(vec3 p) { return map(R * p); }
vec3 nrm(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(f(p + e.xyy) - f(p - e.xyy), f(p + e.yxy) - f(p - e.yxy), f(p + e.yyx) - f(p - e.yyx)));
}

vec3 env(vec3 d) {
  float g = 0.5 + 0.5 * d.y;
  vec3 c = uDark > 0.5 ? mix(vec3(0.05), vec3(0.26), g) : mix(vec3(0.6), vec3(0.95), g);
  c += vec3(1.0) * smoothstep(0.82, 0.97, dot(d, normalize(vec3(-0.6, 0.72, 0.4)))) * 2.4;
  c += vec3(1.0) * smoothstep(0.88, 0.99, dot(d, normalize(vec3(0.75, 0.15, 0.6)))) * 1.6;
  c += vec3(1.0) * smoothstep(0.9, 0.99, dot(d, normalize(vec3(0.1, -0.5, 0.85)))) * 0.9;
  c += vec3(1.0) * exp(-pow((d.y + 0.05) * 12.0, 2.0)) * 0.3 * (0.6 + 0.4 * d.x);
  return c;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  // Every shape fits a sphere of radius ~0.8; from z = 3.2 this lens frames
  // a half-height of ~1.03, so no rotation or tilt can push an edge out.
  vec3 ro = vec3(0.0, 0.0, 3.2);
  vec3 rd = normalize(vec3(uv, -1.55));
  R = rotY(uTime * 0.45 + uTilt.x) * rotX(0.22 + uTilt.y);

  float t = 0.0;
  bool hit = false;
  vec3 p = ro;
  for (int i = 0; i < 80; i++) {
    p = ro + rd * t;
    float d = f(p);
    if (d < 0.001) { hit = true; break; }
    t += d;
    if (t > 6.0) break;
  }
  if (!hit) { gl_FragColor = vec4(0.0); return; }

  vec3 n = nrm(p);
  float cosi = max(dot(-rd, n), 0.0);
  float fres = 0.04 + 0.96 * pow(1.0 - cosi, 5.0);

  // Into the body, through it, and out.
  vec3 rdi = refract(rd, n, 1.0 / 1.46);
  float ti = 0.02;
  vec3 pi = p;
  for (int j = 0; j < 40; j++) {
    pi = p + rdi * ti;
    float d = -f(pi);
    if (d < 0.001) break;
    ti += max(d, 0.008);
  }
  vec3 n2 = -nrm(pi);
  vec3 col;
  vec3 oR = refract(rdi, n2, 1.43); if (dot(oR, oR) < 0.01) oR = reflect(rdi, n2);
  vec3 oG = refract(rdi, n2, 1.46); if (dot(oG, oG) < 0.01) oG = reflect(rdi, n2);
  vec3 oB = refract(rdi, n2, 1.50); if (dot(oB, oB) < 0.01) oB = reflect(rdi, n2);
  col = vec3(env(oR).r, env(oG).g, env(oB).b);
  col *= exp(-ti * vec3(0.08, 0.06, 0.05));

  col = mix(col, env(reflect(rd, n)), fres);
  col += pow(1.0 - cosi, 3.0) * (uDark > 0.5 ? 0.38 : 0.16);

  gl_FragColor = vec4(col, 1.0);
}
`;

interface Entry {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  shape: number;
  visible: boolean;
  tilt: { x: number; y: number; tx: number; ty: number };
  drawn: boolean;
  onFirstFrame?: () => void;
}

interface Gl {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;
  u: Record<'uRes' | 'uTime' | 'uShape' | 'uTilt' | 'uDark', WebGLUniformLocation | null>;
}

const entries = new Set<Entry>();
let glState: Gl | null | undefined;
let raf = 0;
let last = 0;
const start = typeof performance !== 'undefined' ? performance.now() : 0;
const FRAME_MS = 1000 / 30;

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initGl(): Gl | null {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      if (process.env.NODE_ENV !== 'production') console.warn('[glass]', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT);
  const fs = sh(gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return {
    gl,
    canvas,
    u: {
      uRes: gl.getUniformLocation(prog, 'uRes'),
      uTime: gl.getUniformLocation(prog, 'uTime'),
      uShape: gl.getUniformLocation(prog, 'uShape'),
      uTilt: gl.getUniformLocation(prog, 'uTilt'),
      uDark: gl.getUniformLocation(prog, 'uDark'),
    },
  };
}

function drawEntry(g: Gl, e: Entry, time: number) {
  const { gl, canvas, u } = g;
  const w = e.canvas.width;
  const h = e.canvas.height;
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  gl.viewport(0, 0, w, h);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  e.tilt.x += (e.tilt.tx - e.tilt.x) * 0.08;
  e.tilt.y += (e.tilt.ty - e.tilt.y) * 0.08;
  gl.uniform2f(u.uRes, w, h);
  gl.uniform1f(u.uTime, time);
  gl.uniform1f(u.uShape, e.shape);
  gl.uniform2f(u.uTilt, e.tilt.x, e.tilt.y);
  gl.uniform1f(u.uDark, document.documentElement.getAttribute('data-theme') === 'dark' ? 1 : 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  e.ctx.clearRect(0, 0, w, h);
  e.ctx.drawImage(canvas, 0, 0);
  if (!e.drawn) {
    e.drawn = true;
    e.onFirstFrame?.();
  }
}

function loop(now: number) {
  raf = 0;
  const g = glState;
  if (!g) return;
  const still = reducedMotion();
  let anyVisible = false;
  if (now - last >= FRAME_MS) {
    last = now;
    const time = still ? 0.6 : (now - start) / 1000;
    for (const e of entries) {
      if (!e.visible) continue;
      if (still && e.drawn) continue;
      drawEntry(g, e, time);
    }
  }
  for (const e of entries) if (e.visible && !(still && e.drawn)) anyVisible = true;
  if (anyVisible) raf = requestAnimationFrame(loop);
}

function kick() {
  if (!raf && !document.hidden) raf = requestAnimationFrame(loop);
}

let pointerBound = false;
function bindPointer() {
  if (pointerBound) return;
  pointerBound = true;
  window.addEventListener(
    'pointermove',
    (ev) => {
      for (const e of entries) {
        if (!e.visible) continue;
        const r = e.canvas.getBoundingClientRect();
        const nx = (ev.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const ny = (ev.clientY - (r.top + r.height / 2)) / window.innerHeight;
        e.tilt.tx = Math.max(-0.6, Math.min(0.6, nx * 1.4));
        e.tilt.ty = Math.max(-0.4, Math.min(0.4, ny * 0.9));
      }
    },
    { passive: true },
  );
  document.addEventListener('visibilitychange', kick);
}

/** Registers a canvas; returns the cleanup. Null when WebGL is unavailable. */
export function registerGlass(
  canvas: HTMLCanvasElement,
  shape: GlassShape,
  onFirstFrame: () => void,
): (() => void) | null {
  if (glState === undefined) glState = initGl();
  if (!glState) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const entry: Entry = {
    canvas,
    ctx,
    shape: SHAPE_ID[shape],
    visible: false,
    tilt: { x: 0, y: 0, tx: 0, ty: 0 },
    drawn: false,
    onFirstFrame,
  };
  entries.add(entry);
  bindPointer();
  const io = new IntersectionObserver(([en]) => {
    entry.visible = en?.isIntersecting ?? false;
    if (entry.visible) kick();
  });
  io.observe(canvas);
  return () => {
    io.disconnect();
    entries.delete(entry);
  };
}
