// Verifica che l'SVG del logo sia identico al PDF del cliente.
// 1) rasterizza il PDF con `sips` (macOS) e la tavola SVG con sharp/librsvg alla stessa risoluzione;
// 2) confronta la "forma" (pixel con inchiostro) e i colori dichiarati.
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const pdf = 'DEVASTANTE LOGO PROP 2.pdf';
const svg = 'public/brand/devastante-logo-tavola.svg';
const dir = mkdtempSync(join(tmpdir(), 'logo-'));
const refPng = join(dir, 'ref.png');
execFileSync('sips', ['-s', 'format', 'png', pdf, '--out', refPng], { stdio: 'ignore' });
const ref = await sharp(refPng).flatten({ background: '#fff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = ref.info;
const out = await sharp(readFileSync(svg), { density: 72 }).resize(W, H, { fit: 'fill' }).flatten({ background: '#fff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const inkMap = (d) => { const m = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) { const r = d[i * 3], g = d[i * 3 + 1], b = d[i * 3 + 2]; m[i] = (r + g + b) / 3 < 200 || (r > 150 && g < 120) ? 1 : 0; } return m; };
const A = inkMap(ref.data), S = inkMap(out.data);
let inkRef = 0, inkSvg = 0, both = 0, diff = 0, strong = 0;
// "strong" = differenza non spiegabile da 1 px di antialiasing: nessun vicino (raggio 2 px) nell'altra immagine ha lo stesso valore
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x; inkRef += A[i]; inkSvg += S[i]; both += A[i] & S[i];
  if (A[i] !== S[i]) { diff++; let ok = false;
    for (let dy = -2; dy <= 2 && !ok; dy++) for (let dx = -2; dx <= 2 && !ok; dx++) { const j = (y + dy) * W + (x + dx); if (j >= 0 && j < W * H && S[j] === A[i]) ok = true; }
    if (!ok) strong++; }
}
const iou = both / (inkRef + inkSvg - both);
const fills = [...new Set([...readFileSync(svg, 'utf8').matchAll(/fill="(#[0-9A-F]{6})"/g)].map((m) => m[1]))];
console.log(`Risoluzione confronto: ${W}×${H}`);
console.log(`Pixel con inchiostro — PDF: ${inkRef}, SVG: ${inkSvg}, differenti: ${diff} (${((diff / inkRef) * 100).toFixed(3)}%)`);
console.log(`Sovrapposizione (IoU): ${(iou * 100).toFixed(3)}%`);
console.log(`Differenze oltre 2 px (antialiasing): ${strong}`);
console.log(`Colori nell'SVG: ${fills.join(', ')} (PDF: 0.89 0.024 0.075 rg = #E30613, 0 g = #000000)`);
if (strong > 0.0005 * inkRef || iou < 0.99) { console.error('ATTENZIONE: la forma differisce dal PDF.'); process.exit(1); }
console.log('OK: logo identico all\'originale (differenze solo di antialiasing).');
