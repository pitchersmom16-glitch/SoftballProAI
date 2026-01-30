#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function run(cmd) {
  return cp.execSync(cmd, { encoding: 'utf8' }).toString().trim();
}

try {
  const root = run('git rev-parse --show-toplevel');
  // Support syncing multiple workflows files (root + Claude folder)
  const possiblePaths = [
    path.join(root, 'workflows.md'),
    path.join(root, 'Claude', 'Claude Rules and Project Specifications', 'workflows.md'),
  ];

  const workflowsPaths = possiblePaths.filter(p => fs.existsSync(p));
  if (workflowsPaths.length === 0) {
    console.log('No workflows.md found — skipping live update.');
    process.exit(0);
  }

  const hash = run('git rev-parse --short HEAD');
  const rawMsg = run('git log -1 --pretty=%B');
  const msg = rawMsg.split('\n')[0].trim();

  // Avoid infinite loop: do not add an entry for the workflows commit itself
  if (msg.toLowerCase().startsWith('docs(workflows): add live update')) {
    console.log('Commit is a workflows update — skipping auto-entry to avoid loop.');
    process.exit(0);
  }

  const author = run('git log -1 --pretty=%an') || run('git config user.name') || 'unknown';
  const date = new Date().toISOString().slice(0, 10);
  const entry = `- ${date} — ${msg} (commit: \`${hash}\`) — author: ${author}\n\n`;

  // Update each workflows file as-needed, collecting which files were changed
  const updatedFiles = [];

  const headerRegex = /(## 🔁 Live Updates[\s\S]*?\n)(?:-|$)/m;

  for (const wpath of workflowsPaths) {
    const content = fs.readFileSync(wpath, 'utf8');

    // If the entry is already present for this commit, skip
    if (content.includes(`(${hash})`)) {
      console.log(`Entry for this commit already exists in ${wpath} — skipping.`);
      continue;
    }

    if (headerRegex.test(content)) {
      const updated = content.replace(headerRegex, (m, p1) => `${p1}${entry}`);
      fs.writeFileSync(wpath, updated, 'utf8');
      updatedFiles.push(wpath);
    } else {
      const liveHeader = `\n## 🔁 Live Updates (canonical change log)\n\n${entry}\n`;
      fs.writeFileSync(wpath, liveHeader + content, 'utf8');
      updatedFiles.push(wpath);
    }
  }

  if (updatedFiles.length === 0) {
    console.log('No workflows file updated.');
    process.exit(0);
  }

  // Stage and commit all updated workflows files together
  run(`git add ${updatedFiles.map(f => '"' + f + '"').join(' ')}`);
  const shortSummary = msg.length > 60 ? msg.slice(0, 57) + '...' : msg;
  run(`git commit -m "docs(workflows): add live update — ${shortSummary} (commit: ${hash})" -- ${updatedFiles.map(f => '"' + f + '"').join(' ')}`);

  // Optionally push to the current branch instead of hardcoding 'main'
  try {
    const branch = run('git rev-parse --abbrev-ref HEAD');
    const pushTarget = branch && branch !== 'HEAD' ? branch : 'main';
    run(`git push origin ${pushTarget}`);
  } catch (e) {
    console.log('Could not push workflows update (remote may require auth or diverged).');
  }

  console.log('Live update entry added to:', updatedFiles.join(', '));
} catch (err) {
  console.error('Failed to run add-workflow-entry:', err.message);
  process.exit(1);
}