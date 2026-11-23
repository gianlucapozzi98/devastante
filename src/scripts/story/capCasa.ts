import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { traccia } from '../tratto';
import { SplitText } from 'gsap/SplitText';
import { EASE, riduci } from '../motion';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Capitolo 8 — il "wow": la pennellata della storia arriva fino a "Ordina" e gli gira intorno. */
export default function capCasa(el: HTMLElement) {
  if (riduci()) return;
  const filo = el.querySelector<SVGPathElement>('.cap-casa__filo path');
  const disegno = { f: 0 };
  traccia(filo, 0);
  const btn = el.querySelector('.cap-casa__ordina');
  // "Vieni a casa." lettera per lettera (SplitText con maschera: il testo resta leggibile dagli screen reader)
  const split = SplitText.create(el.querySelector('.cap-casa__titolo'), {
    type: 'words,chars', mask: 'words', aria: 'auto',
  });
  gsap.from(split.chars, {
    yPercent: 110, rotation: (i: number) => (i % 2 ? 8 : -8), duration: 0.9, stagger: 0.035, ease: EASE.lettere,
    scrollTrigger: { trigger: el, start: 'top 75%', once: true },
  });
  const tl = gsap.timeline({ scrollTrigger: { trigger: el.querySelector('.cap-casa__azione'), start: 'top 85%', end: 'bottom 45%', scrub: 0.6 } });
  tl.to(disegno, { f: 1, ease: 'none', duration: 1, onUpdate: () => traccia(filo, disegno.f) })
    .fromTo(btn, { scale: 0.7, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.35, ease: 'back.out(2.5)' }, 0.72);
  return () => split.revert();
}
