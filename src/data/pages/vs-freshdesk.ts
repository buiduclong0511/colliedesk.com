import { PRICES_READ } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { PRICE } from '../../lib/site';
import { rowsAt, usd, vsMarkdown, type VsPricing } from '../../lib/vs-pricing';
import { collieFacts as c, statusTable } from './collie-status';

const pricing: VsPricing = {
  competitor: 'Freshdesk',
  readOn: '2026-10-14',
  billing: 'per agent, billed annually',
  plans: [
    { name: 'Freshdesk Growth', perAgent: 19 },
    { name: 'Freshdesk Pro', perAgent: 55 },
    { name: 'Freshdesk Pro + Freddy AI Copilot', perAgent: 55, aiPerAgent: 29 },
  ],
  forYou: [
    'You pay Freshdesk per agent, then again per agent for AI, and the bill grows with every hire.',
    'Most of your support is email. The email channel is built and in testing for v0.2.',
    'You want your tickets in a PostgreSQL database you control, or to self-host for free.',
    'Your Freshdesk renewal is months away, so you can plan the move around our [roadmap](/roadmap).',
  ],
  notForYou: [
    'You need live chat, phone, WhatsApp or a marketplace of apps today.',
    'You must switch this week: Colliedesk is pre-alpha, and attachments on agent replies and canned replies are not built yet.',
    'You want the founding price and have more than 20 GB of Freshdesk attachments: founding includes 20 GB, imported files included.',
  ],
};
const fiveAgents = rowsAt(pricing, 5).at(-1);

const faq: Faq[] = [
  {
    q: 'What is the best open-source alternative to Freshdesk?',
    a: 'Colliedesk is an open-source (AGPL-3.0) helpdesk built for small teams leaving Freshdesk: flat $49 per workspace per month, AI included at cost, and a Freshdesk importer (coming v0.2). It is pre-alpha today, so check the status table before you switch.',
  },
  {
    q: 'How much does Freshdesk cost for 5 agents with AI?',
    a: `At list prices read on ${PRICES_READ}: Freshdesk Pro is $55 per agent per month billed annually, and Freddy AI Copilot is $29 per agent per month. Five agents: 5 × ($55 + $29) = $420 per month.`,
  },
  {
    q: 'Is Colliedesk ready to replace Freshdesk today?',
    a: 'Not for most teams. The released v0.1 is a shared inbox. The email channel and the Freshdesk importer are built and in testing for v0.2, and daily basics such as attachments on replies and canned replies are not built yet. If your renewal is months away, the founding offer locks $100 per year for life and includes the migration.',
  },
  {
    q: 'Can I get my tickets out of Freshdesk with the full conversation?',
    a: 'Not with the ticket export in the Freshdesk UI: it exports ticket fields to CSV or Excel, without the conversation. The full thread needs the account export or the Freshdesk API. See [how to export tickets from Freshdesk](/migrate/freshdesk/export).',
  },
];

const body = `## Price, side by side

Freshdesk prices are per agent per month, billed annually, as published on ${PRICES_READ}.

| | Freshdesk | Colliedesk |
|---|---|---|
| Plans | Growth $19, Pro $55, Enterprise $89 per agent per month | ${c.price} |
| AI drafting | Freddy AI Copilot $29 per agent per month, add-on for Pro and Enterprise only | ${c.ai} |
| AI agent | 500 sessions free once per account, then $49 per 100 sessions | Auto-answer with a human in the loop, same AI pricing (coming v0.3) |
| Free option | No free plan on the pricing page; 14-day trial | ${c.free} |
| Source code | Proprietary | ${c.source} |

List prices before tax. AI usage on Colliedesk depends on ticket volume and the model you pick; with your own key it is billed by your provider.

## Leaving: what Freshdesk gives you

- The ticket export in the Freshdesk UI gives **ticket fields only**, as CSV or Excel. It does not include the conversation, and archived tickets are excluded.
- The API lists **100 tickets per page, up to 300 pages** (30,000 tickets) per filter, and only the **last 30 days** unless you pass \`updated_since\`.
- Closed tickets with no activity for 120 days are **archived** and fetched through a separate endpoint.
- API rate limits are **100, 400 or 700 calls per minute** on Growth, Pro and Enterprise.

Colliedesk keeps your data in PostgreSQL with an open, documented model. ${c.export} The step-by-step guide: [migrate from Freshdesk](/migrate/freshdesk).

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Freshdesk pricing: [freshworks.com/freshdesk/pricing](https://www.freshworks.com/freshdesk/pricing/)
- Ticket export (fields only, archived excluded): [support.freshdesk.com article 225158](https://support.freshdesk.com/support/solutions/articles/225158)
- API pagination, 30-day default, archived tickets: [developers.freshdesk.com/api](https://developers.freshdesk.com/api/)
- API rate limits: [support.freshdesk.com article 225439](https://support.freshdesk.com/support/solutions/articles/225439-what-are-the-rate-limits-for-the-api-calls-to-freshdesk-)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/freshdesk',
  section: 'Compare',
  title: `Colliedesk vs Freshdesk: ${PRICE.monthly} a month for up to 10 agents, not $19–89 per agent`,
  description:
    'An honest comparison of Colliedesk and Freshdesk: published prices, AI add-on costs, export limits and what Colliedesk can and cannot do yet. Prices read 14 October 2026.',
  summary: 'Freshdesk $19–89 per agent plus $29 Copilot vs Colliedesk $49 per workspace; export limits; honest status',
  eyebrow: 'Compare · Freshdesk alternative',
  h1: 'Colliedesk vs Freshdesk',
  lede: `Five agents on ${fiveAgents?.name ?? 'Freshdesk'} pay ${usd(fiveAgents?.usd ?? 0)} a month. Colliedesk Cloud Team is ${PRICE.monthly} for the whole workspace, up to 10 agents. Pick your team size to see where Colliedesk fits, and where it does not.`,
  cta: true,
  vs: pricing,
  preMd: vsMarkdown(pricing),
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
