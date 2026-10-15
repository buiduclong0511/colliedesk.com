// A space between the buttons keeps their labels apart in text-only readers; flex layout hides it.
import { FOUNDING_HREF, REPO } from '../lib/site';

export function CtaButtons() {
  return (
    <div className="cta-row">
      <a className="btn btn-primary" href={FOUNDING_HREF}>Start free trial</a>{' '}
      <a className="btn btn-ghost" href={REPO} rel="noopener">Self-host free <span aria-hidden="true">↗</span></a>
    </div>
  );
}
