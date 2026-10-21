import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://raulcardenasmontoya.me',
  output: 'static',
  integrations: [sitemap()]
});