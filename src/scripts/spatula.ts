import { gsap } from 'gsap';
import { riduci } from './motion';
import { suona } from './sound';

/** Il gesto dello smash: tieni premuto (mouse, dito o tastiera) e la spatola schiaccia. */
export default function spatola(el: HTMLElement) {
  const btn = el.querySelector<HTMLButtonElement>('[data-schiaccia]')!;
  const spat = el.querySelector('.gesto__spatola');
  const parola = el.querySelector<HTMLElement>('.gesto__parola')!;
  const conta = el.querySelector('[data-conta]')!;
  let n = 0;
  let premuto = false;
  const durata = riduci() ? 0 : 0.35;
  const giu = () => {
    if (premuto) return;
    premuto = true;
    const sp = (spat as Element).getBoundingClientRect();
    const pr = parola.getBoundingClientRect();
    gsap.to(spat, { y: pr.top - sp.bottom + pr.height * 0.55 + (gsap.getProperty(spat, 'y') as number), duration: durata, ease: 'power4.in' });
    gsap.to(parola, { scaleY: 0.45, scaleX: 1.3, duration: durata, ease: 'power4.in', onComplete: () => suona('sfrigolio') });
  };
  const su = () => {
    if (!premuto) return;
    premuto = false;
    n++;
    conta.textContent = String(n);
    gsap.to(spat, { y: 0, duration: durata * 1.6, ease: 'expo.out' });
    gsap.to(parola, { scaleY: 1, scaleX: 1, duration: durata * 2, ease: 'elastic.out(1, 0.4)' });
  };
  btn.addEventListener('pointerdown', (e) => { btn.setPointerCapture(e.pointerId); giu(); });
  btn.addEventListener('pointerup', su);
  btn.addEventListener('pointercancel', su);
  btn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); giu(); } });
  btn.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); su(); } });
  btn.addEventListener('blur', su);
}
