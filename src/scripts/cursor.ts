import { gsap } from 'gsap';
import { riduci, puntatoreFine } from './motion';

/** Sfera rossa che segue il puntatore (solo desktop) e si gonfia sui pulsanti. Il cursore di sistema resta visibile. */
export function initCursore() {
  if (!puntatoreFine() || riduci()) return;
  const el = document.querySelector<HTMLElement>('.cursore');
  const palla = el?.querySelector<HTMLElement>('.cursore__palla');
  if (!el || !palla) return;
  document.documentElement.classList.add('cursore-attivo');
  const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
  const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
  let visibile = false;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x(e.clientX);
    y(e.clientY);
    if (!visibile) { gsap.set(el, { x: e.clientX, y: e.clientY }); visibile = true; palla.style.setProperty('--o', '1'); }
    const t = (e.target as HTMLElement).closest('a, button, [role="button"], input, select, textarea, label, summary, [data-cursore]');
    if (t) {
      const grande = t.matches('.btn, [data-cursore="grande"]');
      palla.style.setProperty('--s', grande ? '3.4' : '2.2');
      palla.style.setProperty('--o', grande ? '0.28' : '0.35');
    } else {
      palla.style.setProperty('--s', '1');
      palla.style.setProperty('--o', '1');
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => { palla.style.setProperty('--o', '0'); visibile = false; });
  window.addEventListener('pointerdown', () => palla.style.setProperty('--s', '0.7'));
  window.addEventListener('pointerup', () => palla.style.setProperty('--s', '1'));
}
