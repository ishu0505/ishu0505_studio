/**
 * FILE: src/components/hoverLayout.js
 * WHAT IT DOES
 *   Hover re-flow numbers. Instead of scaling a tile over its neighbours, the grid gives the hovered
 *   tile's rows/columns a bigger share and shrinks the others. Weights are CSS `fr` units per track.
 *   Front page grid = 4 columns x 3 rows (tile areas are in styles/bento.css).
 */
// Front page grid is 4 columns x 3 rows (see styles/bento.css for tile areas).
const HOME_BY_LAYOUT = {
  'projects-first': {
    projects: { cols: [1.18, 1.18, 0.82, 0.82], rows: [0.94, 0.94, 1.12] },
    writing:  { cols: [1.18, 1.18, 0.82, 0.82], rows: [0.82, 0.82, 1.36] },
    profile:  { cols: [0.9, 0.9, 1.1, 1.1], rows: [1.04, 0.82, 1.14] },
    resume:   { cols: [0.96, 0.96, 1.24, 0.84], rows: [0.82, 0.94, 1.24] },
    hobbies:  { cols: [0.96, 0.96, 0.84, 1.24], rows: [0.82, 1.04, 1.14] },
    contact:  { cols: [0.96, 0.96, 0.84, 1.24], rows: [0.82, 0.82, 1.36] },
  },
  'profile-top-left': {
    profile:  { cols: [1.16, 1.16, 0.84, 0.84], rows: [1.14, 1.02, 0.84] },
    writing:  { cols: [1.16, 1.16, 0.84, 0.84], rows: [0.82, 1.36, 0.82] },
    projects: { cols: [0.86, 0.86, 1.14, 1.14], rows: [0.98, 1.18, 0.84] },
    resume:   { cols: [1.16, 1.16, 0.84, 0.84], rows: [0.84, 1.02, 1.14] },
    hobbies:  { cols: [0.94, 0.94, 1.24, 0.88], rows: [0.84, 1.02, 1.14] },
    contact:  { cols: [0.94, 0.94, 0.88, 1.24], rows: [0.84, 1.02, 1.14] },
  },
  'dual-showcase': {
    profile:  { cols: [1.28, 0.91, 0.91, 0.91], rows: [1.26, 0.87, 0.87] },
    resume:   { cols: [0.91, 1.28, 0.91, 0.91], rows: [1.26, 0.87, 0.87] },
    hobbies:  { cols: [0.91, 0.91, 1.28, 0.91], rows: [1.26, 0.87, 0.87] },
    contact:  { cols: [0.91, 0.91, 0.91, 1.28], rows: [1.26, 0.87, 0.87] },
    projects: { cols: [1.18, 1.18, 0.82, 0.82], rows: [0.92, 1.04, 1.04] },
    writing:  { cols: [0.82, 0.82, 1.18, 1.18], rows: [0.92, 1.04, 1.04] },
  },
  classic: {
    profile:  { cols: [1.18, 1.18, 0.82, 0.82], rows: [0.98, 0.98, 1.04] },
    projects: { cols: [0.88, 0.88, 1.12, 1.12], rows: [1.12, 0.82, 1.06] },
    resume:   { cols: [0.94, 0.94, 1.26, 0.86], rows: [0.8, 1.02, 1.18] },
    hobbies:  { cols: [0.94, 0.94, 0.86, 1.26], rows: [0.8, 1.02, 1.18] },
    writing:  { cols: [1.26, 0.92, 0.91, 0.91], rows: [0.8, 0.8, 1.4] },
    contact:  { cols: [0.92, 1.26, 0.91, 0.91], rows: [0.8, 0.8, 1.4] },
  },
};

const track = (weights) => weights.map((w) => `minmax(0, ${w}fr)`).join(' ');

// CSS variables for the grid while a tile on the front page is hovered.
export function homeHoverStyle(id, layout = 'projects-first') {
  const preset = HOME_BY_LAYOUT[layout] || HOME_BY_LAYOUT['projects-first'];
  const w = preset[id];
  return w ? { '--cols': track(w.cols), '--rows': track(w.rows) } : undefined;
}

// Rail (while a tile is open): 5 stacked small tiles; the hovered one gets taller.
export function railHoverStyle(railIndex, count = 5) {
  if (railIndex < 0) return undefined;
  const big = 1.6;
  const small = (count - big) / (count - 1);
  const rows = Array.from({ length: count }, (_, i) => (i === railIndex ? big : small));
  return { '--rows': track(rows) };
}
