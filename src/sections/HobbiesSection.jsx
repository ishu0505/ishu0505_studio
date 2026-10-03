import Card from '../components/ui/Card';
import { hobbies } from '../data/hobbies';

function Preview() {
  return (
    <div className="teaser">
      <div className="emoji-row" aria-hidden="true">
        {hobbies.map((h) => (
          <span key={h.id}>{h.emoji}</span>
        ))}
      </div>
      <p className="label">Hobbies</p>
      <h2>Off the clock</h2>
    </div>
  );
}

function Full() {
  return (
    <div className="card-grid">
      {hobbies.map((h) => (
        <Card key={h.id} tone={h.tone}>
          <span className="emoji-big" aria-hidden="true">{h.emoji}</span>
          <h3 className="card__title">{h.title}</h3>
          <p className="muted small">{h.text}</p>
        </Card>
      ))}
    </div>
  );
}

export default { id: 'hobbies', title: 'Hobbies', emoji: '🎨', tone: 'mint', Preview, Full };
