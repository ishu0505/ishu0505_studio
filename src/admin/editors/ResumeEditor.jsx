/**
 * FILE: src/admin/editors/ResumeEditor.jsx
 * EDITS: src/content/resume.json  (jobs, education, certifications, skills)
 *        + the resume PDF upload (see ResumePdfUpload.jsx)
 */
import { useFileEditor } from '../hooks/useFileEditor';
import { uniqueId } from '../lib/content';
import { ListEditor } from '../fields/ListEditor';
import { Group, StringList, TextArea, TextInput, Toggle, ToneSelect } from '../fields/inputs';
import ResumePdfUpload from './ResumePdfUpload';

export default function ResumeEditor() {
  const [resume, setResume] = useFileEditor('resume');
  const set = (patch) => setResume({ ...resume, ...patch });

  return (
    <div className="adm-stack">
      <ResumePdfUpload />

      <Group title="Experience">
        <ListEditor
          items={resume.experience}
          onChange={(experience) => set({ experience })}
          itemLabel="job"
          addLabel="Add job"
          getTitle={(job) => `${job.role} · ${job.company}`}
          makeItem={(items) => ({ id: uniqueId('new-job', items.map((j) => j.id)), role: 'Role', company: 'Company', place: 'City', period: 'Jan 2026 – Present', tone: 'yellow', bullets: ['What you did.'] })}
          renderItem={(job, update) => (
            <>
              <div className="adm-row">
                <TextInput label="Role" value={job.role} onChange={(role) => update({ role })} />
                <TextInput label="Company" value={job.company} onChange={(company) => update({ company })} />
              </div>
              <div className="adm-row">
                <TextInput label="Place" value={job.place} onChange={(place) => update({ place })} />
                <TextInput label="Dates" value={job.period} onChange={(period) => update({ period })} />
              </div>
              <StringList label="Highlights" items={job.bullets} onChange={(bullets) => update({ bullets })} multiline addLabel="Add highlight" />
              <Toggle label="Big card (full width, marked as current)" checked={job.wide} onChange={(wide) => update({ wide: wide || undefined })} />
              <ToneSelect value={job.tone} onChange={(tone) => update({ tone })} />
            </>
          )}
        />
      </Group>

      <Group title="Education">
        <ListEditor
          items={resume.education}
          onChange={(education) => set({ education })}
          itemLabel="school"
          addLabel="Add school"
          getTitle={(e) => e.school}
          makeItem={(items) => ({ id: uniqueId('new-school', items.map((e) => e.id)), school: 'School', period: '2020 – 2024', detail: 'Degree or subject.', tone: 'blue' })}
          renderItem={(school, update) => (
            <>
              <TextInput label="School" value={school.school} onChange={(value) => update({ school: value })} />
              <TextInput label="Dates" value={school.period} onChange={(period) => update({ period })} />
              <TextArea label="Details" value={school.detail} onChange={(detail) => update({ detail })} />
              <ToneSelect value={school.tone} onChange={(tone) => update({ tone })} />
            </>
          )}
        />
      </Group>

      <Group title="Certifications and skills">
        <StringList label="Certifications" items={resume.certifications} onChange={(certifications) => set({ certifications })} addLabel="Add certification" />
        <StringList label="Skills" items={resume.skills} onChange={(skills) => set({ skills })} addLabel="Add skill" />
      </Group>
    </div>
  );
}
