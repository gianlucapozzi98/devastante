import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { traccia } from './tratto';

gsap.registerPlugin(ScrollTrigger);

/**
 * La pennellata di progresso. Ogni capitolo vale un tratto; "Il ricordo" vale zero: lì la linea si ferma.
 * Funziona anche con movimento ridotto (nessuna animazione, solo lo stato).
 */
export default function progresso(nav: HTMLElement) {
  const capitoli = Array.from(document.querySelectorAll<HTMLElement>('[data-capitolo]'));
  if (!capitoli.length) return;
  const path = nav.querySelector<SVGPathElement>('.progresso__pennellata')!;
  const svg = nav.querySelector<SVGSVGElement>('.progresso__svg')!;
  const rotella = nav.querySelector<SVGSVGElement>('.progresso__rotella')!;
  const lama = rotella.querySelector('.rotella__lama');
  const mobile = nav.querySelector<HTMLElement>('.progresso__mobile');
  const tacche = Array.from(nav.querySelectorAll<HTMLAnchorElement>('[data-tacca]'));
  const pesi: number[] = capitoli.map((c) => (c.id === 'cap-ricordo' ? 0 : 1));
  const totale = pesi.reduce((a, b) => a + b, 0);
  const inizio = pesi.map((_, i) => pesi.slice(0, i).reduce((a, b) => a + b, 0) / totale);
  tacche.forEach((t, i) => t.parentElement!.style.setProperty('--y', `${inizio[i] * 100}%`));
  const len = path.getTotalLength();
  traccia(path, 0);

  const aggiorna = () => {
    const y = window.scrollY + window.innerHeight * 0.5;
    let idx = -1;
    let p = 0;
    for (let i = 0; i < capitoli.length; i++) {
      const top = capitoli[i].getBoundingClientRect().top + window.scrollY;
      const h = capitoli[i].offsetHeight + (capitoli[i].parentElement?.classList.contains('pin-spacer') ? capitoli[i].parentElement!.offsetHeight - capitoli[i].offsetHeight : 0);
      if (y >= top) { idx = i; p = Math.min(1, (y - top) / Math.max(h, 1)); }
    }
    const fine = capitoli[capitoli.length - 1];
    const dentro = idx >= 0 && fine.getBoundingClientRect().bottom > window.innerHeight * 0.4;
    document.documentElement.classList.toggle('storia-visibile', dentro);
    const f = idx < 0 ? 0 : Math.min(1, inizio[idx] + (pesi[idx] * p) / totale);
    traccia(path, f);
    const pt = path.getPointAtLength(len * f);
    const r = svg.getBoundingClientRect();
    const n = nav.getBoundingClientRect();
    gsap.set(rotella, { x: r.left - n.left + (pt.x / 40) * r.width - 17, y: (pt.y / 1000) * r.height - 17 });
    gsap.set(lama, { rotation: f * 2400 });
    mobile?.style.setProperty('--p', String(f));
    nav.dataset.tema = (idx >= 0 && capitoli[idx].getBoundingClientRect().top < window.innerHeight * 0.5 && capitoli[idx].dataset.tema) || 'chiaro';
    tacche.forEach((t, i) => {
      t.classList.toggle('fatto', i < idx || (i === idx && pesi[i] === 0));
      if (i === idx) t.setAttribute('aria-current', 'step');
      else t.removeAttribute('aria-current');
    });
  };
  const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: aggiorna, onRefresh: aggiorna });
  aggiorna();
  return () => { st.kill(); document.documentElement.classList.remove('storia-visibile'); };
}
