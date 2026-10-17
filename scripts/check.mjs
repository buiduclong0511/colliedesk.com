// Verifies the built site in _site/: every page has a Markdown twin, an llms.txt entry,
// a sitemap entry, canonical + alternate links and valid JSON-LD; every internal link and
// fragment resolves; the JavaScript budget holds. Exits 1 on any failure.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://colliedesk.com';
const UPDATES_FORM_URL = 'https://app.colliedesk.com/api/v1/public/forms/hclabs';
const JS_BUDGET_BYTES = 100 * 1024;
const REQUIRED_PAGES = [
  '/', '/pricing', '/migrate/freshdesk', '/vs/freshdesk', '/vs/zendesk', '/vs/help-scout',
  '/open-source', '/roadmap', '/docs', '/changelog', '/privacy', '/terms',
  '/self-hosted-helpdesk', '/migrate/freshdesk/done-for-you', '/helpdesk-for-small-teams',
  '/vs/zammad', '/vs/chatwoot', '/vs/freescout', '/vs/zoho-desk', '/vs/happyfox', '/vs/gorgias',
  '/vs/hubspot-service-hub', '/vs/groove', '/freshdesk-alternative', '/freshdesk-pricing-history', '/compare',
];
const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];

const outDir = fileURLToPath(new URL('../_site/', import.meta.url));
const errors = [];
const fail = (msg) => { if (!errors.includes(msg)) errors.push(msg); };

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// _site/pricing.html -> /pricing, _site/index.html -> /, _site/docs/install.html -> /docs/install
function urlPathOf(htmlFile) {
  const rel = relative(outDir, htmlFile).split(sep).join('/').replace(/\.html$/, '');
  return rel === 'index' ? '/' : `/${rel}`;
}
const mdPathOf = (urlPath) => (urlPath === '/' ? '/index.md' : `${urlPath}.md`);

// Same resolution rules as Cloudflare Pages and scripts/serve.mjs.
function fileFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const base = join(outDir, clean);
  const candidates = clean.endsWith('/')
    ? [join(base, 'index.html')]
    : [base, `${base}.html`, join(base, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
}

const idsCache = new Map();
function idsIn(file) {
  if (!idsCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
}

function checkLink(href, fromUrlPath, where) {
  if (/^(mailto:|tel:|data:)/.test(href)) return;
  let target = href;
  if (href.startsWith(ORIGIN)) target = href.slice(ORIGIN.length) || '/';
  else if (/^https?:\/\//.test(href)) return; // external, not crawled here
  if (target.startsWith('#')) target = fromUrlPath + target;
  if (!target.startsWith('/')) return fail(`${where}: relative link "${href}" (use root-relative)`);
  const [pathPart, fragment] = target.split('#');
  const file = fileFor(pathPart || '/');
  if (!file) return fail(`${where}: broken link "${href}"`);
  if (fragment && file.endsWith('.html') && !idsIn(file).has(fragment)) {
    fail(`${where}: missing fragment "#${fragment}" in ${pathPart}`);
  }
}

if (!existsSync(outDir)) {
  console.error('FAIL _site/ does not exist; run `pnpm build` first');
  process.exit(1);
}

const files = walk(outDir);
const pages = files.filter((f) => f.endsWith('.html') && !f.endsWith(`${sep}404.html`));
const read = (name) => (existsSync(join(outDir, name)) ? readFileSync(join(outDir, name), 'utf8') : '');
const llms = read('llms.txt');
const llmsFull = read('llms-full.txt');
const sitemap = read('sitemap.xml');
const robots = read('robots.txt');

if (!llms.startsWith('# ')) fail('llms.txt missing or has no H1');
if (!/^> /m.test(llms)) fail('llms.txt has no blockquote summary');
if (!llmsFull) fail('llms-full.txt missing');
if (!sitemap.includes('<urlset')) fail('sitemap.xml missing');
if (!/Sitemap: https:\/\/colliedesk\.com\/sitemap\.xml/.test(robots)) fail('robots.txt has no Sitemap line');
for (const bot of AI_CRAWLERS) {
  if (!new RegExp(`User-agent: ${bot}\\s*\\nAllow: /`).test(robots)) fail(`robots.txt does not allow ${bot}`);
}

const urlPaths = pages.map(urlPathOf);
for (const required of REQUIRED_PAGES) {
  if (!urlPaths.includes(required)) fail(`required page ${required} not built`);
}

let jsBytes = 0;
for (const file of files.filter((f) => f.endsWith('.js') || f.endsWith('.mjs'))) jsBytes += statSync(file).size;

for (const file of pages) {
  const urlPath = urlPathOf(file);
  const html = readFileSync(file, 'utf8');
  const mdUrl = mdPathOf(urlPath);
  const canonical = `${ORIGIN}${urlPath}`;
  const where = urlPath;

  if (!fileFor(mdUrl)) fail(`${where}: no Markdown twin at ${mdUrl}`);
  if (!llms.includes(`(${ORIGIN}${mdUrl})`)) fail(`${where}: no llms.txt entry for ${ORIGIN}${mdUrl}`);
  if (!llmsFull.includes(`Source: ${canonical}\n`)) fail(`${where}: not in llms-full.txt`);
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) fail(`${where}: not in sitemap.xml`);
  if (!html.includes(`<link rel="canonical" href="${canonical}">`)) fail(`${where}: canonical missing or wrong`);
  if (!html.includes(`<link rel="alternate" type="text/markdown" href="${mdUrl}">`)) fail(`${where}: markdown alternate link missing`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail(`${where}: <title> missing or too short`);
  if (!/<meta name="description" content="[^"]{50,}">/.test(html)) fail(`${where}: meta description missing or under 50 chars`);
  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(`${where}: expected exactly one <h1>, found ${h1s.length}`);
  if (/Be Vietnam Pro/i.test(html)) fail(`${where}: banned typeface referenced`);
  // Every page offers the updates box: an email field with a label, posting to the web form
  // channel of HC Labs' own Colliedesk workspace, plus the empty honeypot the endpoint expects.
  const form = html.match(/<form[^>]*data-updates-form[^>]*>[\s\S]*?<\/form>/)?.[0] || '';
  if (!form) fail(`${where}: updates form missing`);
  else {
    if (!form.includes(`action="${UPDATES_FORM_URL}"`)) fail(`${where}: updates form does not post to ${UPDATES_FORM_URL}`);
    if (!/<label for="updates-email"/.test(form) || !/<input[^>]*id="updates-email"[^>]*type="email"[^>]*required/.test(form)) fail(`${where}: updates form has no labelled required email field`);
    if (!/<input[^>]*name="website"[^>]*tabindex="-1"/.test(form)) fail(`${where}: updates form has no honeypot`);
  }

  for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (m[1].includes('application/ld+json')) {
      try { JSON.parse(m[2]); } catch (e) { fail(`${where}: invalid JSON-LD (${e.message})`); }
    } else {
      jsBytes += Buffer.byteLength(m[2]);
    }
  }
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) checkLink(m[1], urlPath, where);

  const md = fileFor(mdUrl) ? readFileSync(fileFor(mdUrl), 'utf8') : '';
  for (const m of md.matchAll(/\]\(([^)\s]+)\)/g)) checkLink(m[1], urlPath, `${mdUrl}`);
}

// The founding price is locked for life, so its storage cap must be stated wherever the offer is.
for (const path of ['/', '/pricing']) {
  const file = fileFor(path);
  if (file && !readFileSync(file, 'utf8').includes('20 GB of attachments')) fail(`${path}: founding offer does not state the 20 GB attachment cap`);
}

// A static Polar checkout link sells Founding to a buyer who has no workspace: the payment lands
// and nothing is created. Founding is bought inside the app, after sign-up, so the checkout carries
// the workspace.
for (const file of files.filter((f) => /\.(html|md|txt)$/.test(f))) {
  if (readFileSync(file, 'utf8').includes('buy.polar.sh/')) fail(`${file.slice(outDir.length - 1)}: links a static Polar checkout; send buyers to the app (${'app.colliedesk.com/settings/billing?buy=founding'})`);
}

// The Founding refund promise must sit wherever the Founding checkout is offered, and the terms
// must define it at /terms#refunds, the anchor those pages link to.
for (const file of files.filter((f) => /\.(html|md)$/.test(f))) {
  const text = readFileSync(file, 'utf8');
  if (text.includes('app.colliedesk.com/settings/billing?buy=founding') && !/30-day money-back|within 30 days/.test(text)) {
    fail(`${file.slice(outDir.length - 1)}: offers the Founding checkout without the 30-day money-back guarantee`);
  }
}
{
  const terms = fileFor('/terms');
  if (terms && !readFileSync(terms, 'utf8').includes('id="refunds"')) fail('/terms: no #refunds section for the Founding money-back guarantee');
}

// Founding closes at ten places. A site built from a closed state must not link to the checkout,
// and an open state with a known count must show it on the home page.
const foundingFile = process.env.FOUNDING_STATE_FILE ?? 'founding-state.json';
if (existsSync(foundingFile)) {
  const founding = JSON.parse(readFileSync(foundingFile, 'utf8'));
  const checkout = 'app.colliedesk.com/settings/billing?buy=founding';
  if (founding.open === false) {
    for (const file of files.filter((f) => /\.(html|md|txt)$/.test(f))) {
      if (readFileSync(file, 'utf8').includes(checkout)) fail(`${file.slice(outDir.length - 1)}: founding is closed but the page links to its checkout`);
    }
  } else if (Number.isInteger(founding.taken)) {
    const home = fileFor('/');
    if (home && !readFileSync(home, 'utf8').includes('places left')) fail('/: founding is open with a known count but the home page does not show the places left');
  }
}

for (const m of llms.matchAll(/\]\(([^)\s]+)\)/g)) checkLink(m[1], '/', 'llms.txt');

// Web analytics run on every page and never store anything in the visitor's browser, so the site
// needs no cookie banner. Switching PostHog to cookies or person profiles must fail here first.
const analytics = join(outDir, 'analytics.js');
if (!existsSync(analytics)) fail('analytics.js not built');
else {
  const source = readFileSync(analytics, 'utf8');
  if (!/cookieless_mode:\s*'always'/.test(source)) fail("analytics.js: PostHog must run with cookieless_mode: 'always'");
  if (!/person_profiles:\s*'never'/.test(source)) fail("analytics.js: PostHog must run with person_profiles: 'never'");
}
for (const file of pages) {
  if (!readFileSync(file, 'utf8').includes('<script src="/analytics.js" defer></script>')) fail(`${urlPathOf(file)}: analytics.js not loaded`);
}

// The Freshdesk page leads with price, so its chart must let a visitor pick a team size, say where
// Colliedesk stops being the cheaper choice, and carry a price read date that is kept fresh.
// Expected figures are worked by hand from Freshdesk's monthly-billing list prices (Growth $23,
// Pro $66, Copilot $35 per agent) against Colliedesk Team $49 per workspace, also billed monthly,
// so both sides of the chart use the same billing period.
const PRICE_MAX_AGE_DAYS = 90;
{
  const vsHtml = read('vs/freshdesk.html');
  const vsMd = read('vs/freshdesk.md');
  const chart = vsHtml.match(/<figure class="vs-chart"[\s\S]*?<\/figure>/)?.[0] ?? '';
  if (!chart) fail('/vs/freshdesk: price chart (figure.vs-chart) missing');
  for (const n of [1, 3, 5, 10, 25]) {
    if (!new RegExp(`<input[^>]*name="agents"[^>]*value="${n}"`).test(chart)) fail(`/vs/freshdesk: no ${n}-agent option in the price chart`);
    if (!chart.includes(`data-agents="${n}"`)) fail(`/vs/freshdesk: no price list for ${n} agents`);
  }
  if ((chart.match(/name="agents"[^>]*checked/g) ?? []).length !== 1) fail('/vs/freshdesk: price chart needs exactly one team size checked by default');
  const list = (n) => chart.match(new RegExp(`<ol[^>]*data-agents="${n}"[\\s\\S]*?</ol>`))?.[0] ?? '';
  // A bar total renders as "$19<small>", so this cannot match $190 or $490.
  const total = (html, amount) => html.includes(`>${amount}<small>`);
  const block = (n) => chart.match(new RegExp(`data-size="${n}"[\\s\\S]*?(?=data-size=|<p class="vs-fit-line")`))?.[0] ?? '';
  if (!total(list(3), '$69') || !total(list(3), '$49')) fail('/vs/freshdesk: 3 agents must show Freshdesk Growth $69 and Colliedesk $49');
  if (!total(list(5), '$505') || !block(5).includes('$5,472 a year')) fail('/vs/freshdesk: 5 agents must show Freshdesk Pro + Copilot $505 and a $5,472 yearly saving');
  if (!total(list(1), '$23')) fail('/vs/freshdesk: 1 agent must show Freshdesk Growth $23, cheaper than Colliedesk');
  if (!/billed monthly/.test(chart)) fail('/vs/freshdesk: chart must say Freshdesk prices are billed monthly, like the Colliedesk $49');
  if (!/from 3 to 25 agents/.test(chart)) fail('/vs/freshdesk: chart must say Colliedesk costs less from 3 to 25 agents');
  // 25 agents: Growth 25 x $23 = $575, Colliedesk Team 25 is $99 flat.
  if (!total(list(25), '$575') || !total(list(25), '$99')) fail('/vs/freshdesk: 25 agents must show Freshdesk Growth $575 and Colliedesk Team 25 $99');
  if (!/more than 25 agents/.test(vsHtml)) fail('/vs/freshdesk: "not for you yet" must stop at 25 agents');
  const readOn = chart.match(/data-read-on="(\d{4}-\d{2}-\d{2})"/)?.[1];
  if (!readOn) fail('/vs/freshdesk: price chart has no data-read-on date');
  else if ((Date.now() - Date.parse(readOn)) / 86_400_000 > PRICE_MAX_AGE_DAYS) {
    fail(`/vs/freshdesk: competitor prices read ${readOn}, older than ${PRICE_MAX_AGE_DAYS} days; read them again`);
  }
  if (!/id="fit"/.test(vsHtml) || !/Not for you yet/.test(vsHtml)) fail('/vs/freshdesk: "who it fits" section missing');
  if (!vsMd.includes('## Who Colliedesk fits') || !vsMd.includes('| 3 agents |')) fail('/vs/freshdesk.md: twin lacks the price-by-team-size table or the fit section');
}

// Price comparisons outside /vs/freshdesk must also put both sides on one billing period. Expected
// figures are worked by hand: five agents on Freshdesk Pro + Copilot billed annually are
// 5 x ($55 + $29) x 12 = $5,040 a year against Colliedesk Team $490 a year, a 90% saving (floor);
// billed monthly they are 5 x ($66 + $35) = $505 a month against $49.
{
  const home = read('index.html');
  const homeMd = read('index.md');
  if (!home.includes('90% cheaper')) fail('/: hero must say 90% cheaper ($490 a year vs Freshdesk $5,040 a year, both billed annually)');
  if (!homeMd.includes('$5,040') || !homeMd.includes('$490') || !/per year, billed annually/.test(homeMd)) fail('/: five-agent bill must compare yearly totals billed annually ($5,040 vs $490)');
  if (!read('pricing.md').includes('$5,040 a year') || read('pricing.md').includes('$420 per month')) fail('/pricing: five-agent comparison must be $5,040 a year billed annually or $505 a month billed monthly');
  if (!read('helpdesk-for-small-teams.md').includes('| 5 | $115 | $505 | $49 |')) fail('/helpdesk-for-small-teams: table must use Freshdesk monthly-billing prices (5 agents: $115, $505) against $49 a month');
  if (!read('freshdesk-alternative.md').includes('$40.83')) fail('/freshdesk-alternative: annual-billed table must show Colliedesk at $40.83 a month ($490 a year)');
}

// Cloud plan limits. Team: 10 agents, 100 GB. Team 25: 25 agents, 250 GB, $99 a month or $990 a year.
// Extra storage is not sold self-serve, so no add-on price may appear. Teams above the caps are
// never sent to "contact us" for 10 agents: Team 25 covers up to 25.
{
  const supportMail = 'support@colliedesk.com';
  for (const name of ['pricing.html', 'pricing.md']) {
    const text = read(name);
    for (const needle of ['Team 25', '$99', '$990', 'Up to 25 agents', '250 GB of attachments', '100 GB of attachments', '$490', 'Need more storage? Email us', supportMail]) {
      if (!text.includes(needle)) fail(`/${name}: missing "${needle}"`);
    }
    if (/\+\s?100 GB|\$10 (a|per) month/.test(text)) fail(`/${name}: shows an extra-storage price; it is not sold self-serve`);
    if (!/customer email/i.test(text)) fail(`/${name}: does not say customer email keeps arriving over the cap`);
  }
  if (!/"name":"Colliedesk Cloud Team 25"[^}]*"price":"99"|"price":"99"[^}]*"name":"Colliedesk Cloud Team 25"/.test(read('pricing.html'))) fail('/pricing: JSON-LD has no Team 25 offer at 99');
  const stale = /(more than|above|over) 10 agents|Above that, email us/i;
  for (const file of pages) {
    const urlPath = urlPathOf(file);
    const md = read(`${urlPath === '/' ? 'index' : urlPath.slice(1)}.md`);
    if (stale.test(readFileSync(file, 'utf8')) || stale.test(md)) fail(`${urlPath}: still sends teams above 10 agents to "contact us"; Team 25 covers up to 25`);
  }
}

// Status honesty: the product is alpha and live on Colliedesk Cloud. No page may promise a
// release that has already happened ("v0.2"), call the product pre-alpha or say checkout is
// coming. The Team and Team 25 cards must start the free trial at the real signup entry, and
// every "Start free trial" button must go to the same place.
const TRIAL_URL = 'https://app.colliedesk.com/sign-in';
{
  const stale = /v0\.[2-9]|pre-alpha|checkout link is coming soon|\bin testing\b/i;
  for (const file of files.filter((f) => /\.(html|md|txt)$/.test(f))) {
    const m = readFileSync(file, 'utf8').match(stale);
    if (m) fail(`${file.slice(outDir.length - 1)}: stale status claim "${m[0]}"`);
  }
  const pricing = read('pricing.html');
  for (const plan of ['Cloud Team', 'Cloud Team 25']) {
    const card = pricing.match(new RegExp(`<article class="plan">\\s*<h2 class="plan-name">${plan}\\b[\\s\\S]*?</article>`))?.[0] ?? '';
    if (!card) fail(`/pricing: ${plan} card missing`);
    else if (!card.includes(`href="${TRIAL_URL}"`)) fail(`/pricing: ${plan} card has no free-trial CTA to ${TRIAL_URL}`);
  }
  for (const file of pages) {
    for (const m of readFileSync(file, 'utf8').matchAll(/<a[^>]*href="([^"]*)"[^>]*>\s*Start free trial/g)) {
      if (m[1] !== TRIAL_URL) fail(`${urlPathOf(file)}: "Start free trial" links to ${m[1]}, not ${TRIAL_URL}`);
    }
  }
}

// Shipped features must not be labelled as missing. Cc on replies shipped in colliedesk#75; a
// sentence or table row that names Cc must not call it beta or "not there yet". The changelog is
// history: the 0.0.x notes correctly say Cc was not in that release.
{
  const notYet = /not there yet|\(beta\)|\*\*Beta\*\*|>Beta</i;
  for (const file of files.filter((f) => /\.(html|md)$/.test(f) && !/[\\/]changelog\.(html|md)$/.test(f))) {
    const text = readFileSync(file, 'utf8').replace(/<\/(tr|p|li)>/g, '\n');
    for (const part of text.split(/[.!?]\s|\n/)) {
      if (/\bCc\b/.test(part) && notYet.test(part)) fail(`${file.slice(outDir.length - 1)}: lists Cc as not shipped: "${part.trim().slice(0, 90)}"`);
    }
  }
}

// /compare is the hub of every comparison page: each /vs page is linked from it, the header
// "Compare" link opens it, and every comparison page says the names are their owners' trademarks.
{
  const hub = read('compare.html');
  if (!hub) fail('/compare: hub page not built');
  for (const urlPath of urlPaths.filter((p) => p.startsWith('/vs/'))) {
    if (!hub.includes(`href="${urlPath}"`)) fail(`/compare: does not link ${urlPath}`);
  }
  const home = read('index.html');
  const nav = home.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? '';
  if (!/href="\/compare"[^>]*>Compare</.test(nav)) fail('header: "Compare" does not link /compare');
  for (const urlPath of urlPaths.filter((p) => p.startsWith('/vs/') || p === '/compare')) {
    const name = urlPath.slice(1);
    if (!read(`${name}.html`).includes('trademarks of their owners')) fail(`${urlPath}: no trademark note`);
    if (!read(`${name}.md`).includes('trademarks of their owners')) fail(`${urlPath}.md: no trademark note`);
  }
}

// Home hero: one competitor at a time, each with its own saving, without client JavaScript.
// The h1 keeps one stable sentence for screen readers; the rotating words are aria-hidden, and
// reduced motion shows Freshdesk only. Savings worked by hand from yearly bills for five agents,
// billed annually, against Cloud Team $490 a year: 1 - 490/5,040 = 90% (Freshdesk Pro + Copilot),
// 1 - 490/9,900 = 95% (Zendesk Suite Professional + Copilot, euros as dollars), 1 - 490/2,700 = 81%
// (Help Scout Plus).
{
  const home = read('index.html');
  const h1 = home.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? '';
  const spoken = h1.match(/<span class="visually-hidden">([^<]*)<\/span>/)?.[1] ?? '';
  for (const claim of ['90% cheaper than Freshdesk', '95% cheaper than Zendesk', '81% cheaper than Help Scout']) {
    if (!spoken.includes(claim)) fail(`/: h1 screen-reader text lacks "${claim}"`);
  }
  if (!/<span[^>]*aria-hidden="true"[^>]*class="h1-rotate"|<span[^>]*class="h1-rotate"[^>]*aria-hidden="true"/.test(h1)) fail('/: rotating h1 words must be aria-hidden');
  const css = read('styles.css');
  if (!/@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\.h1-rotate/.test(css)) fail('styles.css: rotating h1 has no reduced-motion rule');
  // WCAG 2.2.2: motion that starts by itself must stop within 5 seconds (duration + delay per item).
  for (const [, rule] of css.matchAll(/\.h1-item[^{]*\{[^}]*animation:\s*([^;}]+)/g)) {
    const secs = [...rule.matchAll(/([\d.]+)s\b/g)].map((m) => Number(m[1]));
    const end = (secs[0] ?? 0) + (secs[1] ?? 0);
    if (end > 5) fail(`styles.css: rotating h1 animation "${rule.trim()}" runs to ${end}s; WCAG 2.2.2 allows 5s`);
  }
  // Closing block: a year of Freshdesk bills for five agents against Colliedesk Team billed yearly.
  // 12 x $420 = $5,040; $5,040 - $490 = $4,550.
  if (!home.includes('Keep the difference')) fail('/: closing block "Keep the difference" missing');
  if (!home.includes('$5,040') || !home.includes('$4,550')) fail('/: closing block must show $5,040 a year and the $4,550 difference');
  for (const [name, needles] of [
    ['index.html', ['Why per workspace, not per agent?', 'Who is behind Colliedesk?', 'What happens over the limit?']],
    ['pricing.html', ['Why per workspace, not per agent?', 'Every feature on every plan']],
    ['vs/freshdesk.html', ['Where Freshdesk does more']],
  ]) {
    for (const needle of needles) if (!read(name).includes(needle)) fail(`/${name}: missing "${needle}"`);
  }
}

if (jsBytes > JS_BUDGET_BYTES) fail(`JavaScript budget exceeded: ${jsBytes} bytes > ${JS_BUDGET_BYTES}`);

const summary = `${pages.length} pages, ${urlPaths.length} Markdown twins checked, JS ${jsBytes} bytes (budget ${JS_BUDGET_BYTES})`;
if (errors.length) {
  for (const e of errors) console.error(`FAIL ${e}`);
  console.error(`\n${errors.length} problem(s); ${summary}`);
  process.exit(1);
}
console.log(`OK ${summary}`);
