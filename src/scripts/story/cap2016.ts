import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { EASE, riduci } from '../motion';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

/** Capitolo 3 — il "wow": la teglia diventa tonda (MorphSVG). Resta il contorno della teglia: il trancio si ferma, per un po'. */
export default function cap2016(el: HTMLElement) {
  const morph = el.querySelector<SVGPathElement>('.cap-2016__morph')!;
  const fantasma = el.querySelector('.cap-2016__fantasma');
  const eTeglia = el.querySelector('.e-teglia');
  const eTonda = el.querySelector('.e-tonda');
  if (riduci()) {
    // stato finale leggibile, senza movimento
    morph.setAttribute('d', morph.dataset.tonda!);
    gsap.set(fantasma, { opacity: 0.5 });
    gsap.set(eTeglia, { opacity: 0 });
    gsap.set(eTonda, { opacity: 1 });
    return;
  }
  const mm = gsap.matchMedia();
  const costruisci = (pin: boolean) => {
    const tl = gsap.timeline({
      defaults: { ease: EASE.io },
      scrollTrigger: pin
        ? { trigger: el, start: 'top top', end: '+=160%', scrub: 0.8, pin: el.querySelector('.cap-2016__pin'), anticipatePin: 1 }
        : { trigger: el.querySelector('.cap-2016__scena'), start: 'top 75%', end: 'bottom 35%', scrub: 0.8 },
    });
    tl.from(el.querySelectorAll('.cap-2016__testo > *'), { y: 40, opacity: 0, stagger: 0.08, duration: 0.5, ease: EASE.out }, 0)
      .from(morph, { rotation: -6, scale: 0.92, transformOrigin: '50% 50%', duration: 0.5 }, 0)
      .to(morph, { morphSVG: morph.dataset.tonda!, rotation: 0, scale: 1, transformOrigin: '50% 50%', duration: 1.2 }, 0.45)
      .to(eTeglia, { opacity: 0, y: -10, duration: 0.3 }, 0.8)
      .fromTo(eTonda, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0.95)
      .to(fantasma, { opacity: 0.45, duration: 0.4 }, 1.3)
      .to({}, { duration: 0.3 });
  };
  mm.add('(min-width: 900px)', () => costruisci(true));
  mm.add('(max-width: 899px)', () => costruisci(false));
  return () => mm.revert();
}
