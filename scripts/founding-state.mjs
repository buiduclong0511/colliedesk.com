// Prints the founding state the site is built with, as JSON: {"open":bool,"taken":int|null}.
// Source: the public endpoint of Colliedesk Cloud. Any failure prints the unknown state (open, no
// count) and a warning, so a Cloud outage never blocks a docs deploy.
// Usage: node scripts/founding-state.mjs > founding-state.json
const url = process.env.FOUNDING_STATE_URL ?? 'https://app.colliedesk.com/api/v1/founding';
const unknown = { open: true, taken: null };

async function read() {
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const body = await response.json();
  if (typeof body.open !== 'boolean') throw new Error('reply has no boolean "open"');
  const taken = Number.isInteger(body.taken) && body.taken >= 0 ? body.taken : null;
  return { open: body.open, taken };
}

let state = unknown;
try {
  state = await read();
} catch (error) {
  console.error(`founding state unknown (${url}): ${error.message}`);
}
console.log(JSON.stringify(state));
