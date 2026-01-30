#!/usr/bin/env node
const fs = require('fs');
const cp = require('child_process');

function run(cmd) {
  try {
    return cp.execSync(cmd, { encoding: 'utf8' }).toString().trim();
  } catch (e) {
    console.error('Git command failed:', cmd, e.message);
    process.exit(2);
  }
}

const root = run('git rev-parse --show-toplevel');
const workflowsPath = root + '/workflows.md';

if (!fs.existsSync(workflowsPath)) {
  console.log('No workflows.md found; skipping live update check.');
  process.exit(0);
}

// Ensure we have the main branch history to compare against
try {
  run('git fetch origin main --depth=1');
} catch (e) {
  // ignore fetch failures; we'll attempt to use local refs
}

let commits = [];
try {
  commits = run('git rev-list --no-merges --reverse origin/main..HEAD').split('\n').filter(Boolean);
} catch (e) {
  // Fallback to local HEAD if rev-list fails (e.g., shallow or detached refs)
  commits = [run('git rev-parse HEAD')];
}

const shortCommits = commits.map(c => c.slice(0, 7));
const content = fs.readFileSync(workflowsPath, 'utf8');

for (const c of [...shortCommits, ...commits]) {
  if (content.includes(c)) {
    console.log('Found live update entry for commit:', c);
    process.exit(0);
  }
}

console.error('No Live Update entry found in workflows.md for commits:', shortCommits.join(', '));
console.error('Please add an entry to `workflows.md` referencing at least one of your commits (date, summary, commit: `abcd123`).');
process.exit(1);
