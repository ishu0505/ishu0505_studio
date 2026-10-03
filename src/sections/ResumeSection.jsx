/**
 * FILE: src/sections/ResumeSection.jsx
 * WHAT IT DOES
 *   The Resume tile (jobs, education, skills, download button). Content: src/content/resume.json.
 */
import Card from '../components/ui/Card';
import Tags from '../components/ui/Tags';
import ResumeDownload from '../components/ui/ResumeDownload';
import { experience, education, certifications, skills } from '../data/resume';
import { profile } from '../data/profile';
import { stickers as allStickers } from '../data/stickers';

function Preview() {
  return (
    <div className="teaser">
      <p className="label">Resume</p>
      <h2>{profile.current.title}</h2>
      <p className="muted small">Experience · Education · Skills</p>
    </div>
  );
}

function Full() {
  return (
    <div className="stack">
      <div className="card-grid card-grid--wide">
        {experience.map((job) => (
          <Card
            key={job.id}
            tone={job.tone}
            wide={job.wide}
            label={`Experience${job.wide ? ' · Current' : ''}`}
            title={job.role}
            icons={job.wide ? ['medal'] : undefined}
          >
            <p className="meta">
              {job.company} · {job.place} · {job.period}
            </p>
            <ul className="bullets">
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Card>
        ))}

        {education.map((ed) => (
          <Card key={ed.id} tone={ed.tone} label="Education" title={ed.school}>
            <p className="meta">{ed.period}</p>
            <p className="muted">{ed.detail}</p>
          </Card>
        ))}

        <Card tone="white" label="Certifications" title="Credentials">
          <ul className="bullets">
            {certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Card>

        <Card tone="yellow" label="Skills" wide>
          <Tags items={skills} />
        </Card>
      </div>

      <div className="actions">
        <ResumeDownload>Download my resume (PDF) ↓</ResumeDownload>
      </div>
    </div>
  );
}

const stickers = allStickers.resume;

export default { id: 'resume', title: 'Resume', icon: 'medal', tone: 'peach', stickers, Preview, Full };
