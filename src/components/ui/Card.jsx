/**
 * FILE: src/components/ui/Card.jsx
 * WHAT IT DOES
 *   The small coloured card used inside opened tiles. Optional: label, title, icons, link (href).
 */
import Doodle from '../doodles/Doodle';

export default function Card({ tone = 'white', label, title, wide = false, href, icons, iconSize = 46, children, className = '' }) {
  const classes = `card tone-${tone} ${wide ? 'card--wide' : ''} ${href ? 'card--link' : ''} ${className}`;
  const body = (
    <>
      {icons && (
        <div className="card__icons">
          {icons.map((name) => (
            <Doodle key={name} name={name} size={iconSize} />
          ))}
        </div>
      )}
      {label && <p className="label">{label}</p>}
      {title && <h3 className="card__title">{title}</h3>}
      {children}
    </>
  );

  if (href) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer">
        {body}
      </a>
    );
  }
  return <div className={classes}>{body}</div>;
}
