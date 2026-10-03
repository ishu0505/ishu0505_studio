/**
 * FILE: src/admin/fields/IconPicker.jsx
 * WHAT IT DOES
 *   Icon choosing for the admin:
 *     IconPickerModal  the pop-up grid of every icon (built-in + your custom ones)
 *     IconChips        a row of icons with ✕ buttons and a '+ Icon' button (used for hobbies)
 *     IconSelect       choose exactly one icon (used for stickers)
 */
import { useState } from 'react';
import Doodle from '../../components/doodles/Doodle';
import { ICON_NAMES } from '../../components/doodles/icons';
import { useAdmin } from '../context/AdminContext';
import { Field } from './inputs';

/** Modal grid of every icon (built in + custom). */
export function IconPickerModal({ onPick, onClose }) {
  const { content } = useAdmin();
  const { draft } = content;
  const custom = (draft.icons ?? []).map((i) => i.name);
  return (
    <div className="adm-modal" role="dialog" aria-modal="true" aria-label="Choose an icon" onClick={onClose}>
      <div className="adm-modal__box" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal__head">
          <strong>Choose an icon</strong>
          <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="adm-icon-grid">
          {[...ICON_NAMES, ...custom].map((name) => (
            <button key={name} type="button" className="adm-icon-btn" onClick={() => onPick(name)} title={name}>
              <Doodle name={name} size={44} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** A row of icon chips (remove with ✕) plus an "add icon" button. */
export function IconChips({ label = 'Icons', icons = [], onChange, hint, max }) {
  const [open, setOpen] = useState(false);
  return (
    <Field label={label} hint={hint}>
      <div className="adm-chips">
        {icons.map((name, i) => (
          <span key={`${name}-${i}`} className="adm-chip">
            <Doodle name={name} size={34} />
            <button type="button" aria-label={`Remove ${name}`} onClick={() => onChange(icons.filter((_, idx) => idx !== i))}>
              ✕
            </button>
          </span>
        ))}
        {(max === undefined || icons.length < max) && (
          <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setOpen(true)}>
            + Icon
          </button>
        )}
      </div>
      {open && (
        <IconPickerModal
          onClose={() => setOpen(false)}
          onPick={(name) => {
            onChange([...icons, name]);
            setOpen(false);
          }}
        />
      )}
    </Field>
  );
}

/** Single icon chooser (used by stickers). */
export function IconSelect({ label = 'Icon', value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <Field label={label}>
      <button type="button" className="adm-icon-select" onClick={() => setOpen(true)} aria-label={`${label}: ${value}. Change`}>
        <Doodle name={value} size={40} />
        <span>{value || 'Choose…'}</span>
      </button>
      {open && (
        <IconPickerModal
          onClose={() => setOpen(false)}
          onPick={(name) => {
            onChange(name);
            setOpen(false);
          }}
        />
      )}
    </Field>
  );
}
