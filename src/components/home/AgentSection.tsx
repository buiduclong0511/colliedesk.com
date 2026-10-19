import { AGENT_HEADING, AGENT_LEDE, AGENT_POINTS, AGENT_TIERS, MCP_URL } from '../../data/pages/home-sections';
import { Badge } from '../Badge';
import { RequestTile } from './RequestTile';

// "Your AI agent can do this too": the shipped MCP server and agent token tiers, then what waits for
// a person. The request card plays one request on the Requests screen; the text says the same.
export function AgentSection() {
  return (
    <section className="section" aria-labelledby="agents">
      <div className="wrap">
        <div className="split">
          <div>
            <p className="eyebrow">For your AI agent</p>
            <h2 id="agents">{AGENT_HEADING}</h2>
            <p className="section-lede">{AGENT_LEDE}</p>
            <p><Badge kind="shipped">Available now</Badge> <a href="/docs/mcp">Connect an AI agent</a> · <a href="/docs/agent-requests">How approval works</a></p>
          </div>
          <div className="agent-stage">
            <pre className="code-card"><code><span className="t-prompt">$</span>{` claude mcp add --transport http colliedesk \\\n    ${MCP_URL} \\\n    --header "Authorization: Bearer $COLLIEDESK_TOKEN"`}</code></pre>
            <RequestTile />
          </div>
        </div>
        <ol className="agent-tiers" aria-label="Agent token tiers, each with everything of the one before">
          {AGENT_TIERS.map(([tier, text]) => (
            <li key={tier}><h3><code>{tier}</code></h3><p>{text}</p></li>
          ))}
        </ol>
        <ul className="bento agent-points">
          {AGENT_POINTS.map(([k, v]) => (
            <li key={k} className="bento-card"><h3>{k}</h3><p>{v}</p></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
