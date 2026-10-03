/**
 * FILE: src/admin/hooks/useFileEditor.js
 *
 * WHAT IT DOES
 *   A tiny helper every editor uses to read and change ONE content file.
 *
 *   const [projects, setProjects] = useFileEditor('projects');
 *   setProjects([...projects, newProject]);   // updates your draft (not published yet)
 */
import { useAdmin } from '../context/AdminContext';

export function useFileEditor(name) {
  const { content } = useAdmin();
  return [content.draft[name], (value) => content.setFile(name, value)];
}
