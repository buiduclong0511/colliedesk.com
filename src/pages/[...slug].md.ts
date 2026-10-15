import type { APIRoute, GetStaticPaths } from 'astro';
import { allPages } from '../data/pages';
import type { Page } from '../lib/page';
import { markdownTwin } from '../lib/twin';

// The Markdown twin of every page: /pricing.md, /docs/install.md, and /index.md for the home page.
export const getStaticPaths = (() =>
  allPages().map((page) => ({ params: { slug: page.path === '/' ? 'index' : page.path.slice(1) }, props: { page } }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ page: Page }> = ({ props }) =>
  new Response(markdownTwin(props.page), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
