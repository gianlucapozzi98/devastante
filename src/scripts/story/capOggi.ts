import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, riduci } from '../motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Capitolo 5 — il "wow": la saracinesca si alza sulle due vetrine.
 * Con "Presto in apertura" si ferma a metà e scende il cartello: il sito non dice mai "aperto" prima del tempo.
 */
export default function capOggi(el: HTMLElement) {
  if (riduci()) return;
  const presto = el.dataset.presto === '1';
  const sar = el.querySelectorAll('[data-saracinesca]');
  const cartello = el.querySelector('[data-cartello]');
  const testo = el.querySelectorAll('.cap-oggi__testo > *');
  const mm = gsap.matchMedia();
  const costruisci = (pin: boolean) => {
    if (cartello) gsap.set(cartello, { opacity: 0, rotation: -24, y: -40 });
    const tl = gsap.timeline({
      defaults: { ease: EASE.io },
      scrollTrigger: pin
        ? { trigger: el, start: 'top top', end: '+=150%', scrub: 0.8, pin: el.querySelector('.cap-oggi__pin'), anticipatePin: 1 }
        : { trigger: el.querySelector('.negozio'), start: 'top 70%', end: 'bottom 40%', scrub: 0.8 },
    });
    tl.from(testo, { y: 40, opacity: 0, stagger: 0.08, duration: 0.4, ease: EASE.out }, 0)
      .to(sar, { yPercent: presto ? -55 : -100, duration: 1.2, stagger: 0.18, ease: 'power2.inOut' }, 0.2);
    if (cartello) tl.to(cartello, { opacity: 1, rotation: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }, 1.3);
    tl.to({}, { duration: 0.4 });
  };
  mm.add('(min-width: 900px)', () => costruisci(true));
  mm.add('(max-width: 899px)', () => costruisci(false));
  return () => mm.revert();
}
