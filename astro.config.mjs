import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/postcss';

// https://astro.build/config
export default defineConfig({
  base: '/blog',
  integrations: [react()],
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
