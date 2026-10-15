// Markdown twins: every HTML page has a .md file with the same content for people and AI agents.
import { absolutizeMarkdownLinks } from './markdown';
import type { Faq, Page } from './page';
import { ORIGIN, UPDATED } from './site';

export function faqMarkdown(faq: readonly Faq[] | undefined): string {
  if (!faq?.length) return '';
  return `\n\n## Questions people ask\n\n${faq.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}\n`;
}

export function markdownTwin(page: Page): string {
  const lede = page.lede ? `\n> ${page.lede}\n` : '';
  const content = page.md ?? [page.preMd, page.body].filter(Boolean).join('\n\n') + faqMarkdown(page.faq);
  const md = `# ${page.h1}\n${lede}\nSource: ${ORIGIN}${page.path}\nUpdated: ${page.updated || UPDATED}\n\n${content.trim()}\n`;
  return absolutizeMarkdownLinks(md);
}
