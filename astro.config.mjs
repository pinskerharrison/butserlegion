import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { redirects } from './src/data/redirects.mjs';

export default defineConfig({
  site: 'https://pinskerharrison.github.io',
  base: '/butserlegion',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (url) =>
        !Object.keys(redirects).some(
          path => new URL(url).pathname === path
        ) && !url.endsWith('/404/')
    })
  ],
  redirects,
  markdown: { syntaxHighlight: false },
});