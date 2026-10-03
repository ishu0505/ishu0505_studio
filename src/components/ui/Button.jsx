export default function Button({ href, children, variant = 'dark', download, external = false, onClick }) {
  const props = {
    className: `btn btn--${variant}`,
    href,
    onClick,
    ...(download ? { download } : {}),
    ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  };
  return <a {...props}>{children}</a>;
}
