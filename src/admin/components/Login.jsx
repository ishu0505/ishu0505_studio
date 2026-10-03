/**
 * FILE: src/admin/components/Login.jsx
 * WHAT IT DOES
 *   The login screen. You paste your GitHub token; nothing is stored in the website's code.
 */
import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { REPO, OWNER } from '../lib/config';

export default function Login() {
  const { session } = useAdmin();
  const [token, setToken] = useState('');
  const [expiresOn, setExpiresOn] = useState('');
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    await session.login(token, { remember, expiresOn: expiresOn ? new Date(`${expiresOn}T23:59:59`).toISOString() : null });
    setBusy(false);
  }

  return (
    <main className="adm-login">
      <form className="adm-panel" onSubmit={submit}>
        <h1>Site admin</h1>
        <p className="adm-hint">Only you can change the site. Paste your GitHub token to continue.</p>

        <label className="adm-label" htmlFor="token">GitHub token</label>
        <input id="token" type="password" autoComplete="off" spellCheck="false" value={token} onChange={(e) => setToken(e.target.value)} placeholder="github_pat_…" required />

        <label className="adm-label" htmlFor="expires">Token expiry date (optional, to get a reminder)</label>
        <input id="expires" type="date" value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} />

        <label className="adm-check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span>Remember me on this device (otherwise I forget it when the tab closes)</span>
        </label>

        {session.error && <p className="adm-error" role="alert">{session.error}</p>}

        <button className="adm-btn adm-btn--primary" type="submit" disabled={busy || !token.trim()}>
          {busy ? 'Checking…' : 'Log in'}
        </button>

        <details className="adm-help">
          <summary>How do I get a token?</summary>
          <ol>
            <li>Open <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">GitHub → Settings → Fine-grained tokens → New</a>.</li>
            <li>Name it "site admin" and set an expiry (90 days is a good choice).</li>
            <li>Repository access: <strong>Only select repositories</strong> → <code>{OWNER}/{REPO}</code>.</li>
            <li>Permissions: <strong>Contents → Read and write</strong>, and <strong>Actions → Read-only</strong> (so I can show when the site is live).</li>
            <li>Generate the token, copy it, paste it above. It is never saved in the website's code.</li>
          </ol>
        </details>
        <p className="adm-hint"><a href="#">← Back to the website</a></p>
      </form>
    </main>
  );
}
