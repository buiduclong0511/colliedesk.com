// Compares two built sites (a known-good baseline and a candidate) and exits 1 on any difference.
//   node scripts/compare-site.mjs <baseline-dir> <candidate-dir>
// - Same set of files. fonts/ is only required to exist on both sides.
// - Every non-HTML file (.md, .txt, .xml, _headers, CSS, JS, images) must be byte-identical.
// - HTML is compared after this normalisation, and nothing else:
//   * comments are dropped (generators emit text separators and source notes as comments);
//   * whitespace-only text between tags is dropped, other whitespace runs become one space
//     (except inside <pre>, which is compared exactly);
//   * character references are decoded, so &#x27; and ' compare equal;
//   * tag names are lower-cased, attributes are sorted, a self-closing "/" closes a non-void
//     element (SVG <path/> equals <path></path>) and is ignored on a void one, a
//     boolean attribute equals the same attribute with an empty value, and data-astro-* is dropped;
//   * a class attribute is compared as its list of class names (extra spaces ignored);
//   * JSON-LD is compared as parsed JSON.
//   The visible text flow is compared as well, so a dropped space between inline elements still fails.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const [baseDir, candDir] = process.argv.slice(2);
if (!baseDir || !candDir) {
  console.error('usage: node scripts/compare-site.mjs <baseline-dir> <candidate-dir>');
  process.exit(2);
}
for (const dir of [baseDir, candDir]) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    console.error(`not a directory: ${dir}`);
    process.exit(2);
  }
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
const listFiles = (root) =>
  walk(root)
    .map((f) => relative(root, f).split(sep).join('/'))
    .filter((f) => !f.startsWith('fonts/'))
    .sort();

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, ref) => {
    if (ref[0] === '#') return String.fromCodePoint(ref[1].toLowerCase() === 'x' ? parseInt(ref.slice(2), 16) : Number(ref.slice(1)));
    return ENTITIES[ref.toLowerCase()] ?? m;
  });

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const TAG = /<!--[\s\S]*?-->|<(?:[^>"']|"[^"]*"|'[^']*')*>/g;
const ATTR = /([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;

function normTag(raw) {
  const closing = raw.startsWith('</');
  const inner = raw.slice(closing ? 2 : 1, -1).replace(/\/\s*$/, '').trim();
  const [, name = '', rest = ''] = inner.match(/^(\S+)([\s\S]*)$/) || [];
  const attrs = [...rest.matchAll(ATTR)]
    .map(([, k, a, b, c]) => [k.toLowerCase(), decode(a ?? b ?? c ?? '')])
    .map(([k, v]) => [k, k === 'class' ? v.trim().split(/\s+/).join(' ') : v])
    .filter(([k]) => !k.startsWith('data-astro-'))
    .sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0))
    .map(([k, v]) => ` ${k}="${v}"`);
  return `<${closing ? '/' : ''}${name.toLowerCase()}${attrs.join('')}>`;
}

// Returns the normalised token list of an HTML document.
export function normalizeHtml(html) {
  const out = [];
  let pre = 0;
  let script = null; // attributes of the open <script>, while inside one
  let last = 0;
  const pushText = (text) => {
    if (script !== null) {
      if (!text) return;
      if (script.includes('application/ld+json')) {
        try {
          out.push(`json:${JSON.stringify(JSON.parse(text))}`);
        } catch {
          out.push(`badjson:${text}`);
        }
      } else out.push(`script:${text}`);
      return;
    }
    const decoded = decode(text);
    if (pre) {
      if (decoded) out.push(`text:${decoded}`);
      return;
    }
    if (!decoded.trim()) return;
    out.push(`text:${decoded.replace(/\s+/g, ' ')}`);
  };
  for (const m of html.matchAll(TAG)) {
    const raw = m[0];
    if (script !== null && raw !== '</script>') continue; // tag-looking text inside a script
    pushText(html.slice(last, m.index));
    last = m.index + raw.length;
    if (raw.startsWith('<!--')) continue;
    const tag = normTag(raw);
    if (tag === '<pre>' || tag.startsWith('<pre ')) pre++;
    if (tag === '</pre>') pre--;
    if (tag.startsWith('<script')) script = tag;
    if (tag === '</script>') script = null;
    out.push(tag);
    // <path/> in SVG closes the element; a "/" on an HTML void element (<input/>) changes nothing.
    const name = tag.slice(1).split(/[ >]/)[0];
    if (raw.endsWith('/>') && !VOID.has(name)) out.push(`</${name}>`);
  }
  pushText(html.slice(last));
  return out;
}

function firstDiff(a, b) {
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    // After the first difference every later token may shift; one is enough to act on.
    if (a[i] !== b[i]) return { at: i, base: a.slice(Math.max(0, i - 2), i + 3), cand: b.slice(Math.max(0, i - 2), i + 3) };
  }
  return null;
}

// Dropping whitespace-only text could hide a visible space between two inline elements
// ("<b>x</b> <a>y</a>"). This second view keeps it: inline tags are removed, every other tag
// becomes a "|" boundary, and the text in between must match segment by segment.
const INLINE = new Set(['a', 'abbr', 'b', 'button', 'code', 'em', 'g', 'i', 'img', 'input', 'kbd', 'label', 'path', 'rect', 'small', 'span', 'strong', 'svg', 'title']);
const textFlow = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>|<!--[\s\S]*?-->|<!doctype[^>]*>/gi, '')
      .replace(/<\/?([a-z0-9]+)(?:[^>"']|"[^"]*"|'[^']*')*>/gi, (_, name) => (INLINE.has(name.toLowerCase()) ? '' : '|')),
  )
    .replace(/\s+/g, ' ')
    .replace(/ ?\| ?/g, '|')
    .replace(/\|+/g, '|')
    .split('|');

const problems = [];
for (const dir of [baseDir, candDir]) if (!existsSync(join(dir, 'fonts'))) problems.push(`${dir}: fonts/ missing`);

const base = listFiles(baseDir);
const cand = listFiles(candDir);
const candSet = new Set(cand);
const baseSet = new Set(base);
for (const f of base) if (!candSet.has(f)) problems.push(`missing in candidate: ${f}`);
for (const f of cand) if (!baseSet.has(f)) problems.push(`extra in candidate: ${f}`);

let compared = 0;
let html = 0;
for (const f of base.filter((x) => candSet.has(x))) {
  compared++;
  const a = readFileSync(join(baseDir, f));
  const b = readFileSync(join(candDir, f));
  if (!f.endsWith('.html')) {
    if (!a.equals(b)) problems.push(`bytes differ: ${f}`);
    continue;
  }
  html++;
  const na = normalizeHtml(a.toString('utf8'));
  const nb = normalizeHtml(b.toString('utf8'));
  const d = firstDiff(na, nb) ?? firstDiff(textFlow(a.toString('utf8')), textFlow(b.toString('utf8')));
  if (d) problems.push(`html differs: ${f} at token ${d.at}\n    baseline:  ${JSON.stringify(d.base)}\n    candidate: ${JSON.stringify(d.cand)}`);
}

if (problems.length) {
  for (const p of problems) console.error(`DIFF ${p}`);
  console.error(`\n${problems.length} difference(s); ${compared} files compared (${html} HTML)`);
  process.exit(1);
}
console.log(`SAME ${compared} files compared (${html} HTML normalised, ${compared - html} byte-identical)`);
