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
      <Card tone="yellow" label="Email" title={`${profile.email} ↗`} href={`mailto:${profile.email}`} icons={['speech']} />
      <Card tone="blue" label="Contact form" title="Send me a message ↗" href={links.form} />
      <Card tone="lilac" label="LinkedIn" title="ishaan-parmar5 ↗" href={links.linkedin} />
      <Card tone="white" label="GitHub" title="ishu0505 ↗" href={links.github} />
      <Card tone="mint" label="Kaggle" title="ishu0505 ↗" href={links.kaggle} />
    </div>
  );
}

const stickers = [
  { icon: 'speech', size: 58, rot: -8, pos: { top: -22, left: '16%' } },
  { icon: 'heart', size: 44, rot: 12, pos: { bottom: -22, right: -10 }, keep: true },
];

export default { id: 'contact', title: 'Contact', icon: 'speech', tone: 'lilac', stickers, Preview, Full };
