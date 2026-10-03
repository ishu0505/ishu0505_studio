/**
 * FILE: src/admin/hooks/usePublisher.js
 *
 * WHAT IT DOES
 *   Runs the Publish and Undo buttons and tracks their progress.
 *
 * PROGRESS STATES (publish.state)
 *   idle      nothing happening
 *   saving    sending your edits to GitHub
 *   building  saved! GitHub is rebuilding the site (about a minute)
 *   live      the new version is online
 *   failed    the rebuild failed (the old site stays online)
 *   unknown   saved, but we cannot check the rebuild (token has no Actions access)
 *   pr        main is protected, so a pull request was opened instead
 *   conflict  someone else changed the site while you were editing
 *   error     something else went wrong (see `message`)
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { COMMIT_PREFIX } from '../lib/config';
import { ConflictError } from '../lib/githubClient';
import { contentPath, serialize } from '../lib/content';
import { commitFiles, undoLastAdminCommit, waitForDeploy } from '../lib/publish';

export function usePublisher(client, content) {
  const [publish, setPublish] = useState({ state: 'idle' });
  const watcher = useRef(null); // lets us stop watching when you log out

  useEffect(() => () => watcher.current?.abort(), []);

  /** Poll GitHub until the site rebuild for this commit finishes. */
  const watchDeploy = useCallback(
    async (commitSha) => {
      watcher.current?.abort();
      const controller = new AbortController();
      watcher.current = controller;
      setPublish({ state: 'building' });
      const result = await waitForDeploy(client, commitSha, { signal: controller.signal });
      if (!controller.signal.aborted) setPublish({ state: result.state, runUrl: result.url });
    },
    [client],
  );

  /** Send all unpublished edits to GitHub as one commit. */
  const doPublish = useCallback(
    async (note = '') => {
      if (!client || content.changeCount === 0 || content.problems.length > 0) return;
      setPublish({ state: 'saving' });
      try {
        const files = [
          ...content.dirtyFiles.map((name) => ({ path: contentPath(name), content: serialize(content.draft[name]), encoding: 'utf-8' })),
          ...content.pendingPaths.map((path) => ({ path, content: content.pending[path].base64, encoding: 'base64' })),
        ];
        const filesAsLoaded = {};
        content.dirtyFiles.forEach((name) => {
          filesAsLoaded[contentPath(name)] = content.textsAsLoaded.current[contentPath(name)];
        });

        const names = [...content.dirtyFiles, ...(content.pendingPaths.length ? [`${content.pendingPaths.length} file(s)`] : [])];
        const message = note.trim() || `update ${names.join(', ')}`;

        const result = await commitFiles(client, { files, message, baseHead: content.head.sha, filesAsLoaded });
        content.markPublished({ commitSha: result.sha, message: COMMIT_PREFIX + message });

        if (result.mode === 'pr') setPublish({ state: 'pr', prUrl: result.pr.url });
        else watchDeploy(result.sha);
      } catch (e) {
        if (e instanceof ConflictError) setPublish({ state: 'conflict', message: e.message });
        else setPublish({ state: 'error', message: e.message || 'Publishing failed.' });
      }
    },
    [client, content, watchDeploy],
  );

  /** You can undo only when the newest commit came from the admin and nothing is unpublished. */
  const canUndo = Boolean(content.head?.message?.startsWith(COMMIT_PREFIX)) && content.changeCount === 0;

  /** Take back the last admin publish. */
  const undoLast = useCallback(async () => {
    setPublish({ state: 'saving' });
    try {
      const { sha } = await undoLastAdminCommit(client);
      await content.load();
      watchDeploy(sha);
    } catch (e) {
      setPublish({ state: 'error', message: e.message || 'Could not undo.' });
    }
  }, [client, content, watchDeploy]);

  const resetPublish = useCallback(() => setPublish({ state: 'idle' }), []);

  return { publish, doPublish, canUndo, undoLast, resetPublish };
}
