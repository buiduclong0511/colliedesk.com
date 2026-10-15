import type { APIRoute } from 'astro';
import { ENTRIES } from '../data/pages/changelog';
import { changelogRss } from '../lib/feeds';

export const GET: APIRoute = () => new Response(changelogRss(ENTRIES), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
