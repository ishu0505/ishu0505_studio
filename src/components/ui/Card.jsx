// A small pastel card used inside an expanded tile.
// Renders an <a> when `href` is given, otherwise a <div>.
export default function Card({ tone = 'white', label, title, wide = false, href, children, className = '' }) {
  const classes = `card tone-${tone} ${wide ? 'card--wide' : ''} ${href ? 'card--link' : ''} ${className}`;
  const body = (
    <>
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
