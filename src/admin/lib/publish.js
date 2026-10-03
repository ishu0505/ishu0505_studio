/**
 * FILE: src/admin/lib/publish.js
 *
 * WHAT IT DOES
 *   The "Publish" logic, in small steps:
 *     1. commitFiles()        save all your edits as ONE commit on the main branch
 *     2. undoLastAdminCommit() take back your most recent admin publish
 *     3. waitForDeploy()      watch GitHub rebuild the site until it is live
 *
 * WHY ONE COMMIT?
 *   Every push to main makes GitHub rebuild the site. One commit = one rebuild,
 *   even if you changed five things.
 */
import { BRANCH, COMMIT_PREFIX, DEPLOY_WORKFLOW_NAME, EDIT_BRANCH } from './config';
import { ConflictError } from './githubClient';

/** Stop if someone else changed one of the files we are about to overwrite. */
async function assertNobodyElseChangedOurFiles(client, commitSha, filesAsLoaded) {
  for (const [path, textWhenLoaded] of Object.entries(filesAsLoaded)) {
    const textNow = await client.readText(path, commitSha).catch(() => null);
    if (textNow !== textWhenLoaded) throw new ConflictError(`"${path}" was changed by someone else since you opened the admin.`);
  }
}

/** Upload every file and return the list of entries GitHub needs to build a snapshot. */
async function uploadFiles(client, files) {
  const entries = [];
  for (const file of files) {
    const sha = await client.createBlob(file.content, file.encoding);
    entries.push({ path: file.path, mode: '100644', type: 'blob', sha });
  }
  return entries;
}

/** Normal case: add the commit to the main branch. */
async function commitToMain(client, entries, message, head) {
  const treeSha = await client.createTree(head.treeSha, entries);
  const commitSha = await client.createCommit(message, treeSha, head.sha);
  await client.updateBranch(BRANCH, commitSha, false);
  return { sha: commitSha, mode: 'main' };
}

/** Special case: main only accepts pull requests, so put the edit on its own branch and open one. */
async function commitToPullRequest(client, entries, message, head) {
  const treeSha = await client.createTree(head.treeSha, entries);
  const commitSha = await client.createCommit(message, treeSha, head.sha);
  try {
    await client.createBranch(EDIT_BRANCH, commitSha);
  } catch {
    await client.updateBranch(EDIT_BRANCH, commitSha, true); // the branch exists already: move it
  }
  const pr = await client.createPullRequest(message, EDIT_BRANCH, BRANCH, 'Created by the site admin. Merge it to publish.');
  return { sha: commitSha, mode: 'pr', pr };
}

/**
 * Save edits as one commit.
 *   files      [{ path, content, encoding }]   what to write
 *   message    short description of the change
 *   baseHead   the commit id the editor was loaded from
 *   filesAsLoaded  { path: textWhenLoaded }    used to detect clashing edits
 * Returns { sha, mode: 'main' | 'pr', pr? }
 */
export async function commitFiles(client, { files, message, baseHead, filesAsLoaded = {} }) {
  const fullMessage = COMMIT_PREFIX + message;
  const entries = await uploadFiles(client, files);

  // We may need two tries: the first can fail if main moved a moment ago.
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const head = await client.getHead();
    if (head.sha !== baseHead) await assertNobodyElseChangedOurFiles(client, head.sha, filesAsLoaded);
    try {
      return await commitToMain(client, entries, fullMessage, head);
    } catch (error) {
      if (error.kind === 'protected') return commitToPullRequest(client, entries, fullMessage, head);
      if (!(error instanceof ConflictError) || attempt === 2) throw error;
    }
  }
  throw new ConflictError('The site changed while you were publishing. Please try again.');
}

/** Undo the newest commit, but only if the admin made it. Creates a new commit that restores the previous state. */
export async function undoLastAdminCommit(client) {
  const head = await client.getHead();
  if (!head.message.startsWith(COMMIT_PREFIX) || !head.parentSha) {
    throw new Error('The latest change was not made by the admin, so it cannot be undone here.');
  }
  const previous = await client.getCommit(head.parentSha);
  const title = head.message.split('\n')[0].slice(COMMIT_PREFIX.length);
  const sha = await client.createCommit(`${COMMIT_PREFIX}undo "${title}"`, previous.treeSha, head.sha);
  await client.updateBranch(BRANCH, sha, false);
  return { sha };
}

/**
 * Wait until GitHub finishes rebuilding the site for a commit.
 * Resolves to { state: 'live' | 'failed' | 'unknown', url? }.
 * 'unknown' just means "we could not check" (for example the token cannot read Actions).
 */
export async function waitForDeploy(client, commitSha, { signal, intervalMs = 4000, timeoutMs = 5 * 60_000 } = {}) {
  const startedAt = Date.now();
  while (!signal?.aborted) {
    let runs;
    try {
      runs = await client.listRunsForCommit(commitSha);
    } catch {
      return { state: 'unknown' };
    }
    const run = runs.find((r) => r.name === DEPLOY_WORKFLOW_NAME);
    if (run?.status === 'completed') return { state: run.conclusion === 'success' ? 'live' : 'failed', url: run.url };
    if (Date.now() - startedAt > timeoutMs) return { state: 'unknown', url: run?.url };
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return { state: 'unknown' };
}
