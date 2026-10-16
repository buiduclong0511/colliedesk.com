import { FOUNDING_SLOTS, foundingState, placesLeft } from '../../lib/founding';
import { FOUNDING_CHECKOUT } from '../../lib/site';

function Collie() {
  return (
    <section className="section section-ink" aria-labelledby="collie">
      <div className="wrap split">
        <div>
          <p className="eyebrow">Why a collie?</p>
          <h2 id="collie">A sheepdog herds every ticket home. Your team stays in charge.</h2>
        </div>
        <div className="prose-invert">
          <p>A collie does not own the flock. It brings every sheep back to the pen and the shepherd decides what happens next. That is the job we give AI in Colliedesk (coming after beta): sort, draft and chase every ticket so none is lost, while a person on your team approves what goes out.</p>
        </div>
      </div>
    </section>
  );
}

function Fork() {
  return (
    <section className="section" aria-labelledby="fork">
      <div className="wrap split">
        <div>
          <p className="eyebrow">AGPL-3.0</p>
          <h2 id="fork">If you don't like something, fork it</h2>
          <p className="section-lede">You were held hostage at renewal once. That should not happen again. The code, your data and the export format are yours.</p>
          <p><a href="/open-source">How the license and the business fit together</a></p>
        </div>
        <pre className="code-card"><code><span className="t-prompt">$</span>{' gh repo fork colliedesk/colliedesk --clone\n'}<span className="t-prompt">$</span>{' cd colliedesk && make dev'}</code></pre>
      </div>
    </section>
  );
}

function Quotes() {
  return (
    <section className="section section-alt" aria-labelledby="quotes">
      <div className="wrap">
        <h2 id="quotes">From founding customers</h2>
        {/* Real founding-customer quotes go here, verbatim, with name and team. Never invent one. */}
        <div className="quote-slot"><p><strong>No quotes yet.</strong> Colliedesk is in alpha and we will not make them up. The first founding customers' words will go here, unedited, with their names.</p></div>
      </div>
    </section>
  );
}

function Founding() {
  const state = foundingState();
  const left = placesLeft(state);
  return (
    <section className="section" id="founding" aria-labelledby="founding-title">
      <div className="wrap">
        <div className="founding">
          <div>
            <p className="eyebrow">Founding offer{left !== null && state.open ? ` · ${left} of ${FOUNDING_SLOTS} places left` : ''}</p>
            {state.open ? (
              <>
                <h2 id="founding-title">$100 a year. Locked for life.</h2>
                <p className="section-lede">For small teams planning to leave Freshdesk. Only {FOUNDING_SLOTS} workspaces get it. Cloud Team lists at $490 a year. Your price never goes up, and we migrate your Freshdesk data for free.</p>
              </>
            ) : (
              <>
                <h2 id="founding-title">Founding is closed. All {FOUNDING_SLOTS} places are taken.</h2>
                <p className="section-lede">Thank you to the first {FOUNDING_SLOTS} teams. Their price stays $100 a year for life. Everyone else can start on Cloud Team, or self-host for free.</p>
              </>
            )}
          </div>
          <ul className="check-list">
            <li>$100 per workspace per year, locked for life</li>
            <li>Free Freshdesk migration with a reconcile report</li>
            <li>Up to 10 agents, no per-agent fees</li>
            <li>20 GB of attachments, imported files included</li>
            <li>AI at model cost +30%, or bring your own key</li>
            <li>Founding workspaces run on Colliedesk Cloud today</li>
          </ul>
          {state.open ? (
            <div className="founding-cta">
              <a className="btn btn-primary btn-lg" href={FOUNDING_CHECKOUT} rel="noopener">Become a founding customer, $100/year</a>
              <p>Secure checkout by Polar. After payment we email you within one business day to set up your workspace and plan your Freshdesk migration.</p>
            </div>
          ) : (
            <div className="founding-cta">
              <a className="btn btn-primary btn-lg" href="/pricing">See Cloud Team pricing</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// The sections between the home status table and the FAQ.
export function ClosingSections() {
  return (
    <>
      <Collie />
      <Fork />
      <Quotes />
      <Founding />
    </>
  );
}
