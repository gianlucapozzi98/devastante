/** Percorso "pulito" della pagina (senza .html, index o barra finale): per canonical, og:url e voce di menu attiva. */
export function percorsoPulito(pathname: string): string {
  const p = pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1');
  return p === '' ? '/' : p;
}
