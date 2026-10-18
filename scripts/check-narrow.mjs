// Renders every built page at a 375px phone width in headless Chrome and fails when a page scrolls
// sideways. Static checks cannot see this: a nowrap button label or a wide table only overflows once
// the browser lays it out. No dependencies: Chrome DevTools Protocol over Node's built-in WebSocket.
//   node scripts/check-narrow.mjs            (needs _site/ and a Chrome binary; CHROME_BIN overrides)
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const WIDTH = 375;
const site = fileURLToPath(new URL('../_site/', import.meta.url));
const chromeBin = process.env.CHROME_BIN
  || ['google-chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((b) => !b.startsWith('/') || existsSync(b));

function pages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return pages(p);
    return e.name.endsWith('.html') ? ['/' + relative(site, p).split(sep).join('/')] : [];
  });
}

function waitForLine(proc, re, label) {
  return new Promise((resolve, reject) => {
    let buf = '';
    const onData = (d) => { buf += d; const m = buf.match(re); if (m) resolve(m); };
    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);
    proc.on('exit', (code) => reject(new Error(`${label} exited (${code}) before it was ready:\n${buf}`)));
  });
}

function cdp(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const waiting = new Map();
  const listeners = [];
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id && waiting.has(msg.id)) {
      const { resolve, reject } = waiting.get(msg.id);
      waiting.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else listeners.forEach((l) => l(msg));
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    waiting.set(++id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
  const once = (method, sessionId) => new Promise((resolve) => {
    const l = (msg) => { if (msg.method === method && msg.sessionId === sessionId) { listeners.splice(listeners.indexOf(l), 1); resolve(msg.params); } };
    listeners.push(l);
  });
  return new Promise((resolve, reject) => { ws.onopen = () => resolve({ send, once, close: () => ws.close() }); ws.onerror = reject; });
}

if (!existsSync(join(site, 'index.html'))) { console.error('check-narrow: _site/ is missing; build the site first'); process.exit(1); }

const port = 4400 + Math.floor(Math.random() * 500);
const server = spawn(process.execPath, [fileURLToPath(new URL('./serve.mjs', import.meta.url))], { env: { ...process.env, PORT: String(port) } });
const profile = mkdtempSync(join(tmpdir(), 'check-narrow-'));
const chrome = spawn(chromeBin, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank']);
const failures = [];
let list = [];
try {
  await waitForLine(server, /serving/, 'serve.mjs');
  const [, wsUrl] = await waitForLine(chrome, /DevTools listening on (ws:\S+)/, chromeBin);
  const c = await cdp(wsUrl);
  const { targetId } = await c.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await c.send('Target.attachToTarget', { targetId, flatten: true });
  await c.send('Page.enable', {}, sessionId);
  await c.send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 812, deviceScaleFactor: 1, mobile: true }, sessionId);
  list = pages(site);
  for (const path of list) {
    const loaded = c.once('Page.loadEventFired', sessionId);
    await c.send('Page.navigate', { url: `http://localhost:${port}${path}` }, sessionId);
    await loaded;
    const { result } = await c.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const w = document.documentElement.clientWidth, sw = document.documentElement.scrollWidth;
        if (sw <= w) return null;
        const clipped = (e) => { for (let p = e.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o !== 'visible') return true; } return false; };
        const worst = [...document.body.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().right > w + 0.5 && !clipped(e))
          .map((e) => e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).trim().split(/\\s+/).join('.') : '') + ' "' + e.textContent.trim().slice(0, 40) + '"');
        return sw + 'px wide; ' + (worst.slice(-1)[0] || 'no single element');
      })()`,
    }, sessionId);
    if (result.value) failures.push(`${path}: scrolls sideways at ${WIDTH}px, ${result.value}`);
  }
  await c.send('Browser.close').catch(() => {});
  c.close();
} finally {
  const exited = chrome.exitCode === null ? new Promise((r) => chrome.once('exit', r)) : null;
  chrome.kill();
  server.kill();
  await exited;
  // Chrome helpers can still be flushing the temporary profile; leaving a stray file in tmp is harmless.
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 3 }); } catch {}
}

if (failures.length) { failures.forEach((f) => console.error('FAIL ' + f)); process.exit(1); }
console.log(`OK ${list.length} pages fit ${WIDTH}px without sideways scroll`);
