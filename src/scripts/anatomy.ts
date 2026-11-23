import { gsap } from 'gsap';
import { EASE, riduci } from './motion';

/** Anatomia dello smash: gli strati arrivano distanziati e si compattano con lo scroll (parallasse leggera). */
export default function anatomia(el: HTMLElement) {
  if (riduci()) return;
  const strati = Array.from(el.querySelectorAll<HTMLElement>('.strato'));
  strati.forEach((s, i) => {
    gsap.fromTo(s.querySelector('.strato__foto'), { yPercent: 18 + i * 4, rotation: i % 2 ? 2 : -2 }, { yPercent: -6, rotation: 0, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom 30%', scrub: 0.6 } });
    gsap.from(s.querySelector('.strato__etichetta'), { x: 40, opacity: 0, duration: 0.8, ease: EASE.out, scrollTrigger: { trigger: s, start: 'top 80%', once: true } });
  });
}
