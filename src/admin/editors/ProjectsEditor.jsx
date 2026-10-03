/**
 * FILE: src/admin/editors/ProjectsEditor.jsx
 * EDITS: src/content/projects.json  (the Projects tile)
 *
 * A project is either:
 *   - a normal project (kind "project"): just a link, or
 *   - a demo (kind "demo"): something running elsewhere (Streamlit, Hugging Face, AWS ...).
 *     Demos also get a "Live demo" button, a host badge and an optional preview window.
 */
import { DEMO_HOSTS } from '../../content/schema';
import { useFileEditor } from '../hooks/useFileEditor';
import { uniqueId } from '../lib/content';
import { ListEditor } from '../fields/ListEditor';
import { Group, Select, TextInput, Toggle, ToneSelect } from '../fields/inputs';
import { ImagePicker } from '../fields/ImagePicker';

/** The form for one project. `update({ field: value })` changes it. */
function ProjectForm({ project, update }) {
  const isDemo = project.kind === 'demo';

  /** Switching to "demo" adds the demo settings; switching back removes them. */
  function changeKind(kind) {
    if (kind === 'demo') update({ kind, demo: project.demo ?? { url: 'https://', host: 'other', embed: false } });
    else update({ kind: undefined, demo: undefined });
  }
  const updateDemo = (patch) => update({ demo: { ...project.demo, ...patch } });

  return (
    <>
      <TextInput label="Title" value={project.title} onChange={(title) => update({ title })} />
      <div className="adm-row">
        <TextInput label="Category" value={project.category} onChange={(category) => update({ category })} />
        <TextInput label="Tech used" value={project.tech} onChange={(tech) => update({ tech })} />
      </div>
      <TextInput label="Main link" value={project.href} onChange={(href) => update({ href })} hint="Where clicking the card goes (repo, article, product page...)." />
      <ImagePicker label="Picture (optional)" value={project.image} optional onChange={(image) => update({ image })} />
      <ToneSelect value={project.tone} onChange={(tone) => update({ tone })} />

      <Select
        label="Type"
        value={isDemo ? 'demo' : 'project'}
        onChange={changeKind}
        options={[
          { value: 'project', label: 'Project (a link)' },
          { value: 'demo', label: 'Live demo (running somewhere else)' },
        ]}
      />
      {isDemo && (
        <Group title="Demo settings">
          <TextInput label="Demo address" value={project.demo.url} onChange={(url) => updateDemo({ url })} hint="The live app, for example a Streamlit or Hugging Face link." />
          <TextInput label="Code repository (optional)" value={project.demo.repoUrl ?? ''} onChange={(repoUrl) => updateDemo({ repoUrl: repoUrl || undefined })} />
          <Select label="Hosted on" value={project.demo.host} onChange={(host) => updateDemo({ host })} options={DEMO_HOSTS} />
          <Toggle label="Show a preview window on the site" checked={project.demo.embed} onChange={(embed) => updateDemo({ embed })} hint="Some hosts do not allow this; the live-demo button always works." />
          <TextInput label="Note (optional)" value={project.demo.note ?? ''} onChange={(note) => updateDemo({ note: note || undefined })} hint='For example: "Free tier: the first load can take a minute."' />
        </Group>
      )}
    </>
  );
}

export default function ProjectsEditor() {
  const [projects, setProjects] = useFileEditor('projects');
  return (
    <ListEditor
      items={projects}
      onChange={setProjects}
      itemLabel="project"
      addLabel="Add project"
      getTitle={(p) => p.title}
      makeItem={(items) => ({ id: uniqueId('new-project', items.map((p) => p.id)), title: 'New project', category: 'Category', tech: 'Tech', href: 'https://', tone: 'blue' })}
      renderItem={(project, update) => <ProjectForm project={project} update={update} />}
    />
  );
}
