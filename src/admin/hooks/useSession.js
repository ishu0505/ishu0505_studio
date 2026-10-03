/**
 * FILE: src/admin/hooks/useSession.js
 *
 * WHAT IT DOES
 *   Handles logging in and out of the admin.
 *
 * HOW LOGIN WORKS
 *   1. You paste your GitHub token.
 *   2. We ask GitHub "who is this?" and "can this token change the repo?".
 *   3. If yes, we remember the token in this browser (see lib/token.js) and you are in.
 *
 * WHAT YOU GET BACK
 *   status   'checking' | 'logged-out' | 'logged-in'
 *   user     { login, expiresOn, remember } or null
 *   client   the GitHub client to use (null when logged out)
 *   error    a message to show on the login screen
 *   login(token, { remember, expiresOn })   -> true/false
 *   logout()
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient, GitHubError } from '../lib/githubClient';
import { clearSession, loadSession, saveSession } from '../lib/token';

export function useSession() {
  const [status, setStatus] = useState('checking');
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');

  const login = useCallback(async (token, { remember = false, expiresOn = null } = {}) => {
    setError('');
    const newClient = createClient(token.trim());
    try {
      const viewer = await newClient.getViewer();
      const repo = await newClient.getRepo();
      if (!repo.canPush) {
        throw new GitHubError('This token can read the repository but not change it. Give it "Contents: Read and write".', 403, 'permission');
      }
      const info = { login: viewer.login, expiresOn: expiresOn || viewer.expiresOn || null, remember };
      saveSession({ token: token.trim(), login: info.login, expiresOn: info.expiresOn }, remember);
      setClient(newClient);
      setUser(info);
      setStatus('logged-in');
      return true;
    } catch (e) {
      setError(e instanceof GitHubError ? e.message : 'Something went wrong while checking the token.');
      setStatus('logged-out');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setClient(null);
    setUser(null);
    setError('');
    setStatus('logged-out');
  }, []);

  // On first load: if a token was remembered, try it automatically.
  const triedAutoLogin = useRef(false);
  useEffect(() => {
    if (triedAutoLogin.current) return;
    triedAutoLogin.current = true;
    const saved = loadSession();
    if (saved?.token) login(saved.token, { remember: saved.remember, expiresOn: saved.expiresOn });
    else setStatus('logged-out');
  }, [login]);

  return { status, user, client, error, login, logout };
}
