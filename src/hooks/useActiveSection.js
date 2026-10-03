import { useCallback, useEffect, useState } from 'react';

const readHash = (ids) => {
  const hash = window.location.hash.replace('#', '');
  return ids.includes(hash) ? hash : null;
};

// Keeps the open tile in the URL hash (#resume) so the browser Back button
// and shared links both work, with no router dependency.
export default function useActiveSection(ids) {
  const [active, setActive] = useState(() => readHash(ids));

  useEffect(() => {
    const sync = () => setActive(readHash(ids));
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [ids]);

  const open = useCallback((id) => {
    window.location.hash = id;
  }, []);

  const close = useCallback(() => {
    window.history.pushState(null, '', window.location.pathname + window.location.search);
    setActive(null);
  }, []);

  return { active, open, close };
}
