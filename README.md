# colliedesk.com

Static marketing and docs site, built with [Astro](https://astro.build), React and TypeScript.
React renders at build time only: the browser gets HTML, CSS and two small vanilla scripts
(`public/theme.js`, `public/updates.js`) plus PostHog web analytics (`public/analytics.js`:
cookieless until the visitor accepts cookies in the banner of `public/consent.js`, then cookie
and masked session replay; JavaScript errors always; no person profiles, IP discarded; `pnpm check` fails if that changes), no framework runtime.

```sh
git clone --depth 1 https://github.com/colliedesk/colliedesk product   # docs source, gitignored
corepack pnpm install
corepack pnpm dev         # astro dev on http://localhost:4321, reloads on save
corepack pnpm build       # astro build, writes _site/
corepack pnpm typecheck   # astro check: TypeScript (strictest) for .ts, .tsx and .astro
corepack pnpm check       # links, .md twins, llms.txt, sitemap, JSON-LD, JS budget (100 KB)
corepack pnpm serve       # serves _site/ on http://localhost:4321 with Cloudflare Pages URL rules
```

`dev`, `build` and `typecheck` read the docs from `./product`; set `PRODUCT_DIR=/path/to/checkout`
to use another checkout. `typecheck` works without it.

## Layout

- `src/data/pages/*.ts`: one typed `Page` (`src/lib/page.ts`) per page: title, description, hero,
  Markdown body, FAQ, JSON-LD. `src/data/pages/index.ts` lists them in llms.txt and sitemap order.
- `src/components/*.tsx`: React components for the header, footer parts, hero, pricing plans and the
  home page sections. `.astro` files render them to static HTML with `html(Component, props)` from
  `src/lib/render-react.ts` (`react-dom/server`), inside `<Fragment set:html={...} />`; there is no
  React integration. Markdown (bodies, FAQ answers) is rendered with `marked` in
  `src/lib/markdown.ts` and placed by the Astro components (`Prose.astro`, `Faq.astro`). The
  release-notes form is plain HTML in `UpdatesForm.astro`, posted by `public/updates.js`.
- `src/layouts/Base.astro`: the HTML document (head, canonical, Markdown alternate, JSON-LD, fonts).
- `src/pages/`: Astro routes. `[...slug].astro` builds every HTML page; `[...slug].md.ts` builds its
  Markdown twin (`/pricing` and `/pricing.md`); `llms.txt`, `llms-full.txt`, `sitemap.xml`,
  `robots.txt` and `changelog.xml` are static endpoints; `404.astro` is the not-found page.
  `_headers` is written after the build by `src/integrations/cloudflare-headers.ts`.
- `public/`: files served as they are (fonts, icons, images, CSS, the two scripts).
- `src/integrations/no-bundled-client-js.ts` fails the build if any script other than
  `theme.js`, `updates.js`, `analytics.js` and JSON-LD would ship (a bundled or inlined `<script>`). A `client:*`
  directive on a React component fails earlier: without a React renderer Astro cannot hydrate it.

## Content

- `/docs` and `/roadmap` render `docs/user/*.md` and `ROADMAP.md` from [colliedesk/colliedesk](https://github.com/colliedesk/colliedesk). Edit those files there, not here. Every 15 minutes CI compares those docs on `main` with `/product-docs-version.txt` on the live site (`scripts/product-docs-version.sh`) and rebuilds when they differ. To preview unmerged docs, run the Site workflow with `product_ref` set to a branch of colliedesk/colliedesk: it builds, checks and uploads the site as an artifact without deploying. Pull requests there that touch the docs build this site too, so a broken link fails before merge.
- Shared facts (prices, positioning, repo URL) are in `src/lib/site.ts`. Competitor prices carry their source and read date on each `/vs` page.
- Mark unshipped features with `**Coming v0.N**` in Markdown; the build turns it into a badge.
- Deploy: GitHub Pages from `.github/workflows/site.yml`, custom domain `colliedesk.com`, output directory `_site` (`_headers` keeps the Cloudflare Pages rules for `pnpm serve`).
- Refactors that should not change the output: build `main` and the branch into two directories and
  run `node scripts/compare-site.mjs <main-build> <branch-build>`. Non-HTML files must be
  byte-identical; HTML is compared after the normalisation described at the top of the script.

## Design

References: t3.codes (honest "what are you selling me", fork-it, terminal snippets), plausible.io
("X alternative" positioning, transparent pricing, vs pages), cal.com (pricing answered in the FAQ,
footer comparison links).

Colour rule (from how mailcheap.ai is built, 19/10/2026): the page is neutral grey and colour belongs to
the product pictures and the one action on the screen. Blue Merle is for the primary button, links, focus and
inside the pictures, never for eyebrows, card borders or section bands; `pnpm check` fails when `styles.css`
uses `var(--accent…)` more than its budget. Cards sit on a 1px shadow ring (`--ring`), not a border. The greys
are the site's own, at the top of `public/styles.css` (all text pairs at least 4.5:1); the rest comes from the app.

Brand: Blue Merle, shared with the app. `public/tokens.css` is a copy of the app's
`web/src/styles/tokens.css` (change it there first; the app repo checks contrast for every pair).
Light theme: cool grey surfaces (`--surface-0` `#f5f7fa`, cards `#ffffff`), ink text (`--text-1`
`#151c27`) and merle blue accent `--accent` `#2d62b3`, darkened so white text and links reach 4.5:1.
Dark theme: near-black surfaces (`--surface-0` `#0b0f15`), light text (`#e8edf4`) and a lighter
accent `#7aa5e6` with dark text on it. Spacing is a 4 px grid (`--space-*`), radii 4 to 10 px.
Light is the default; the footer **Dark theme** button sets `data-theme="dark"` and saves it in
`localStorage` for this site only (`public/theme.js`; the app keeps its own setting). Self-hosted IBM Plex Sans and Mono,
sentence case everywhere, mono only for code. The hero shows the real light inbox
(`public/product-inbox.jpg`) with the reconcile report over its corner. Buttons are at least
44 px tall on touch (`--touch`).
