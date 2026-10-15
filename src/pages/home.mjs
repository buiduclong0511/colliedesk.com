import { FOUNDING_HREF, POSITIONING, PRICES_READ, REPO, TAGLINE } from '../site.mjs';
import { faqHtml, faqMarkdown } from '../layout.mjs';
import { faqPage, organization, softwareApplication } from '../schema.mjs';
import { renderMarkdown } from '../markdown.mjs';
import { statusTable } from './collie-status.mjs';
import { homeSections, homeSectionsMd, SAVING_PCT } from './home-sections.mjs';

// Headline pattern from mailcheap.ai: one number against the incumbents, then why the bill is lower.
// SAVING_PCT comes from the five-agent bill below (Freshdesk Pro + Freddy AI Copilot vs Cloud Team).
const H1 = `Run your helpdesk up to ${SAVING_PCT}% cheaper than Freshdesk, Zendesk and Help Scout.`;
const LEDE =
  'You pay for the workspace, not for every agent you add. Move from Freshdesk with your tickets, replies, private notes and attachments, and a reconcile report proves nothing was lost.';

const faq = [
  {
    q: 'What is Colliedesk?',
    a: 'Colliedesk is an open-source (AGPL-3.0) helpdesk for small support teams, made by HC Labs. It is the open-source alternative to Freshdesk, Zendesk and Help Scout: a shared inbox for your team, AI included at cost, one flat price per workspace.',
  },
  {
    q: 'Is Colliedesk free?',
    a: 'Self-hosting is free, forever, with every feature. Colliedesk Cloud costs $49 per workspace per month or $490 per year, with no per-agent fees. See [pricing](/pricing).',
  },
  {
    q: 'Is Colliedesk ready to use?',
    a: 'It is pre-alpha (v0.1). The shared inbox, notes, tags, assignment and passwordless sign-in work today. The email channel and the Freshdesk importer are built and in testing for v0.2. AI comes in v0.3. See the [roadmap](/roadmap).',
  },
  {
    q: 'How does AI pricing work?',
    a: 'AI is included, not an add-on. On Colliedesk Cloud you pay the model cost plus 30%, or bring your own key. Self-hosted installs use your own key.',
  },
  {
    q: 'Can I move my Freshdesk tickets to Colliedesk?',
    a: 'Yes, with the Freshdesk importer (coming v0.2): tickets, replies, notes, attachments, tags and contacts, with a reconcile report. Founding customers get the migration done for free. Read [the migration guide](/migrate/freshdesk).',
  },
];

const CHECK = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"/></svg>';
const SHIELD = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>';

// Illustrative numbers only; the figure is labelled EXAMPLE because the importer has not shipped.
const RECONCILE = [
  ['Tickets', '48,211'],
  ['Replies and notes', '312,904'],
  ['Attachments', '21,377', 'SHA-256'],
  ['Tags', '186'],
  ['Contacts', '9,402'],
];
const reconcileRows = RECONCILE.map(
  ([k, n, x]) => `<tr><td>${k}${x ? `<small>${x}</small>` : ''}</td><td>${n}</td><td>${n}</td><td class="okc">${CHECK}<span class="visually-hidden">Match</span></td></tr>`,
).join('');

const proof = `<figure class="proof" aria-labelledby="proof-title">
  <div class="proof-head"><figcaption id="proof-title">${SHIELD}Reconcile report <span class="ex">Example</span></figcaption><span class="src">northwind.freshdesk.com → <b>Colliedesk</b></span></div>
  <table><thead><tr><th scope="col">Item</th><th scope="col">Freshdesk</th><th scope="col">Colliedesk</th><th scope="col"><span class="visually-hidden">Result</span></th></tr></thead><tbody>${reconcileRows}</tbody></table>
  <div class="proof-foot">${CHECK}<b>0 lost.</b><span>Every count matches.</span><a href="/migrate/freshdesk#5-check-the-reconcile-report">How the check works</a></div>
  <p class="proof-note">Sample numbers. The Freshdesk importer is <span class="badge badge-coming">Coming v0.2</span></p>
</figure>`;

const install = `<div class="self">
  <figure class="install" aria-label="Self-host Colliedesk with one command">
<pre><code><span class="t-prompt">$</span> curl -fsSL https://raw.githubusercontent.com/colliedesk/colliedesk/main/install.sh \\
    | sh -s -- --name "Acme Support" --email "you@acme.com"
<span class="t-out"># prints a one-time sign-in link, no passwords</span></code></pre>
  </figure>
  <p class="install-label">Or self-host it free with one command.</p>
</div>`;

const statusHtml = `<section class="section" aria-labelledby="today"><div class="wrap">
  <p class="eyebrow">Honest status</p>
  <h2 id="today">What works today, and what is coming</h2>
  <p class="section-lede">We label everything that has not shipped. Dates are targets, not promises.</p>
  <div class="prose prose-wide">${renderMarkdown(statusTable)}</div>
</div></section>`;

// Hero: centred promise and two actions, then the real product with the migration proof laid over its
// corner, so the first screen shows both the inbox and the "nothing lost" check.
const html = `<section class="home-hero"><div class="wrap">
  <div class="hero-copy">
    <p class="eyebrow hero-eyebrow">Open source · AGPL-3.0 · Pre-alpha v0.1</p>
    <h1>${H1}</h1>
    <p class="lede">${LEDE}</p>
    <div class="cta-row">
      <a class="btn btn-primary btn-lg" href="${FOUNDING_HREF}">Start free trial <span aria-hidden="true">→</span></a>
      <a class="btn btn-lg" href="/migrate/freshdesk">Read the migration guide</a>
    </div>
    <p class="hero-note">14-day free trial, no card. <b>Cloud Team $49</b> per workspace per month, no per-agent fees. Founding plan $100 a year. <a href="#bill">How we get to ${SAVING_PCT}%</a></p>
  </div>
  <div class="hero-stage">
    <figure class="hero-shot"><img src="/product-inbox.jpg" width="1440" height="900" alt="The Colliedesk inbox: a list of customer conversations with status and priority, an open conversation with a reply and a private note, and the conversation properties." fetchpriority="high"></figure>
    ${proof}
  </div>
  ${install}
</div></section>
${homeSections.replace('<!--STATUS-->', statusHtml)}
<section class="section section-faq"><div class="wrap"><div class="prose">${faqHtml(faq)}</div></div></section>`;

const md = `${TAGLINE} ${POSITIONING}

${H1} ${LEDE} The Freshdesk importer is coming in v0.2; reconcile report numbers shown on the site are an example.

Status: pre-alpha (v0.1). Self-host free: ${REPO}. Cloud: $49 per workspace per month or $490 per year.

${homeSectionsMd}

## What works today, and what is coming

${statusTable}
${faqMarkdown(faq)}`;

export default {
  name: 'Colliedesk overview',
  path: '/',
  section: 'Product',
  title: `Colliedesk: run your helpdesk up to ${SAVING_PCT}% cheaper than Freshdesk, Zendesk and Help Scout`,
  description:
    `Colliedesk is an open-source helpdesk for small support teams, up to ${SAVING_PCT}% cheaper than Freshdesk for five agents. Leave Freshdesk with all your data. $49 per workspace, no per-agent fees.`,
  summary: `What Colliedesk is, what we sell, status, founding offer; competitor prices read ${PRICES_READ}`,
  h1: H1,
  lede: LEDE,
  html,
  md,
  faq: [],
  bodyClass: 'home',
  jsonLd: [organization(), softwareApplication(), faqPage(faq)],
};
