import { haConsenso, type Categoria } from './consent';

/** Mappa: l'iframe del fornitore esterno viene creato SOLO dopo il consenso "mappe". */
export default function mappa(el: HTMLElement) {
  const box = el.querySelector<HTMLElement>('[data-mappa-box]');
  if (!box) return;
  const url = box.dataset.embed;
  if (!url) return;
  const carica = () => {
    if (box.querySelector('iframe')) return;
    const f = document.createElement('iframe');
    f.src = url;
    f.title = 'Mappa del locale DEVASTANTE';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    box.querySelector('.mappa__vuota')?.remove();
    box.appendChild(f);
  };
  if (haConsenso('mappe' as Categoria)) carica();
  const onAgg = (e: Event) => { if ((e as CustomEvent).detail?.mappe) carica(); };
  document.addEventListener('consenso:aggiornato', onAgg);
  box.querySelector('[data-mappa-consenso]')?.addEventListener('click', () => {
    document.querySelector<HTMLElement>('[data-apri-consenso]')?.click();
  });
  return () => document.removeEventListener('consenso:aggiornato', onAgg);
}
