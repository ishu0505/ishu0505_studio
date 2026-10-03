/**
 * FILE: src/admin/lib/content.js
 * WHAT IT DOES
 *   Helpers for the website's content files:
 *     CONTENT_FILES  the list of JSON files the admin edits
 *     serialize()    turn data back into JSON text exactly like the repo files
 *     sameContent()  'did anything change?'     slugify()/uniqueId()  make safe ids
 *     moveItem/replaceAt/removeAt  small helpers for editing lists without mutating them
 */
export const CONTENT_FILES = ['profile', 'projects', 'hobbies', 'resume', 'writing', 'stickers', 'icons'];
export const contentPath = (name) => `src/content/${name}.json`;
// Same format the repo files already use, so unchanged files stay byte-identical.
export const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
export const clone = (value) => JSON.parse(JSON.stringify(value));
export const sameContent = (a, b) => serialize(a) === serialize(b);

// Where a content path ("assets/images/x.jpg") lives in the repo.
export const repoPathFor = (assetPath) => `public/${assetPath}`;

export function slugify(text, fallback = 'item') {
  const s = String(text ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return s || fallback;
}

export function uniqueId(base, taken) {
  const set = new Set(taken);
  let id = slugify(base);
  let n = 2;
  while (set.has(id)) id = `${slugify(base)}-${n++}`;
  return id;
}

// Immutable list helpers used by the editors.
export const moveItem = (arr, from, to) => {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};
export const replaceAt = (arr, i, value) => arr.map((v, idx) => (idx === i ? value : v));
export const removeAt = (arr, i) => arr.filter((_, idx) => idx !== i);
