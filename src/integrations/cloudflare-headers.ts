// Writes _headers into the build output. Astro ignores routes whose file name starts with "_",
// so this file cannot be a static endpoint like the other generated files.
import { writeFile } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';
import { allPages } from '../data/pages';
import { headersFile } from '../lib/feeds';

export const cloudflareHeaders = (): AstroIntegration => ({
  name: 'cloudflare-headers',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      await writeFile(new URL('_headers', dir), headersFile(allPages()));
      logger.info('wrote _headers');
    },
  },
});
