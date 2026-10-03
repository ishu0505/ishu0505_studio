/**
 * FILE: src/sections/ContactSection.jsx
 * WHAT IT DOES
 *   The Contact tile: a front-page preview (Preview) and the opened view (Full).
 */
import Card from '../components/ui/Card';
import { profile } from '../data/profile';
import { stickers as allStickers } from '../data/stickers';

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

const stickers = allStickers.contact;

export default { id: 'contact', title: 'Contact', icon: 'speech', tone: 'lilac', stickers, Preview, Full };
