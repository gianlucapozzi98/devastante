import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, riduci, puntatoreFine } from '../motion';

gsap.registerPlugin(ScrollTrigger);

/** Hero: logo che ondeggia al passaggio, uscita morbida con lo scroll, pennellata liquida (WebGL) caricata quando c'è tempo. */
export default function hero(el: HTMLElement) {
  const logo = el.querySelector<SVGSVGElement>('.hero__svg');
  const lettere = logo ? Array.from(logo.querySelectorAll<SVGPathElement>('.logo__lettera')) : [];
  const puliture: Array<() => void> = [];

  if (!riduci()) {
    // ondeggiamento al passaggio del mouse/dito: le lettere disegnate "respirano" come nel logo
    const onda = () => {
      if (gsap.isTweening(lettere[0])) return;
      gsap.timeline()
        .to(lettere, { y: (i) => (i % 2 ? 14 : -14), rotation: (i) => (i % 2 ? 2.5 : -2.5), duration: 0.22, stagger: 0.03, ease: 'sine.out' })
        .to(lettere, { y: 0, rotation: 0, duration: 0.6, stagger: 0.03, ease: 'elastic.out(1, 0.45)' }, 0.18);
    };
    logo?.addEventListener('pointerenter', onda);
    puliture.push(() => logo?.removeEventListener('pointerenter', onda));

    // con lo scroll l'hero si allontana (parallasse a strati). Creata dopo l'apertura:
    // una trasformazione sul contenitore isolerebbe il logo sotto il velo del caricamento.
    const parallasse = () => {
      gsap.to(el.querySelector('.hero__in'), { yPercent: -12, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to(el.querySelector('.bollino'), { y: -120, rotation: 40, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
    };

    // ingresso degli elementi dopo l'apertura (solo trasformazioni: il testo è già dipinto per l'LCP)
    const entra = () => gsap.from(el.querySelectorAll('[data-hero-entra]'), { y: 26, duration: 0.9, stagger: 0.06, ease: EASE.out, clearProps: 'transform' });
    if (document.documentElement.classList.contains('con-apertura')) {
      document.addEventListener('apertura:fine', () => { entra(); parallasse(); }, { once: true });
    } else parallasse();
  }

  // Pennellata liquida: l'unico effetto WebGL del sito. Caricata a riposo, mai con movimento ridotto.
  const box = el.querySelector<HTMLElement>('[data-hero-gl]');
  if (box && !riduci()) {
    let stop: (() => void) | undefined;
    let annullato = false;
    const avvia = () => {
      if (annullato) return;
      import('./heroGl').then((m) => {
        if (annullato) return;
        stop = m.avviaSalsa(box, { mouse: puntatoreFine(), centro: () => el.querySelector<HTMLElement>('.hero__frase'), limite: () => el.querySelector('.hero__svg') });
      }).catch(() => { /* resta il fallback SVG */ });
    };
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const dopo = () => (ric ? ric(avvia, { timeout: 2000 }) : setTimeout(avvia, 900));
    if (document.documentElement.classList.contains('con-apertura')) document.addEventListener('apertura:fine', () => setTimeout(avvia, 60), { once: true });
    else if (document.readyState === 'complete') dopo();
    else window.addEventListener('load', dopo, { once: true });
    puliture.push(() => { annullato = true; stop?.(); });
  }

  return () => puliture.forEach((p) => p());
}
