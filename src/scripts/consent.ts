/**
 * Gestione del consenso. Nessun contenuto di terzi viene caricato prima di una scelta esplicita.
 * Archiviazione tecnica: localStorage "dev-consenso" = { v, data, scelte: { mappe, statistiche } }.
 */
export type Categoria = 'mappe' | 'statistiche';
type Scelte = Record<Categoria, boolean>;
const CHIAVE = 'dev-consenso';
const VERSIONE = 1;
const SEI_MESI = 1000 * 60 * 60 * 24 * 182;

function leggi(): { scelte: Scelte; data: number } | null {
  try {
    const raw = localStorage.getItem(CHIAVE);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (v.v !== VERSIONE || Date.now() - v.data > SEI_MESI) return null;
    return v;
  } catch {
    return null;
  }
}

function salva(scelte: Scelte) {
  try {
    localStorage.setItem(CHIAVE, JSON.stringify({ v: VERSIONE, data: Date.now(), scelte }));
  } catch {
    /* archiviazione non disponibile: la scelta vale solo per questa pagina */
  }
  statoCorrente = scelte;
  document.dispatchEvent(new CustomEvent('consenso:aggiornato', { detail: scelte }));
}

let statoCorrente: Scelte | null = leggi()?.scelte ?? null;

export function haConsenso(c: Categoria): boolean {
  return !!statoCorrente?.[c];
}

export function apriPreferenze() {
  const dlg = document.querySelector<HTMLDialogElement>('[data-consenso-dialogo]');
  if (!dlg) return;
  const form = dlg.querySelector('form')!;
  (['mappe', 'statistiche'] as Categoria[]).forEach((c) => {
    const i = form.querySelector<HTMLInputElement>(`input[name="${c}"]`);
    if (i) i.checked = haConsenso(c);
  });
  dlg.showModal();
}

export function initConsenso() {
  const banner = () => document.querySelector<HTMLElement>('[data-consenso-banner]');
  const mostra = () => {
    const b = banner();
    if (b) b.hidden = statoCorrente !== null;
    document.documentElement.classList.toggle('consenso-da-chiedere', statoCorrente === null);
  };
  const chiudiTutto = () => {
    const b = banner();
    if (b) b.hidden = true;
    document.documentElement.classList.remove('consenso-da-chiedere');
    document.querySelector<HTMLDialogElement>('[data-consenso-dialogo]')?.close();
  };
  document.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-consenso-accetta],[data-consenso-rifiuta],[data-consenso-salva],[data-apri-consenso]');
    if (!t) return;
    if (t.hasAttribute('data-apri-consenso')) {
      e.preventDefault();
      apriPreferenze();
      return;
    }
    e.preventDefault();
    if (t.hasAttribute('data-consenso-accetta')) salva({ mappe: true, statistiche: true });
    else if (t.hasAttribute('data-consenso-rifiuta')) salva({ mappe: false, statistiche: false });
    else {
      const form = t.closest('form')!;
      const v = (n: string) => !!form.querySelector<HTMLInputElement>(`input[name="${n}"]`)?.checked;
      salva({ mappe: v('mappe'), statistiche: v('statistiche') });
    }
    chiudiTutto();
    const annuncio = document.querySelector('.annuncio');
    if (annuncio) annuncio.textContent = 'Preferenze sui cookie salvate.';
  });
  document.addEventListener('astro:page-load', mostra);
  mostra();
}
