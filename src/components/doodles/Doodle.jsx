/**
 * FILE: src/components/doodles/Doodle.jsx
 * WHAT IT DOES
 *   Draws one icon:  <Doodle name='coffee' size={48} />
 *   Built-in icons come from icons.jsx (hand-drawn SVG). Any other name is looked up in the custom icons.
 */
import { ICONS } from './icons';
import { useCustomIcons } from './CustomIcons';

/**
 * One hand-drawn icon. Thick ink outline + a small wobble filter (see
 * CrayonFilters) gives the crayon look. Decorative by default.
 * Names that are not built in are looked up in the custom icons (uploaded in the admin).
 */
export default function Doodle({ name, size = 48, className = '', style }) {
  const custom = useCustomIcons();
  const art = ICONS[name];

  if (!art) {
    const src = custom[name];
    if (!src) return null;
    return <img className={`doodle-svg doodle-img ${className}`} style={style} src={src} width={size} height={size} alt="" aria-hidden="true" />;
  }

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
