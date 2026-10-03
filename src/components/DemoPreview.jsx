/**
 * FILE: src/components/DemoPreview.jsx
 * WHAT IT DOES
 *   A pop-up window that shows a live demo inside the page (an <iframe>).
 *   Not every host allows this, so there is always a plain "open in a new tab" link.
 *
 *   It is drawn with createPortal (straight into <body>) because cards are slightly tilted;
 *   a pop-up inside a tilted card would be tilted and clipped too.
 */
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function DemoPreview({ title, demoUrl, onClose }) {
  const closeButton = useRef(null);

  // Esc closes the window; focus starts on the Close button.
  useEffect(() => {
    closeButton.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="demo-modal" role="dialog" aria-modal="true" aria-label={`${title} preview`} onClick={onClose}>
      <div className="demo-modal__box" onClick={(e) => e.stopPropagation()}>
        <header className="demo-modal__head">
          <strong>{title}</strong>
          <span>
            <a className="btn btn--light" href={demoUrl} target="_blank" rel="noopener noreferrer">Open in new tab ↗</a>{' '}
            <button ref={closeButton} type="button" className="btn btn--dark" onClick={onClose}>Close</button>
          </span>
        </header>
        <iframe
          title={`${title} live demo`}
          src={demoUrl}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer"
        />
        <p className="demo-modal__tip">Blank or still loading? Free hosts can take a minute to wake up, and some do not allow previews. Use "Open in new tab".</p>
      </div>
    </div>,
    document.body,
  );
}
