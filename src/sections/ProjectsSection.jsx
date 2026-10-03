import Card from '../components/ui/Card';
import { projects } from '../data/projects';

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

function Full() {
  return (
    <div className="card-grid card-grid--wide">
      {projects.map((p) => (
        <Card key={p.id} tone={p.tone} href={p.href} className={p.image ? 'card--media' : ''}>
          {p.image && <img className="card__img" src={p.image} alt="" loading="lazy" />}
          <p className="label">{p.category}</p>
          <h3 className="card__title">{p.title} ↗</h3>
          <p className="muted small">{p.tech}</p>
        </Card>
      ))}
    </div>
  );
}

export default { id: 'projects', title: 'Projects', emoji: '🚀', tone: 'blue', Preview, Full };
