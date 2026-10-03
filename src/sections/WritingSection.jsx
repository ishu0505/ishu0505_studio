import Card from '../components/ui/Card';
import { articles, writingLinks } from '../data/writing';

function Preview() {
  return (
    <div className="teaser">
      <p className="label">Articles &amp; Blogs</p>
      <h2>{articles[0].title}</h2>
    </div>
  );
}

function Full() {
  return (
    <div className="card-grid card-grid--wide">
      {articles.map((a) => (
        <Card key={a.id} tone={a.tone} href={a.href} wide className="card--media">
          <img className="card__img" src={a.image} alt="" loading="lazy" />
          <p className="label">
            {a.category} · {a.date}
          </p>
          <h3 className="card__title">{a.title} ↗</h3>
          <p className="muted">{a.summary}</p>
        </Card>
      ))}
      {writingLinks.map((l) => (
        <Card key={l.id} tone={l.tone} label={l.label} title={l.title} href={l.href} />
      ))}
    </div>
  );
}

const stickers = [
  { icon: 'pencil', size: 58, rot: 14, pos: { top: -22, right: 64 } },
  { icon: 'king', size: 54, rot: -8, pos: { bottom: -24, right: 10 }, keep: true },
];

export default { id: 'writing', title: 'Writing', icon: 'pencil', tone: 'pink', stickers, Preview, Full };
