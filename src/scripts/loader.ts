import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { EASE } from './motion';
import { suona } from './sound';

gsap.registerPlugin(DrawSVGPlugin);

/**
 * Apertura: la pennellata del logo si dipinge, DEVA scende, STANTE sale, "PIZZA E SMASH" si chiude,
 * la rotella taglia la carta e la pagina si apre. Durata totale ≤ 1,2 s, saltabile (pulsante, clic, Esc).
 */
export default function apertura(hero: HTMLElement) {
  const html = document.documentElement;
  if (!html.classList.contains('con-apertura')) return;
  const overlay = hero.querySelector<HTMLElement>('[data-apertura]')!;
  const logo = hero.querySelector<SVGSVGElement>('.hero__svg')!;
  const salta = hero.querySelector<HTMLButtonElement>('[data-salta]')!;
  const box = logo.getBoundingClientRect();
  overlay.style.setProperty('--taglio-y', `${Math.round(box.bottom + 18)}px`);

  const pennello = logo.querySelector('.logo__pennello');
  const deva = logo.querySelectorAll('.logo__deva path');
  const stante = logo.querySelectorAll('.logo__stante path');
  const linee = logo.querySelectorAll('.logo__linea');
  const car = logo.querySelectorAll('.logo__car');

  const fine = () => {
    html.classList.remove('con-apertura');
    try { sessionStorage.setItem('dev-aperto', '1'); } catch { /* niente */ }
    gsap.set([deva, stante, linee, car], { clearProps: 'all' });
    gsap.set(overlay.children, { clearProps: 'all' });
    window.removeEventListener('keydown', esc);
    overlay.removeEventListener('click', vai);
    document.dispatchEvent(new CustomEvent('apertura:fine'));
  };

  const tl = gsap.timeline({ defaults: { ease: EASE.out }, onComplete: fine });
  tl.fromTo(pennello, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.5, ease: 'power2.inOut' }, 0)
    .fromTo(deva, { y: -160, rotation: -8, opacity: 0, transformOrigin: '50% 100%' }, { y: 0, rotation: 0, opacity: 1, duration: 0.5, stagger: 0.045, ease: EASE.lettere }, 0.08)
    .fromTo(stante, { y: 170, rotation: 7, opacity: 0, transformOrigin: '50% 0%' }, { y: 0, rotation: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: EASE.lettere }, 0.2)
    .fromTo(linee, { scaleX: 0, opacity: 1, transformOrigin: (i: number) => (i === 0 ? '100% 50%' : '0% 50%') }, { scaleX: 1, duration: 0.35 }, 0.52)
    .fromTo(car, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.012 }, 0.55)
    .fromTo(overlay.querySelector('.apertura__taglio path'), { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.26, ease: 'power1.inOut', onStart: () => suona('rotella', 0.7) }, 0.72)
    .to(overlay.querySelector('.apertura__su'), { yPercent: -100, duration: 0.3, ease: 'power3.in' }, 0.9)
    .to(overlay.querySelector('.apertura__giu'), { yPercent: 100, duration: 0.3, ease: 'power3.in' }, 0.9)
    .to(overlay.querySelector('.apertura__taglio'), { opacity: 0, duration: 0.15 }, 0.95)
    .to(salta, { opacity: 0, duration: 0.15 }, 0.95);

  if (import.meta.env.DEV) (window as unknown as { __apertura: gsap.core.Timeline }).__apertura = tl;
  const vai = () => tl.progress(1);
  const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') vai(); };
  salta.addEventListener('click', vai, { once: true });
  overlay.addEventListener('click', vai);
  window.addEventListener('keydown', esc);
  return () => { tl.kill(); if (html.classList.contains('con-apertura')) fine(); };
}
