/**
 * FILE: src/App.jsx
 * WHAT IT DOES
 *   The top of the app. It decides what to show:
 *     - the address ends in #/admin  -> the admin page (loaded only then, see src/admin/)
 *     - anything else                -> the public website (header + tile grid)
 *   Also closes an open tile when you press Esc.
 */
import { Suspense, lazy, useEffect, useMemo } from 'react';
import { MotionConfig } from 'framer-motion';
import Header from './components/Header';
import CrayonFilters from './components/doodles/CrayonFilters';
import BentoGrid from './components/BentoGrid';
import useActiveSection from './hooks/useActiveSection';
import useAdminRoute from './hooks/useAdminRoute';
import { sections } from './sections';

// The admin is a separate chunk: visitors never download it, only /#/admin does.
const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  const isAdmin = useAdminRoute();
  if (isAdmin) {
    return (
      <Suspense fallback={<p style={{ padding: 40, textAlign: 'center' }}>Loading admin…</p>}>
        <AdminApp />
      </Suspense>
    );
  }
  return <Website />;
}

/** The public portfolio. */
function Website() {
  const ids = useMemo(() => sections.map((s) => s.id), []);
  const { active, open, close } = useActiveSection(ids);

  // Escape closes the open tile.
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close]);

  return (
    <MotionConfig reducedMotion="user">
      <div className={`app ${active ? 'app--focus' : ''}`}>
        <CrayonFilters />
        <Header onHome={close} />
        <BentoGrid sections={sections} active={active} onOpen={open} onClose={close} />
      </div>
    </MotionConfig>
  );
}
