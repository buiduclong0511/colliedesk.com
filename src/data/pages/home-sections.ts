// Home page facts shared by the HTML sections (src/components/home/*) and the Markdown twin.
import { PRICES_READ } from '../../lib/site';

export interface PriceBar {
  name: string;
  /** List price per year for five agents, billed annually, USD. */
  usd: number;
  math: string;
  href: string;
  ours?: boolean;
}

// 5 agents, list price per year, billed annually on every bar so the billing periods match.
// USD only (Zendesk publishes EUR; shown in text).
export const BARS: readonly PriceBar[] = [
  { name: 'Freshdesk Pro + Freddy AI Copilot', usd: 5040, math: '5 × ($55 + $29) × 12', href: '/vs/freshdesk' },
  { name: 'Help Scout Plus', usd: 2700, math: '5 × $45 × 12, + $0.75 per AI resolution', href: '/vs/help-scout' },
  { name: 'Colliedesk Cloud', usd: 490, math: 'one workspace, + AI usage at cost +30%', href: '/pricing', ours: true },
];
export const BAR_MAX = Math.max(...BARS.map((b) => b.usd));
const OURS = BARS.find((b) => b.ours)?.usd;
if (OURS === undefined) throw new Error('BARS needs one entry with ours: true');
// The hero promise: saving against the most expensive bar, rounded down so the claim never overstates.
export const SAVING_PCT = Math.floor((1 - OURS / BAR_MAX) * 100);

// Answers "you can't just build a helpdesk over a weekend": the unglamorous parts, each already on
// main and running on Colliedesk Cloud. Only list what shipped; anything else belongs in the status table.
export const BORING: readonly (readonly [title: string, text: string])[] = [
  ['Mail that lands', 'Replies leave signed with DKIM and pass SPF and DMARC. Tested against real Gmail inboxes, in the customer\'s thread.'],
  ['Mail you can trust', 'Inbound mail is checked on arrival. Spoofed senders and auto-reply loops are stopped before they become tickets.'],
  ['Threading', 'A customer\'s reply joins its conversation, so one problem stays one ticket.'],
  ['Nothing lost on import', 'The reconcile report counts tickets, replies, notes, tags and contacts on both sides, and checks every attachment by SHA-256.'],
  ['Your data out, any time', 'Export the whole workspace as a ZIP, even after a trial ends or a plan lapses.'],
  ['Workspaces kept apart', 'PostgreSQL row-level security keeps each workspace\'s rows apart. Passwordless sign-in, revocable sessions.'],
  ['A supply chain you can check', 'Signed container images with provenance and SBOM. CodeQL and an OSV gate on every pull request, the email parser fuzzed.'],
  ['Nothing to stitch together', 'Self-hosted, it is one server and PostgreSQL. Bring an SMTP account for outgoing mail and a forwarder, such as Cloudflare Email Routing, for incoming mail. That is the list.'],
];

export const homeSectionsMd = `## Wait, what are you selling me?

Self-hosting is free, forever, with every feature. We sell two things:

1. **Colliedesk Cloud**: we run it for you. $49 per workspace per month or $490 per year, not per agent.
2. **Migration**: we move your Freshdesk history (tickets, replies, attachments, tags) and give you a reconcile report that proves nothing was lost.

## Why teams switch

- **Leave Freshdesk with all your data** (importer available now): tickets, replies, notes, checksummed attachments, tags and contacts, with a reconcile report. [Migration guide](/migrate/freshdesk).
- **AI that answers tickets, included** (coming after beta): drafts, triage and auto-answer with a human in the loop. Model cost +30%, or bring your own key.
- **Flat price**: $49 per workspace per month, no per-agent fees. Self-host for $0.

## The bill for five agents

List prices per year, billed annually, read on ${PRICES_READ}.

${BARS.map((b) => `- ${b.name}: $${b.usd.toLocaleString('en-US')} (${b.math})`).join('\n')}
- Zendesk Suite Professional + Copilot: 5 × (€115 + €50) × 12 = €9,900 ([details](/vs/zendesk))

## The boring parts already work

We are not rebuilding every Freshdesk feature. We build what a team of three to ten uses every day, and we label the rest. HC Labs runs its own support on Colliedesk Cloud.

${BORING.map(([k, v]) => `- **${k}.** ${v}`).join('\n')}

## Why a collie?

A collie does not own the flock. It brings every sheep back to the pen and the shepherd decides what happens next. Colliedesk's AI sorts, drafts and chases every ticket so none is lost, while a person on your team approves what goes out.

## If you don't like something, fork it

Colliedesk is AGPL-3.0. The code, your data and the export format are yours. [How the license and the business fit together](/open-source).

## Founding offer

$100 per workspace per year, locked for life, with free Freshdesk migration and a reconcile report. Up to 10 agents, no per-agent fees, 20 GB of attachments including imported files. Cloud Team is $49 a month for up to 10 agents and 100 GB; Team 25 is $99 a month for up to 25 agents and 250 GB. AI at model cost +30% or your own key. Colliedesk Cloud is live; every workspace starts with a 14-day free trial.`;
