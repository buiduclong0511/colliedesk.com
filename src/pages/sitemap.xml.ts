import type { APIRoute } from 'astro';
import { allPages } from '../data/pages';
import { sitemapXml } from '../lib/feeds';

export const GET: APIRoute = () => new Response(sitemapXml(allPages()), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
