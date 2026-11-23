import { gsap } from 'gsap';
import { riduci } from '../motion';

/** Capitolo 4 — solo una dissolvenza lenta all'ingresso. Nessuno scrub, nessun effetto. */
export default function capRicordo(el: HTMLElement) {
  if (riduci()) return;
  gsap.from(el.querySelectorAll('.cap-ricordo__in > *'), {
    opacity: 0, duration: 1.6, stagger: 0.5, ease: 'sine.inOut',
    scrollTrigger: { trigger: el, start: 'top 55%', once: true },
  });
}
