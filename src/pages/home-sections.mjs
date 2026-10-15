// Home page sections between the hero and the status table, as HTML and as Markdown.
import { FOUNDING_CHECKOUT, PRICES_READ, REPO } from '../site.mjs';

// 5 agents, list price per month, billed annually, USD only (Zendesk publishes EUR; shown in text).
const BARS = [
  { name: 'Freshdesk Pro + Freddy AI Copilot', usd: 420, math: '5 × ($55 + $29)', href: '/vs/freshdesk' },
  { name: 'Help Scout Plus', usd: 225, math: '5 × $45, + $0.75 per AI resolution', href: '/vs/help-scout' },
  { name: 'Colliedesk Cloud', usd: 49, math: 'one workspace, + AI usage at cost +30%', href: '/pricing', ours: true },
];
const MAX = Math.max(...BARS.map((b) => b.usd));
const OURS = BARS.find((b) => b.ours).usd;
// The hero promise: saving against the most expensive bar, rounded down so the claim never overstates.
export const SAVING_PCT = Math.floor((1 - OURS / MAX) * 100);

// Answers "you can't just build a helpdesk over a weekend": the unglamorous parts, each already on
// main and running on Colliedesk Cloud. Only list what shipped; anything else belongs in the status table.
const BORING = [
  ['Mail that lands', 'Replies leave signed with DKIM and pass SPF and DMARC. Tested against real Gmail inboxes, in the customer\'s thread.'],
  ['Mail you can trust', 'Inbound mail is checked on arrival. Spoofed senders and auto-reply loops are stopped before they become tickets.'],
  ['Threading', 'A customer\'s reply joins its conversation, so one problem stays one ticket.'],
  ['Nothing lost on import', 'The reconcile report counts tickets, replies, notes, tags and contacts on both sides, and checks every attachment by SHA-256.'],
  ['Your data out, any time', 'Export the whole workspace as a ZIP, even after a trial ends or a plan lapses.'],
  ['Workspaces kept apart', 'PostgreSQL row-level security keeps each workspace\'s rows apart. Passwordless sign-in, revocable sessions.'],
  ['A supply chain you can check', 'Signed container images with provenance and SBOM. CodeQL and an OSV gate on every pull request, the email parser fuzzed.'],
  ['Nothing to stitch together', 'Self-hosted, it is one server and PostgreSQL. Bring an SMTP account for outgoing mail and a forwarder, such as Cloudflare Email Routing, for incoming mail. That is the list.'],
];

const bars = BARS.map(
  (b) => `<li class="bar${b.ours ? ' bar-ours' : ''}">
  <div class="bar-label"><a href="${b.href}">${b.name}</a><span class="bar-math">${b.math}</span></div>
  <div class="bar-track"><span class="bar-fill" style="width:${Math.max((b.usd / MAX) * 100, 1.5).toFixed(1)}%"></span><strong>$${b.usd}<small>/mo</small></strong></div>
</li>`,
).join('');

export const homeSections = `
<section class="section" aria-labelledby="selling"><div class="wrap split">
  <div>
    <p class="eyebrow">Wait, what are you selling me?</p>
    <h2 id="selling">Self-hosting is free. We sell two things.</h2>
    <p class="section-lede">No enterprise edition with the good parts held back. Every feature is in the open-source code.</p>
  </div>
  <ol class="sell-list">
    <li><h3>Colliedesk Cloud</h3><p>We run it for you. One flat price per workspace, not per agent: <strong>$49 a month</strong> or $490 a year.</p></li>
    <li><h3>Migration</h3><p>We move your Freshdesk history (tickets, replies, attachments, tags) and give you a reconcile report that proves nothing was lost.</p></li>
  </ol>
</div></section>

<section class="section section-alt" aria-labelledby="pillars"><div class="wrap">
  <h2 id="pillars" class="visually-hidden">Why teams switch</h2>
  <div class="pillars">
    <article class="pillar"><p class="pillar-k">01 · Your data</p><h3>Leave Freshdesk with all of it</h3>
      <p>Freshdesk's ticket export has fields only, no conversation. Our importer brings tickets, replies, notes, checksummed attachments, tags and contacts, then proves the counts match.</p>
      <p><span class="badge badge-coming">Coming v0.2</span> <a href="/migrate/freshdesk">Read the migration guide</a></p></article>
    <article class="pillar"><p class="pillar-k">02 · AI included</p><h3>AI that answers tickets, not an add-on</h3>
      <p>Drafts and triage from your own past replies and knowledge base, auto-answer for repetitive tickets with a human in the loop. Pay model cost +30%, or bring your own key.</p>
      <p><span class="badge badge-coming">Coming v0.3</span> <a href="/roadmap">See the roadmap</a></p></article>
    <article class="pillar"><p class="pillar-k">03 · Flat price</p><h3>No per-agent fees</h3>
      <p>Hire a fifth agent, or a tenth, and the bill stays $49 a month for the workspace. Self-host and it stays $0.</p>
      <p><span class="badge badge-shipped">Price published</span> <a href="/pricing">See pricing</a></p></article>
  </div>
</div></section>

<section class="section" aria-labelledby="bill"><div class="wrap split">
  <div>
    <p class="eyebrow">The bill for five agents</p>
    <h2 id="bill">Per-agent pricing, then per-agent AI</h2>
    <p class="section-lede">List prices per month, billed annually, read on ${PRICES_READ}. Zendesk publishes euros: Suite Professional with Copilot is 5 × (€115 + €50) = €825. <a href="/vs/zendesk">Details</a>.</p>
  </div>
  <ul class="bars" aria-label="Monthly cost for five agents">${bars}</ul>
</div></section>

<section class="section section-alt" aria-labelledby="boring"><div class="wrap">
  <p class="eyebrow">The boring parts</p>
  <h2 id="boring">A helpdesk is more than an inbox. These parts already work.</h2>
  <p class="section-lede">We are not rebuilding every Freshdesk feature. We build what a team of three to ten uses every day, and we label the rest below. HC Labs runs its own support on Colliedesk Cloud.</p>
  <ul class="check-list check-list-wide">${BORING.map(([k, v]) => `<li><strong>${k}.</strong> ${v}</li>`).join('')}</ul>
</div></section>

<!--STATUS-->

<section class="section section-ink" aria-labelledby="collie"><div class="wrap split">
  <div>
    <p class="eyebrow">Why a collie?</p>
    <h2 id="collie">A sheepdog herds every ticket home. Your team stays in charge.</h2>
  </div>
  <div class="prose-invert">
    <p>A collie does not own the flock. It brings every sheep back to the pen and the shepherd decides what happens next. That is the job we give AI in Colliedesk (coming in v0.3): sort, draft and chase every ticket so none is lost, while a person on your team approves what goes out.</p>
  </div>
</div></section>

<section class="section" aria-labelledby="fork"><div class="wrap split">
  <div>
    <p class="eyebrow">AGPL-3.0</p>
    <h2 id="fork">If you don't like something, fork it</h2>
    <p class="section-lede">You were held hostage at renewal once. That should not happen again. The code, your data and the export format are yours.</p>
    <p><a href="/open-source">How the license and the business fit together</a></p>
  </div>
  <pre class="code-card"><code><span class="t-prompt">$</span> gh repo fork colliedesk/colliedesk --clone
<span class="t-prompt">$</span> cd colliedesk &amp;&amp; make dev</code></pre>
</div></section>

<section class="section section-alt" aria-labelledby="quotes"><div class="wrap">
  <h2 id="quotes">From founding customers</h2>
  <!-- SLOT: real founding-customer quotes go here, verbatim, with name and team. Never invent one. -->
  <div class="quote-slot"><p><strong>No quotes yet.</strong> Colliedesk is pre-alpha and we will not make them up. The first founding customers' words will go here, unedited, with their names.</p></div>
</div></section>

<section class="section" id="founding" aria-labelledby="founding-title"><div class="wrap">
  <div class="founding">
    <div>
      <p class="eyebrow">Founding offer</p>
      <h2 id="founding-title">$100 a year. Locked for life.</h2>
      <p class="section-lede">For small teams planning to leave Freshdesk. Cloud Team lists at $490 a year. Your price never goes up, and we migrate your Freshdesk data for free.</p>
    </div>
    <ul class="check-list">
      <li>$100 per workspace per year, locked for life</li>
      <li>Free Freshdesk migration with a reconcile report</li>
      <li>Up to 10 agents, no per-agent fees</li>
      <li>20 GB of attachments, imported files included</li>
      <li>AI at model cost +30%, or bring your own key</li>
      <li>Colliedesk Cloud opens for founding customers with v0.2</li>
    </ul>
    <div class="founding-cta">
      <a class="btn btn-primary btn-lg" href="${FOUNDING_CHECKOUT}" rel="noopener">Become a founding customer, $100/year</a>
      <p>Secure checkout by Polar. After payment we email you within one business day to set up your workspace and plan your Freshdesk migration.</p>
    </div>
  </div>
</div></section>`;

export const homeSectionsMd = `## Wait, what are you selling me?

Self-hosting is free, forever, with every feature. We sell two things:

1. **Colliedesk Cloud**: we run it for you. $49 per workspace per month or $490 per year, not per agent.
2. **Migration**: we move your Freshdesk history (tickets, replies, attachments, tags) and give you a reconcile report that proves nothing was lost.

## Why teams switch

- **Leave Freshdesk with all your data** (importer coming v0.2): tickets, replies, notes, checksummed attachments, tags and contacts, with a reconcile report. [Migration guide](/migrate/freshdesk).
- **AI that answers tickets, included** (coming v0.3): drafts, triage and auto-answer with a human in the loop. Model cost +30%, or bring your own key.
- **Flat price**: $49 per workspace per month, no per-agent fees. Self-host for $0.

## The bill for five agents

List prices per month, billed annually, read on ${PRICES_READ}.

${BARS.map((b) => `- ${b.name}: $${b.usd} (${b.math})`).join('\n')}
- Zendesk Suite Professional + Copilot: 5 × (€115 + €50) = €825 ([details](/vs/zendesk))

## The boring parts already work

We are not rebuilding every Freshdesk feature. We build what a team of three to ten uses every day, and we label the rest. HC Labs runs its own support on Colliedesk Cloud.

${BORING.map(([k, v]) => `- **${k}.** ${v}`).join('\n')}

## Why a collie?

A collie does not own the flock. It brings every sheep back to the pen and the shepherd decides what happens next. Colliedesk's AI sorts, drafts and chases every ticket so none is lost, while a person on your team approves what goes out.

## If you don't like something, fork it

Colliedesk is AGPL-3.0. The code, your data and the export format are yours. [How the license and the business fit together](/open-source).

## Founding offer

$100 per workspace per year, locked for life, with free Freshdesk migration and a reconcile report. Up to 10 agents, no per-agent fees, 20 GB of attachments including imported files. AI at model cost +30% or your own key. Colliedesk Cloud opens for founding customers with v0.2. The checkout link is coming soon.`;
