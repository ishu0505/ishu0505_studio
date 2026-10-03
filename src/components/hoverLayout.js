// Hover re-flow: instead of scaling a tile over its neighbours, the grid
// itself re-allocates space. The hovered tile's rows/columns get a bigger
// share and every other track shrinks to make room, so nothing overlaps.
//
// Weights are CSS `fr` units for each grid track.

// Front page grid is 4 columns x 3 rows (see styles/bento.css for tile areas).
const HOME = {
  profile:  { cols: [1.25, 1.25, 0.8, 0.8], rows: [1.15, 1.15, 0.8] },
  projects: { cols: [0.85, 0.85, 1.15, 1.15], rows: [1.3, 0.85, 0.85] },
  resume:   { cols: [0.92, 0.92, 1.35, 0.92], rows: [0.85, 1.1, 1.1] },
  hobbies:  { cols: [0.92, 0.92, 0.92, 1.35], rows: [0.85, 1.1, 1.1] },
  writing:  { cols: [1.35, 0.92, 0.92, 0.92], rows: [0.85, 0.85, 1.3] },
  contact:  { cols: [0.92, 1.35, 0.92, 0.92], rows: [0.85, 0.85, 1.3] },
};

const track = (weights) => weights.map((w) => `minmax(0, ${w}fr)`).join(' ');

// CSS variables for the grid while a tile on the front page is hovered.
export function homeHoverStyle(id) {
  const w = HOME[id];
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
