# colliedesk.com

Static marketing and docs site. No client JavaScript.

```sh
git clone --depth 1 https://github.com/colliedesk/colliedesk product   # docs source, gitignored
corepack pnpm install
corepack pnpm build   # writes _site/
corepack pnpm check   # links, .md twins, llms.txt, sitemap, JSON-LD, JS budget (100 KB)
corepack pnpm serve   # http://localhost:4321 with Cloudflare Pages URL rules
```

- Pages live in `src/pages/*.mjs`. Every page builds an HTML file and a Markdown twin (`/pricing` and `/pricing.md`).
- `/docs` and `/roadmap` render `docs/user/*.md` and `ROADMAP.md` from [colliedesk/colliedesk](https://github.com/colliedesk/colliedesk). Edit those files there, not here. The build reads them from `./product` (override with `PRODUCT_DIR=/path/to/checkout`). CI rebuilds every 6 hours, on `workflow_dispatch`, and on a `product-docs-changed` repository dispatch.
- Shared facts (prices, positioning, repo URL) are in `src/site.mjs`. Competitor prices carry their source and read date on each `/vs` page.
- Mark unshipped features with `**Coming v0.N**` in Markdown; the build turns it into a badge.
- Deploy: GitHub Pages from `.github/workflows/site.yml`, custom domain `colliedesk.com`, output directory `_site` (`_headers` keeps the Cloudflare Pages rules for `pnpm serve`).

## Design

References: t3.codes (honest "what are you selling me", fork-it, terminal snippets), plausible.io
("X alternative" positioning, transparent pricing, vs pages), cal.com (pricing answered in the FAQ,
footer comparison links).

Tokens are at the top of `src/styles.css`: ink `#15171a`, paper `#ffffff` / `#f4f5f7`, collie sable
`#a8481c` (links, primary buttons, 5.8:1 on white), ember `#f08a50` (accents on dark only), focus
`#1f5fd1`. System sans and mono stacks, no web fonts. Buttons are at least 44 px tall.
