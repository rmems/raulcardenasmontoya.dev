import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://raulcardenasmontoya.me',
  output: 'static',
  // /projects/ was merged into /work/.
  redirects: { '/projects/': '/work/' },
  integrations: [sitemap()]
});