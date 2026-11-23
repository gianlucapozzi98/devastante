/**
 * Disegno progressivo di una linea con `vector-effect: non-scaling-stroke` dentro un SVG stirato
 * (preserveAspectRatio="none"). DrawSVG misura la lunghezza nelle unità dell'SVG, ma qui il tratteggio
 * si applica in pixel dello schermo: la linea resterebbe indietro e poi scatterebbe.
 * Misuriamo quindi la lunghezza reale a schermo e impostiamo noi dasharray/dashoffset.
 */
const cache = new WeakMap<SVGPathElement, { w: number; h: number; l: number }>();

export function lunghezzaSchermo(path: SVGPathElement): number {
  const svg = path.ownerSVGElement;
  if (!svg) return path.getTotalLength();
  const r = svg.getBoundingClientRect();
  const c = cache.get(path);
  if (c && Math.abs(c.w - r.width) < 0.5 && Math.abs(c.h - r.height) < 0.5) return c.l;
  const vb = svg.viewBox.baseVal;
  const sx = vb && vb.width ? r.width / vb.width : 1;
  const sy = vb && vb.height ? r.height / vb.height : 1;
  const tot = path.getTotalLength();
  const passi = 96;
  let l = 0;
  let prec = path.getPointAtLength(0);
  for (let i = 1; i <= passi; i++) {
    const p = path.getPointAtLength((tot * i) / passi);
    l += Math.hypot((p.x - prec.x) * sx, (p.y - prec.y) * sy);
    prec = p;
  }
  cache.set(path, { w: r.width, h: r.height, l });
  return l;
}

/** Mostra la linea dall'inizio fino alla frazione f (0–1). */
export function traccia(path: SVGPathElement | null | undefined, f: number) {
  if (!path) return;
  const l = lunghezzaSchermo(path) + 2;
  const q = Math.max(0, Math.min(1, f));
  path.style.strokeDasharray = `${l} ${l}`;
  path.style.strokeDashoffset = String(l * (1 - q));
}
