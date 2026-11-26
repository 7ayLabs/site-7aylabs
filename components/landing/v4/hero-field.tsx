'use client';

/**
 * HeroField — a slow field of contour lines, drawn in one fragment shader.
 *
 * Monochrome on purpose: ink on the page ground, a few percent strong. It is
 * there so the glass above it has something to refract, not to be looked at.
 * A soft lens follows the pointer and lifts the lines under it.
 *
 * Cost control: device pixel ratio capped at 1.5, the loop stops while the
 * canvas is off screen or the tab is hidden, and under reduced motion a single
 * still frame is drawn. Raw WebGL, no library.
 */
import { useEffect, useRef, type ReactElement } from 'react';

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform vec3 uInk;
uniform vec2 uPtr;
uniform float uLens;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(17.1,9.2);a*=.5;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);
  float t=uT*.022;
  // Two drifting layers of terrain; their sum is cut into contour lines.
  float h=fbm(p*1.35+vec2(t,-t*.6))+.5*fbm(p*2.6-vec2(t*.8,t*.3));
  // The pointer presses a shallow well into the terrain.
  vec2 d=p-uPtr;
  float well=exp(-dot(d,d)*7.)*uLens;
  h+=well*.12;
  float bands=h*11.;
  float f=abs(fract(bands)-.5);
  float w=.045+.03*well;
  float line=smoothstep(w,0.,f);
  // Every fourth line is a touch heavier, like an index contour.
  float idx=step(.75,fract(floor(bands)*.25+.01));
  float a=line*(.05+.045*idx+.16*well);
  // Fade toward the bottom and the corners so text below stays clean.
  float fade=smoothstep(-.1,.75,uv.y)*(1.-.55*smoothstep(.35,1.05,length(p)));
  a*=fade;
  gl_FragColor=vec4(uInk*a,a);
}`;

function readInk(): [number, number, number] {
  const dark = document.documentElement.dataset.theme === 'dark';
  return dark ? [0.96, 0.96, 0.97] : [0.04, 0.04, 0.055];
}

export default function HeroField(): ReactElement {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
    if (!gl) return;

    const compile = (type: number, src: string): WebGLShader | null => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
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

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uT = gl.getUniformLocation(prog, 'uT');
    const uInk = gl.getUniformLocation(prog, 'uInk');
    const uPtr = gl.getUniformLocation(prog, 'uPtr');
    const uLens = gl.getUniformLocation(prog, 'uLens');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let ink = readInk();
    let raf = 0;
    let visible = true;
    let ptr: [number, number] = [0.4, 0.2];
    let target: [number, number] = [0.4, 0.2];
    let lens = 0;
    let lensTarget = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (now: number) => {
      resize();
      ptr = [ptr[0] + (target[0] - ptr[0]) * 0.06, ptr[1] + (target[1] - ptr[1]) * 0.06];
      lens += (lensTarget - lens) * 0.05;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, reduced ? 12 : (now - start) / 1000);
      gl.uniform3f(uInk, ink[0], ink[1], ink[2]);
      gl.uniform2f(uPtr, ptr[0], ptr[1]);
      gl.uniform1f(uLens, lens);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      if (visible && !reduced) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const m = Math.min(r.width, r.height) || 1;
      target = [(e.clientX - r.left - r.width / 2) / m, -(e.clientY - r.top - r.height / 2) / m];
      lensTarget = 1;
    };
    const onLeave = () => {
      lensTarget = 0;
    };
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) kick();
    };

    // Redraw in the right ink when the theme flips.
    const mo = new MutationObserver(() => {
      ink = readInk();
      if (reduced) kick();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const ro = new ResizeObserver(() => {
      if (reduced) kick();
    });
    ro.observe(canvas);

    if (fine && !reduced) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
    document.addEventListener('visibilitychange', onVisibility);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" />;
}
