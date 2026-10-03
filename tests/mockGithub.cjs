/**
 * FILE: tests/mockGithub.cjs
 * WHAT IT DOES
 *   A pretend GitHub for testing the admin without a real token.
 *   It keeps a tiny repo in memory (starting from this project's real files) and answers the
 *   same API calls the admin makes: read files, create blobs/trees/commits, move the branch,
 *   list "workflow runs".
 *
 * USE (see tests/admin-e2e.cjs):
 *   const gh = createMockGithub();
 *   await gh.attach(page);          // intercepts https://api.github.com/* for that page
 *   gh.commits / gh.fileText(path)  // look at what the admin saved
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const OWNER = 'ishu0505';
const REPO = 'ishu0505_studio';
const GOOD_TOKEN = 'github_pat_GOOD';

const sha = (seed) => crypto.createHash('sha1').update(String(seed) + Math.random()).digest('hex');

/** All files under a folder, as repo-relative paths. */
function walk(dir, out = []) {
  for (const name of fs.readdirSync(path.join(ROOT, dir))) {
    const rel = `${dir}/${name}`;
    if (fs.statSync(path.join(ROOT, rel)).isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

function createMockGithub({ protectedMain = false, deployFails = false } = {}) {
  const blobs = new Map(); //  blobSha -> Buffer
  const trees = new Map(); //  treeSha -> Map(path -> blobSha)
  const commits = new Map(); // commitSha -> { tree, parents, message }
  const refs = new Map(); //   branch -> commitSha
  const runPolls = new Map(); // commitSha -> number of times asked
  const log = []; //           every request, for assertions

  // seed: this project's real content + public files
  const seedFiles = new Map();
  [...walk('src/content'), ...walk('public')].forEach((p) => {
    const blob = sha(p);
    blobs.set(blob, fs.readFileSync(path.join(ROOT, p)));
    seedFiles.set(p, blob);
  });
  const t0 = sha('tree0');
  trees.set(t0, seedFiles);
  const c0 = sha('commit0');
  commits.set(c0, { tree: t0, parents: [], message: 'initial' });
  refs.set('main', c0);

  const state = { commits: [], tokenSeen: null };

  function treeOf(commitSha) {
    return trees.get(commits.get(commitSha).tree);
  }
  const json = (route, status, body, extra = {}) =>
    route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', ...extra }, body: JSON.stringify(body) });
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization,content-type,accept,x-github-api-version', 'access-control-allow-methods': 'GET,POST,PATCH,OPTIONS' };

  async function handle(route, request) {
    const url = new URL(request.url());
    const method = request.method();
    if (method === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });

    const auth = request.headers().authorization ?? '';
    state.tokenSeen = auth;
    log.push(`${method} ${url.pathname}${url.search}`);
    if (!auth.endsWith(GOOD_TOKEN)) return json(route, 401, { message: 'Bad credentials' });

    const p = url.pathname;
    const base = `/repos/${OWNER}/${REPO}`;
    let m;

    if (p === '/user') return json(route, 200, { login: 'tester' });
    if (p === base) return json(route, 200, { permissions: { push: true } });
    if ((m = p.match(new RegExp(`^${base}/git/ref/heads/(.+)$`)))) {
      return refs.has(m[1]) ? json(route, 200, { object: { sha: refs.get(m[1]) } }) : json(route, 404, { message: 'Not Found' });
    }
    if ((m = p.match(new RegExp(`^${base}/git/commits/(.+)$`)))) {
      const c = commits.get(m[1]);
      return c ? json(route, 200, { sha: m[1], tree: { sha: c.tree }, message: c.message, parents: c.parents.map((s) => ({ sha: s })) }) : json(route, 404, { message: 'Not Found' });
    }
    if ((m = p.match(new RegExp(`^${base}/git/trees/(.+)$`))) && method === 'GET') {
      return json(route, 200, { tree: [...trees.get(m[1]).keys()].map((q) => ({ path: q, type: 'blob' })), truncated: false });
    }
    if ((m = p.match(new RegExp(`^${base}/contents/(.+)$`)))) {
      const file = decodeURIComponent(m[1]);
      const blob = treeOf(url.searchParams.get('ref')).get(file);
      return blob ? route.fulfill({ status: 200, contentType: 'text/plain', headers: cors, body: blobs.get(blob).toString('utf8') }) : json(route, 404, { message: 'Not Found' });
    }
    if (p === `${base}/git/blobs` && method === 'POST') {
      const body = request.postDataJSON();
      const id = sha(body.content);
      blobs.set(id, body.encoding === 'base64' ? Buffer.from(body.content, 'base64') : Buffer.from(body.content, 'utf8'));
      return json(route, 201, { sha: id });
    }
    if (p === `${base}/git/trees` && method === 'POST') {
      const body = request.postDataJSON();
      const next = new Map(trees.get(body.base_tree));
      body.tree.forEach((e) => next.set(e.path, e.sha));
      const id = sha('tree');
      trees.set(id, next);
      return json(route, 201, { sha: id });
    }
    if (p === `${base}/git/commits` && method === 'POST') {
      const body = request.postDataJSON();
      const id = sha('commit');
      commits.set(id, { tree: body.tree, parents: body.parents, message: body.message });
      state.commits.push(id);
      return json(route, 201, { sha: id });
    }
    if ((m = p.match(new RegExp(`^${base}/git/refs/heads/(.+)$`))) && method === 'PATCH') {
      const body = request.postDataJSON();
      if (protectedMain && m[1] === 'main') return json(route, 403, { message: 'Protected branch update failed. Changes must be made through a pull request.' });
      const current = refs.get(m[1]);
      if (!body.force && current && !commits.get(body.sha).parents.includes(current)) return json(route, 422, { message: 'Update is not a fast forward' });
      refs.set(m[1], body.sha);
      return json(route, 200, { object: { sha: body.sha } });
    }
    if (p === `${base}/git/refs` && method === 'POST') {
      const body = request.postDataJSON();
      refs.set(body.ref.replace('refs/heads/', ''), body.sha);
      return json(route, 201, {});
    }
    if (p === `${base}/pulls` && method === 'POST') return json(route, 201, { html_url: 'https://github.com/mock/pull/1' });
    if (p === `${base}/actions/runs`) {
      const head = url.searchParams.get('head_sha');
      const n = (runPolls.get(head) ?? 0) + 1;
      runPolls.set(head, n);
      const done = n >= 2;
      return json(route, 200, {
        workflow_runs: [{ name: 'Deploy to GitHub Pages', status: done ? 'completed' : 'in_progress', conclusion: done ? (deployFails ? 'failure' : 'success') : null, html_url: 'https://github.com/mock/run/1' }],
      });
    }
    return json(route, 404, { message: `mock: unhandled ${method} ${p}` });
  }

  return {
    GOOD_TOKEN,
    state,
    log,
    /** Intercept GitHub calls made by a Playwright page. */
    attach: (page) => page.route('https://api.github.com/**', (route, request) => handle(route, request)),
    /** The text of a file on main right now. */
    fileText: (file) => blobs.get(treeOf(refs.get('main')).get(file))?.toString('utf8'),
    fileBuffer: (file) => blobs.get(treeOf(refs.get('main')).get(file)),
    head: () => refs.get('main'),
    commitInfo: (id) => commits.get(id),
    /** Files that differ between a commit and its parent. */
    changedIn: (id) => {
      const c = commits.get(id);
      const before = trees.get(commits.get(c.parents[0]).tree);
      const after = trees.get(c.tree);
      return [...after.keys()].filter((f) => before.get(f) !== after.get(f)).sort();
    },
    /** Pretend someone else committed to main (changes one file). */
    externalCommit: (file, text) => {
      const blob = sha(text);
      blobs.set(blob, Buffer.from(text));
      const next = new Map(treeOf(refs.get('main')));
      next.set(file, blob);
      const t = sha('t');
      trees.set(t, next);
      const c = sha('c');
      commits.set(c, { tree: t, parents: [refs.get('main')], message: 'someone else' });
      refs.set('main', c);
    },
    refs,
  };
}

module.exports = { createMockGithub };
