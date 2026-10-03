/**
 * FILE: src/sections/ProjectsSection.jsx
 * WHAT IT DOES
 *   The Projects tile. Normal projects are link cards; projects with kind 'demo' become DemoCards.
 *   Content: src/content/projects.json.
 */
import Card from '../components/ui/Card';
import DemoCard from '../components/DemoCard';
import { projects } from '../data/projects';
import { stickers as allStickers } from '../data/stickers';

function Preview() {
  const withImages = projects.filter((p) => p.image).slice(0, 2);
  return (
    <div className="teaser">
      <div className="teaser__thumbs">
        {withImages.map((p) => (
          <img key={p.id} src={p.image} alt="" loading="lazy" />
        ))}
      </div>
      <p className="label">Projects</p>
      <h2>Things I've built</h2>
      <p className="muted small">{projects.length} projects &amp; products</p>
    </div>
  );
}

/** One project card: a normal link card, or a live-demo card (kind "demo"). */
function ProjectCard({ project }) {
  if (project.kind === 'demo') return <DemoCard project={project} />;
  return (
    <Card tone={project.tone} href={project.href} className={project.image ? 'card--media' : ''}>
      {project.image && <img className="card__img" src={project.image} alt="" loading="lazy" />}
      <p className="label">{project.category}</p>
      <h3 className="card__title">{project.title} ↗</h3>
      <p className="muted small">{project.tech}</p>
    </Card>
  );
}

function Full() {
  return (
    <div className="card-grid card-grid--wide">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

const stickers = allStickers.projects;

export default { id: 'projects', title: 'Projects', icon: 'code', tone: 'blue', stickers, Preview, Full };
