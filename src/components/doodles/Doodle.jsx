import { ICONS } from './icons';

/**
 * One hand-drawn icon. Thick ink outline + a small wobble filter (see
 * CrayonFilters) gives the crayon look. Decorative by default.
 */
export default function Doodle({ name, size = 48, className = '', style }) {
  const art = ICONS[name];
  if (!art) return null;
  return (
    <svg
      className={`doodle-svg ${className}`}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="#2a2a35"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <g filter="url(#crayon-line)">{art}</g>
    </svg>
  );
}
