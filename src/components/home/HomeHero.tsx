import { HOME_LEDE } from '../../data/pages/home';
import { FOUNDING_HREF } from '../../lib/site';
import { ReconcileProof } from './ReconcileProof';

const INSTALL = `curl -fsSL https://raw.githubusercontent.com/colliedesk/colliedesk/main/install.sh \\
    | sh -s -- --name "Acme Support" --email "you@acme.com"
`;

function InstallSnippet() {
  return (
    <div className="self">
      <figure className="install" aria-label="Self-host Colliedesk with one command">
        <pre><code><span className="t-prompt">$</span>{` ${INSTALL}`}<span className="t-out"># prints a one-time sign-in link, no passwords</span></code></pre>
      </figure>
      <p className="install-label">Or self-host it free with one command.</p>
    </div>
  );
}

// Hero: centred promise and two actions, then the real product with the migration proof laid over its
// corner, so the first screen shows both the inbox and the "nothing lost" check.
export function HomeHero() {
  return (
    <section className="home-hero">
      <div className="wrap">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">Open source · AGPL-3.0 · Pre-alpha v0.1</p>
          <h1>Bring every ticket home.</h1>
          <p className="lede">{HOME_LEDE}</p>
          <div className="cta-row">
            <a className="btn btn-primary btn-lg" href={FOUNDING_HREF}>Start free trial <span aria-hidden="true">→</span></a>{' '}
            <a className="btn btn-lg" href="/migrate/freshdesk">Read the migration guide</a>
          </div>
          <p className="hero-note">14-day free trial, no card. <b>Cloud Team $49</b> per workspace per month, no per-agent fees. Founding plan $100 a year. <a href="/pricing">See pricing</a></p>
        </div>
        <div className="hero-stage">
          <figure className="hero-shot">
            <img src="/product-inbox.jpg" width={1440} height={900} alt="The Colliedesk inbox: a list of customer conversations with status and priority, an open conversation with a reply and a private note, and the conversation properties." fetchPriority="high" />
          </figure>
          <ReconcileProof />
        </div>
        <InstallSnippet />
      </div>
    </section>
  );
}
