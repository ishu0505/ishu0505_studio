/**
 * FILE: src/admin/components/PublishBar.jsx
 * WHAT IT DOES
 *   The bar at the bottom of the admin: how many changes you have, any problems,
 *   and the Publish / Discard / Undo buttons.
 */
import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import PublishStatus from './PublishStatus';

export default function PublishBar() {
  const { content, publisher } = useAdmin();
  const { publish, doPublish, canUndo, undoLast, resetPublish } = publisher;
  const [note, setNote] = useState('');
  const busy = publish.state === 'saving' || publish.state === 'building';
  const hasProblems = content.problems.length > 0;

  async function publishNow() {
    await doPublish(note);
    setNote('');
  }

  return (
    <footer className="adm-publish">
      {hasProblems && (
        <details className="adm-problems" open>
          <summary>{content.problems.length} thing{content.problems.length > 1 ? 's' : ''} to fix before publishing</summary>
          <ul>{content.problems.map((p) => <li key={p}>{p}</li>)}</ul>
        </details>
      )}

      <PublishStatus publish={publish} />
      {publish.state === 'conflict' && (
        <button type="button" className="adm-btn" onClick={() => { content.load(); resetPublish(); }}>Reload latest</button>
      )}

      <div className="adm-publish__row">
        <span className="adm-count" aria-live="polite">
          {content.changeCount === 0 ? 'No unpublished changes' : `${content.changeCount} unpublished change${content.changeCount > 1 ? 's' : ''}`}
        </span>
        <input className="adm-note-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Describe the change (optional)" aria-label="Describe the change" disabled={content.changeCount === 0} />
        <button type="button" className="adm-btn adm-btn--ghost" disabled={content.changeCount === 0 || busy} onClick={() => window.confirm('Throw away all unpublished changes?') && content.discard()}>
          Discard
        </button>
        {canUndo && (
          <button type="button" className="adm-btn adm-btn--ghost" disabled={busy} onClick={() => window.confirm('Undo your last publish? This creates a new change that restores the previous version.') && undoLast()}>
            Undo last publish
          </button>
        )}
        <button type="button" className="adm-btn adm-btn--primary" disabled={content.changeCount === 0 || hasProblems || busy} onClick={publishNow}>
          {publish.state === 'saving' ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </footer>
  );
}
