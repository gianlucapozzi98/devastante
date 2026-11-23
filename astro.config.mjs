// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';

// Su Vercel (variabile VERCEL impostata dalla piattaforma) si usa l'adattatore Vercel;
// in locale e su un server proprio l'adattatore Node.
const suVercel = !!process.env.VERCEL;

// Dominio: SITE_URL se impostato; su Vercel l'indirizzo di produzione del progetto;
// altrimenti ".example", dominio riservato (RFC 2606) come segnaposto evidente.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://devastante.example');

export default defineConfig({
  site,
  trailingSlash: 'never',
  // la classe di scope passa ai componenti figli tramite la prop class
  scopedStyleStrategy: 'class',
  build: { format: 'file', inlineStylesheets: 'always' },
  // Pagine statiche; solo /keystatic, /api/keystatic e /api/iscrizione sono su richiesta.
  output: 'static',
  adapter: suVercel ? vercel() : node({ mode: 'standalone' }),
  integrations: [
    sitemap({
      filter: (page) => !/\/(keystatic|api)\b/.test(page) && !page.endsWith('/404'),
    }),
    react(),
    keystatic(),
  ],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: { responsiveStyles: false },
  devToolbar: { enabled: false },
  vite: {
    // compatibilità anche con browser di qualche anno fa (Mac non aggiornati): sintassi abbassata a ES2020
    build: { assetsInlineLimit: 2048 },
    environments: { client: { build: { target: ['chrome87', 'edge88', 'firefox78', 'safari14'] } } },
  },
});
