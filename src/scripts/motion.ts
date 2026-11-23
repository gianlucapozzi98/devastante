import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

/** Le stesse curve di src/styles/global.css (--ease-out, --ease-io). */
export const EASE = {
  out: CustomEase.create('dev-out', 'M0,0 C0.16,1 0.3,1 1,1'),
  io: CustomEase.create('dev-io', 'M0,0 C0.65,0 0.35,1 1,1'),
  lettere: 'back.out(1.6)',
} as const;

export const DUR = { micro: 0.18, ui: 0.45, scene: 0.9, apertura: 1.1 } as const;

/**
 * Movimento ridotto: segue l'impostazione del sistema ("Riduci movimento" su Mac, "Effetti di animazione"
 * su Windows) salvo una scelta esplicita del visitatore (localStorage "dev-movimento": "si" | "no").
 * La decisione la prende lo script in <head> prima del primo disegno e la scrive come classe sull'<html>.
 */
export const riduci = (): boolean => document.documentElement.classList.contains('movimento-ridotto');
export const desktop = (): boolean => window.matchMedia('(min-width: 900px)').matches;
export const puntatoreFine = (): boolean => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
