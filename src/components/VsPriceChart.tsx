import { renderInline } from '../lib/markdown';
import {
  chartCaption, DEFAULT_TEAM_SIZE, fitLine, notForYouLines, rowsAt, savingAt, TEAM_SIZES, teamLabel, usd,
  type VsPricing,
} from '../lib/vs-pricing';

// Monthly cost by team size. The team-size buttons are radio inputs; CSS :has() shows the list for
// the checked one, so the chart works without JavaScript. Bars scale to the most expensive plan at
// that size, and a plan's AI add-on is drawn as a separate segment.
export function VsPriceChart({ pricing }: { pricing: VsPricing }) {
  return (
    <figure className="vs-chart" data-read-on={pricing.readOn}>
      <figcaption className="vs-chart-head">
        <span className="vs-chart-title">What a team pays a month</span>
        <fieldset className="vs-sizes">
          <legend className="visually-hidden">Agents</legend>
          {TEAM_SIZES.map((n) => (
            <label key={n}>
              <input type="radio" name="agents" value={n} defaultChecked={n === DEFAULT_TEAM_SIZE} />
              {teamLabel(n)}
            </label>
          ))}
        </fieldset>
      </figcaption>
      {TEAM_SIZES.map((n) => {
        const rows = rowsAt(pricing, n);
        const max = Math.max(...rows.map((r) => r.usd));
        const saving = savingAt(pricing, n);
        return (
          <div key={n} className="vs-size" data-size={n}>
            <ol className="bars" data-agents={n} aria-label={teamLabel(n)}>
              {rows.map((r) => (
                <li key={r.name} className={r.ours ? 'bar bar-ours' : 'bar'}>
                  <div className="bar-label"><span>{r.name}</span><span className="bar-math">{r.math}</span></div>
                  <div className="bar-track">
                    <span className="vs-stack" style={{ width: `${Math.max((r.usd / max) * 100, 1.5).toFixed(1)}%` }}>
                      <span className="bar-fill" style={{ flexGrow: r.seatUsd }}></span>
                      {r.aiUsd > 0 && <span className="bar-fill bar-fill-ai" style={{ flexGrow: r.aiUsd }} title="AI add-on"></span>}
                    </span>
                    <strong>{usd(r.usd)}<small>/mo</small></strong>
                  </div>
                </li>
              ))}
            </ol>
            {saving && (
              <p className="vs-saving">
                {`${usd(saving.perMonth)} a month less than ${saving.name}, ${usd(saving.perMonth * 12)} a year.`}
              </p>
            )}
          </div>
        );
      })}
      <p className="vs-fit-line"><strong>{fitLine(pricing)}</strong></p>
      <p className="vs-chart-note">{chartCaption(pricing)} <span className="vs-legend"><span className="vs-legend-ai" aria-hidden="true"></span> AI add-on</span></p>
    </figure>
  );
}

export function VsFit({ pricing }: { pricing: VsPricing }) {
  const item = (text: string) => <li key={text} dangerouslySetInnerHTML={{ __html: renderInline(text) }} />;
  return (
    <section className="vs-fit" id="fit" aria-labelledby="fit-title">
      <h2 id="fit-title" className="visually-hidden">Who Colliedesk fits</h2>
      <div className="vs-fit-col vs-fit-yes">
        <h3>Colliedesk is for you if</h3>
        <ul>{pricing.forYou.map(item)}</ul>
      </div>
      <div className="vs-fit-col vs-fit-no">
        <h3>Not for you yet if</h3>
        <ul>{notForYouLines(pricing).map(item)}</ul>
      </div>
    </section>
  );
}
