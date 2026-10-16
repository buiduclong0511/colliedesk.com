import { POSITIONING, PRICES_READ, REPO, TAGLINE } from '../../lib/site';
import { faqPage, organization, softwareApplication } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { faqMarkdown } from '../../lib/twin';
import { statusTable } from './collie-status';
import { homeSectionsMd, SAVING_PCT } from './home-sections';

// Headline pattern from mailcheap.ai: one number against the incumbents, then why the bill is lower.
// SAVING_PCT comes from the five-agent bill (Freshdesk Pro + Freddy AI Copilot vs Cloud Team).
export const HOME_H1 = `Run your helpdesk up to ${SAVING_PCT}% cheaper than Freshdesk, Zendesk and Help Scout.`;
export const HOME_LEDE =
  'You pay for the workspace, not for every agent you add. Move from Freshdesk with your tickets, replies, private notes and attachments, and a reconcile report proves nothing was lost.';

export const HOME_FAQ: Faq[] = [
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
    a: 'It is alpha (0.0.x): released and running on Colliedesk Cloud, with a 14-day free trial. The email channel (inbound and outbound, threading), the Freshdesk importer with its reconcile report, saved replies, attachments and live updates work today. Alpha means the interface or database schema may change between releases. Cc, starting a new conversation from the inbox and contact history are not there yet (beta), and neither is AI. See the [roadmap](/roadmap).',
  },
  {
    q: 'How does AI pricing work?',
    a: 'AI is included, not an add-on. On Colliedesk Cloud you pay the model cost plus 30%, or bring your own key. Self-hosted installs use your own key.',
  },
  {
    q: 'Can I move my Freshdesk tickets to Colliedesk?',
    a: 'Yes, with the Freshdesk importer, available now: tickets, replies, notes, attachments, tags and contacts, with a reconcile report. Founding customers get the migration done for free. Read [the migration guide](/migrate/freshdesk).',
  },
];

const md = `${TAGLINE} ${POSITIONING}

${HOME_H1} ${HOME_LEDE} The Freshdesk importer is available now; reconcile report numbers shown on the site are an example.

Status: alpha (0.0.x), live on Colliedesk Cloud with a 14-day free trial. Self-host free: ${REPO}. Cloud: $49 per workspace per month or $490 per year.

${homeSectionsMd}

## What works today, and what is coming

${statusTable}
${faqMarkdown(HOME_FAQ)}`;

// The HTML is the Home view (src/components/home/*); the twin is the Markdown above.
const page: Page = {
  name: 'Colliedesk overview',
  path: '/',
  section: 'Product',
  title: `Colliedesk: run your helpdesk up to ${SAVING_PCT}% cheaper than Freshdesk, Zendesk and Help Scout`,
  description:
    `Colliedesk is an open-source helpdesk for small support teams, up to ${SAVING_PCT}% cheaper than Freshdesk for five agents. Leave Freshdesk with all your data. $49 per workspace, no per-agent fees.`,
  summary: `What Colliedesk is, what we sell, status, founding offer; competitor prices read ${PRICES_READ}`,
  h1: HOME_H1,
  lede: HOME_LEDE,
  view: 'home',
  md,
  faq: [],
  bodyClass: 'home',
  jsonLd: [organization(), softwareApplication(), faqPage(HOME_FAQ)],
};
export default page;
