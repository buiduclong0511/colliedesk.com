import { HOME_H1, HOME_LEDE } from '../../data/pages/home';
import { SAVING_PCT } from '../../data/pages/home-sections';
import { FOUNDING_HREF } from '../../lib/site';

const INSTALL = `curl -fsSL https://raw.githubusercontent.com/colliedesk/colliedesk/main/install.sh \\
    | sh -s -- --name "Acme Support" --email "you@acme.com"
`;

export function InstallSnippet() {
  return (
    <div className="self">
      <figure className="install" aria-label="Self-host Colliedesk with one command">
        <pre><code><span className="t-prompt">$</span>{` ${INSTALL}`}<span className="t-out"># prints a one-time sign-in link, no passwords</span></code></pre>
      </figure>
      <p className="install-label">Or self-host it free with one command.</p>
    </div>
  );
}

// Hero copy: centred promise and two actions. Home.astro places the product screenshot and the
// reconcile proof under it; the <img> stays out of React, whose renderer would add an image preload.
export function HeroCopy() {
  return (
    <div className="hero-copy">
      <p className="eyebrow hero-eyebrow">Open source · AGPL-3.0 · Pre-alpha v0.1</p>
      <h1>{HOME_H1}</h1>
      <p className="lede">{HOME_LEDE}</p>
      <div className="cta-row">
        <a className="btn btn-primary btn-lg" href={FOUNDING_HREF}>Start free trial <span aria-hidden="true">→</span></a>{' '}
        <a className="btn btn-lg" href="/migrate/freshdesk">Read the migration guide</a>
      </div>
      <p className="hero-note">14-day free trial, no card. <b>Cloud Team $49</b> per workspace per month, no per-agent fees. Founding plan $100 a year. <a href="#bill">{`How we get to ${SAVING_PCT}%`}</a></p>
    </div>
  );
}
