/**
 * FILE: src/admin/lib/token.js
 * WHAT IT DOES
 *   Remembers your GitHub token in THIS browser only (never in the repo).
 *     'Remember me' ticked  -> localStorage   (stays until you log out)
 *     not ticked            -> sessionStorage (forgotten when the tab closes)
 *   Also: daysLeft() for the 'token expires in N days' badge.
 */
const KEY = 'portfolio.admin.session';

export function loadSession() {
  try {
    const raw = window.sessionStorage.getItem(KEY) ?? window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session, remember) {
  clearSession();
  try {
    (remember ? window.localStorage : window.sessionStorage).setItem(KEY, JSON.stringify({ ...session, remember }));
  } catch {
    /* storage blocked: the session just won't persist */
  }
}

export function clearSession() {
  try {
    window.sessionStorage.removeItem(KEY);
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

// Days until the token's expiry date (null when unknown).
export function daysLeft(expiresOn) {
  if (!expiresOn) return null;
  const t = Date.parse(expiresOn);
  if (Number.isNaN(t)) return null;
  return Math.ceil((t - Date.now()) / 86_400_000);
}
