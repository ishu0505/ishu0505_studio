/**
 * FILE: src/admin/fields/ImagePicker.jsx
 * WHAT IT DOES
 *   Choose an image for a project/article/photo: pick one already in the repo, or upload a new one.
 *   Uploaded images are shrunk to max 1600px wide, then wait in the 'pending' list until Publish.
 */
import { useMemo, useRef, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { prepareImage } from '../lib/files';
import { slugify } from '../lib/content';
import { Field } from './inputs';

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg)$/i;

/** Pick an existing image from the repo or upload a new one (shrunk to 1600px). */
export function ImagePicker({ label = 'Image', value, onChange, optional = false, hint }) {
  const { content } = useAdmin();
  const { repoFiles, pending, previewSrc, addPending } = content;
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const input = useRef(null);

  const options = useMemo(() => {
    const all = new Set([...repoFiles, ...Object.keys(pending)]);
    return [...all]
      .filter((p) => p.startsWith('public/assets/images/') && IMAGE_EXT.test(p))
      .map((p) => p.replace(/^public\//, ''))
      .sort();
  }, [repoFiles, pending]);

  async function upload(file) {
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const { base64, mime, ext } = await prepareImage(file);
      const base = slugify(file.name.replace(/\.[^.]+$/, ''), 'image');
      const path = `assets/images/${base}-${Date.now().toString(36)}.${ext}`;
      addPending(path, { base64, mime });
      onChange(path);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="adm-image">
        {value ? <img src={previewSrc(value)} alt="" /> : <div className="adm-image__empty">No image</div>}
        <div className="adm-image__controls">
          <select aria-label={`${label}: choose existing`} value={options.includes(value) ? value : ''} onChange={(e) => e.target.value && onChange(e.target.value)}>
            <option value="">{value && !options.includes(value) ? value : 'Choose an existing image…'}</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o.replace('assets/images/', '')}
              </option>
            ))}
          </select>
          <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => upload(e.target.files?.[0])} aria-label={`${label}: upload file`} />
          <button type="button" className="adm-btn adm-btn--ghost" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? 'Preparing…' : 'Upload new'}
          </button>
          {optional && value && (
            <button type="button" className="adm-btn adm-btn--ghost" onClick={() => onChange(undefined)}>
              Remove
            </button>
          )}
        </div>
        {error && (
          <p className="adm-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </Field>
  );
}
