import Doodle from './Doodle';

/**
 * Icons "stuck" on the corners/edges of a tile, overlapping its border.
 * Each sticker: { icon, size, rot, pos: { top|bottom|left|right }, delay }.
 * Positions are relative to the tile, so they follow it in every layout.
 */
export default function Stickers({ items = [] }) {
  return (
    <div className="stickers" aria-hidden="true">
      {items.map((s, i) => (
        <span
          key={`${s.icon}-${i}`}
          className="sticker"
          style={{
            ...s.pos,
            '--s': `${s.size ?? 48}px`,
            '--r': `${s.rot ?? 0}deg`,
            '--d': `${s.delay ?? i * 0.7}s`,
          }}
        >
          <Doodle name={s.icon} size={s.size ?? 48} />
        </span>
      ))}
    </div>
  );
}
