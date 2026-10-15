import { FOUNDING_HREF, REPO } from '../../lib/site';
import { faqPage, softwareApplication } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

const faq: Faq[] = [
  {
    q: 'Does Colliedesk charge per agent?',
    a: 'No. Colliedesk Cloud Team is $49 per workspace per month or $490 per year, for up to 10 agents. A workspace is one support team. Adding an agent does not change the price. More than 10 agents: email us.',
  },
  {
    q: 'What does "AI at LLM cost +30%" mean?',
    a: 'On Colliedesk Cloud you can use our AI key. You pay what the model provider charges for the tokens your tickets used, plus 30%. Example: if the provider charges $1.00, you pay $1.30. Or bring your own key and pay your provider directly.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. Every Cloud workspace starts with a 14-day free trial of the Team plan, every feature, no card. If you import from Freshdesk during the trial, it extends to 30 days so you can run both side by side. When the trial ends without a plan, the workspace is locked: you can still sign in to export all your data, and choosing a plan unlocks it at once with nothing lost. Self-hosting stays free forever.',
  },
  {
    q: 'Is self-hosting really free?',
    a: `Yes. Self-hosting is free, forever, with every feature. The code is AGPL-3.0 on [GitHub](${REPO}). Read the [install guide](/docs/install).`,
  },
  {
    q: 'What is the founding offer?',
    a: 'A founding customer pays $100 per workspace per year, and that price is locked for life. We also migrate your Freshdesk data for free. It includes up to 10 agents and 20 GB of attachments, imported files included. Above 20 GB nothing is deleted and customer email keeps arriving with its attachments; only your own uploads and new imports wait until you upgrade to Cloud Team, which has no storage cap. It is for teams who want to leave Freshdesk and help shape Colliedesk while it is young.',
  },
  {
    q: 'When can I use Colliedesk Cloud?',
    a: 'Colliedesk is pre-alpha (v0.1). Cloud opens for the first founding customers with v0.2, together with the email channel and the Freshdesk importer. See the [roadmap](/roadmap).',
  },
];

const plansMd = `| Plan | Price | What you get |
|---|---|---|
| Self-host | $0, forever | Every feature. AGPL-3.0. AI with your own model key. |
| Founding | $100 per workspace per year, locked for life | Free Freshdesk migration with a reconcile report. Up to 10 agents, no per-agent fees. 20 GB of attachments, imported files included. AI at LLM cost +30% or bring your own key. |
| Cloud Team (coming v0.2) | $49 per workspace per month, or $490 per year | Hosted by HC Labs. Up to 10 agents, unlimited conversations, no per-agent fees. AI at LLM cost +30% or bring your own key. |`;

const body = `## What you pay for

Self-hosting is free. We sell two things: **Colliedesk Cloud** (we run it for you) and **migration** (we move your Freshdesk history and prove nothing was lost). That is the whole business. There is no "enterprise edition" with the good features held back.

## AI is included, not an add-on

**Coming v0.3**. AI features: draft replies and triage from your own past replies and knowledge base, and auto-answer for repetitive tickets with a human in the loop. There is no AI seat licence and no per-resolution fee.

- **Use our key on Cloud:** you pay the model provider's cost for your usage, plus 30%.
- **Bring your own key:** on Cloud or self-hosted, you pay your provider directly.

## How this compares

Most helpdesks charge per agent, then charge again for AI. For five agents, Freshdesk Pro with Freddy AI Copilot lists at $420 per month (billed annually). Colliedesk Cloud Team is $49 per month for the workspace, plus AI usage. Prices and sources: [vs Freshdesk](/vs/freshdesk), [vs Zendesk](/vs/zendesk), [vs Help Scout](/vs/help-scout).

## Honest status

Colliedesk is **pre-alpha**. Released today (v0.1): a shared inbox, private notes, tags, assignment and passwordless sign-in. Built and in testing for v0.2: the email channel (replies are plain text, without CC) and the Freshdesk importer with its reconcile report. Not built yet: attachments on agent replies, canned replies and new-ticket notifications. If you must switch this week, Colliedesk is not ready for you yet. If you are planning your exit before your next Freshdesk renewal, [the founding offer](${FOUNDING_HREF}) is for you.`;

const page: Page = {
  name: 'Pricing',
  path: '/pricing',
  section: 'Product',
  title: 'Colliedesk pricing: $49 per workspace, no per-agent fees, 14-day free trial',
  description:
    'Colliedesk Cloud starts with a 14-day free trial, no card. Team costs $49 per workspace per month ($490 per year), up to 10 agents, no per-agent fees. Self-hosting is free.',
  summary: '14-day free trial, no card; Team $49 per workspace per month or $490 per year, up to 10 agents, no per-agent fees; founding offer; AI at LLM cost +30% or your own key; self-host free',
  eyebrow: 'Pricing',
  h1: 'One flat price per workspace. No per-agent fees.',
  lede: 'Try it free for 14 days. Add your whole team, up to 10 agents, for the same $49 a month. Self-host for $0. Pay for AI at cost plus 30%, or bring your own key.',
  pre: 'pricing-plans',
  preMd: plansMd,
  body,
  faq,
  jsonLd: [softwareApplication(), faqPage(faq)],
};
export default page;
