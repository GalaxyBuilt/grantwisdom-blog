import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/postcss';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  base: '/blog',
  integrations: [
    react(),
    sitemap(),
  ],
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
