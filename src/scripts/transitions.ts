import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { riduci } from './motion';
import type Lenis from 'lenis';

gsap.registerPlugin(MorphSVGPlugin);

// Forme della pennellata (viewBox 0 0 100 100, stirata a tutto schermo): bordo d'attacco ondulato come la pennellata del logo.
const F = {
  vuota: 'M-6,0 C-6,18 -6,36 -6,52 C-6,70 -6,86 -6,100 L-6,100 L-6,0 Z',
  meta: 'M-6,0 L58,0 C70,18 46,36 60,52 C76,70 50,86 64,100 L-6,100 L-6,0 Z',
  piena: 'M-6,0 L112,0 C112,18 112,36 112,52 C112,70 112,86 112,100 L-6,100 L-6,0 Z',
  uscita: 'M44,0 L112,0 C112,18 112,36 112,52 C112,70 112,86 112,100 L40,100 C26,86 52,70 36,52 C22,36 46,18 44,0 Z',
  fine: 'M112,0 L112,0 C112,18 112,36 112,52 C112,70 112,86 112,100 L112,100 C112,86 112,70 112,52 C112,36 112,18 112,0 Z',
};

export function initTransizioni({ getLenis }: { getLenis: () => Lenis | null }) {
  if (riduci() || !document.startViewTransition && !('animate' in Element.prototype)) return;
  const forma = () => document.querySelector<SVGPathElement>('.transizione__forma');
  let coperto = false;

  document.addEventListener('astro:before-preparation', (ev) => {
    const e = ev as Event & { loader: () => Promise<void>; to: URL; from: URL };
    if (e.to.pathname === e.from.pathname) return;
    const p = forma();
    if (!p) return;
    const originale = e.loader;
    e.loader = async () => {
      getLenis()?.stop();
      const anim = gsap.timeline()
        .set(p, { morphSVG: F.vuota })
        .to(p, { morphSVG: F.meta, duration: 0.28, ease: 'power2.in' })
        .to(p, { morphSVG: F.piena, duration: 0.3, ease: 'power2.out' });
      coperto = true;
      await Promise.all([originale(), anim.then()]);
    };
  });

  document.addEventListener('astro:after-swap', () => {
    if (!coperto) return;
    const p = forma();
    coperto = false;
    getLenis()?.start();
    if (!p) return;
    gsap.timeline({ delay: 0.05 })
      .to(p, { morphSVG: F.uscita, duration: 0.32, ease: 'power2.in' })
      .to(p, { morphSVG: F.fine, duration: 0.32, ease: 'power2.out' })
      .set(p, { morphSVG: F.vuota });
  });
}
