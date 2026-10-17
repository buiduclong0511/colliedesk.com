// Colliedesk's own capability status, from ROADMAP.md. Shared by comparison pages.
export const statusTable = `| Capability | Colliedesk |
|---|---|
| Shared inbox: replies, Cc, private notes, status, priority, assignee, tags, search, bulk actions | **Available now** (alpha) |
| Email channel (inbound and outbound, threading) | **Available now** (alpha) |
| Freshdesk importer with reconcile report | **Available now** (alpha) |
| Saved replies, attachments, live updates and browser notifications | **Available now** (alpha) |
| Passwordless sign-in, revocable sessions, isolated workspaces, full export | **Available now** (alpha) |
| One-command install and published container image | **Available now** |
| Colliedesk Cloud with a 14-day free trial, then Team or Founding | **Available now** (alpha) |
| New conversation from the inbox, contact history | **Beta** (0.1.0) |
| Upgrade guide, upgrades tested on real data | **Beta** (0.1.0) |
| AI draft replies, triage, auto-answer with a human in the loop | **Coming after beta** |
| Knowledge base and public help center | **Coming after beta** |
| Automations, macros, SLA, business hours, CSAT and reports | **Coming later** |
| Zendesk and Help Scout importers, live chat widget | **Coming later** |`;

export const collieFacts: Readonly<Record<'price' | 'ai' | 'free' | 'source' | 'export', string>> = {
  price: 'Cloud Team: $49 per workspace per month, or $490 per year, up to 10 agents, 100 GB of attachments. Team 25: $99 per month, or $990 per year, up to 25 agents, 250 GB. No per-agent fees. Founding customers: $100 per year, locked for life.',
  ai: 'Included (coming after beta). LLM cost +30% on our key, or bring your own key.',
  free: 'Self-host free, every feature. Cloud: 14-day free trial, no card.',
  source: 'Open source, AGPL-3.0. Self-host or use Cloud.',
  export: 'Your data lives in PostgreSQL. Self-hosted, you can take a database dump at any time.',
};
