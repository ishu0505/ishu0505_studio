/**
 * FILE: src/admin/editors/HobbiesEditor.jsx
 * EDITS: src/content/hobbies.json  (the Hobbies tile: your favourite things)
 */
import { useFileEditor } from '../hooks/useFileEditor';
import { uniqueId } from '../lib/content';
import { ListEditor } from '../fields/ListEditor';
import { TextInput, ToneSelect } from '../fields/inputs';
import { IconChips } from '../fields/IconPicker';

export default function HobbiesEditor() {
  const [hobbies, setHobbies] = useFileEditor('hobbies');
  return (
    <ListEditor
      items={hobbies}
      onChange={setHobbies}
      itemLabel="hobby"
      addLabel="Add hobby"
      getTitle={(h) => h.title}
      makeItem={(items) => ({ id: uniqueId('new-hobby', items.map((h) => h.id)), title: 'New hobby', text: 'A few words about it.', icons: ['star'], tone: 'yellow' })}
      renderItem={(hobby, update) => (
        <>
          <TextInput label="Title" value={hobby.title} onChange={(title) => update({ title })} />
          <TextInput label="Short caption" value={hobby.text} onChange={(text) => update({ text })} />
          <IconChips icons={hobby.icons} onChange={(icons) => update({ icons })} hint="Pick one or more doodles." />
          <ToneSelect value={hobby.tone} onChange={(tone) => update({ tone })} />
        </>
      )}
    />
  );
}
