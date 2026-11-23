import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './app';

let ultimo = 0;
let agganciato = false;

/** Barra: nasconde scendendo, ricompare salendo; sfondo dopo l'hero; logo nascosto sopra il logo grande della home. */
export function initNav() {
  const html = document.documentElement;
  const hero = document.querySelector<HTMLElement>('[data-hero-logo]');
  const aggiorna = () => {
    const y = window.scrollY;
    html.classList.toggle('nav-scorre', y > 40);
    html.classList.toggle('nav-nascosta', y > 400 && y > ultimo + 2 && !html.classList.contains('menu-aperto'));
    if (y < ultimo - 2 || y < 400) html.classList.remove('nav-nascosta');
    if (hero) html.classList.toggle('home-in-alto', hero.getBoundingClientRect().bottom > 70);
    else html.classList.remove('home-in-alto');
    ultimo = y;
  };
  aggiorna();
  if (!agganciato) {
    window.addEventListener('scroll', aggiorna, { passive: true });
    document.addEventListener('astro:after-swap', () => requestAnimationFrame(aggiorna));
    agganciato = true;
  }

  const burger = document.querySelector<HTMLButtonElement>('[data-burger]');
  const pannello = document.querySelector<HTMLElement>('[data-pannello]');
  if (!burger || !pannello) return;
  const chiudi = (focus = true) => {
    burger.setAttribute('aria-expanded', 'false');
    burger.querySelector('.sr-only')!.textContent = 'Apri il menu';
    pannello.hidden = true;
    html.classList.remove('menu-aperto');
    getLenis()?.start();
    if (focus) burger.focus();
  };
  burger.onclick = () => {
    const aperto = burger.getAttribute('aria-expanded') === 'true';
    if (aperto) return chiudi();
    burger.setAttribute('aria-expanded', 'true');
    burger.querySelector('.sr-only')!.textContent = 'Chiudi il menu';
    pannello.hidden = false;
    html.classList.add('menu-aperto');
    getLenis()?.stop();
    pannello.querySelector<HTMLAnchorElement>('a')?.focus();
  };
  pannello.onkeydown = (e) => {
    if (e.key === 'Escape') chiudi();
  };
  pannello.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => chiudi(false)));
  ScrollTrigger.addEventListener('refresh', aggiorna);
}
