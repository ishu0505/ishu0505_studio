/**
 * FILE: src/admin/editors/ResumePdfUpload.jsx
 * WHAT IT DOES
 *   Replace your resume PDF. The new file takes the SAME path as the old one
 *   (profile.json -> resume.path), so the site's Download button never needs changing.
 */
import { useRef, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Group, TextInput } from '../fields/inputs';
import { preparePdf } from '../lib/files';

export default function ResumePdfUpload() {
  const { content } = useAdmin();
  const profile = content.draft.profile;
  const input = useRef(null);
  const [error, setError] = useState('');
  const queued = content.pending[`public/${profile.resume.path}`];

  async function chooseFile(file) {
    if (!file) return;
    setError('');
    try {
      content.addPending(profile.resume.path, await preparePdf(file));
    } catch (e) {
      setError(e.message);
    } finally {
      if (input.current) input.current.value = '';
    }
  }

  return (
    <Group title="Resume PDF (the Download button)">
      <p className="adm-hint">
        Current file: <a href={content.previewSrc(profile.resume.path)} target="_blank" rel="noopener noreferrer">{profile.resume.path}</a>
      </p>
      {queued && <p className="adm-note">New PDF ready ({Math.round(queued.size / 1024)} KB). It goes live when you press Publish.</p>}
      <input ref={input} type="file" accept="application/pdf" hidden aria-label="Upload resume PDF" onChange={(e) => chooseFile(e.target.files?.[0])} />
      <button type="button" className="adm-btn" onClick={() => input.current?.click()}>
        Upload new resume PDF
      </button>
      {error && <p className="adm-error" role="alert">{error}</p>}
      <TextInput
        label="Name of the downloaded file"
        value={profile.resume.filename}
        onChange={(filename) => content.setFile('profile', { ...profile, resume: { ...profile.resume, filename } })}
      />
    </Group>
  );
}
