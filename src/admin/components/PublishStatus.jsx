/**
 * FILE: src/admin/components/PublishStatus.jsx
 * WHAT IT DOES
 *   One friendly sentence for each step of publishing (see usePublisher.js for the states).
 */
export default function PublishStatus({ publish }) {
  const { state, message, runUrl, prUrl } = publish;
  const link = (url, text) => (url ? <a href={url} target="_blank" rel="noopener noreferrer">{text}</a> : null);

  if (state === 'saving') return <p className="adm-note" role="status">Saving to GitHub…</p>;
  if (state === 'building') return <p className="adm-note" role="status">Saved. GitHub is rebuilding the site, usually about a minute…</p>;
  if (state === 'live') return <p className="adm-ok" role="status">✔ Live! Your changes are on the website. Refresh the site to see them. {link(runUrl, 'Details')}</p>;
  if (state === 'unknown') return <p className="adm-ok" role="status">Saved. The site updates in about a minute. {link(runUrl, 'Check progress')}</p>;
  if (state === 'failed') return <p className="adm-error" role="alert">The rebuild failed, so the old site is still online. {link(runUrl, 'See what went wrong')} You can use "Undo last publish".</p>;
  if (state === 'pr') return <p className="adm-note" role="status">The main branch only takes pull requests, so I opened one: {link(prUrl, 'open it')}. Merge it to publish.</p>;
  if (state === 'conflict') return <p className="adm-error" role="alert">{message} Reload to get the latest version (your unpublished edits will be lost).</p>;
  if (state === 'error') return <p className="adm-error" role="alert">{message}</p>;
  return null;
}
