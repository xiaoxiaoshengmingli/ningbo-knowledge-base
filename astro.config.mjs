import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import pagefind from 'astro-pagefind';

export default defineConfig({
  output: 'static',
  site: 'https://xiaoxiaoshengmingli.github.io',
  base: '/ningbo-knowledge-base/',
  integrations: [pagefind()],
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    ssr: {
      noExternal: ['astro-pagefind'],
    },
  },
});
