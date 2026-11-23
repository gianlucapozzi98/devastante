import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { EASE, riduci } from './motion';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Rivelazione sobria all'ingresso: [data-rivela] (o i figli diretti). Solo trasformazioni e opacità, una volta. */
export default function rivela(el: HTMLElement) {
  if (riduci()) return;
  const target = el.querySelectorAll<HTMLElement>('[data-rivela]');
  const items = target.length ? Array.from(target) : (Array.from(el.children) as HTMLElement[]);
  const split: SplitText[] = [];
  items.forEach((it) => {
    if (it.hasAttribute('data-split')) {
      // parole che salgono da una maschera, con un leggero ondeggiamento come le lettere del logo
      const s = SplitText.create(it, { type: 'words', mask: 'words', aria: /^H[1-6]$/.test(it.tagName) ? 'auto' : 'none' });
      split.push(s);
      gsap.from(s.words, { yPercent: 110, rotation: 6, duration: 0.9, stagger: 0.06, ease: EASE.lettere, scrollTrigger: { trigger: it, start: 'top 88%', once: true } });
      return;
    }
    gsap.from(it, { y: 36, opacity: 0, duration: 0.9, ease: EASE.out, scrollTrigger: { trigger: it, start: 'top 88%', once: true } });
  });
  return () => split.forEach((s) => s.revert());
}
