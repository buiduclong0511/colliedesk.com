import { FOUNDING_HREF, PRICES_READ } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { statusTable } from './collie-status';

const faq: Faq[] = [
  {
    q: 'What is the cheapest helpdesk for a team of 3 to 10 agents?',
    a: `Among the paid options we compare, Colliedesk Cloud Team is $49 per workspace per month for up to 10 agents, so the price does not grow with the team. Freshdesk Growth is $19 per agent per month billed annually (read on ${PRICES_READ}): $57 at 3 agents, $190 at 10. Self-hosting Colliedesk is free.`,
  },
  {
    q: 'Is a flat price worse for a one- or two-person team?',
    a: 'It can be. At $19 per agent, one or two Freshdesk Growth agents cost less than $49. Colliedesk pays off from three agents, or when you want AI without a per-seat add-on.',
  },
  {
    q: 'What happens above 10 agents?',
    a: 'Cloud Team covers up to 10 agents. Above that, email us. Self-hosting has no agent limit.',
  },
];

const body = `## What a small support team needs

- **One shared inbox** where everyone sees who owns a ticket: assignee, status, priority, tags, private notes.
- **Email in and out** on your own support address.
- **A price you can predict** when you hire the next person.
- **Your history**, moved in from the old tool without losing replies or attachments.
- **AI drafts** that do not cost another seat licence.

## What it costs as you grow

Freshdesk prices are per agent per month, billed annually, read on ${PRICES_READ}.

| Agents | Freshdesk Growth ($19) | Freshdesk Pro + Freddy AI Copilot ($55 + $29) | Colliedesk Cloud Team |
|---|---|---|---|
| 2 | $38 | $168 | $49 |
| 3 | $57 | $252 | $49 |
| 5 | $95 | $420 | $49 |
| 10 | $190 | $840 | $49 |

Colliedesk AI (coming v0.3) is billed at model cost +30% on our key, or by your provider on your own key. Full sources: [Colliedesk vs Freshdesk](/vs/freshdesk).

## What Colliedesk does today

Colliedesk is pre-alpha. The shared inbox is released; the email channel and the Freshdesk importer are built and in testing for v0.2. Read the table before you plan a move.

${statusTable}

## How small teams start

1. **Try it:** self-host free, or wait for the Cloud trial with v0.2.
2. **Plan the move before your renewal:** the [founding offer](${FOUNDING_HREF}) is $100 per workspace per year, locked for life, and we [migrate your Freshdesk data for you](/migrate/freshdesk/done-for-you).
3. **Switch only when the reconcile report matches.**`;

const page: Page = {
  jsonLd: [],
  name: 'Helpdesk for small teams',
  path: '/helpdesk-for-small-teams',
  section: 'Product',
  title: 'Helpdesk for small teams: one flat price for 2 to 10 agents',
  description:
    'A helpdesk for small support teams of 2 to 10 agents: one flat $49 per workspace instead of per-agent fees, AI included at cost, open source. Price by team size and honest status.',
  summary: 'Small-team helpdesk: price by team size (2, 3, 5, 10 agents) vs Freshdesk, what small teams need, honest status',
  eyebrow: 'For small teams',
  h1: 'A helpdesk priced for a small team',
  lede: 'Two to ten people answering customers do not need an enterprise suite. They need a shared inbox, their history, and a bill that does not grow with every hire.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
