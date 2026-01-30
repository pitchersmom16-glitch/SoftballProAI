#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function run(cmd) {
  return cp.execSync(cmd, { encoding: 'utf8' }).toString().trim();
}

try {
  const root = run('git rev-parse --show-toplevel');
  const workflowsPath = path.join(root, 'workflows.md');
  if (!fs.existsSync(workflowsPath)) {
    console.log('workflows.md not found — skipping live update.');
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

  const content = fs.readFileSync(workflowsPath, 'utf8');

  // If the entry is already present, skip
  if (content.includes(`(${hash})`)) {
    console.log('Entry for this commit already exists in workflows.md — skipping.');
    process.exit(0);
  }

  // Insert the entry right after the Live Updates header
  const headerRegex = /(## 🔁 Live Updates[\s\S]*?\n)(?:-\s|$)/m;
  if (headerRegex.test(content)) {
    // place entry immediately after header block (before existing list)
    const updated = content.replace(headerRegex, (m, p1) => `${p1}${entry}`);
    fs.writeFileSync(workflowsPath, updated, 'utf8');

    // Stage and commit the change
    run(`git add "${workflowsPath}"`);
    const shortSummary = msg.length > 60 ? msg.slice(0, 57) + '...' : msg;
    run(`git commit -m "docs(workflows): add live update — ${shortSummary} (commit: ${hash})" -- "${workflowsPath}"`);

    // Optionally push
    try {
      run('git push origin main');
    } catch (e) {
      console.log('Could not push workflows update (remote may require auth or diverged).');
    }

    console.log('Live update entry added to workflows.md.');
  } else {
    // No header found — append a small Live Updates section
    const liveHeader = `\n## 🔁 Live Updates (canonical change log)\n\n${entry}\n`;
    fs.writeFileSync(workflowsPath, liveHeader + content, 'utf8');
    run(`git add "${workflowsPath}"`);
    run(`git commit -m "docs(workflows): add initial live update for ${hash}" -- "${workflowsPath}"`);
    try {
      run('git push origin main');
    } catch (e) {
      console.log('Could not push workflows update.');
    }
    console.log('Live Updates section created and entry added.');
  }
} catch (err) {
  console.error('Failed to run add-workflow-entry:', err.message);
  process.exit(1);
}