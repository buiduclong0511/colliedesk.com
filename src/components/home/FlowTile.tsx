// One conversation from arrival to Resolved, played as a CSS loop on the Threading card: the email
// becomes an open conversation assigned to Ada, her reply goes out signed, the customer's answer joins
// the same thread and Ada resolves it. Only shipped behaviour is shown. The markup is the final state,
// so reduced motion and browsers without animation see the finished conversation. The loop is longer
// than 5 s, so the card has a Pause switch (WCAG 2.2.2); hover pauses it too.
export function FlowTile() {
  return (
    <div className="mini flow" aria-hidden="true">
      <p className="mini-row flow-mail">
        <span>Invoice #2291 charged twice</span>
        <span className="flow-status"><span className="flow-open">Open</span><span className="flow-done">Resolved</span></span>
      </p>
      <p className="mini-sub flow-from">sam@northwind.example · assigned to Ada</p>
      <div className="flow-msg flow-reply">
        <p className="flow-text"><b>Ada</b> Refunded the second charge.</p>
        <p className="mini-sub flow-sent">Sent · DKIM pass</p>
      </div>
      <div className="flow-msg flow-cust">
        <p><b>Sam</b> Thanks, it's there.</p>
        <p className="mini-sub">Joined the open conversation</p>
      </div>
    </div>
  );
}

export function FlowPause() {
  return <label className="flow-pause"><input type="checkbox" /> Pause</label>;
}
