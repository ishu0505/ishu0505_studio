/**
 * FILE: src/hooks/useHoverCapable.js
 * WHAT IT DOES
 *   True on desktop-sized screens with a real mouse. Phones/tablets skip the hover re-flow.
 */
import { useEffect, useState } from 'react';

const QUERY = '(min-width: 900px) and (hover: hover) and (pointer: fine)';

// True on desktop-sized screens with a real mouse. Touch devices skip the
// hover re-flow and just use tap.
export default function useHoverCapable() {
  const [capable, setCapable] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setCapable(mq.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return capable;
}
