import { techArticle } from '../../lib/schema';
import type { Page } from '../../lib/page';

export const LEGAL_UPDATED = '2026-10-15';
export const PRIVACY_EMAIL = 'privacy@colliedesk.com';

const body = `## The short version

- Your tickets, replies, notes, contacts and attachments belong to you. We store them to run your helpdesk and for nothing else.
- We do not sell personal data, show ads, or train AI models on your content.
- Colliedesk Cloud runs on servers in Germany. Backups are encrypted and also stay in Germany.
- You can export your whole workspace as a ZIP file at any time, even after your trial ends.
- A locked workspace is deleted 12 months after it locks. We email the admins 30 days before.
- To stop repeated free trials, we keep a one-way, keyed fingerprint of your email address. We cannot turn it back into your address.
- This website sets no cookies.
- If you self-host Colliedesk, your data never reaches us.

The rest of this page says the same thing in more detail.

## Who we are

Colliedesk is made by **HC Labs Co., Ltd.** (CÔNG TY TNHH HC LABS), Hanoi, Vietnam, enterprise code 0111487156. In this policy, "we" means HC Labs.

- For your **account, billing and this website**, we decide how the data is used (we are the controller).
- For the **content of your workspace** (customer emails, replies, notes, contacts, attachments), your company decides. We process it only on your instructions, to run the service (we are the processor).

## What this policy covers

- Colliedesk Cloud at \`app.colliedesk.com\`.
- This website, \`colliedesk.com\`.

It does **not** cover a Colliedesk server that you run yourself. A self-hosted server sends us nothing except, if you leave it on, one anonymous usage report a day: a random install id, the version and counts (workspaces, active agents, replies sent). Never names, email addresses or message content. Turn it off with \`DISABLE_TELEMETRY=true\` or \`DO_NOT_TRACK=1\`.

## What we collect and why

| Data | Why | Where it comes from |
|---|---|---|
| Your email address and name | To sign you in and to tell you about your account | You, or Google if you sign in with Google |
| Workspace content: customer emails, replies, notes, contacts, tags, attachments | To run your helpdesk | You, your teammates and your customers |
| Billing details: name, email, country, plan, invoices | To charge for Colliedesk Cloud | Polar, our payment provider. We never see your card number |
| A keyed fingerprint of your verified email address and of your IP address at sign-up | To allow one free trial per person and stop mass sign-ups | Your sign-up |
| Technical data: IP address, browser, request times, errors | To keep the service secure and to fix problems | Your browser |
| Usage counts: active agents, replies sent | To understand how Colliedesk is used, without names or content | The Colliedesk server |
| Your email address, if you subscribe to release notes | To send one email per release | You |

**About the sign-up fingerprint.** We store an HMAC (a one-way hash made with a secret key) of your verified email address and of your IP address. With it we can answer one question: "did this email already have a trial?" Nobody can read your email address from it. We keep it for as long as Colliedesk Cloud runs, because deleting it would allow a new trial.

## What we do not do

- We do not sell or rent personal data.
- We do not use your data for advertising or share it with ad networks.
- We do not use your workspace content to train AI models.
- We do not read your conversations. We look at workspace content only when you ask us for help, or when we must to keep the service secure or to follow the law.

## Where your data is stored

Colliedesk Cloud runs on Hetzner servers in Falkenstein, Germany. Database and attachment backups are encrypted before they leave the server and are kept on other Hetzner servers in Germany.

Some of the providers below are outside the European Union (for example in the United States). When personal data goes to them, we rely on their standard contractual clauses or an equivalent legal safeguard.

## Who helps us run Colliedesk

| Provider | What they do | Location |
|---|---|---|
| Hetzner | Servers and encrypted backups | Germany |
| Clerk | Sign-in with an email code or Google | United States |
| Google | Sign-in, only if you choose "Continue with Google" | United States |
| Polar | Payments, invoices and tax, as merchant of record | United States |
| Resend | Sends the replies your team writes, and our service emails | United States |
| Cloudflare | DNS and network protection | Global |
| PostHog | Cookieless website statistics and anonymous usage counts. It does not store your IP address | United States |
| GitHub | Hosts this website and the Colliedesk source code | United States |

We will list a new provider on this page before it receives personal data.

## Cookies

This website sets **no cookies** and uses no local storage. Visits are counted without cookies and without a profile of you.

The Colliedesk app uses only the cookies and storage that sign-in needs (set by us and by Clerk). There are no advertising or tracking cookies.

## How long we keep data

- **Active workspace:** as long as your subscription or trial runs.
- **Ended trial or subscription:** the workspace is locked. You can still sign in and export everything.
- **Locked for 12 months:** we delete the workspace with all its content and attachments. We email the admins 30 days before.
- **Backups:** an encrypted copy can stay in backups for up to 30 days after a deletion, then it expires.
- **Sign-up fingerprints:** as long as Colliedesk Cloud runs (see above).
- **Billing records:** as long as tax and accounting law requires.

You can ask us to delete your workspace or account earlier. Email ${PRIVACY_EMAIL} from an admin's address.

## Your rights

Wherever you live, you can ask us to:

- show you the personal data we hold about you,
- correct it,
- delete it,
- give you a copy in a portable format,
- stop using it for a purpose you object to.

A workspace admin can export the whole workspace (conversations, contacts, attachments) as a ZIP file from **Settings**, at any time. Customers of a company that uses Colliedesk should contact that company first: it controls their data, and we will help it answer.

If you are in the EU or the UK, you can also complain to your data protection authority.

## Security

- All traffic uses HTTPS.
- Colliedesk has no passwords. You sign in with a one-time code sent to your email, or with Google.
- Each workspace is isolated in the database with PostgreSQL row-level security. A query for one workspace cannot read another.
- Backups are encrypted, and the key is kept apart from the servers.

No system is perfectly secure. If we learn of a breach that affects your data, we will tell you without undue delay.

## Children

Colliedesk is a tool for businesses. It is not meant for anyone under 16, and we do not knowingly collect their data.

## Changes to this policy

When we change this policy, we update the date at the top of this page and note it in the [changelog](/changelog). If a change reduces your rights, we email workspace admins before it takes effect.

## Contact

Questions or requests: **${PRIVACY_EMAIL}**. HC Labs Co., Ltd., Hanoi, Vietnam.

See also our [terms of service](/terms).`;

const page: Page = {
  jsonLd: [],
  name: 'Privacy policy',
  path: '/privacy',
  section: 'Product',
  title: 'Privacy policy | Colliedesk',
  description:
    'How Colliedesk Cloud and colliedesk.com handle personal data: what we collect, the providers we use, where data is stored (Germany), how long we keep it and your rights.',
  summary: 'What Colliedesk collects, why, who helps run it, where it is stored, how long it is kept, your rights',
  eyebrow: 'Legal',
  h1: 'Privacy policy',
  lede: `Plain English, no surprises. Last updated ${LEGAL_UPDATED}.`,
  updated: LEGAL_UPDATED,
  body,
};
page.jsonLd = [techArticle(page)];
export default page;
