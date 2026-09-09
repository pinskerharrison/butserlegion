import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { redirects } from './src/data/redirects.mjs';
const base = '/butserlegion';

export default defineConfig({
  site: 'https://pinskerharrison.github.io',
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (url) =>
        !Object.keys(redirects).some(
          path => new URL(url).pathname === `${base}${path}`
        ) && !url.endsWith('/404/')
    })
  ],
  redirects: Object.fromEntries(Object.entries(redirects).map(([from, to]) => [from, `${base}${to}`])),
  markdown: { syntaxHighlight: false },
});
