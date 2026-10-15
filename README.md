# colliedesk.com

Static marketing and docs site. Client JavaScript is limited to the theme toggle, the updates form and cookieless PostHog web analytics (`src/static/analytics.js`: no cookies or browser storage, no person profiles, IP discarded; `pnpm check` fails if that changes).

```sh
git clone --depth 1 https://github.com/colliedesk/colliedesk product   # docs source, gitignored
corepack pnpm install
corepack pnpm build   # writes _site/
corepack pnpm check   # links, .md twins, llms.txt, sitemap, JSON-LD, JS budget (100 KB)
corepack pnpm serve   # http://localhost:4321 with Cloudflare Pages URL rules
```

- Pages live in `src/pages/*.mjs`. Every page builds an HTML file and a Markdown twin (`/pricing` and `/pricing.md`).
- `/docs` and `/roadmap` render `docs/user/*.md` and `ROADMAP.md` from [colliedesk/colliedesk](https://github.com/colliedesk/colliedesk). Edit those files there, not here. The build reads them from `./product` (override with `PRODUCT_DIR=/path/to/checkout`). Every 15 minutes CI compares those docs on `main` with `/product-docs-version.txt` on the live site (`scripts/product-docs-version.sh`) and rebuilds when they differ. To preview unmerged docs, run the Site workflow with `product_ref` set to a branch of colliedesk/colliedesk: it builds, checks and uploads the site as an artifact without deploying. Pull requests there that touch the docs build this site too, so a broken link fails before merge.
- Shared facts (prices, positioning, repo URL) are in `src/site.mjs`. Competitor prices carry their source and read date on each `/vs` page.
- Mark unshipped features with `**Coming v0.N**` in Markdown; the build turns it into a badge.
- Deploy: GitHub Pages from `.github/workflows/site.yml`, custom domain `colliedesk.com`, output directory `_site` (`_headers` keeps the Cloudflare Pages rules for `pnpm serve`).

## Design

References: t3.codes (honest "what are you selling me", fork-it, terminal snippets), plausible.io
("X alternative" positioning, transparent pricing, vs pages), cal.com (pricing answered in the FAQ,
footer comparison links).

Brand: Blue Merle, shared with the app. `src/static/tokens.css` is a copy of the app's
`web/src/styles/tokens.css` (change it there first; the app repo checks contrast for every pair).
Light is the default; the footer **Dark theme** button sets `data-theme="dark"` and saves it in
`localStorage` for this site only (`src/static/theme.js`; the app keeps its own setting). Self-hosted IBM Plex Sans and Mono,
sentence case everywhere, mono only for code. The hero shows the real light inbox
(`src/static/product-inbox.jpg`) with the reconcile report over its corner. Buttons are at least
44 px tall on touch.
