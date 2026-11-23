import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { EASE, riduci } from './motion';
import { suona } from './sound';

gsap.registerPlugin(Draggable, DrawSVGPlugin);

/** Linea del tempo interattiva (schema "tab" ARIA): tappe cliccabili, frecce da tastiera, rotella trascinabile. */
export default function timeline(el: HTMLElement) {
  const tabs = Array.from(el.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const binario = el.querySelector<HTMLElement>('[data-binario]')!;
  const maniglia = el.querySelector<HTMLElement>('[data-maniglia]')!;
  const fatto = el.querySelector('.linea__fatto');
  const lama = maniglia.querySelector('.rotella__lama');
  const durata = riduci() ? 0 : 0.6;
  let attuale = 0;

  const posizione = (i: number) => (binario.clientWidth * i) / (tabs.length - 1);
  const seleziona = (i: number, focus = false) => {
    i = Math.max(0, Math.min(tabs.length - 1, i));
    const cambiato = i !== attuale;
    attuale = i;
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const p = document.getElementById(t.getAttribute('aria-controls')!)!;
      p.hidden = !on;
      if (on && cambiato && !riduci()) gsap.from(p.children, { y: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: EASE.out });
    });
    if (focus) tabs[i].focus();
    const f = i / (tabs.length - 1);
    gsap.to(fatto, { drawSVG: `0% ${f * 100}%`, duration: durata, ease: EASE.out });
    gsap.to(maniglia, { x: posizione(i), duration: durata, ease: EASE.out });
    gsap.to(lama, { rotation: f * 720, duration: durata, ease: EASE.out });
    if (cambiato) suona('rotella', 0.4);
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => seleziona(i));
    t.addEventListener('keydown', (e) => {
      const mappa: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 };
      if (e.key in mappa) { e.preventDefault(); seleziona(mappa[e.key], true); }
    });
  });

  gsap.set(fatto, { drawSVG: '0% 0%' });
  const [drag] = Draggable.create(maniglia, {
    type: 'x',
    bounds: { minX: 0, maxX: binario.clientWidth },
    inertia: false,
    onDrag(this: Draggable) {
      const f = this.x / binario.clientWidth;
      gsap.set(fatto, { drawSVG: `0% ${f * 100}%` });
      gsap.set(lama, { rotation: f * 720 });
    },
    onRelease(this: Draggable) {
      seleziona(Math.round((this.x / binario.clientWidth) * (tabs.length - 1)));
    },
  });
  const ridimensiona = () => { drag.applyBounds({ minX: 0, maxX: binario.clientWidth }); gsap.set(maniglia, { x: posizione(attuale) }); };
  window.addEventListener('resize', ridimensiona);
  seleziona(0);
  return () => { drag.kill(); window.removeEventListener('resize', ridimensiona); };
}
