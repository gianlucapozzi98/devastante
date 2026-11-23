// Genera favicon (SVG, ICO, apple-touch 180, manifest 192/512) dal monogramma "DE" e l'immagine Open Graph 1200×630.
// Il monogramma è usato com'è (tracciati originali) su fondo bianco: su fondo scuro la D nera sparirebbe.
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const mono = readFileSync('public/brand/devastante-monogramma.svg', 'utf8');
const logo = readFileSync('public/brand/devastante-logo.svg', 'utf8');
const inner = (svg) => svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>')).replace(/<title>.*?<\/title>/, '');
const vb = (svg) => svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);

function icona(size, { raggio = 0.22, margine = 0.14 } = {}) {
  const [x, y, w, h] = vb(mono);
  const lato = Math.max(w, h) / (1 - margine * 2);
  const ox = x - (lato - w) / 2, oy = y - (lato - h) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${ox} ${oy} ${lato} ${lato}">
  <rect x="${ox}" y="${oy}" width="${lato}" height="${lato}" rx="${lato * raggio}" fill="#FFFFFF"/>${inner(mono)}</svg>`;
}

writeFileSync('public/favicon.svg', icona(64).replace(/width="64" height="64" /, ''));
const png = async (svg, size) => sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
writeFileSync('public/apple-touch-icon.png', await png(icona(180, { raggio: 0, margine: 0.12 }), 180));
writeFileSync('public/icon-192.png', await png(icona(192), 192));
writeFileSync('public/icon-512.png', await png(icona(512), 512));
writeFileSync('public/icon-maskable-512.png', await png(icona(512, { raggio: 0, margine: 0.22 }), 512));

// ICO con immagini PNG incorporate (16 e 32 px)
const imgs = [await png(icona(16, { raggio: 0.15, margine: 0.06 }), 16), await png(icona(32, { raggio: 0.18, margine: 0.08 }), 32)];
const head = Buffer.alloc(6 + 16 * imgs.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(imgs.length, 4);
let off = head.length;
imgs.forEach((b, i) => {
  const s = [16, 32][i];
  const e = 6 + 16 * i;
  head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt8(0, e + 2); head.writeUInt8(0, e + 3);
  head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(b.length, e + 8); head.writeUInt32LE(off, e + 12);
  off += b.length;
});
writeFileSync('public/favicon.ico', Buffer.concat([head, ...imgs]));

// Open Graph 1200×630: logo vero su carta + pennellata grafica. Da sostituire con una foto vera quando disponibile.
const [lx, ly, lw, lh] = vb(logo);
const W = 1200, H = 630, larg = 860, alt = (lh / lw) * larg;
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F6F1E7"/>
  <path d="M40 580 C 260 550, 420 605, 640 575 S 980 540, 1160 565" fill="none" stroke="#E30613" stroke-width="40" stroke-linecap="round"/>
  <svg x="${(W - larg) / 2}" y="120" width="${larg}" height="${alt}" viewBox="${lx} ${ly} ${lw} ${lh}">${inner(logo)}</svg>
  <text x="${W / 2}" y="${120 + alt + 70}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="34" letter-spacing="3" fill="#000">CESANO BOSCONE · PIZZA IN TEGLIA E SMASH BURGER</text>
</svg>`;
writeFileSync('public/og.png', await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toBuffer());

writeFileSync('public/site.webmanifest', JSON.stringify({
  name: 'DEVASTANTE · Pizza e smash',
  short_name: 'DEVASTANTE',
  lang: 'it',
  start_url: '/',
  display: 'standalone',
  background_color: '#F6F1E7',
  theme_color: '#F6F1E7',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2));
console.log('Icone, manifest e og.png generati.');
