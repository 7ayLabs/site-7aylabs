'use client';

/**
 * HeroFlow — ribbons of light sweeping behind the hero, drawn in one
 * fragment shader. Black and white, like everything else: bands of soft
 * light with a bright edge, crossing the frame on a slow diagonal and
 * bending toward the pointer.
 *
 * Device pixel ratio capped at 1.5; stops while off screen or the tab is
 * hidden; one still frame under reduced motion.
 */
import { useEffect, useRef, type ReactElement } from 'react';

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `
precision highp float;
uniform vec2 uRes;uniform float uT;uniform float uDark;uniform vec2 uPtr;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);
  vec2 q=rot(-.55)*uv;
  q.y+=.06*uPtr.y*sin(q.x*2.+uT*.3);
  float a=0.;
  for(int i=0;i<7;i++){
    float f=float(i);
    float y=q.y-(f-3.)*.13
      -.2*sin(q.x*1.35+uT*.22+f*1.31+uPtr.x*.5)
      -.07*sin(q.x*3.4-uT*.35+f*2.1);
    float w=.5+.5*sin(q.x*2.2+uT*.4+f*1.7);
    a+=exp(-y*y*70.)*.045*(.5+w);
    a+=exp(-y*y*2600.)*.3*w;
  }
  // Fade toward the edges and the bottom so the copy stays clean.
  a*=smoothstep(1.25,.25,length(uv*vec2(.8,1.15)));
  // Keep the middle, where the copy sits, calm.
  a*=mix(.38,1.,smoothstep(.12,.62,length(uv*vec2(.55,1.25))));
  a=clamp(a,0.,.7);
  vec3 ink=vec3(uDark);
  gl_FragColor=vec4(ink*a,a);
}`;

export function HeroFlow(): ReactElement {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s;
      console.warn('[hero-flow] shader did not compile:', gl.getShaderInfoLog(s));
      return null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = {
      res: gl.getUniformLocation(prog, 'uRes'),
      t: gl.getUniformLocation(prog, 'uT'),
      dark: gl.getUniformLocation(prog, 'uDark'),
      ptr: gl.getUniformLocation(prog, 'uPtr'),
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = true;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const start = performance.now();

    const draw = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      ptr.x += (ptr.tx - ptr.x) * 0.04;
      ptr.y += (ptr.ty - ptr.y) * 0.04;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(u.res, w, h);
      gl.uniform1f(u.t, reduced ? 8 : (now - start) / 1000);
      gl.uniform1f(u.dark, document.documentElement.dataset.theme === 'dark' ? 1 : 0);
      gl.uniform2f(u.ptr, ptr.x, ptr.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      raf = 0;
      draw(now);
      if (visible && !reduced && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e?.isIntersecting ?? false;
      if (visible) kick();
    });
    io.observe(canvas);
    const onMove = (e: PointerEvent) => {
      ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const mo = new MutationObserver(kick);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (!reduced) window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', kick);
    window.addEventListener('resize', kick);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', kick);
      window.removeEventListener('resize', kick);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
