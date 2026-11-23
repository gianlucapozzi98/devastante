import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { EASE, riduci } from './motion';
import { suona } from './sound';

gsap.registerPlugin(Flip);

/** Menu a teglia: filtri con Flip (i tranci si riordinano), schede prodotto in un pannello <dialog>. */
export default function menu(el: HTMLElement) {
  const filtri = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-filtro]'));
  const tranci = Array.from(el.querySelectorAll<HTMLElement>('.trancio-menu'));
  const conta = el.querySelector<HTMLElement>('[data-conta]');
  filtri.forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filtro!;
    filtri.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const stato = Flip.getState(tranci);
    let n = 0;
    tranci.forEach((t) => { const vis = f === 'tutto' || t.dataset.cat === f; t.hidden = !vis; if (vis) n++; });
    if (conta) conta.textContent = `${n} ${n === 1 ? 'prodotto' : 'prodotti'}`;
    if (!riduci()) Flip.from(stato, { duration: 0.6, ease: EASE.out, scale: true, absolute: true, onEnter: (e) => gsap.fromTo(e, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: EASE.out }), onLeave: (e) => gsap.to(e, { opacity: 0, scale: 0.8, duration: 0.3 }) });
  }));

  // schede prodotto
  const apri = (id: string, origine: HTMLElement) => {
    const d = document.getElementById(id) as HTMLDialogElement | null;
    if (!d) return;
    d.showModal();
    suona('morso', 0.5);
    if (!riduci()) gsap.fromTo(d, { xPercent: 100 }, { xPercent: 0, duration: 0.55, ease: EASE.out });
    const chiudi = () => {
      if (riduci()) { d.close(); return; }
      gsap.to(d, { xPercent: 100, duration: 0.35, ease: 'power2.in', onComplete: () => d.close() });
    };
    d.querySelector<HTMLButtonElement>('[data-chiudi]')!.onclick = chiudi;
    d.onclick = (e) => { if (e.target === d) chiudi(); };
    d.oncancel = (e) => { e.preventDefault(); chiudi(); };
    d.addEventListener('close', () => origine.focus(), { once: true });
  };
  el.querySelectorAll<HTMLButtonElement>('[data-apri]').forEach((b) => b.addEventListener('click', () => apri(b.dataset.apri!, b)));

  // la teglia viene "servita": i tranci entrano in sequenza
  if (!riduci()) gsap.from(tranci, { y: 40, opacity: 0, rotation: () => gsap.utils.random(-3, 3), duration: 0.8, stagger: 0.06, ease: EASE.out, scrollTrigger: { trigger: el.querySelector('.teglia-menu'), start: 'top 85%', once: true } });
}
