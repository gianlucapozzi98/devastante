import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { traccia } from '../tratto';
import { EASE, riduci } from '../motion';
import { suona } from '../sound';

gsap.registerPlugin(ScrollTrigger);

/**
 * Capitolo 1 — il "wow": la rotella taglia la teglia e il trancio del 1999 si alza.
 * Desktop: scena fissata e guidata dallo scroll. Telefono: tranci che arrivano in sequenza.
 */
export default function cap1999(el: HTMLElement) {
  if (riduci()) return;
  const mm = gsap.matchMedia();
  const teglia = el.querySelector<HTMLElement>('[data-teglia]')!;
  const fondo = el.querySelector<HTMLElement>('.teglia__fondo')!;
  const svg = el.querySelector<SVGSVGElement>('.teglia__tagli')!;
  const rotella = el.querySelector<SVGSVGElement>('.teglia__rotella')!;
  const lama = rotella.querySelector('.rotella__lama');
  const anno = el.querySelector<HTMLElement>('[data-trancio-anno]')!;
  const altri = Array.from(el.querySelectorAll<HTMLElement>('.teglia__griglia > *')).filter((c) => c !== anno);
  const testo = el.querySelectorAll('.cap-1999__testo > *');
  const tagli = Array.from(svg.querySelectorAll<SVGPathElement>('path'));

  mm.add('(min-width: 900px)', () => {
    tagli.forEach((t) => traccia(t, 0));
    gsap.set(testo, { y: 50, opacity: 0 });

    // la rotella segue il tracciato del taglio (coordinate SVG → pixel della teglia)
    const segui = (path: SVGPathElement, p: number) => {
      const len = path.getTotalLength();
      const pt = path.getPointAtLength(len * p);
      const r = svg.getBoundingClientRect();
      const t = teglia.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      const x = r.left - t.left + (pt.x / vb.width) * r.width;
      const y = r.top - t.top + (pt.y / vb.height) * r.height;
      const w = rotella.getBoundingClientRect().width;
      gsap.set(rotella, { x: x - w * 0.375, y: y - w * 0.375 });
      gsap.set(lama, { rotation: p * 720 });
    };
    const taglia = (tl: gsap.core.Timeline, path: SVGPathElement, pos: number | string, durata: number) => {
      const st = { p: 0 };
      tl.to(st, {
        p: 1, duration: durata, ease: 'none',
        onStart: () => suona('rotella', 0.5),
        onUpdate: () => { traccia(path, st.p); segui(path, st.p); },
      }, pos);
    };

    const tl = gsap.timeline({
      defaults: { ease: EASE.io },
      scrollTrigger: { trigger: el, start: 'top top', end: '+=230%', scrub: 0.7, pin: el.querySelector('.cap-1999__pin'), anticipatePin: 1 },
    });
    tl.fromTo(fondo, { scale: 0.9, rotation: -1.5 }, { scale: 1, rotation: 0, duration: 0.6 }, 0)
      .to(testo, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: EASE.out }, 0.1)
      .to(rotella, { opacity: 1, duration: 0.1 }, 0.5);
    taglia(tl, tagli[0], 0.55, 1);
    taglia(tl, tagli[1], 1.6, 0.42);
    taglia(tl, tagli[2], 2.05, 0.42);
    taglia(tl, tagli[3], 2.5, 0.42);
    tl.to(rotella, { opacity: 0, scale: 0.6, duration: 0.2 }, 2.95)
      .to(altri, { opacity: 0.32, filter: 'saturate(0.6)', duration: 0.5, stagger: 0.02 }, 3)
      .to(anno, { scale: 1.28, xPercent: 8, yPercent: 14, rotation: -5, boxShadow: '0 40px 60px -20px rgba(0,0,0,.45)', duration: 0.8, ease: EASE.out }, 3)
      .to(tagli, { opacity: 0.35, duration: 0.4 }, 3)

      .to({}, { duration: 0.6 });
  });

  mm.add('(max-width: 899px)', () => {
    const celle = el.querySelectorAll('.teglia__griglia > *');
    gsap.from(celle, {
      scale: 0.86, opacity: 0, duration: 0.7, stagger: { each: 0.07, from: 'start' }, ease: EASE.out,
      scrollTrigger: { trigger: teglia, start: 'top 80%', once: true },
    });
    gsap.from(testo, { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: EASE.out, scrollTrigger: { trigger: el.querySelector('.cap-1999__testo'), start: 'top 85%', once: true } });
  });

  return () => mm.revert();
}
