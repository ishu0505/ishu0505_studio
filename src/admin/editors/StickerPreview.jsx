/**
 * FILE: src/admin/editors/StickerPreview.jsx
 * WHAT IT DOES
 *   A small mock tile that shows where each sticker sits. Drag a sticker to move it.
 *   (Dragging saves the position as "top" and "left" percentages.)
 */
import { useRef } from 'react';
import Doodle from '../../components/doodles/Doodle';

export default function StickerPreview({ stickers, tone, onMove }) {
  const box = useRef(null);

  /** Start dragging sticker number `index`. */
  function startDrag(event, index) {
    event.preventDefault();
    const rect = box.current.getBoundingClientRect();
    const sticker = stickers[index];

    function move(e) {
      const half = sticker.size / 2;
      const left = Math.round(((e.clientX - rect.left - half) / rect.width) * 100);
      const top = Math.round(((e.clientY - rect.top - half) / rect.height) * 100);
      onMove(index, { top: `${top}%`, left: `${left}%` });
    }
    function stop() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  }

  return (
    <div className="adm-stickerbox-wrap">
      <div ref={box} className={`adm-stickerbox tone-${tone}`} aria-label="Sticker preview. Drag a sticker to move it.">
        <span className="adm-stickerbox__hint">tile</span>
        {stickers.map((s, i) => (
          <button
            key={i}
            type="button"
            className="adm-sticker"
            aria-label={`Drag sticker ${i + 1} (${s.icon})`}
            style={{ ...s.pos, width: s.size * 0.6, height: s.size * 0.6, transform: `rotate(${s.rot}deg)` }}
            onPointerDown={(e) => startDrag(e, i)}
          >
            <Doodle name={s.icon} size={s.size * 0.6} />
          </button>
        ))}
      </div>
      <p className="adm-hint">Sizes are shown smaller than on the real tile. Items that hang outside the box stay outside.</p>
    </div>
  );
}
