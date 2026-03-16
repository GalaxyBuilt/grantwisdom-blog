import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/postcss';

// https://astro.build/config
export default defineConfig({
  // Deploy to root of domain (grantwisdom-blog.pages.dev)
  // Worker proxy on grantwisdom.com/blog/* will rewrite paths at the edge
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
