import type { DocsNavItem } from '../lib/page';

export function DocsNav({ items, current }: { items: readonly DocsNavItem[]; current: string }) {
  return (
    <nav className="docs-nav" aria-label="Docs">
      <p className="docs-nav-title">User guides</p>
      <ul>
        {items.map(({ href, label }) => (
          <li key={href}><a href={href} aria-current={href === current ? 'page' : undefined}>{label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
