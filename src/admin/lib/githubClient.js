/**
 * FILE: src/admin/lib/githubClient.js
 *
 * WHAT IT DOES
 *   Talks to GitHub's web API. Each function here is one simple question or action:
 *   "who am I?", "what files are in the repo?", "save this file", and so on.
 *
 * WHY IT EXISTS
 *   The admin page has no server. It saves your edits by sending requests straight
 *   from your browser to GitHub, using the token you pasted at login.
 *
 * HOW TO USE IT
 *   const client = createClient(token);
 *   const { login } = await client.getViewer();
 *
 * NOTE: nothing in here knows about the website's content. See publish.js for
 *   the "save my edits as one commit" logic that uses these building blocks.
 */
import { API, BRANCH, OWNER, REPO } from './config';

/** An error with a friendly message you can show to a person. */
export class GitHubError extends Error {
  constructor(message, status = 0, kind = 'error') {
    super(message);
    this.status = status; // the HTTP status number (404, 401 ...)
    this.kind = kind; //     a short label: 'auth', 'permission', 'conflict', ...
  }
}

/** "Someone else changed the site while you were editing." */
export class ConflictError extends GitHubError {
  constructor(message) {
    super(message, 409, 'conflict');
  }
}

/** Turn a failed response into a GitHubError with a plain-English message. */
async function errorFromResponse(res) {
  let detail = '';
  try {
    detail = (await res.json()).message ?? '';
  } catch {
    // some errors have no body
  }
  const text = detail.toLowerCase();

  // A protected branch refuses direct changes (publish.js then opens a pull request instead).
  if (text.includes('protected branch') || text.includes('through a pull request')) return new GitHubError(detail, res.status, 'protected');

  if (res.status === 401) return new GitHubError('GitHub rejected this token. It may be wrong, expired or revoked.', 401, 'auth');
  if (res.status === 403 && text.includes('rate limit')) return new GitHubError('GitHub is rate-limiting this token. Wait a few minutes and try again.', 403, 'rate');
  if (res.status === 403) return new GitHubError('This token is not allowed to do that. It needs "Contents: Read and write" on this repository.', 403, 'permission');
  if (res.status === 404) return new GitHubError('Repository not found, or this token has no access to it.', 404, 'notfound');
  if (res.status === 409 || text.includes('fast forward') || text.includes('fast-forward')) return new ConflictError('The site changed while you were editing.');
  return new GitHubError(detail || `GitHub returned an error (${res.status}).`, res.status);
}

/** Make a client that sends every request with your token. */
export function createClient(token) {
  const repoUrl = `${API}/repos/${OWNER}/${REPO}`;

  /** Send one request. `path` is relative to the repo (or starts with /user). */
  async function send(path, { method = 'GET', body, asText = false } = {}) {
    const url = path.startsWith('/user') ? `${API}${path}` : `${repoUrl}${path}`;
    let res;
    try {
      res = await fetch(url, {
        method,
        cache: 'no-store', // always ask GitHub, never use an old copy
        headers: {
          Accept: asText ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          Authorization: `Bearer ${token}`,
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new GitHubError('Could not reach GitHub. Check your internet connection.', 0, 'network');
    }
    if (!res.ok) throw await errorFromResponse(res);
    const data = asText ? await res.text() : res.status === 204 ? null : await res.json();
    return { data, headers: res.headers };
  }

  return {
    /** Who does this token belong to? Also tries to read the token's expiry date. */
    async getViewer() {
      const { data, headers } = await send('/user');
      let expiresOn = null;
      try {
        // GitHub sometimes hides this header from browsers; if so we just don't know the date.
        const raw = headers.get('github-authentication-token-expiration');
        if (raw) expiresOn = new Date(raw.replace(' UTC', 'Z').replace(' ', 'T')).toISOString();
      } catch {
        expiresOn = null;
      }
      return { login: data.login, expiresOn };
    },

    /** Can this token change the repository? */
    async getRepo() {
      const { data } = await send('');
      return { canPush: Boolean(data.permissions?.push) };
    },

    /** The newest commit on a branch: { sha, treeSha, message, parentSha }. */
    async getHead(branch = BRANCH) {
      const { data: ref } = await send(`/git/ref/heads/${branch}`);
      return this.getCommit(ref.object.sha);
    },

    /** One commit by its id. */
    async getCommit(sha) {
      const { data } = await send(`/git/commits/${sha}`);
      return { sha: data.sha, treeSha: data.tree.sha, message: data.message, parentSha: data.parents?.[0]?.sha ?? null };
    },

    /** Every file path in the repo at a given tree (a Set of strings). */
    async listFiles(treeSha) {
      const { data } = await send(`/git/trees/${treeSha}?recursive=1`);
      return new Set(data.tree.filter((item) => item.type === 'blob').map((item) => item.path));
    },

    /** The text of one file at a given commit. */
    async readText(path, commitSha) {
      const safePath = path.split('/').map(encodeURIComponent).join('/');
      const { data } = await send(`/contents/${safePath}?ref=${encodeURIComponent(commitSha)}`, { asText: true });
      return data;
    },

    // ---- the pieces of "save a commit" (used by publish.js) -----------
    /** Upload file contents. encoding is 'utf-8' for text, 'base64' for images/PDFs. */
    async createBlob(content, encoding) {
      const { data } = await send('/git/blobs', { method: 'POST', body: { content, encoding } });
      return data.sha;
    },
    /** Build a new snapshot of the repo: the old one plus the changed files. */
    async createTree(baseTreeSha, entries) {
      const { data } = await send('/git/trees', { method: 'POST', body: { base_tree: baseTreeSha, tree: entries } });
      return data.sha;
    },
    /** Wrap a snapshot in a commit with a message. */
    async createCommit(message, treeSha, parentSha) {
      const { data } = await send('/git/commits', { method: 'POST', body: { message, tree: treeSha, parents: [parentSha] } });
      return data.sha;
    },
    /** Move a branch to point at a commit. force=false means "only if nothing else changed". */
    async updateBranch(branch, commitSha, force = false) {
      await send(`/git/refs/heads/${branch}`, { method: 'PATCH', body: { sha: commitSha, force } });
    },
    /** Create a new branch. */
    async createBranch(branch, commitSha) {
      await send('/git/refs', { method: 'POST', body: { ref: `refs/heads/${branch}`, sha: commitSha } });
    },
    /** Open a pull request. */
    async createPullRequest(title, fromBranch, toBranch, body) {
      const { data } = await send('/pulls', { method: 'POST', body: { title, head: fromBranch, base: toBranch, body } });
      return { url: data.html_url };
    },

    /** The automatic jobs ("workflow runs") GitHub started for a commit. */
    async listRunsForCommit(commitSha) {
      const { data } = await send(`/actions/runs?head_sha=${commitSha}&per_page=20`);
      return (data.workflow_runs ?? []).map((run) => ({ name: run.name, status: run.status, conclusion: run.conclusion, url: run.html_url }));
    },
  };
}
