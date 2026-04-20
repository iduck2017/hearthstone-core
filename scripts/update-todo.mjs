/**
 * Generates todo.md from index.json: completed = card folder has index.ts, uncompleted = in index.json but no folder.
 * Usage:
 *   node scripts/update-todo.mjs <dir-or-index-path>
 *   dir-or-index-path: directory containing index.json, or path to index.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const rawArg = process.argv[2];
if (!rawArg) {
  console.error('Usage: node scripts/update-todo.mjs <dir-or-index-path>');
  process.exit(1);
}

let targetDir;
const resolved = path.resolve(root, rawArg);
if (path.basename(resolved) === 'index.json') {
  targetDir = path.dirname(resolved);
} else {
  targetDir = resolved;
}

const indexJsonPath = path.join(targetDir, 'index.json');
if (!fs.existsSync(indexJsonPath)) {
  console.error(`Error: index.json not found at ${indexJsonPath}`);
  process.exit(1);
}

const indexJson = JSON.parse(fs.readFileSync(indexJsonPath, 'utf-8'));
const cards = indexJson.cards || [];

const entries = fs.readdirSync(targetDir, { withFileTypes: true });
const completedDirs = new Set(
  entries
    .filter((e) => e.isDirectory())
    .filter((e) => fs.existsSync(path.join(targetDir, e.name, 'index.ts')))
    .map((e) => e.name)
);

function slugToFolder(slug) {
  const firstDash = slug.indexOf('-');
  return firstDash === -1 ? slug : slug.slice(firstDash + 1);
}

const completed = [];
const uncompleted = [];

for (const card of cards) {
  const slug = card.slug;
  const name = card.name;
  if (!slug) continue;
  const folder = slugToFolder(slug);
  const item = { name, folder, id: card.id };
  if (completedDirs.has(folder)) {
    completed.push(item);
  } else {
    uncompleted.push(item);
  }
}

completed.sort((a, b) => a.id - b.id);
uncompleted.sort((a, b) => a.id - b.id);

const sectionTitle = path.basename(targetDir)
  .split('-')
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(' ');

const lines = [
  `# ${sectionTitle} cards`,
  '',
  `## Completed (${completed.length})`,
  '',
  ...completed.map((c) => `- [x] ${c.name} (\`${c.folder}\`)`),
  '',
  `## Uncompleted (${uncompleted.length})`,
  '',
  ...uncompleted.map((c) => `- [ ] ${c.name} (\`${c.folder}\`)`),
  '',
];

const todoPath = path.join(targetDir, 'todo.md');
fs.writeFileSync(todoPath, lines.join('\n'), 'utf-8');
console.log(`Updated ${todoPath}: ${completed.length} completed, ${uncompleted.length} uncompleted.`);
