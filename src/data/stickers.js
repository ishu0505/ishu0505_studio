/**
 * FILE: src/data/stickers.js
 * WHAT IT DOES
 *   Adapter: hands src/content/stickers.json to the tiles. Keyed by tile id: { profile: [...], projects: [...] ... }.
 */
import stickers from '../content/stickers.json';

// Doodle stickers stuck on the corners of each tile, keyed by section id.
// Each: { icon, size, rot, pos: {top|bottom|left|right}, keep?, delay? }
export { stickers };
