/**
 * FILE: src/components/DemoCard.jsx
 * WHAT IT DOES
 *   A project card for a live demo (kind: "demo" in src/content/projects.json).
 *   It shows where the demo runs (the host badge) and has buttons for:
 *     Live demo   open the running app
 *     Code        open the repository (if given)
 *     Preview     show it in a pop-up window (only if "embed" is on)
 *   The demo itself lives in its own repo / server. This site only links to it.
 */
import { useState } from 'react';
import Card from './ui/Card';
import DemoPreview from './DemoPreview';
import { DEMO_HOSTS } from '../content/schema';

const hostLabel = (host) => DEMO_HOSTS.find((h) => h.value === host)?.label ?? 'Other';

export default function DemoCard({ project }) {
  const { demo } = project;
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <Card tone={project.tone} className={project.image ? 'card--media' : ''}>
      {project.image && <img className="card__img" src={project.image} alt="" loading="lazy" />}
      <p className="label">
        {project.category} · <span className="host-badge">{hostLabel(demo.host)}</span>
      </p>
      <h3 className="card__title">{project.title}</h3>
      <p className="muted small">{project.tech}</p>
      {demo.note && <p className="muted small demo-note">{demo.note}</p>}
      <div className="actions demo-actions">
        <a className="btn btn--dark" href={demo.url} target="_blank" rel="noopener noreferrer">▶ Live demo</a>
        {demo.repoUrl && <a className="btn btn--light" href={demo.repoUrl} target="_blank" rel="noopener noreferrer">Code ↗</a>}
        {demo.embed && <button type="button" className="btn btn--light" onClick={() => setPreviewOpen(true)}>Preview</button>}
      </div>
      {previewOpen && <DemoPreview title={project.title} demoUrl={demo.url} onClose={() => setPreviewOpen(false)} />}
    </Card>
  );
}
