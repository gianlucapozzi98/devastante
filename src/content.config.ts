import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const foto = z.string().nullable().optional();

const capitoli = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/capitoli' }),
  schema: z.object({
    titolo: z.string(),
    ordine: z.number(),
    ancora: z.string(),
    etichetta: z.string(),
    occhiello: z.string(),
    testo: z.string(),
    nota: z.string().optional(),
    foto: z
      .array(z.object({ src: foto, alt: z.string(), didascalia: z.string().optional(), consenso: z.boolean().default(false) }))
      .default([]),
  }),
});

const menu = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/menu' }),
  schema: z.object({
    nome: z.string(),
    categoria: z.enum(['pizze', 'smash', 'bevande']),
    ordine: z.number(),
    descrizione: z.string().default(''),
    ingredienti: z.array(z.string()).default([]),
    allergeni: z.array(z.string()).default([]),
    prezzo: z.string().default(''),
    unita: z.enum(['da-confermare', 'trancio', 'kg', 'pezzo']).default('da-confermare'),
    foto,
    confermato: z.boolean().default(false),
  }),
});

const offerte = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/offerte' }),
  schema: z.object({
    titolo: z.string(),
    testo: z.string(),
    dal: z.string().nullable().optional(),
    al: z.string().nullable().optional(),
    attiva: z.boolean().default(false),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/faq' }),
  schema: z.object({
    domanda: z.string(),
    ordine: z.number(),
    risposta: z.string(),
    confermata: z.boolean().default(false),
  }),
});

export const collections = { capitoli, menu, offerte, faq };
