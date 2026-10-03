/**
 * FILE: src/admin/lib/sanitizeSvg.js
 * WHAT IT DOES
 *   Cleans an SVG before it is saved: removes <script>, event handlers (onclick...), external links
 *   and other risky parts. Custom icons are also shown through <img>, so this is a second safety layer.
 */
const BLOCKED_TAGS = new Set(['script', 'foreignobject', 'iframe', 'object', 'embed', 'style', 'link', 'meta', 'audio', 'video', 'canvas', 'animate', 'set', 'animatemotion', 'animatetransform']);

export function sanitizeSvg(source) {
  const text = String(source ?? '').trim();
  if (!text) throw new Error('The SVG is empty.');
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  if (doc.querySelector('parsererror')) throw new Error('That does not look like a valid SVG file.');
  const root = doc.documentElement;
  if (!root || root.localName.toLowerCase() !== 'svg') throw new Error('The file must start with an <svg> element.');

  const walk = (el) => {
    [...el.children].forEach((child) => {
      if (BLOCKED_TAGS.has(child.localName.toLowerCase())) {
        child.remove();
        return;
      }
      walk(child);
    });
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      const isLink = name === 'href' || name === 'xlink:href';
      if (name.startsWith('on')) el.removeAttribute(attr.name);
      else if (isLink && !value.startsWith('#')) el.removeAttribute(attr.name);
      else if (value.includes('javascript:') || value.includes('data:text/html')) el.removeAttribute(attr.name);
      else if (name === 'style' && /url\s*\(|expression|@import/i.test(value)) el.removeAttribute(attr.name);
    });
  };
  walk(root);

  if (!root.getAttribute('xmlns')) root.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  if (!root.getAttribute('viewBox')) {
    const w = parseFloat(root.getAttribute('width'));
    const h = parseFloat(root.getAttribute('height'));
    if (w > 0 && h > 0) root.setAttribute('viewBox', `0 0 ${w} ${h}`);
  }
  root.removeAttribute('width');
  root.removeAttribute('height');
  return new XMLSerializer().serializeToString(root);
}
