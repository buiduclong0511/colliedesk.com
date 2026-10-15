import type { APIRoute } from 'astro';
import { allPages } from '../data/pages';
import { llmsFullTxt } from '../lib/feeds';

export const GET: APIRoute = () => new Response(llmsFullTxt(allPages()), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
