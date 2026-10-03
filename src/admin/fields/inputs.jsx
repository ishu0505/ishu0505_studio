/**
 * FILE: src/admin/fields/inputs.jsx
 * WHAT IT DOES
 *   Small form building blocks used by all editors:
 *     Group, Field, TextInput, TextArea, Select, Toggle, NumberInput,
 *     ToneSelect (colour dots) and StringList (a list of text lines).
 */
import { useId } from 'react';
import { TONES } from '../../content/schema';
import { moveItem, removeAt, replaceAt } from '../lib/content';

/** A titled box that groups related fields. */
export function Group({ title, children }) {
  return (
    <fieldset className="adm-group">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}

export function Field({ label, hint, children, className = '' }) {
  return (
    <div className={`adm-field ${className}`}>
      {label && <span className="adm-label">{label}</span>}
      {children}
      {hint && <span className="adm-hint">{hint}</span>}
    </div>
  );
}

export function TextInput({ label, value, onChange, placeholder, hint, type = 'text' }) {
  const id = useId();
  return (
    <div className="adm-field">
      {label && (
        <label className="adm-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} type={type} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className="adm-hint">{hint}</span>}
    </div>
  );
}

export function TextArea({ label, value, onChange, rows = 3, hint }) {
  const id = useId();
  return (
    <div className="adm-field">
      {label && (
        <label className="adm-label" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea id={id} rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className="adm-hint">{hint}</span>}
    </div>
  );
}

export function Select({ label, value, onChange, options, hint }) {
  const id = useId();
  return (
    <div className="adm-field">
      {label && (
        <label className="adm-label" htmlFor={id}>
          {label}
        </label>
      )}
      <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <span className="adm-hint">{hint}</span>}
    </div>
  );
}

export function Toggle({ label, checked, onChange, hint }) {
  const id = useId();
  return (
    <div className="adm-field">
      <label className="adm-check" htmlFor={id}>
        <input id={id} type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
      {hint && <span className="adm-hint">{hint}</span>}
    </div>
  );
}

export function NumberInput({ label, value, onChange, min, max, step = 1, hint }) {
  const id = useId();
  return (
    <div className="adm-field">
      {label && (
        <label className="adm-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="number"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
      />
      {hint && <span className="adm-hint">{hint}</span>}
    </div>
  );
}

export function ToneSelect({ label = 'Colour', value, onChange }) {
  return (
    <Field label={label}>
      <div className="adm-tones" role="radiogroup" aria-label={label}>
        {TONES.map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={value === t}
            aria-label={t}
            title={t}
            className={`adm-tone tone-${t} ${value === t ? 'is-on' : ''}`}
            onClick={() => onChange(t)}
          />
        ))}
      </div>
    </Field>
  );
}

/** A list of plain strings: add, edit, reorder, delete. */
export function StringList({ label, items = [], onChange, multiline = false, addLabel = 'Add', hint }) {
  return (
    <Field label={label} hint={hint}>
      <ul className="adm-strings">
        {items.map((text, i) => (
          <li key={i}>
            {multiline ? (
              <textarea rows={2} value={text} aria-label={`${label} ${i + 1}`} onChange={(e) => onChange(replaceAt(items, i, e.target.value))} />
            ) : (
              <input value={text} aria-label={`${label} ${i + 1}`} onChange={(e) => onChange(replaceAt(items, i, e.target.value))} />
            )}
            <span className="adm-mini-actions">
              <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => onChange(moveItem(items, i, i - 1))}>
                ↑
              </button>
              <button type="button" aria-label="Move down" disabled={i === items.length - 1} onClick={() => onChange(moveItem(items, i, i + 1))}>
                ↓
              </button>
              <button type="button" aria-label="Delete" onClick={() => onChange(removeAt(items, i))}>
                ✕
              </button>
            </span>
          </li>
        ))}
      </ul>
      <button type="button" className="adm-btn adm-btn--ghost" onClick={() => onChange([...items, ''])}>
        + {addLabel}
      </button>
    </Field>
  );
}
