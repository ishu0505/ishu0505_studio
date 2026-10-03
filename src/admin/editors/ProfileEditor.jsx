/**
 * FILE: src/admin/editors/ProfileEditor.jsx
 * EDITS: src/content/profile.json  (the About tile, the intro, contact links)
 */
import { useFileEditor } from '../hooks/useFileEditor';
import { Group, StringList, TextArea, TextInput } from '../fields/inputs';
import { ImagePicker } from '../fields/ImagePicker';

export default function ProfileEditor() {
  const [profile, setProfile] = useFileEditor('profile');

  /** Change top-level fields:  set({ name: 'New name' }) */
  const set = (patch) => setProfile({ ...profile, ...patch });
  /** Change a nested group:  setIn('links', { github: '...' }) */
  const setIn = (group, patch) => setProfile({ ...profile, [group]: { ...profile[group], ...patch } });

  return (
    <div className="adm-stack">
      <Group title="About you">
        <TextInput label="Name" value={profile.name} onChange={(name) => set({ name })} />
        <TextInput label="Job title" value={profile.role} onChange={(role) => set({ role })} />
        <TextArea label="Short intro" value={profile.lead} onChange={(lead) => set({ lead })} />
        <div className="adm-row">
          <TextInput label="Location" value={profile.location} onChange={(location) => set({ location })} />
          <TextInput label="School tag" value={profile.school} onChange={(school) => set({ school })} />
          <TextInput label="Status tag" value={profile.status} onChange={(status) => set({ status })} />
        </div>
        <ImagePicker label="Profile photo" value={profile.avatar} onChange={(avatar) => set({ avatar })} />
      </Group>

      <Group title="Contact and links">
        <TextInput label="Email" type="email" value={profile.email} onChange={(email) => set({ email })} />
        <TextInput label="LinkedIn" value={profile.links.linkedin} onChange={(linkedin) => setIn('links', { linkedin })} />
        <TextInput label="GitHub" value={profile.links.github} onChange={(github) => setIn('links', { github })} />
        <TextInput label="Kaggle" value={profile.links.kaggle} onChange={(kaggle) => setIn('links', { kaggle })} />
        <TextInput label="Medium" value={profile.links.medium} onChange={(medium) => setIn('links', { medium })} />
        <TextInput label="Contact form" value={profile.links.form} onChange={(form) => setIn('links', { form })} />
      </Group>

      <Group title="Current job card">
        <TextInput label="Title" value={profile.current.title} onChange={(title) => setIn('current', { title })} />
        <TextInput label="Text" value={profile.current.text} onChange={(text) => setIn('current', { text })} />
      </Group>

      <Group title="Startup card">
        <TextInput label="Title" value={profile.startup.title} onChange={(title) => setIn('startup', { title })} />
        <TextInput label="Text" value={profile.startup.text} onChange={(text) => setIn('startup', { text })} />
      </Group>

      <Group title="Skills and certificate">
        <StringList label="What I do" items={profile.focus} onChange={(focus) => set({ focus })} addLabel="Add item" />
        <StringList label="Toolkit" items={profile.toolkit} onChange={(toolkit) => set({ toolkit })} addLabel="Add tool" />
        <TextInput label="Certificate name" value={profile.certificate.title} onChange={(title) => setIn('certificate', { title })} />
        <TextInput label="Certificate link" value={profile.certificate.url} onChange={(url) => setIn('certificate', { url })} />
      </Group>
    </div>
  );
}
