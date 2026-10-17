import { HOME_H1, HOME_H1_LEAD, HOME_LEDE } from '../../data/pages/home';
import { HERO_SAVINGS, SAVING_PCT } from '../../data/pages/home-sections';
import { TRIAL_HREF } from '../../lib/site';

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

// The h1 names one competitor at a time with CSS only (public/styles.css, .h1-rotate): one pass
// through the list, then it rests on the first. Screen readers read the full sentence once; the
// moving words are aria-hidden. Reduced motion, or no animation support, shows the first only.
function RotatingH1() {
  return (
    <h1>
      <span className="visually-hidden">{HOME_H1}</span>
      <span aria-hidden="true" className="h1-rotate">
        {`${HOME_H1_LEAD} `}
        <span className="h1-swap">
          {HERO_SAVINGS.map((s) => (
            <span key={s.name} className="h1-item"><em>{`${s.pct}% cheaper`}</em>{` than ${s.name}`}</span>
          ))}
        </span>
      </span>
    </h1>
  );
}

// Hero copy: centred promise and two actions. Home.astro places the product screenshot and the
// reconcile proof under it; the <img> stays out of React, whose renderer would add an image preload.
export function HeroCopy() {
  return (
    <div className="hero-copy">
      <p className="eyebrow hero-eyebrow">Open source · AGPL-3.0 · Alpha, live on Cloud</p>
      <RotatingH1 />
      <p className="lede">{HOME_LEDE}</p>
      <div className="cta-row">
        <a className="btn btn-primary btn-lg" href={TRIAL_HREF}>Start free trial <span aria-hidden="true">→</span></a>{' '}
        <a className="btn btn-lg" href="/migrate/freshdesk">Read the migration guide</a>
      </div>
      <p className="hero-note">14-day free trial, no card · <b>$49</b> per workspace a month · <a href="#bill">{`How we get to ${SAVING_PCT}%`}</a></p>
    </div>
  );
}
