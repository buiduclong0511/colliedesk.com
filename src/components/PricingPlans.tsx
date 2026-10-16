import { FOUNDING_SLOTS, foundingState, placesLeft } from '../lib/founding';
import { CONTACT_EMAIL, FOUNDING_HREF, PRICE, REPO, TRIAL_HREF } from '../lib/site';

// The three plans above the pricing prose; the Markdown twin carries the same facts as a table.
export function PricingPlans() {
  const state = foundingState();
  const left = placesLeft(state);
  return (
    <section className="wrap plans" aria-label="Plans">
      <article className="plan">
        <h2 className="plan-name">Self-host</h2>
        <p className="plan-price"><strong>$0</strong> <span>forever</span></p>
        <ul>
          <li>Every feature, no paywalled edition</li>
          <li>AGPL-3.0, your server, your PostgreSQL</li>
          <li>AI with your own model key</li>
        </ul>
        <a className="btn btn-ghost" href={REPO} rel="noopener">Self-host free <span aria-hidden="true">↗</span></a>
      </article>
      <article className="plan plan-featured" aria-labelledby="plan-founding">
        <p className="plan-flag">{state.open ? (left === null ? `First ${FOUNDING_SLOTS} workspaces` : `${left} of ${FOUNDING_SLOTS} places left`) : 'Closed: all places taken'}</p>
        <h2 className="plan-name" id="plan-founding">Founding</h2>
        <p className="plan-price"><strong>$100</strong> <span>per workspace / year</span></p>
        <ul>
          <li>Price locked for life</li>
          <li>Free Freshdesk migration, with a reconcile report</li>
          <li>Up to 10 agents, no per-agent fees</li>
          <li>20 GB of attachments, imported files included</li>
          <li>AI at LLM cost +30%, or bring your own key</li>
        </ul>
        {state.open ? <a className="btn btn-primary" href={FOUNDING_HREF}>Get founding access</a> : <p>Founding is closed. Existing founding customers keep this price for life.</p>}
      </article>
      <article className="plan">
        <h2 className="plan-name">Cloud Team</h2>
        <p className="plan-price"><strong>$49</strong> <span>per workspace / month</span></p>
        <p className="plan-alt">or $490 per year</p>
        <ul>
          <li>We run, update and back it up</li>
          <li>14-day free trial, no card (30 days if you import from Freshdesk)</li>
          <li>Up to 10 agents, unlimited conversations</li>
          <li>100 GB of attachments, imported files included</li>
          <li>No per-agent fees</li>
          <li>AI at LLM cost +30%, or bring your own key</li>
        </ul>
        <a className="btn btn-primary" href={TRIAL_HREF}>Start free trial</a>
      </article>
      <article className="plan">
        <h2 className="plan-name">Cloud Team 25</h2>
        <p className="plan-price"><strong>{PRICE.team25Monthly}</strong> <span>per workspace / month</span></p>
        <p className="plan-alt">or {PRICE.team25Yearly} per year</p>
        <ul>
          <li>Everything in Team</li>
          <li>Up to 25 agents, unlimited conversations</li>
          <li>250 GB of attachments, imported files included</li>
          <li>Flat price, no per-agent fees</li>
        </ul>
        <a className="btn btn-primary" href={TRIAL_HREF}>Start free trial</a>
      </article>
      <p className="plans-note">
        Need more storage? Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Customer email always arrives, even over the
        cap; only agent uploads and new imports pause, and we warn you at 80%.
      </p>
    </section>
  );
}
