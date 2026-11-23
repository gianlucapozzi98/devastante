import type { ImageMetadata } from 'astro';

/**
 * Catalogo delle foto vere del cliente in /assets/foto (vedi IMMAGINI.md).
 * Le immagini passano da sharp in build (AVIF/WebP, dimensioni responsive).
 */
const file = import.meta.glob<{ default: ImageMetadata }>('/assets/foto/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}', { eager: true });

export function trovaFoto(percorso?: string | null): ImageMetadata | null {
  if (!percorso) return null;
  const chiave = percorso.startsWith('/') ? percorso : `/assets/foto/${percorso}`;
  return file[chiave]?.default ?? null;
}

export const fotoDisponibili = () => Object.keys(file);

import prova from '../data/foto-prova.json';
import { impostazioni } from './site';

/** Foto di prova per uno spazio (solo se l'interruttore "Foto di prova" è acceso). */
export function fotoProva(slot?: string): { img: ImageMetadata; alt: string } | null {
  if (!slot || !impostazioni.fotoProva) return null;
  const nome = (prova.slot as Record<string, string>)[slot];
  if (!nome) return null;
  const img = trovaFoto(`/assets/foto/prova/${nome}.jpg`);
  const alt = (prova.foto as Record<string, string>)[nome] ?? '';
  return img ? { img, alt } : null;
}
