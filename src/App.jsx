import { useEffect, useMemo } from 'react';
import { MotionConfig } from 'framer-motion';
import Header from './components/Header';
import CrayonFilters from './components/doodles/CrayonFilters';
import BentoGrid from './components/BentoGrid';
import useActiveSection from './hooks/useActiveSection';
import { sections } from './sections';

export default function App() {
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
