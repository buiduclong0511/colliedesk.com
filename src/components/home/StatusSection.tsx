import { statusTable } from '../../data/pages/collie-status';
import { renderMarkdown } from '../../lib/markdown';

export function StatusSection() {
  return (
    <section className="section" aria-labelledby="today">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Honest status</p>
          <h2 id="today">What works today, and what is coming</h2>
          <p className="section-lede">Dates are targets, not promises.</p>
        </div>
        <div className="prose prose-wide" dangerouslySetInnerHTML={{ __html: renderMarkdown(statusTable) }} />
      </div>
    </section>
  );
}
