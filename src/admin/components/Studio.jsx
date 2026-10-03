/**
 * FILE: src/admin/components/Studio.jsx
 * WHAT IT DOES
 *   The main admin screen once you are logged in: top bar, a menu of things to edit,
 *   the editor for the selected item, and the publish bar.
 *
 * TO ADD A NEW EDITOR: write it in src/admin/editors/ and add one line to SECTIONS below.
 */
import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { daysLeft } from '../lib/token';
import ProfileEditor from '../editors/ProfileEditor';
import ProjectsEditor from '../editors/ProjectsEditor';
import HobbiesEditor from '../editors/HobbiesEditor';
import ResumeEditor from '../editors/ResumeEditor';
import WritingEditor from '../editors/WritingEditor';
import StickersEditor from '../editors/StickersEditor';
import IconsEditor from '../editors/IconsEditor';
import PublishBar from './PublishBar';

/** The menu. `files` = which content files the editor changes (used for the "unpublished" dot). */
const SECTIONS = [
  { id: 'profile', label: 'About & contact', Editor: ProfileEditor, files: ['profile'] },
  { id: 'projects', label: 'Projects & demos', Editor: ProjectsEditor, files: ['projects'] },
  { id: 'hobbies', label: 'Hobbies', Editor: HobbiesEditor, files: ['hobbies'] },
  { id: 'resume', label: 'Resume', Editor: ResumeEditor, files: ['resume'] },
  { id: 'writing', label: 'Writing', Editor: WritingEditor, files: ['writing'] },
  { id: 'stickers', label: 'Stickers', Editor: StickersEditor, files: ['stickers'] },
  { id: 'icons', label: 'Icons', Editor: IconsEditor, files: ['icons'] },
];

function ExpiryBadge({ expiresOn }) {
  const days = daysLeft(expiresOn);
  if (days === null) return null;
  const text = days < 0 ? 'Token expired' : `Token expires in ${days} day${days === 1 ? '' : 's'}`;
  return <span className={`adm-badge ${days <= 7 ? 'is-warn' : ''}`}>{text}</span>;
}

export default function Studio() {
  const { session, content } = useAdmin();
  const [active, setActive] = useState(SECTIONS[0].id);
  const current = SECTIONS.find((s) => s.id === active);

  const isDirty = (section) => section.files.some((f) => content.dirtyFiles.includes(f)) || (section.id === 'resume' && content.pendingPaths.some((p) => p.includes('/resume/')));

  return (
    <div className="adm">
      <header className="adm-top">
        <h1>Site admin</h1>
        <div className="adm-top__right">
          <ExpiryBadge expiresOn={session.user.expiresOn} />
          <span className="adm-badge">@{session.user.login}</span>
          <a className="adm-btn adm-btn--ghost" href="#" target="_blank" rel="noopener noreferrer">View site</a>
          <button type="button" className="adm-btn adm-btn--ghost" onClick={() => (content.changeCount === 0 || window.confirm('You have unpublished changes. Log out anyway?')) && session.logout()}>
            Log out
          </button>
        </div>
      </header>

      <div className="adm-body">
        <nav className="adm-nav" aria-label="What to edit">
          {SECTIONS.map((s) => (
            <button key={s.id} type="button" className={s.id === active ? 'is-on' : ''} aria-current={s.id === active ? 'page' : undefined} onClick={() => setActive(s.id)}>
              {s.label}
              {isDirty(s) && <span className="adm-dot" title="Unpublished changes" aria-label="unpublished changes" />}
            </button>
          ))}
        </nav>
        <section className="adm-panel" aria-label={current.label}>
          <h2>{current.label}</h2>
          <current.Editor />
        </section>
      </div>

      <PublishBar />
    </div>
  );
}
