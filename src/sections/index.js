/**
 * FILE: src/sections/index.js
 * WHAT IT DOES
 *   The list of tiles, in front-page order. To add a tile: create a *Section.jsx file that exports
 *   { id, title, icon, tone, stickers, Preview, Full }, import it here, and give it a grid area in styles/bento.css.
 */
import profile from './ProfileSection';
import projects from './ProjectsSection';
import resume from './ResumeSection';
import hobbies from './HobbiesSection';
import writing from './WritingSection';
import contact from './ContactSection';

export const sections = [profile, projects, resume, hobbies, writing, contact];
