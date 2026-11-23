/**
 * Regia generale: scroll fluido (Lenis), GSAP, ciclo di vita delle pagine con le View Transitions di Astro.
 * Ogni sezione animata dichiara data-anim="nome": il modulo relativo viene caricato solo se serve.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { riduci } from './motion';
import { initCursore } from './cursor';
import { initSuono } from './sound';
import { initNav } from './nav';
import { initConsenso } from './consent';

gsap.registerPlugin(ScrollTrigger);

type Pulizia = void | (() => void);
const moduli: Record<string, () => Promise<{ default: (el: HTMLElement) => Pulizia | Promise<Pulizia> }>> = {
  loader: () => import('./loader'),
  hero: () => import('./story/hero'),
  'cap-1999': () => import('./story/cap1999'),
  'cap-tabisca': () => import('./story/capTabisca'),
  'cap-2016': () => import('./story/cap2016'),
  'cap-ricordo': () => import('./story/capRicordo'),
  'cap-oggi': () => import('./story/capOggi'),
  'cap-teglia': () => import('./story/capTeglia'),
  'cap-smash': () => import('./story/capSmash'),
  'cap-casa': () => import('./story/capCasa'),
  progresso: () => import('./progress'),
  rivela: () => import('./reveal'),
  menu: () => import('./menu'),
  anatomia: () => import('./anatomy'),
  spatola: () => import('./spatula'),
  timeline: () => import('./timeline'),
  modulo: () => import('./forms'),
  mappa: () => import('./map'),
};

let lenis: Lenis | null = null;
let pulizie: Array<() => void> = [];
let ctx: gsap.Context | null = null;

function avviaLenis() {
  if (riduci() || lenis) return;
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
}

export function getLenis() {
  return lenis;
}

async function avviaPagina() {
  ctx = gsap.context(() => {});
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-anim]'));
  for (const el of els) {
    for (const nome of (el.dataset.anim ?? '').split(/\s+/).filter(Boolean)) {
      const carica = moduli[nome];
      if (!carica) continue;
      try {
        const mod = await carica();
        let pulizia: Pulizia = undefined;
        ctx.add(() => {
          const r = mod.default(el);
          if (r instanceof Promise) r.then((p) => p && pulizie.push(p));
          else pulizia = r;
        });
        if (typeof pulizia === 'function') pulizie.push(pulizia);
      } catch (e) {
        console.error(`[anim] ${nome}`, e);
      }
    }
  }
  ScrollTrigger.refresh();
  document.documentElement.classList.add('js-pronto');
}

function chiudiPagina() {
  pulizie.forEach((p) => p());
  pulizie = [];
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

// Avvio una sola volta
avviaLenis();
initCursore();
initSuono();
initConsenso();
// La pennellata di transizione (MorphSVG) arriva quando il browser è libero: non pesa sul primo caricamento.
const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
(ric ?? ((cb: () => void) => setTimeout(cb, 1200)))(() => import('./transitions').then((m) => m.initTransizioni({ getLenis })), { timeout: 2500 });

document.addEventListener('astro:page-load', () => {
  initNav();
  avviaPagina();
});
document.addEventListener('astro:before-swap', chiudiPagina);
document.addEventListener('astro:after-swap', () => {
  lenis?.scrollTo(0, { immediate: true, force: true });
  lenis?.resize();
});

// Le immagini e i font cambiano le altezze: ricalcola i trigger
window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
