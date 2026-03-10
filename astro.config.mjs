// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [preact(), tailwind()],
  site: 'https://counttokens.lokeshadapa.com',
  adapter: cloudflare(),
});