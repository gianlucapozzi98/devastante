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
