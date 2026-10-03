// The order here is the order of tiles on the front page.
// To add a section: create a file that default-exports
// { id, title, emoji, tone, Preview, Full } and list it below
// (plus a grid area for it in styles/bento.css).
import profile from './ProfileSection';
import projects from './ProjectsSection';
import resume from './ResumeSection';
import hobbies from './HobbiesSection';
import writing from './WritingSection';
import contact from './ContactSection';

export const sections = [profile, projects, resume, hobbies, writing, contact];
