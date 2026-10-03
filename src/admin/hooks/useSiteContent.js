/**
 * FILE: src/admin/hooks/useSiteContent.js
 *
 * WHAT IT DOES
 *   Holds the website's content while you edit it.
 *
 * THE IDEA (two copies)
 *   original   the content as it is on GitHub right now
 *   draft      your working copy. Editors change this one.
 *   When draft differs from original, that file is "dirty" (has unpublished changes).
 *
 * UPLOADS
 *   Images/PDFs you upload wait in `pending` until you press Publish.
 *
 * WHAT YOU GET BACK (the main ones)
 *   status         'idle' | 'loading' | 'ready' | 'error'
 *   draft          { profile, projects, hobbies, resume, writing, stickers, icons }
 *   setFile(name, newValue)      change one content file in the draft
 *   addPending(assetPath, file)  queue an upload
 *   dirtyFiles     names of content files that changed
 *   changeCount    changed content files + queued uploads
 *   problems       list of things wrong with the draft (empty = good to publish)
 *   previewSrc(path)   an image URL to preview (queued upload or the live site)
 *   discard()      throw away all unpublished changes
 *   markPublished(...) called after a successful publish
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { validateContent } from '../../content/schema';
import { ICON_NAMES } from '../../components/doodles/icons';
import { asset } from '../../utils/asset';
import { GitHubError } from '../lib/githubClient';
import { CONTENT_FILES, clone, contentPath, repoPathFor, sameContent, serialize } from '../lib/content';
import { approxBytes, dataUrl } from '../lib/files';

const BUILT_IN_ICONS = new Set(ICON_NAMES);

export function useSiteContent(client) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [original, setOriginal] = useState({});
  const [draft, setDraft] = useState({});
  const [pending, setPending] = useState({}); // repo path -> { base64, mime, size }
  const [repoFiles, setRepoFiles] = useState(() => new Set());
  const [head, setHead] = useState(null); // the commit we loaded: { sha, message }
  const textsAsLoaded = useRef({}); // file text exactly as loaded (to spot clashing edits)

  /** Download the latest content from GitHub. */
  const load = useCallback(async () => {
    if (!client) return;
    setStatus('loading');
    setError('');
    try {
      const newHead = await client.getHead();
      const [files, ...texts] = await Promise.all([
        client.listFiles(newHead.treeSha),
        ...CONTENT_FILES.map((name) => client.readText(contentPath(name), newHead.sha)),
      ]);
      const parsed = {};
      CONTENT_FILES.forEach((name, i) => {
        textsAsLoaded.current[contentPath(name)] = texts[i];
        parsed[name] = JSON.parse(texts[i]);
      });
      setOriginal(parsed);
      setDraft(clone(parsed));
      setPending({});
      setRepoFiles(files);
      setHead({ sha: newHead.sha, message: newHead.message });
      setStatus('ready');
    } catch (e) {
      setError(e instanceof GitHubError ? e.message : `Could not load the site content (${e.message}).`);
      setStatus('error');
    }
  }, [client]);

  // Load as soon as we have a logged-in client.
  useEffect(() => {
    if (client) load();
    else setStatus('idle');
  }, [client, load]);

  // ---------- editing --------------------------------------------------
  const setFile = useCallback((name, value) => setDraft((d) => ({ ...d, [name]: value })), []);

  const addPending = useCallback((assetPath, { base64, mime }) => {
    setPending((p) => ({ ...p, [repoPathFor(assetPath)]: { base64, mime, size: approxBytes(base64) } }));
  }, []);

  const discard = useCallback(() => {
    setDraft(clone(original));
    setPending({});
  }, [original]);

  // ---------- what changed ---------------------------------------------
  const dirtyFiles = useMemo(() => CONTENT_FILES.filter((n) => draft[n] && original[n] && !sameContent(draft[n], original[n])), [draft, original]);
  const pendingPaths = useMemo(() => Object.keys(pending), [pending]);
  const changeCount = dirtyFiles.length + pendingPaths.length;

  // ---------- previews and checks --------------------------------------
  /** Image URL for a content path: a queued upload if there is one, else the live site. */
  const previewSrc = useCallback(
    (assetPath) => {
      if (!assetPath) return '';
      if (/^(https?:|data:|blob:)/i.test(assetPath)) return assetPath;
      const queued = pending[repoPathFor(assetPath)];
      return queued ? dataUrl(queued.mime, queued.base64) : asset(assetPath);
    },
    [pending],
  );

  const assetExists = useCallback((assetPath) => repoFiles.has(repoPathFor(assetPath)) || Boolean(pending[repoPathFor(assetPath)]), [repoFiles, pending]);

  /** Same rules as the build check, so you hear about mistakes before publishing. */
  const problems = useMemo(() => {
    if (status !== 'ready' || !CONTENT_FILES.every((n) => draft[n] !== undefined)) return [];
    return validateContent(draft, { iconNames: BUILT_IN_ICONS, assetExists });
  }, [status, draft, assetExists]);

  // ---------- after publishing -------------------------------------------
  /** The draft is now what is on GitHub: reset the baseline. */
  const markPublished = useCallback(
    ({ commitSha, message }) => {
      dirtyFiles.forEach((name) => {
        textsAsLoaded.current[contentPath(name)] = serialize(draft[name]);
      });
      setOriginal(clone(draft));
      setRepoFiles((files) => new Set([...files, ...pendingPaths]));
      setPending({});
      setHead({ sha: commitSha, message });
    },
    [dirtyFiles, draft, pendingPaths],
  );

  return {
    status, error, load,
    original, draft, setFile,
    pending, addPending, pendingPaths, discard,
    dirtyFiles, changeCount,
    previewSrc, assetExists, repoFiles, problems,
    head, textsAsLoaded, markPublished,
  };
}
