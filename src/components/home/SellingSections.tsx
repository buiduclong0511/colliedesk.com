import { BARS } from '../../data/pages/home-sections';
import { PRICES_READ } from '../../lib/site';
import { Badge } from '../Badge';

const MAX = Math.max(...BARS.map((b) => b.usd));

function Selling() {
  return (
    <section className="section" aria-labelledby="selling">
      <div className="wrap split">
        <div>
          <p className="eyebrow">Wait, what are you selling me?</p>
          <h2 id="selling">Self-hosting is free. We sell two things.</h2>
          <p className="section-lede">No enterprise edition with the good parts held back. Every feature is in the open-source code.</p>
        </div>
        <ol className="sell-list">
          <li><h3>Colliedesk Cloud</h3><p>We run it for you. One flat price per workspace, not per agent: <strong>$49 a month</strong> or $490 a year.</p></li>
          <li><h3>Migration</h3><p>We move your Freshdesk history (tickets, replies, attachments, tags) and give you a reconcile report that proves nothing was lost.</p></li>
        </ol>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section className="section section-alt" aria-labelledby="pillars">
      <div className="wrap">
        <h2 id="pillars" className="visually-hidden">Why teams switch</h2>
        <div className="pillars">
          <article className="pillar">
            <p className="pillar-k">01 · Your data</p>
            <h3>Leave Freshdesk with all of it</h3>
            <p>Freshdesk's ticket export has fields only, no conversation. Our importer brings tickets, replies, notes, checksummed attachments, tags and contacts, then proves the counts match.</p>
            <p><Badge kind="coming">Coming v0.2</Badge> <a href="/migrate/freshdesk">Read the migration guide</a></p>
          </article>
          <article className="pillar">
            <p className="pillar-k">02 · AI included</p>
            <h3>AI that answers tickets, not an add-on</h3>
            <p>Drafts and triage from your own past replies and knowledge base, auto-answer for repetitive tickets with a human in the loop. Pay model cost +30%, or bring your own key.</p>
            <p><Badge kind="coming">Coming v0.3</Badge> <a href="/roadmap">See the roadmap</a></p>
          </article>
          <article className="pillar">
            <p className="pillar-k">03 · Flat price</p>
            <h3>No per-agent fees</h3>
            <p>Hire a fifth agent, or a tenth, and the bill stays $49 a month for the workspace. Self-host and it stays $0.</p>
            <p><Badge kind="shipped">Price published</Badge> <a href="/pricing">See pricing</a></p>
          </article>
        </div>
      </div>
    </section>
  );
}

function Bill() {
  return (
    <section className="section" aria-labelledby="bill">
      <div className="wrap split">
        <div>
          <p className="eyebrow">The bill for five agents</p>
          <h2 id="bill">Per-agent pricing, then per-agent AI</h2>
          <p className="section-lede">
            {`List prices per month, billed annually, read on ${PRICES_READ}. Zendesk publishes euros: Suite Professional with Copilot is 5 × (€115 + €50) = €825. `}
            <a href="/vs/zendesk">Details</a>.
          </p>
        </div>
        <ul className="bars" aria-label="Monthly cost for five agents">
          {BARS.map((b) => (
            <li key={b.href} className={b.ours ? 'bar bar-ours' : 'bar'}>
              <div className="bar-label"><a href={b.href}>{b.name}</a><span className="bar-math">{b.math}</span></div>
              <div className="bar-track">
                <span className="bar-fill" style={{ width: `${Math.max((b.usd / MAX) * 100, 1.5).toFixed(1)}%` }}></span>
                <strong>{`$${b.usd}`}<small>/mo</small></strong>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// The sections between the home hero and the status table.
export function SellingSections() {
  return (
    <>
      <Selling />
      <Pillars />
      <Bill />
    </>
  );
}
