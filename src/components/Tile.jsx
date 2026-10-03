import { motion } from 'framer-motion';
import Doodle from './doodles/Doodle';
import Stickers from './doodles/Stickers';

const SPRING = { type: 'spring', stiffness: 260, damping: 32, mass: 0.9 };

/**
 * One bento tile. The same element morphs between three modes:
 *   home — a preview tile on the front page
 *   main — expanded to fill most of the page
 *   rail — a compact tile while another tile is open
 * `layout` lets Framer Motion animate the size/position change.
 */
export default function Tile({ section, mode, index, onOpen, onClose }) {
  const { id, title, icon, tone, stickers, Preview, Full } = section;
  const interactive = mode !== 'main';

  const buttonProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-label': `Open ${title}`,
        onClick: () => onOpen(id),
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen(id);
          }
        },
      }
    : {};

  return (
    <motion.article
      layout
      style={{ borderRadius: 28 }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ layout: SPRING, opacity: { delay: index * 0.05 }, y: { delay: index * 0.05 } }}
      whileHover={interactive ? { scale: 1.015 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      className={`tile tile--${id} tile--${mode} tone-${tone}`}
      {...buttonProps}
    >
      {mode === 'home' && (
        <div className="tile__preview">
          <Preview />
          <span className="tile__arrow" aria-hidden="true">↗</span>
        </div>
      )}

      {mode !== 'rail' && stickers && <Stickers items={mode === 'main' ? stickers.filter((s) => s.keep) : stickers} />}

      {mode === 'rail' && (
        <div className="tile__rail">
          <Doodle name={icon} size={34} className="tile__icon" />
          <span className="tile__rail-title">{title}</span>
        </div>
      )}

      {mode === 'main' && (
        <motion.div
          className="tile__main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <header className="tile__header">
            <h2>
              <Doodle name={icon} size={40} className="tile__icon" /> {title}
            </h2>
            <button type="button" className="tile__close" onClick={onClose} aria-label="Close and go back to all tiles">
              ✕
            </button>
          </header>
          <div className="tile__body">
            <Full />
          </div>
        </motion.div>
      )}
    </motion.article>
  );
}
