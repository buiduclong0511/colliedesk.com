// Home page facts shared by the HTML sections (src/components/home/*) and the Markdown twin.
import { PRICES_READ } from '../../lib/site';

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

## Why a collie?

A collie does not own the flock. It brings every sheep back to the pen and the shepherd decides what happens next. Colliedesk's AI sorts, drafts and chases every ticket so none is lost, while a person on your team approves what goes out.

## If you don't like something, fork it

Colliedesk is AGPL-3.0. The code, your data and the export format are yours. [How the license and the business fit together](/open-source).

## Founding offer

$100 per workspace per year, locked for life, with free Freshdesk migration and a reconcile report. Up to 10 agents, no per-agent fees, 20 GB of attachments including imported files. AI at model cost +30% or your own key. Colliedesk Cloud opens for founding customers with v0.2. The checkout link is coming soon.`;
