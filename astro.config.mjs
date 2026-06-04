import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

export default defineConfig({
  output: 'static',
  site: 'https://xiaoxiaoshengmingli.github.io',
  base: '/ningbo-knowledge-base/',
  integrations: [pagefind()],
});
