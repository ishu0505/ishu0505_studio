/**
 * FILE: src/admin/editors/IconsEditor.jsx
 * EDITS: src/content/icons.json  +  new files in public/assets/icons/
 *
 * Add your own icons (SVG or PNG). They then appear in every icon picker, next to the
 * built-in doodles. SVGs are cleaned first (scripts and links are removed).
 */
import { useRef, useState } from 'react';
import Doodle from '../../components/doodles/Doodle';
import { ICON_NAMES } from '../../components/doodles/icons';
import { useAdmin } from '../context/AdminContext';
import { useFileEditor } from '../hooks/useFileEditor';
import { Group, TextArea, TextInput } from '../fields/inputs';
import { MAX_ICON_BYTES } from '../lib/config';
import { slugify } from '../lib/content';
import { preparePngIcon, textToBase64 } from '../lib/files';
import { sanitizeSvg } from '../lib/sanitizeSvg';

export default function IconsEditor() {
  const { content } = useAdmin();
  const [icons, setIcons] = useFileEditor('icons');
  const [name, setName] = useState('');
  const [svgText, setSvgText] = useState('');
  const [error, setError] = useState('');
  const fileInput = useRef(null);

  /** Name check: lowercase, unique, not already a built-in icon. */
  function cleanName() {
    const clean = slugify(name, '');
    if (!clean) throw new Error('Give the icon a name first (letters and numbers).');
    if (ICON_NAMES.includes(clean) || icons.some((i) => i.name === clean)) throw new Error(`There is already an icon called "${clean}".`);
    return clean;
  }

  /** Queue the file for upload and list it in icons.json. */
  function addIcon(iconName, extension, upload) {
    const file = `assets/icons/${iconName}.${extension}`;
    content.addPending(file, upload);
    setIcons([...icons, { name: iconName, file }]);
    setName('');
    setSvgText('');
  }

  function addFromPastedSvg() {
    setError('');
    try {
      const iconName = cleanName();
      const clean = sanitizeSvg(svgText);
      if (clean.length > MAX_ICON_BYTES) throw new Error('That SVG is too big (over 200 KB).');
      addIcon(iconName, 'svg', { base64: textToBase64(clean), mime: 'image/svg+xml' });
    } catch (e) {
      setError(e.message);
    }
  }

  async function addFromFile(file) {
    if (!file) return;
    setError('');
    try {
      const iconName = cleanName();
      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        const clean = sanitizeSvg(await file.text());
        addIcon(iconName, 'svg', { base64: textToBase64(clean), mime: 'image/svg+xml' });
      } else {
        addIcon(iconName, 'png', await preparePngIcon(file));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  return (
    <div className="adm-stack">
      <Group title="Add your own icon">
        <TextInput label="Icon name" value={name} onChange={setName} hint='For example "rocket". Used in the icon pickers.' />
        <input ref={fileInput} type="file" accept="image/svg+xml,image/png,.svg" hidden aria-label="Upload icon file" onChange={(e) => addFromFile(e.target.files?.[0])} />
        <button type="button" className="adm-btn" onClick={() => fileInput.current?.click()}>
          Upload SVG or PNG
        </button>
        <TextArea label="…or paste SVG code" rows={4} value={svgText} onChange={setSvgText} />
        <button type="button" className="adm-btn adm-btn--ghost" disabled={!svgText.trim()} onClick={addFromPastedSvg}>
          Add pasted SVG
        </button>
        {error && <p className="adm-error" role="alert">{error}</p>}
      </Group>

      <Group title="Your icons">
        {icons.length === 0 && <p className="adm-empty">No custom icons yet.</p>}
        <ul className="adm-icon-list">
          {icons.map((icon) => (
            <li key={icon.name}>
              <Doodle name={icon.name} size={48} />
              <span>{icon.name}</span>
              <button type="button" className="adm-btn adm-btn--ghost" onClick={() => window.confirm(`Remove "${icon.name}"? Anything using it must be changed first.`) && setIcons(icons.filter((i) => i.name !== icon.name))}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Built-in doodles">
        <div className="adm-icon-grid">
          {ICON_NAMES.map((n) => (
            <div key={n} className="adm-icon-btn">
              <Doodle name={n} size={44} />
              <span>{n}</span>
            </div>
          ))}
        </div>
      </Group>
    </div>
  );
}
