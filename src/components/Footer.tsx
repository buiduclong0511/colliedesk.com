import { FOOTER, UPDATES_FORM_URL } from '../lib/site';
import { MoonIcon } from './Icons';
import { NavLink } from './NavLink';
import { BrandLink } from './Wordmark';

// Works with public/updates.js, which sends the form as JSON and shows the result in the status line.
function UpdatesForm() {
  return (
    <form className="updates-form" data-updates-form="" action={UPDATES_FORM_URL} method="post">
      <label htmlFor="updates-email" className="footer-title">Release notes by email</label>
      <p>One email when a release ships. Reply "stop" and we take you off the list.</p>
      <div className="updates-row">
        <input id="updates-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
        <button type="submit" className="btn btn-primary">Subscribe</button>
      </div>
      <input className="updates-trap" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p className="updates-status" role="status" aria-live="polite"></p>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <BrandLink />
          <p>Open-source helpdesk by HC Labs. AGPL-3.0. Every page on this site has a plain Markdown version: add <code>.md</code> to the URL.</p>
        </div>
        {FOOTER.map((c) => (
          <div key={c.title}>
            <h2 className="footer-title">{c.title}</h2>
            <ul>
              {c.links.map((l) => (
                <li key={l.href}><NavLink link={l} current="" /></li>
              ))}
            </ul>
          </div>
        ))}
        <UpdatesForm />
      </div>
      <div className="wrap footer-legal">
        <p>© 2026 HC Labs. Pre-alpha software: things will change, and we will say so in the <a href="/changelog">changelog</a>.</p>
        <button type="button" className="theme-toggle" data-theme-toggle="" aria-pressed="false" hidden><MoonIcon />Dark theme</button>
      </div>
    </footer>
  );
}
