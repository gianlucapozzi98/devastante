import { Renderer, Program, Mesh, Triangle } from 'ogl';

/**
 * Pennellata liquida rossa (#E30613) — grafica, non cibo.
 * Un nastro con bordi "a setola" che scorre lentamente e si piega verso il puntatore.
 * In pausa quando è fuori schermo o la scheda è nascosta. DPR limitato per i telefoni.
 */
const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uMouseAmt;
uniform float uReveal;
uniform float uY;
uniform float uThick;
uniform float uLimite;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

void main() {
  vec2 uv = vUv;
  float ar = uRes.x / uRes.y;
  float t = uTime * 0.22;
  float x = uv.x;

  // linea centrale del nastro: onde lente sovrapposte
  float c = uY + 0.035 * sin(x * 3.1 + t * 1.4) + 0.02 * sin(x * 6.7 - t * 1.1) + 0.008 * sin(x * 13.0 + t * 2.0);
  // il puntatore attira il nastro
  float dx = (x - uMouse.x) * ar;
  c += uMouseAmt * (uMouse.y - c) * exp(-dx * dx * 9.0) * 0.4;

  // spessore: si assottiglia agli estremi come una pennellata
  float taper = smoothstep(-0.02, 0.22, x) * smoothstep(1.06, 0.72, x);
  float th = uThick * (0.35 + 0.65 * taper) * (0.85 + 0.3 * fbm(vec2(x * 1.7, t)));
  // mai sopra il logo: il bordo superiore resta sotto "PIZZA E SMASH"
  float lim = uLimite - th * 1.25;
  c = -0.025 * log(exp(-c / 0.025) + exp(-lim / 0.025)); // minimo morbido: niente bordo piatto
  float d = abs(uv.y - c);

  // bordo a setola
  float ruvido = fbm(vec2(x * 24.0, uv.y * 5.0 + t * 0.4)) * 0.34 + fbm(vec2(x * 80.0, 3.0)) * 0.14;
  float bordo = th * (0.74 + ruvido);
  float a = 1.0 - smoothstep(bordo - 0.0035, bordo + 0.0015, d);

  // pennello asciutto verso i bordi: strisce lungo il gesto
  float striscia = fbm(vec2(x * 2.6 + t * 0.15, uv.y * 150.0 / max(uThick * 6.0, 0.4)));
  float secco = smoothstep(0.62, 0.92, d / max(bordo, 1e-3)) * smoothstep(0.5, 0.78, striscia);
  a *= 1.0 - secco;

  // il colore si stende da sinistra (apertura)
  float fronte = uReveal + (fbm(vec2(uv.y * 9.0, 2.0)) - 0.5) * 0.08;
  a *= smoothstep(fronte, fronte - 0.06, x);

  vec3 rosso = vec3(0.890, 0.024, 0.075);
  float lato = (uv.y - c) / max(bordo, 1e-3);
  vec3 col = rosso * (1.0 + 0.09 * smoothstep(0.15, 0.8, lato) - 0.10 * smoothstep(-0.25, -0.95, lato));
  col += 0.035 * (striscia - 0.5);
  gl_FragColor = vec4(col * a, a);
}
`;

export function avviaSalsa(box: HTMLElement, { mouse, centro, limite }: { mouse: boolean; centro?: () => HTMLElement | null; limite?: () => Element | null }) {
  const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 900 ? 1 : 1.5);
  let renderer: Renderer;
  try {
    renderer = new Renderer({ dpr, alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
  } catch {
    return () => {};
  }
  const gl = renderer.gl;
  if (!gl) return () => {};
  gl.clearColor(0, 0, 0, 0);
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  box.appendChild(canvas);

  const mobile = window.innerWidth < 900;
  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: [1, 1] },
    uMouse: { value: [0.5, 0.4] },
    uMouseAmt: { value: 0 },
    uReveal: { value: -0.1 },
    uY: { value: mobile ? 0.36 : 0.33 },
    uThick: { value: mobile ? 0.07 : 0.085 },
    uLimite: { value: 1.0 },
  };
  const program = new Program(gl, { vertex, fragment, uniforms, transparent: true, depthTest: false });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const misura = () => {
    const r = box.getBoundingClientRect();
    // il nastro passa dietro al titolo (testo nero: contrasto ok), mai dietro al logo
    const c = centro?.();
    if (c && r.height) {
      const cr = c.getBoundingClientRect();
      uniforms.uY.value = 1 - (cr.top + cr.height * 0.55 - r.top) / r.height;
      uniforms.uThick.value = Math.min(0.09, (cr.height * 0.42) / r.height);
    }
    const l = limite?.();
    if (l && r.height) uniforms.uLimite.value = 1 - (l.getBoundingClientRect().bottom + 8 - r.top) / r.height;
  };
  const resize = () => {
    const r = box.getBoundingClientRect();
    renderer.setSize(r.width, r.height);
    uniforms.uRes.value = [r.width, r.height];
    misura();
  };
  let conta = 0;
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(box);
  document.fonts?.ready.then(resize);

  // puntatore (morbido)
  const target = { x: 0.5, y: 0.4, amt: 0 };
  const onMove = (e: PointerEvent) => {
    const r = box.getBoundingClientRect();
    target.x = (e.clientX - r.left) / r.width;
    target.y = 1 - (e.clientY - r.top) / r.height;
    target.amt = 1;
  };
  const onLeave = () => { target.amt = 0; };
  if (mouse) {
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
  }

  let visibile = true;
  let raf = 0;
  let t0 = performance.now();
  const io = new IntersectionObserver(([e]) => { visibile = e.isIntersecting; if (visibile) loop(); }, { threshold: 0 });
  io.observe(box);
  const onVis = () => { if (!document.hidden) loop(); };
  document.addEventListener('visibilitychange', onVis);

  function frame(now: number) {
    raf = 0;
    if (!visibile || document.hidden) return;
    const dt = Math.min((now - t0) / 1000, 0.05);
    t0 = now;
    uniforms.uTime.value += dt;
    uniforms.uReveal.value = Math.min(uniforms.uReveal.value + dt * 1.6, 1.2);
    const m = uniforms.uMouse.value as number[];
    m[0] += (target.x - m[0]) * 0.08;
    m[1] += (target.y - m[1]) * 0.08;
    uniforms.uMouseAmt.value += (target.amt - uniforms.uMouseAmt.value) * 0.05;
    if (++conta % 20 === 0) misura(); // il layout può cambiare (font, ingresso): il nastro resta sotto il logo
    renderer.render({ scene: mesh });
    loop();
  }
  function loop() {
    if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); }
  }
  document.documentElement.classList.add('gl-attivo');
  loop();

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
    document.removeEventListener('visibilitychange', onVis);
    document.documentElement.classList.remove('gl-attivo');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    canvas.remove();
  };
}
