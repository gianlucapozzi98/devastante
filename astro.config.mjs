// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

// Dominio definitivo da confermare con il cliente: impostare SITE_URL in produzione.
// ".example" è un dominio riservato (RFC 2606): segnaposto evidente.
const site = process.env.SITE_URL ?? 'https://devastante.example';

export default defineConfig({
  site,
  trailingSlash: 'never',
  // la classe di scope passa ai componenti figli tramite la prop class
  scopedStyleStrategy: 'class',
  build: { format: 'file', inlineStylesheets: 'always' },
  // Pagine statiche; solo /keystatic, /api/keystatic e /api/iscrizione sono su richiesta.
  output: 'static',
  adapter: node({ mode: 'standalone' }),
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
    build: { assetsInlineLimit: 2048 },
  },
});
