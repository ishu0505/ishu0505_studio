/**
 * FILE: src/admin/editors/StickersEditor.jsx
 * EDITS: src/content/stickers.json  (the doodles stuck on each tile's corners)
 *
 * Pick a tile, then add / remove stickers and change their icon, size, rotation and
 * position. Drag stickers in the preview, or type exact numbers.
 */
import { useState } from 'react';
import { SECTION_IDS } from '../../content/schema';
import { useFileEditor } from '../hooks/useFileEditor';
import { ListEditor } from '../fields/ListEditor';
import { IconSelect } from '../fields/IconPicker';
import { NumberInput, Toggle, TextInput } from '../fields/inputs';
import StickerPreview from './StickerPreview';

const TILE_NAMES = { profile: 'About', projects: 'Projects', resume: 'Resume', hobbies: 'Hobbies', writing: 'Writing', contact: 'Contact' };
const TILE_TONES = { profile: 'cream', projects: 'blue', resume: 'peach', hobbies: 'mint', writing: 'pink', contact: 'lilac' };
const POSITION_KEYS = [
  ['top', 'Top'],
  ['bottom', 'Bottom'],
  ['left', 'Left'],
  ['right', 'Right'],
];

/** Positions are numbers (pixels) or text like "20%". Empty means "not set". */
const parsePos = (text) => {
  const value = text.trim();
  if (value === '') return undefined;
  if (/^-?\d+(\.\d+)?%$/.test(value)) return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
};

function StickerForm({ sticker, update }) {
  const setPos = (key, text) => {
    const pos = { ...sticker.pos };
    const parsed = parsePos(text);
    if (parsed === undefined) delete pos[key];
    else pos[key] = parsed;
    update({ pos });
  };
  return (
    <>
      <IconSelect value={sticker.icon} onChange={(icon) => update({ icon })} />
      <div className="adm-row">
        <NumberInput label="Size" value={sticker.size} min={16} max={160} onChange={(size) => update({ size })} />
        <NumberInput label="Tilt (degrees)" value={sticker.rot} min={-180} max={180} onChange={(rot) => update({ rot })} />
      </div>
      <div className="adm-row">
        {POSITION_KEYS.map(([key, label]) => (
          <TextInput key={key} label={label} value={sticker.pos[key] ?? ''} onChange={(text) => setPos(key, text)} hint={key === 'top' ? 'number = px, or 20%' : undefined} />
        ))}
      </div>
      <Toggle label="Keep visible when the tile is open" checked={sticker.keep} onChange={(keep) => update({ keep: keep || undefined })} />
    </>
  );
}

export default function StickersEditor() {
  const [stickers, setStickers] = useFileEditor('stickers');
  const [tile, setTile] = useState(SECTION_IDS[0]);
  const list = stickers[tile] ?? [];
  const setList = (next) => setStickers({ ...stickers, [tile]: next });

  /** Called while dragging in the preview. */
  const moveSticker = (index, pos) => setList(list.map((s, i) => (i === index ? { ...s, pos } : s)));

  return (
    <div className="adm-stack">
      <div className="adm-tabs" role="tablist" aria-label="Choose a tile">
        {SECTION_IDS.map((id) => (
          <button key={id} type="button" role="tab" aria-selected={tile === id} className={tile === id ? 'is-on' : ''} onClick={() => setTile(id)}>
            {TILE_NAMES[id]}
          </button>
        ))}
      </div>

      <StickerPreview stickers={list} tone={TILE_TONES[tile]} onMove={moveSticker} />

      <ListEditor
        key={tile}
        items={list.map((s, i) => ({ ...s, id: `${tile}-${i}` }))}
        onChange={(next) => setList(next.map(({ id, ...rest }) => rest))}
        itemLabel="sticker"
        addLabel="Add sticker"
        getTitle={(s) => `${s.icon} · ${s.size}px`}
        makeItem={() => ({ id: `${tile}-new`, icon: 'star', size: 48, rot: 0, pos: { top: '10%', left: '10%' } })}
        renderItem={(sticker, update) => <StickerForm sticker={sticker} update={update} />}
      />
    </div>
  );
}
