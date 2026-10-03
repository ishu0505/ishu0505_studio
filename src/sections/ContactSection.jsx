import Card from '../components/ui/Card';
import { profile } from '../data/profile';

function Preview() {
  return (
    <div className="teaser">
      <p className="label">Contact</p>
      <h2>Say hello</h2>
      <p className="muted small">{profile.email}</p>
    </div>
  );
}

function Full() {
  const { links } = profile;
  return (
    <div className="card-grid">
      <Card tone="yellow" label="Email" title={`${profile.email} ↗`} href={`mailto:${profile.email}`} />
      <Card tone="blue" label="Contact form" title="Send me a message ↗" href={links.form} />
      <Card tone="lilac" label="LinkedIn" title="ishaan-parmar5 ↗" href={links.linkedin} />
      <Card tone="white" label="GitHub" title="ishu0505 ↗" href={links.github} />
      <Card tone="mint" label="Kaggle" title="ishu0505 ↗" href={links.kaggle} />
    </div>
  );
}

export default { id: 'contact', title: 'Contact', emoji: '💬', tone: 'lilac', Preview, Full };
