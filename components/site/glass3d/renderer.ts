/**
 * The lab's 3D glass renderer.
 *
 * Every glass object on the site is drawn by ONE WebGL context on a hidden
 * canvas: each visible icon is rendered there in turn and copied onto its own
 * 2D canvas. Browsers cap the number of live WebGL contexts, so a context per
 * icon would start dropping them on a page with ten.
 *
 * The objects are signed-distance shapes, ray-marched in a fragment shader
 * and shaded as clear liquid glass: see-through at the centre, bright at the
 * rim, with a studio light reflected across the surface and a slight split of
 * colour at the edges. They turn slowly. Nothing is loaded: no models, no
 * textures.
 *
 * Cost: 30 frames a second at most, only for icons on screen, paused when
 * the tab is hidden; one still frame under reduced motion.
 */
export type GlassShape = 'apps' | 'software' | 'intelligence' | 'onchain' | 'ground' | 'lab';

const SHAPE_ID: Record<GlassShape, number> = { apps: 0, software: 1, intelligence: 2, onchain: 3, ground: 4, lab: 5 };

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform float uShape;
uniform float uDark;

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float sdBox(vec3 p,vec3 b,float r){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
float sdTorus(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}
float sdCyl(vec3 p,float r,float h,float e){vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h);return min(max(d.x,d.y),0.)+length(max(d,0.))-e;}

float map(vec3 p){
  float t=uT;
  p.xz*=rot(t*.45);
  p.xy*=rot(.28+.12*sin(t*.5));
  if(uShape<.5){
    // Apps: two rounded panes, one in front of the other.
    float a=sdBox(p-vec3(-.12,.1,-.16),vec3(.52,.4,.035),.07);
    float b=sdBox(p-vec3(.14,-.12,.16),vec3(.52,.4,.035),.07);
    return min(a,b);
  }
  if(uShape<1.5){
    // Software: a core block inside a ring that tumbles around it.
    float core=sdBox(p,vec3(.3),.09);
    vec3 q=p;q.xy*=rot(t*.7);q.yz*=rot(1.1);
    return min(core,sdTorus(q,vec2(.74,.065)));
  }
  if(uShape<2.5){
    // Intelligence: drops of glass that merge and part.
    float d=length(p)-.36;
    for(int i=0;i<4;i++){
      float f=float(i);
      vec3 o=.52*vec3(sin(t*.8+f*1.7),cos(t*.6+f*2.3),sin(t*.7+f*3.1));
      d=smin(d,length(p-o)-.2,.3);
    }
    return d;
  }
  if(uShape<3.5){
    // On-chain: two links, one through the other.
    vec3 a=p-vec3(-.27,0.,0.);
    vec3 b=p-vec3(.27,0.,0.);b.yz*=rot(1.5708);
    a.xy*=rot(1.5708);b.xy*=rot(1.5708);
    return min(sdTorus(a,vec2(.42,.11)),sdTorus(b,vec2(.42,.11)));
  }
  if(uShape<4.5){
    // Ground: three slabs stacked, breathing apart.
    float g=.07*sin(t*.9);
    float d=sdCyl(p-vec3(0.,.36+g,0.),.62,.07,.05);
    d=min(d,sdCyl(p,.62,.07,.05));
    return min(d,sdCyl(p-vec3(0.,-.36-g,0.),.62,.07,.05));
  }
  // Lab: one large drop with a smaller one circling into it.
  float d=length(p*vec3(1.,.92,1.))-.6;
  vec3 o=vec3(.78*cos(t*.9),.3*sin(t*1.3),.78*sin(t*.9));
  d=smin(d,length(p-o)-.24,.42);
  vec3 o2=vec3(-.6*cos(t*.6),-.5*sin(t*.8),.5*sin(t*.6));
  return smin(d,length(p-o2)-.15,.36);
}

vec3 normal(vec3 p){
  vec2 e=vec2(.0015,0.);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));
}

// A soft studio: a bright strip overhead, a cool fill below.
vec3 env(vec3 d){
  float strip=smoothstep(.55,.95,d.y)*smoothstep(.9,.2,abs(d.x));
  float side=smoothstep(.75,1.,d.x)*.5;
  vec3 sky=mix(vec3(.02,.05,.16),vec3(.25,.5,1.),smoothstep(-.6,.9,d.y));
  return sky*mix(.9,1.2,uDark)+vec3(1.)*strip*1.7+vec3(.6,.8,1.)*side;
}

void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);
  vec3 ro=vec3(0.,0.,3.1);
  vec3 rd=normalize(vec3(uv,-1.75));
  float t=0.;float hit=0.;
  for(int i=0;i<56;i++){
    float d=map(ro+rd*t);
    if(d<.0016){hit=1.;break;}
    t+=d*.9;
    if(t>6.)break;
  }
  if(hit<.5){gl_FragColor=vec4(0.);return;}
  vec3 p=ro+rd*t;
  vec3 n=normal(p);
  float fres=pow(1.-max(dot(n,-rd),0.),2.6);
  vec3 r=reflect(rd,n);
  // The edges split into colour a little, as thick glass does.
  vec3 refl=vec3(env(r+vec3(.035,0.,0.)).r,env(r).g,env(r-vec3(.035,0.,0.)).b);
  // What shows through the body: the light behind, bent by the surface.
  vec3 through=env(refract(rd,n,.74))*vec3(.55,.75,1.);
  vec3 tint=mix(vec3(.16,.38,.95),vec3(.5,.74,1.),uDark);
  vec3 col=mix(through*tint,refl,fres*.85+.08);
  vec3 l=normalize(vec3(.5,.85,.6));
  col+=pow(max(dot(r,l),0.),70.)*1.25;
  col+=pow(max(dot(n,l),0.),2.)*tint*.22;
  // A rim of light blue, stronger on the dark ground where glass would vanish.
  col+=fres*vec3(.3,.58,1.)*mix(.25,.95,uDark);
  float a=clamp(mix(.32,.46,uDark)+fres*.8+pow(max(dot(r,l),0.),30.),0.,1.);
  gl_FragColor=vec4(col*a,a);
}`;

interface Target {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  shape: GlassShape;
  visible: boolean;
  drawn: boolean;
  onFirstFrame?: () => void;
}

let gl: WebGLRenderingContext | null = null;
let glCanvas: HTMLCanvasElement | null = null;
let uniforms: Record<'uRes' | 'uT' | 'uShape' | 'uDark', WebGLUniformLocation | null> | null = null;
let failed = false;
const targets = new Set<Target>();
let raf = 0;
let lastFrame = 0;
let io: IntersectionObserver | null = null;
const byCanvas = new WeakMap<Element, Target>();

function init(): boolean {
  if (gl) return true;
  if (failed) return false;
  glCanvas = document.createElement('canvas');
  const ctx = glCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true });
  if (!ctx) {
    failed = true;
    return false;
  }
  const compile = (type: number, src: string) => {
    const s = ctx.createShader(type);
    if (!s) return null;
    ctx.shaderSource(s, src);
    ctx.compileShader(s);
    return ctx.getShaderParameter(s, ctx.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(ctx.VERTEX_SHADER, VERT);
  const fs = compile(ctx.FRAGMENT_SHADER, FRAG);
  const prog = ctx.createProgram();
  if (!vs || !fs || !prog) {
    failed = true;
    return false;
  }
  ctx.attachShader(prog, vs);
  ctx.attachShader(prog, fs);
  ctx.linkProgram(prog);
  if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) {
    failed = true;
    return false;
  }
  ctx.useProgram(prog);
  const buf = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), ctx.STATIC_DRAW);
  const loc = ctx.getAttribLocation(prog, 'p');
  ctx.enableVertexAttribArray(loc);
  ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);
  uniforms = {
    uRes: ctx.getUniformLocation(prog, 'uRes'),
    uT: ctx.getUniformLocation(prog, 'uT'),
    uShape: ctx.getUniformLocation(prog, 'uShape'),
    uDark: ctx.getUniformLocation(prog, 'uDark'),
  };
  gl = ctx;
  return true;
}

function drawOne(t: Target, time: number): void {
  if (!gl || !glCanvas || !uniforms) return;
  const w = t.canvas.width;
  const h = t.canvas.height;
  if (w === 0 || h === 0) return;
  if (glCanvas.width !== w || glCanvas.height !== h) {
    glCanvas.width = w;
    glCanvas.height = h;
  }
  gl.viewport(0, 0, w, h);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(uniforms.uRes, w, h);
  // Each shape runs on its own offset so a row of icons is never in step.
  gl.uniform1f(uniforms.uT, time + SHAPE_ID[t.shape] * 1.7);
  gl.uniform1f(uniforms.uShape, SHAPE_ID[t.shape]);
  gl.uniform1f(uniforms.uDark, document.documentElement.dataset.theme === 'dark' ? 1 : 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  t.ctx.clearRect(0, 0, w, h);
  t.ctx.drawImage(glCanvas, 0, 0);
  if (!t.drawn) {
    t.drawn = true;
    t.onFirstFrame?.();
  }
}

function loop(now: number): void {
  raf = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (now - lastFrame >= 32 || reduced) {
    lastFrame = now;
    for (const t of targets) {
      if (!t.visible) continue;
      if (reduced && t.drawn) continue;
      drawOne(t, reduced ? 2.4 : now / 1000);
    }
  }
  schedule();
}

function schedule(): void {
  if (raf || document.hidden) return;
  let any = false;
  for (const t of targets) {
    if (t.visible) {
      any = true;
      break;
    }
  }
  if (any) raf = requestAnimationFrame(loop);
}

/** Start drawing `shape` on `canvas`. Returns the function that stops it. */
export function registerGlass(canvas: HTMLCanvasElement, shape: GlassShape, onFirstFrame?: () => void): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx || !init()) return () => {};
  const target: Target = { canvas, ctx, shape, visible: false, drawn: false, onFirstFrame };
  targets.add(target);
  byCanvas.set(canvas, target);
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const t = byCanvas.get(e.target);
          if (t) t.visible = e.isIntersecting;
        }
        schedule();
      },
      { rootMargin: '120px' },
    );
    document.addEventListener('visibilitychange', schedule);
    // A theme flip must redraw the still frames shown under reduced motion.
    new MutationObserver(() => {
      for (const t of targets) t.drawn = false;
      schedule();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
  io.observe(canvas);
  return () => {
    io?.unobserve(canvas);
    targets.delete(target);
  };
}
