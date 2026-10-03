/**
 * FILE: src/admin/fields/ListEditor.jsx
 * WHAT IT DOES
 *   A reusable editor for a list of things (projects, hobbies, jobs...).
 *   Gives every item: open/close, move up/down, duplicate, delete, and an 'Add' button.
 *   You pass renderItem() to draw the form for one item; this file handles the rest.
 */
import { useState } from 'react';
import { clone, moveItem, removeAt, replaceAt, uniqueId } from '../lib/content';

/**
 * Editable list of objects with add / duplicate / reorder / delete.
 *   renderItem(item, update) draws the form; update(patch) merges changes into that item.
 */
export function ListEditor({ items = [], onChange, getTitle, renderItem, makeItem, addLabel = 'Add', itemLabel = 'item', startOpen = false }) {
  const keyOf = (item, i) => item.id ?? `i${i}`;
  const [open, setOpen] = useState(() => new Set(startOpen ? items.map(keyOf) : []));

  const toggle = (k) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  function add() {
    const item = makeItem(items);
    onChange([...items, item]);
    setOpen((s) => new Set(s).add(keyOf(item, items.length)));
  }

  function duplicate(i) {
    const copy = clone(items[i]);
    if (copy.id) copy.id = uniqueId(`${copy.id}-copy`, items.map((x) => x.id));
    onChange([...items.slice(0, i + 1), copy, ...items.slice(i + 1)]);
    setOpen((s) => new Set(s).add(keyOf(copy, i + 1)));
  }

  function remove(i) {
    const title = getTitle(items[i], i) || itemLabel;
    if (window.confirm(`Delete "${title}"? You can still discard all changes before publishing.`)) onChange(removeAt(items, i));
  }

  return (
    <div className="adm-list">
      {items.length === 0 && <p className="adm-empty">Nothing here yet.</p>}
      {items.map((item, i) => {
        const k = keyOf(item, i);
        const isOpen = open.has(k);
        return (
          <section key={k} className={`adm-item ${isOpen ? 'is-open' : ''}`}>
            <header className="adm-item__head">
              <button type="button" className="adm-item__title" aria-expanded={isOpen} onClick={() => toggle(k)}>
                <span aria-hidden="true">{isOpen ? '▾' : '▸'}</span> {getTitle(item, i) || `(untitled ${itemLabel})`}
              </button>
              <span className="adm-mini-actions">
                <button type="button" aria-label={`Move ${itemLabel} up`} disabled={i === 0} onClick={() => onChange(moveItem(items, i, i - 1))}>
                  ↑
                </button>
                <button type="button" aria-label={`Move ${itemLabel} down`} disabled={i === items.length - 1} onClick={() => onChange(moveItem(items, i, i + 1))}>
                  ↓
                </button>
                <button type="button" aria-label={`Duplicate ${itemLabel}`} onClick={() => duplicate(i)}>
                  ⧉
                </button>
                <button type="button" aria-label={`Delete ${itemLabel}`} onClick={() => remove(i)}>
                  ✕
                </button>
              </span>
            </header>
            {isOpen && <div className="adm-item__body">{renderItem(item, (patch) => onChange(replaceAt(items, i, { ...item, ...patch })), i)}</div>}
          </section>
        );
      })}
      <button type="button" className="adm-btn" onClick={add}>
        + {addLabel}
      </button>
    </div>
  );
}
