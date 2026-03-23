import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/postcss';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://grantwisdom.com',
  base: '/blog/',
  trailingSlash: 'ignore',
  build: {
    format: 'directory'
  },
  integrations: [react(), sitemap(), mdx()],
  vite: {
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
        ],
      },
    },
  },
});