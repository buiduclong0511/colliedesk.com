// Shared facts used on every page. Change a fact here, not in page copy.
export interface NavLink {
  href: string;
  label: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const ORIGIN = 'https://colliedesk.com';
export const REPO = 'https://github.com/colliedesk/colliedesk';
export const NAME = 'Colliedesk';
export const UPDATED = '2026-10-14';
export const PRICES_READ = '14 October 2026';

export const TAGLINE = 'The open-source alternative to Freshdesk, Zendesk and Help Scout.';
export const POSITIONING =
  'Leave Freshdesk with all your data. AI that actually answers tickets is included, not an add-on. Flat price, no per-agent fees.';

export const FOUNDING_HREF = '/#founding';
// Polar checkout link for the Founding product (org Colliedesk).
export const FOUNDING_CHECKOUT = 'https://buy.polar.sh/polar_cl_1R61RlI9VkKyH4ZfFs7XviF7UAd1CaoycIasu2TiXQx';
// Colliedesk Cloud sign-in (email code through Clerk) for agents who already have a workspace.
export const APP_SIGN_IN = 'https://app.colliedesk.com/sign-in';
// The updates box posts to the web form channel of HC Labs' own Colliedesk workspace: every
// signup lands there as a conversation tagged web-form.
export const UPDATES_FORM_URL = 'https://app.colliedesk.com/api/v1/public/forms/hclabs';
export const PRICE = {
  monthly: '$49',
  yearly: '$490',
  founding: '$100 per year, locked for life, with free Freshdesk migration',
  ai: 'LLM cost +30%, or bring your own key',
} as const;

// Primary navigation; order is the order shown.
export const NAV: readonly NavLink[] = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/migrate/freshdesk', label: 'Migrate' },
  { href: '/vs/freshdesk', label: 'Compare' },
  { href: '/docs', label: 'Docs' },
  { href: '/roadmap', label: 'Roadmap' },
];

export const FOOTER: readonly FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { href: '/pricing', label: 'Pricing' },
      { href: '/roadmap', label: 'Roadmap' },
      { href: '/changelog', label: 'Changelog' },
      { href: '/open-source', label: 'Open source' },
    ],
  },
  {
    title: 'Switch',
    links: [
      { href: '/migrate/freshdesk', label: 'Migrate from Freshdesk' },
      { href: '/migrate/freshdesk/export', label: 'Export Freshdesk tickets' },
      { href: '/migrate/zendesk/export', label: 'Export Zendesk tickets' },
      { href: '/vs/freshdesk', label: 'Colliedesk vs Freshdesk' },
      { href: '/vs/zendesk', label: 'Colliedesk vs Zendesk' },
      { href: '/vs/help-scout', label: 'Colliedesk vs Help Scout' },
      { href: '/vs/front', label: 'Colliedesk vs Front' },
    ],
  },
  {
    title: 'Build',
    links: [
      { href: '/docs', label: 'Docs' },
      { href: '/docs/install', label: 'Self-host' },
      { href: REPO, label: 'GitHub' },
      { href: '/llms.txt', label: 'llms.txt' },
    ],
  },
];
