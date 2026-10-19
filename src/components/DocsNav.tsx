import type { DocsNavGroup } from '../lib/page';

export function DocsNav({ groups, current }: { groups: readonly DocsNavGroup[]; current: string }) {
  return (
    <nav className="docs-nav" aria-label="Docs">
      {groups.map(({ title, items }) => (
        <div key={title} className="docs-nav-group">
          <p className="docs-nav-title">{title}</p>
          <ul>
            {items.map(({ href, label }) => (
              <li key={href}><a href={href} aria-current={href === current ? 'page' : undefined}>{label}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
