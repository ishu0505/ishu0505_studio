/**
 * FILE: src/components/ExtraLinks.jsx
 * WHAT IT DOES
 *   The extra link buttons on a project card (the optional "links" list in src/content/projects.json),
 *   for example a "PyPI" button next to the main "GitHub" button.
 */
export default function ExtraLinks({ links = [] }) {
  return links.map((link) => (
    <a key={link.label + link.href} className="btn btn--light" href={link.href} target="_blank" rel="noopener noreferrer">
      {link.label} ↗
    </a>
  ));
}
