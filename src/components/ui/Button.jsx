/**
 * FILE: src/components/ui/Button.jsx
 * WHAT IT DOES
 *   A pill-shaped link styled as a button: <Button href='...' variant='dark|light'>.
 */
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
