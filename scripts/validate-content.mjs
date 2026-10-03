/**
 * FILE: scripts/validate-content.mjs
 * WHAT IT DOES
 *   Checks every file in src/content/ BEFORE each build (npm run build runs it first).
 *   A typo (missing field, unknown icon, image that does not exist...) stops the build with a
 *   plain-English list of problems, so a mistake never replaces the live site.
 *   Run it by hand:  npm run validate     Rules live in: src/content/schema.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateContent } from '../src/content/schema.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'src/content');
const publicDir = path.join(root, 'public');

const FILES = ['profile', 'projects', 'hobbies', 'resume', 'writing', 'stickers', 'icons'];
const content = {};
const problems = [];

for (const name of FILES) {
  const file = path.join(contentDir, `${name}.json`);
  try {
    content[name] = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    problems.push(`${name}.json: ${e.code === 'ENOENT' ? 'file is missing' : `not valid JSON (${e.message})`}`);
  }
}

// Built-in icon names = the keys of ICONS in components/doodles/icons.jsx
const iconSource = fs.readFileSync(path.join(root, 'src/components/doodles/icons.jsx'), 'utf8');
const iconNames = new Set([...iconSource.matchAll(/^ {2}([a-z][a-zA-Z0-9]*): (?:\(|<)/gm)].map((m) => m[1]));
if (iconNames.size < 10) problems.push('could not read the built-in icon list from icons.jsx');

if (problems.length === 0) {
  problems.push(
    ...validateContent(content, {
      iconNames,
      assetExists: (p) => fs.existsSync(path.join(publicDir, p)),
    }),
  );
}

if (problems.length) {
  console.error(`\n✖ Content check failed (${problems.length} problem${problems.length > 1 ? 's' : ''}):\n`);
  problems.forEach((p) => console.error(`  - ${p}`));
  console.error('\nFix the file(s) in src/content/ and try again.\n');
  process.exit(1);
}
console.log(`✔ Content OK (${FILES.length} files, ${iconNames.size} built-in icons)`);
