// Controlla i link interni della build: pagine, file e ancore (#id) devono esistere.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] ?? 'dist/client';
// pagine come "menu.html" (Node) o "menu/index.html" (Vercel)
const pagine = readdirSync(root, { recursive: true }).map(String).filter((f) => f.endsWith('.html') && !f.startsWith('_'));
const ids = new Map();
for (const p of pagine) {
  const html = readFileSync(join(root, p), 'utf8');
  ids.set(p, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}
const risolvi = (href) => {
  const [percorso] = href.split('#');
  if (percorso === '' || percorso === '/') return 'index.html';
  if (percorso.startsWith('/_astro/')) return existsSync(join(root, percorso)) ? percorso.slice(1) : null;
  const pulito = percorso.replace(/^\//, '');
  for (const c of [pulito, `${pulito}.html`, join(pulito, 'index.html')]) if (existsSync(join(root, c)) && statSync(join(root, c)).isFile()) return c;
  return null;
};
const dinamici = ['/keystatic', '/api/iscrizione'];
const host = (readFileSync(join(root, 'index.html'), 'utf8').match(/rel="canonical" href="https?:\/\/([^/"]+)/) ?? [])[1];
let errori = 0;
const esterni = new Set();
for (const p of pagine) {
  const html = readFileSync(join(root, p), 'utf8');
  for (const m of html.matchAll(/\s(?:href|src|action)="([^"]+)"/g)) {
    const href = m[1].replaceAll('&amp;', '&');
    if (/^(https?:)?\/\//.test(href)) { if (!host || !href.includes(host)) esterni.add(href); continue; }
    if (/^(mailto|tel|data|javascript):/.test(href)) continue;
    if (dinamici.some((d) => href.startsWith(d))) continue;
    if (href.startsWith('#')) {
      if (href.length > 1 && !ids.get(p).has(href.slice(1))) { console.log(`✗ ${p}: ancora mancante ${href}`); errori++; }
      continue;
    }
    const dest = risolvi(href);
    if (!dest) { console.log(`✗ ${p}: link rotto ${href}`); errori++; continue; }
    const anc = href.split('#')[1];
    if (anc && dest.endsWith('.html') && !ids.get(dest)?.has(anc)) { console.log(`✗ ${p}: ancora mancante ${href}`); errori++; }
  }
}
console.log(`Pagine controllate: ${pagine.length}. Link esterni: ${[...esterni].join(', ') || 'nessuno'}`);
console.log(errori ? `${errori} problemi.` : 'Nessun link interno rotto.');
process.exit(errori ? 1 : 0);
