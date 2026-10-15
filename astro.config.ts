import { defineConfig } from 'astro/config';
import { cloudflareHeaders } from './src/integrations/cloudflare-headers';
import { noBundledClientJs } from './src/integrations/no-bundled-client-js';
import { reactServerOnly } from './src/integrations/react-server-only';

// Static output with the URL shapes Cloudflare Pages and GitHub Pages serve:
// /pricing -> pricing.html, /docs/install -> docs/install.html, no trailing slashes.
// React renders at site generation only: react-server-only.ts keeps its runtime out of the bundle
// and no-bundled-client-js.ts fails the build if any client JavaScript gets bundled.
export default defineConfig({
  site: 'https://colliedesk.com',
  outDir: './_site',
  trailingSlash: 'never',
  build: { format: 'file' },
  devToolbar: { enabled: false },
  integrations: [reactServerOnly(), noBundledClientJs(), cloudflareHeaders()],
});
