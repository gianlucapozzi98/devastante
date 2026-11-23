import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { riduci } from '../motion';

gsap.registerPlugin(ScrollTrigger);

/** Capitolo 2 — il "wow": l'album di TABISCA scorre in due strisce opposte e si inclina con la velocità dello scroll. */
export default function capTabisca(el: HTMLElement) {
  if (riduci()) return;
  const strisce = Array.from(el.querySelectorAll<HTMLElement>('[data-striscia]'));
  const gigante = el.querySelector<HTMLElement>('.cap-tabisca__gigante');
  const tweens = strisce.map((s) => {
    const dir = Number(s.dataset.striscia);
    return gsap.fromTo(s, { x: dir > 0 ? '0%' : '-22%' }, { x: dir > 0 ? '-22%' : '0%', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  });
  gsap.fromTo(gigante, { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  const inclina = gsap.quickTo(strisce, 'skewX', { duration: 0.5, ease: 'power3.out' });
  const st = ScrollTrigger.create({
    trigger: el, start: 'top bottom', end: 'bottom top',
    onUpdate: (self) => inclina(gsap.utils.clamp(-6, 6, self.getVelocity() / -300)),
    onLeave: () => inclina(0), onLeaveBack: () => inclina(0),
  });
  gsap.from(el.querySelectorAll('.cap-tabisca__parole span'), { y: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el.querySelector('.cap-tabisca__parole'), start: 'top 90%', once: true } });
  return () => { st.kill(); tweens.forEach((t) => t.kill()); };
}
