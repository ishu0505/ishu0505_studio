import { profile } from '../data/profile';
import ResumeDownload from './ui/ResumeDownload';

export default function Header({ onHome }) {
  return (
    <header className="topbar">
      <button type="button" className="topbar__brand" onClick={onHome} aria-label="Back to all tiles">
        <img src={profile.avatar} alt="" width="32" height="32" />
        <span>{profile.name}</span>
      </button>
      <ResumeDownload variant="dark">Resume ↓</ResumeDownload>
    </header>
  );
}
