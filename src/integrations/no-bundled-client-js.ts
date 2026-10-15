// Fails the build when Astro bundles any client JavaScript into _astro/: a client:* directive on a
// React component, or a processed <script> in an .astro file. The only scripts this site ships are
// public/theme.js and public/updates.js, loaded with is:inline.
import { readdir } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';

export const noBundledClientJs = (): AstroIntegration => ({
  name: 'no-bundled-client-js',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      let bundled: string[];
      try {
        bundled = (await readdir(new URL('_astro/', dir), { recursive: true })).filter((f) => /\.m?js$/.test(f));
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') return; // nothing bundled at all
        throw err;
      }
      if (bundled.length) {
        throw new Error(
          `client JavaScript was bundled into _astro/ (${bundled.join(', ')}). React renders at build time only: ` +
            'remove the client:* directive, or load a vanilla script from public/ with <script is:inline>.',
        );
      }
    },
  },
});
