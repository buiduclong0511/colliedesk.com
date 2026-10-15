// @astrojs/react, registered without its client entrypoint. Astro adds every renderer's client
// entrypoint to the browser bundle whether or not a page hydrates anything, which would ship
// ~220 KB of unused React. Without it React only renders at build time. A client:* directive is
// caught by no-bundled-client-js.ts.
import react from '@astrojs/react';
import type { AstroIntegration } from 'astro';

export function reactServerOnly(): AstroIntegration {
  const base = react();
  const setup = base.hooks['astro:config:setup'];
  return {
    ...base,
    hooks: {
      ...base.hooks,
      'astro:config:setup': async (params) => {
        if (!setup) throw new Error('@astrojs/react has no astro:config:setup hook; check the installed version');
        await setup({
          ...params,
          addRenderer: (renderer) => {
            const { clientEntrypoint: _dropped, ...serverOnly } = renderer;
            params.addRenderer(serverOnly);
          },
        });
      },
    },
  };
}
