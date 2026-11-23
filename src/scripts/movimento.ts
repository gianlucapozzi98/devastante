/** Scelta del visitatore sulle animazioni: salvata come preferenza tecnica e applicata ricaricando la pagina. */
export function initMovimento() {
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-movimento]');
    if (!b) return;
    const v = b.dataset.movimento;
    const valore = v === 'cambia' ? (document.documentElement.classList.contains('movimento-ridotto') ? 'si' : 'no') : v;
    try { localStorage.setItem('dev-movimento', valore === 'si' ? 'si' : 'no'); } catch { /* archiviazione non disponibile */ }
    if (v === 'no' && document.documentElement.classList.contains('movimento-ridotto')) {
      // resta tutto fermo: basta nascondere l'avviso
      document.documentElement.classList.add('movimento-scelto');
      return;
    }
    location.reload();
  });
}
