// Every page of the site, in llms.txt and sitemap order.
import type { Page } from '../../lib/page';
import changelog from './changelog';
import home from './home';
import migrateFreshdesk from './migrate-freshdesk';
import migrateFreshdeskExport from './migrate-freshdesk-export';
import migrateZendeskExport from './migrate-zendesk-export';
import openSource from './open-source';
import pricing from './pricing';
import privacy from './privacy';
import { docsPages, roadmapPage } from './repo-docs';
import terms from './terms';
import vsFreshdesk from './vs-freshdesk';
import vsFront from './vs-front';
import vsHelpScout from './vs-help-scout';
import vsZendesk from './vs-zendesk';

let cache: readonly Page[] | undefined;

// Built on first use, because the docs pages read the product checkout (PRODUCT_DIR), which
// only a build needs; astro check and the config load must work without it.
export function allPages(): readonly Page[] {
  cache ??= [
    home, pricing, migrateFreshdesk, migrateFreshdeskExport, migrateZendeskExport,
    vsFreshdesk, vsZendesk, vsHelpScout, vsFront, openSource, roadmapPage(), changelog,
    privacy, terms, ...docsPages(),
  ];
  return cache;
}
