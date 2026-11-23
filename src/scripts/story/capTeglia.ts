import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, riduci } from '../motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Capitolo 6 — il "wow": LIEVITA cresce come un impasto mentre le ore salgono fino a "più di due giorni".
 * Tipografia, non cibo illustrato.
 */
export default function capTeglia(el: HTMLElement) {
  const ore = el.querySelector<HTMLElement>('[data-ore]')!;
  const oltre = el.querySelector('[data-oltre]');
  if (riduci()) { ore.textContent = '48+'; return; }
  const lettere = el.querySelectorAll('.cap-teglia__parola span');
  const ritmo = el.querySelectorAll('.cap-teglia__ritmo span');
  const frasi = el.querySelectorAll('.cap-teglia__frasi li');
  const mm = gsap.matchMedia();
  const costruisci = (pin: boolean) => {
    const conta = { h: 0 };
    const tl = gsap.timeline({
      defaults: { ease: EASE.io },
      scrollTrigger: pin
        ? { trigger: el, start: 'top top', end: '+=170%', scrub: 0.8, pin: el.querySelector('.cap-teglia__pin'), anticipatePin: 1 }
        : { trigger: el.querySelector('.cap-teglia__parola'), start: 'top 85%', end: 'bottom 30%', scrub: 0.8 },
    });
    tl.fromTo(lettere, { scaleY: 0.28, scaleX: 1.12, y: 10 }, { scaleY: 1, scaleX: 1, y: 0, duration: 1.4, stagger: { each: 0.08, from: 'random' }, ease: 'sine.inOut' }, 0)
      .fromTo(conta, { h: 0 }, { h: 48, duration: 1.5, ease: 'none', onUpdate: () => { ore.textContent = String(Math.round(conta.h)); } }, 0)
      .to(lettere, { scaleY: 1.06, duration: 0.3, stagger: 0.03, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 1.5)
      .call(() => { ore.textContent = conta.h >= 48 ? '48+' : String(Math.round(conta.h)); }, [], 1.55)
      .from(oltre, { scale: 0.6, opacity: 0, duration: 0.3, ease: 'back.out(2)' }, 1.55)
      .from(ritmo, { opacity: 0, x: 20, stagger: 0.08, duration: 0.3 }, 0.2)
      .from(frasi, { y: 30, opacity: 0, stagger: 0.15, duration: 0.4, ease: EASE.out }, 1.6)
      .to({}, { duration: 0.3 });
  };
  mm.add('(min-width: 900px)', () => costruisci(true));
  mm.add('(max-width: 899px)', () => costruisci(false));
  return () => mm.revert();
}
