/**
 * FILE: src/components/BentoGrid.jsx
 * WHAT IT DOES
 *   Lays out all the tiles. It switches between two layouts with CSS:
 *     front page  -> every tile visible (see styles/bento.css)
 *     focus       -> one big tile + a rail of small ones
 *   Also re-flows the grid on hover (see hoverLayout.js) so the hovered tile grows and the others make room.
 */
import { useEffect, useState } from 'react';
import Tile from './Tile';
import useHoverCapable from '../hooks/useHoverCapable';
import { homeHoverStyle, railHoverStyle } from './hoverLayout';

// Lays out every section as a tile. The grid switches between a front-page
// layout and a focus layout (one big tile + a rail of small ones) via CSS;
// each Tile just reports which mode it is in. On hover the grid re-flows
// (see hoverLayout.js) so the hovered tile grows and the others make room.
export default function BentoGrid({ sections, active, onOpen, onClose }) {
  const [hovered, setHovered] = useState(null);
  const canHover = useHoverCapable();

  // opening or closing a tile starts from a clean slate
  useEffect(() => setHovered(null), [active]);

  let style;
  if (canHover && hovered) {
    if (!active) {
      style = homeHoverStyle(hovered);
    } else {
      const railIds = sections.filter((s) => s.id !== active).map((s) => s.id);
      style = railHoverStyle(railIds.indexOf(hovered), railIds.length);
    }
  }

  return (
    <main
      className={`bento ${active ? 'bento--focus' : 'bento--home'}`}
      style={style}
      onPointerLeave={() => setHovered(null)}
    >
      {sections.map((section, index) => (
        <Tile
          key={section.id}
          section={section}
          index={index}
          mode={!active ? 'home' : active === section.id ? 'main' : 'rail'}
          onOpen={onOpen}
          onClose={onClose}
          onHover={canHover ? setHovered : undefined}
        />
      ))}
    </main>
  );
}
