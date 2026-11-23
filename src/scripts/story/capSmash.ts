import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, riduci } from '../motion';
import { suona } from '../sound';

gsap.registerPlugin(ScrollTrigger);

/** Capitolo 7 — il "wow": la spatola scende e SMASH si schiaccia con lo scroll. Sfrigolio solo se il suono è acceso. */
export default function capSmash(el: HTMLElement) {
  if (riduci()) return;
  const spatola = el.querySelector('.cap-smash__spatola');
  const parola = el.querySelector('.cap-smash__parola');
  const schizzi = el.querySelectorAll('.cap-smash__schizzi path');
  const testo = el.querySelectorAll('.cap-smash__testo > *');
  const mm = gsap.matchMedia();
  const costruisci = (pin: boolean) => {
    let suonato = false;
    const tl = gsap.timeline({
      defaults: { ease: EASE.io },
      scrollTrigger: pin
        ? { trigger: el, start: 'top top', end: '+=140%', scrub: 0.5, pin: el.querySelector('.cap-smash__pin'), anticipatePin: 1, invalidateOnRefresh: true }
        : { trigger: el.querySelector('.cap-smash__scena'), start: 'top 70%', end: 'bottom 40%', scrub: 0.5, invalidateOnRefresh: true },
    });
    tl.from(testo, { y: 40, opacity: 0, stagger: 0.08, duration: 0.4, ease: EASE.out }, 0)
      .fromTo(spatola, { yPercent: -60, rotation: -14, opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'power2.in' }, 0.1)
      .to(spatola, {
        y: () => {
          const sp = (spatola as Element).getBoundingClientRect();
          const pr = (parola as Element).getBoundingClientRect();
          return pr.top - sp.bottom + pr.height * 0.58;
        },
        duration: 0.25, ease: 'power4.in',
      }, 0.7)
      .to(parola, { scaleY: 0.42, scaleX: 1.12, duration: 0.25, ease: 'power4.in', onComplete: () => { if (!suonato) { suona('sfrigolio'); suonato = true; } } }, 0.7)
      .fromTo(schizzi, { opacity: 0, scale: 0.3, transformOrigin: '50% 100%' }, { opacity: 1, scale: 1, duration: 0.2, stagger: 0.02, ease: 'back.out(3)' }, 0.92)
      .to(schizzi, { opacity: 0, duration: 0.3 }, 1.25)
      .to(spatola, { y: '-=60', rotation: 6, duration: 0.4, ease: EASE.out }, 1.2)
      .to({}, { duration: 0.3 });
  };
  mm.add('(min-width: 900px)', () => costruisci(true));
  mm.add('(max-width: 899px)', () => costruisci(false));
  return () => mm.revert();
}
