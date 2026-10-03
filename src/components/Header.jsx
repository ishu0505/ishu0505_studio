/**
 * FILE: src/components/Header.jsx
 * WHAT IT DOES
 *   The top bar: your name/photo (click = back to all tiles), little doodles, and the Resume button.
 */
import { profile } from '../data/profile';
import Doodle from './doodles/Doodle';
import ResumeDownload from './ui/ResumeDownload';

// Little scribbles floating between the name and the resume button.
const SCRIBBLES = [
  { icon: 'coffee', size: 34, rot: -10 },
  { icon: 'star', size: 24, rot: 14 },
  { icon: 'cat', size: 34, rot: 8 },
  { icon: 'bolt', size: 24, rot: -12 },
];

export default function Header({ onHome }) {
  return (
    <header className="topbar">
      <button type="button" className="topbar__brand" onClick={onHome} aria-label="Back to all tiles">
        <img src={profile.avatar} alt="" width="36" height="36" />
        <span>{profile.name}</span>
      </button>
      <div className="topbar__scribbles" aria-hidden="true">
        {SCRIBBLES.map((s) => (
          <Doodle key={s.icon} name={s.icon} size={s.size} style={{ transform: `rotate(${s.rot}deg)` }} />
        ))}
      </div>
      <ResumeDownload variant="dark">Resume ↓</ResumeDownload>
    </header>
  );
}
