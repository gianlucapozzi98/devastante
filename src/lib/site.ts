import { z } from 'astro/zod';
import impostazioniRaw from '../data/impostazioni.json';
import orariRaw from '../data/orari.json';
import aziendaRaw from '../data/azienda.json';
import smashRaw from '../data/smash.json';

const s = z.string().default('');
export const impostazioni = z
  .object({
    prestoInApertura: z.boolean().default(true),
    dataApertura: z.string().nullable().default(null),
    indirizzo: s, cap: s, citta: s, telefono: s, whatsapp: s, email: s,
    mappaUrl: z.string().nullable().default(null),
    mappaEmbed: z.string().nullable().default(null),
    app: z.array(z.object({ nome: s, url: z.string().nullable() })).default([]),
    social: z.array(z.object({ nome: s, url: z.string().nullable() })).default([]),
    asporto: z.enum(['da-confermare', 'si', 'no']).default('da-confermare'),
    consegna: z.enum(['da-confermare', 'app', 'diretta', 'no']).default('da-confermare'),
    pagamenti: s,
  })
  .parse(impostazioniRaw);

export const orari = z
  .object({
    giorni: z.array(z.object({ giorno: z.string(), stato: z.enum(['da-confermare', 'aperto', 'chiuso']), fasce: s })),
    nota: s,
  })
  .parse(orariRaw);

export const azienda = z
  .object({ ragioneSociale: s, formaGiuridica: s, sedeLegale: s, codiceFiscale: s, partitaIva: s, rea: s, capitaleSociale: s, pec: s })
  .parse(aziendaRaw);

export const smash = z
  .object({
    strati: z.array(z.object({ nome: z.string(), descrizione: s, confermato: z.boolean(), foto: z.string().nullable().optional() })),
  })
  .parse(smashRaw);

/** Nome e dati certi (dal documento di direzione artistica). */
export const SITE = {
  nome: 'DEVASTANTE',
  sottotitolo: 'Pizza e smash',
  citta: 'Cesano Boscone',
  titoloDefault: 'DEVASTANTE | Pizza in teglia e smash burger a Cesano Boscone',
  descrizioneDefault:
    'Pizza in teglia con lievito madre e smash burger a Cesano Boscone, in memoria dei nonni di TABISCA. Guarda il menu e scopri come ordinare.',
} as const;

export const prestoInApertura = impostazioni.prestoInApertura;

/** Ordina: tel: se c'è il telefono, altrimenti la sezione "Come ordinare". */
export function ordinaHref(): string {
  if (!prestoInApertura && impostazioni.telefono) return `tel:${impostazioni.telefono.replace(/\s+/g, '')}`;
  return '/dove-siamo#ordina';
}

export const indirizzoCompleto = (): string | null =>
  impostazioni.indirizzo ? `${impostazioni.indirizzo}, ${impostazioni.cap} ${impostazioni.citta}`.replace(/\s+,/g, ',').trim() : null;

export function dataAperturaLeggibile(): string | null {
  if (!impostazioni.dataApertura) return null;
  const d = new Date(impostazioni.dataApertura + 'T12:00:00');
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}
