/**
 * FILE: src/admin/editors/WritingEditor.jsx
 * EDITS: src/content/writing.json  (the Writing tile: articles and extra links)
 */
import { useFileEditor } from '../hooks/useFileEditor';
import { uniqueId } from '../lib/content';
import { ListEditor } from '../fields/ListEditor';
import { Group, TextArea, TextInput, ToneSelect } from '../fields/inputs';
import { ImagePicker } from '../fields/ImagePicker';

export default function WritingEditor() {
  const [writing, setWriting] = useFileEditor('writing');
  const setArticles = (articles) => setWriting({ ...writing, articles });
  const setLinks = (links) => setWriting({ ...writing, links });

  return (
    <div className="adm-stack">
      <Group title="Articles">
        <ListEditor
          items={writing.articles}
          onChange={setArticles}
          itemLabel="article"
          addLabel="Add article"
          getTitle={(a) => a.title}
          makeItem={(items) => ({
            id: uniqueId('new-article', items.map((a) => a.id)),
            title: 'New article',
            category: 'Category',
            date: 'Jan 1, 2026',
            summary: 'One or two sentences about it.',
            image: writing.articles[0]?.image ?? 'assets/images/project-1.jpg',
            href: 'https://',
            tone: 'pink',
          })}
          renderItem={(article, update) => (
            <>
              <TextInput label="Title" value={article.title} onChange={(title) => update({ title })} />
              <div className="adm-row">
                <TextInput label="Category" value={article.category} onChange={(category) => update({ category })} />
                <TextInput label="Date" value={article.date} onChange={(date) => update({ date })} />
              </div>
              <TextArea label="Summary" value={article.summary} onChange={(summary) => update({ summary })} />
              <TextInput label="Link" value={article.href} onChange={(href) => update({ href })} />
              <ImagePicker label="Picture" value={article.image} onChange={(image) => update({ image })} />
              <ToneSelect value={article.tone} onChange={(tone) => update({ tone })} />
            </>
          )}
        />
      </Group>

      <Group title="Extra link cards">
        <ListEditor
          items={writing.links}
          onChange={setLinks}
          itemLabel="link"
          addLabel="Add link"
          getTitle={(l) => l.title}
          makeItem={(items) => ({ id: uniqueId('new-link', items.map((l) => l.id)), label: 'Label', title: 'Link title ↗', href: 'https://', tone: 'white' })}
          renderItem={(link, update) => (
            <>
              <TextInput label="Small label" value={link.label} onChange={(label) => update({ label })} />
              <TextInput label="Title" value={link.title} onChange={(title) => update({ title })} />
              <TextInput label="Link" value={link.href} onChange={(href) => update({ href })} />
              <ToneSelect value={link.tone} onChange={(tone) => update({ tone })} />
            </>
          )}
        />
      </Group>
    </div>
  );
}
