import svg from '../../public/logo-wordmark.svg?raw';
import { NAME } from '../lib/site';

// Brand wordmark (mascot + outlined text, no font needed), inlined so it costs no request. The mascot's
// white ruff needs a dark ground, so it sits on its tile; the letters take the theme's text colours.
const WORDMARK = svg
  .replace('<svg xmlns="http://www.w3.org/2000/svg"', '<svg class="wordmark" height="30"')
  .replace(/<!--[\s\S]*?-->\s*/g, '')
  .replace(/(<title>[^<]*<\/title>)([\s\S]*?)(<path d="M46)/, '$1<rect class="wm-tile" width="32" height="32" rx="7"/><g transform="translate(2.4 2.6) scale(0.85)">$2</g>$3')
  .replace('fill="#e8edf4"', 'class="wm-collie"')
  .replace('fill="#b4bfcf"', 'class="wm-desk"')
  .replace(/\s*\n\s*/g, '');

export function BrandLink() {
  return <a className="brand" href="/" aria-label={`${NAME} home`} dangerouslySetInnerHTML={{ __html: WORDMARK }} />;
}
