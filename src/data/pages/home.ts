import { POSITIONING, PRICES_READ, REPO, TAGLINE } from '../../lib/site';
import { faqPage, organization, softwareApplication } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { faqMarkdown } from '../../lib/twin';
import { statusTable } from './collie-status';
import { homeSectionsMd } from './home-sections';

export const HOME_LEDE =
  'Move from Freshdesk to Colliedesk with your tickets, replies, private notes and attachments. A reconcile report proves the counts match, so nothing is lost on the way.';

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

const md = `${TAGLINE} ${POSITIONING}

${HOME_LEDE} The Freshdesk importer is coming in v0.2; reconcile report numbers shown on the site are an example.

Status: pre-alpha (v0.1). Self-host free: ${REPO}. Cloud: $49 per workspace per month or $490 per year.

${homeSectionsMd}

## What works today, and what is coming

${statusTable}
${faqMarkdown(HOME_FAQ)}`;

// The HTML is the Home view (src/components/home/*); the twin is the Markdown above.
const page: Page = {
  name: 'Colliedesk overview',
  path: '/',
  section: 'Product',
  title: 'Colliedesk: the open-source alternative to Freshdesk, Zendesk and Help Scout',
  description:
    'Colliedesk is an open-source helpdesk for small support teams. Leave Freshdesk with all your data. AI included, not an add-on. $49 per workspace, no per-agent fees.',
  summary: `What Colliedesk is, what we sell, status, founding offer; competitor prices read ${PRICES_READ}`,
  h1: 'Bring every ticket home.',
  lede: HOME_LEDE,
  view: 'home',
  md,
  faq: [],
  bodyClass: 'home',
  jsonLd: [organization(), softwareApplication(), faqPage(HOME_FAQ)],
};
export default page;
