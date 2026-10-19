import { FlowPause } from './FlowTile';

// An agent request from arrival to Approved, played as a CSS loop beside the MCP command: the call above
// the token's tier waits, a person presses Approve, and it runs once as that person (docs/user/agent-requests.md).
// The markup is the final state, for reduced motion and browsers without animation. The loop is longer than
// 5 s, so it has the same Pause switch as the Threading card; hover pauses it too.
export function RequestTile() {
  return (
    <div className="loop agent-loop">
      <div className="mini agent-request req" aria-hidden="true">
        <p className="mini-row">
          <span>Change the workspace timezone: UTC → Asia/Tokyo</span>
          <span className="flow-status"><span className="req-wait">Waiting</span><span className="req-done">Approved</span></span>
        </p>
        <p className="mini-sub req-from">Asked by Ada via Claude Code (read)</p>
        <div className="req-foot">
          <p className="agent-request-actions req-actions"><span className="agent-approve req-approve">Approve</span><span className="agent-reject">Reject</span></p>
          <p className="mini-sub req-ran">Approved by you. Ran once, as you.</p>
        </div>
      </div>
      <FlowPause />
    </div>
  );
}
