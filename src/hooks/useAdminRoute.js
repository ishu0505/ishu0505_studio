/**
 * FILE: src/hooks/useAdminRoute.js
 * WHAT IT DOES
 *   Returns true when the address ends in  #/admin  (so the admin page should show).
 */
import { useEffect, useState } from 'react';

const check = () => window.location.hash.startsWith('#/admin');

export default function useAdminRoute() {
  const [isAdmin, setIsAdmin] = useState(check);
  useEffect(() => {
    const onChange = () => setIsAdmin(check());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return isAdmin;
}
