// Home page facts shared by the HTML sections (src/components/home/*) and the Markdown twin.
import { PRICE, PRICES_READ } from '../../lib/site';

export interface PriceBar {
  name: string;
  /** List price per month for five agents, USD. */
  usd: number;
  math: string;
  href: string;
  ours?: boolean;
}

// 5 agents, list price per month, billed annually, USD only (Zendesk publishes EUR; shown in text).
export const BARS: readonly PriceBar[] = [
  { name: 'Freshdesk Pro + Freddy AI Copilot', usd: 420, math: '5 × ($55 + $29)', href: '/vs/freshdesk' },
  { name: 'Help Scout Plus', usd: 225, math: '5 × $45, + $0.75 per AI resolution', href: '/vs/help-scout' },
  { name: 'Colliedesk Cloud', usd: 49, math: 'one workspace, + AI usage at cost +30%', href: '/pricing', ours: true },
];
export const BAR_MAX = Math.max(...BARS.map((b) => b.usd));
const OURS = BARS.find((b) => b.ours)?.usd;
if (OURS === undefined) throw new Error('BARS needs one entry with ours: true');
// The hero promise: saving against the most expensive bar, rounded down so the claim never overstates.
const savingPct = (theirs: number): number => Math.floor((1 - OURS / theirs) * 100);
export const SAVING_PCT = savingPct(BAR_MAX);

// Zendesk Suite Professional + Copilot for five agents, in euros: 5 × (€115 + €50).
export const ZENDESK_EUR = 825;
const usdOf = (name: string): number => {
  const bar = BARS.find((b) => b.name.startsWith(name));
  if (!bar) throw new Error(`BARS has no ${name} entry`);
  return bar.usd;
};
// The hero names one competitor at a time with its own saving. Zendesk is counted as if €1 = $1;
// the euro trades above the dollar, so the real saving is larger than the one shown.
export const HERO_SAVINGS: readonly { name: string; pct: number }[] = [
  { name: 'Freshdesk', pct: SAVING_PCT },
  { name: 'Zendesk', pct: savingPct(ZENDESK_EUR) },
  { name: 'Help Scout', pct: savingPct(usdOf('Help Scout')) },
];
// A year of Freshdesk Pro + Copilot for five agents, billed annually, against Cloud Team billed yearly.
export const FRESHDESK_YEAR = BAR_MAX * 12;
export const OURS_YEAR = Number(PRICE.yearly.replace('$', ''));

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

$100 per workspace per year, locked for life, with free Freshdesk migration and a reconcile report. Up to 10 agents, no per-agent fees, 20 GB of attachments including imported files. Cloud Team is $49 a month for up to 10 agents and 100 GB; Team 25 is $99 a month for up to 25 agents and 250 GB. AI at model cost +30% or your own key. Colliedesk Cloud is live; every workspace starts with a 14-day free trial.`;
