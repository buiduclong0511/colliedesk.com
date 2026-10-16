import type { ReactNode } from 'react';

// Status badge; the Markdown renderer emits the same markup for **Coming after beta** and **Available now**.
export function Badge({ kind, children }: { kind: 'coming' | 'shipped'; children: ReactNode }) {
  return <span className={`badge badge-${kind}`}>{children}</span>;
}
