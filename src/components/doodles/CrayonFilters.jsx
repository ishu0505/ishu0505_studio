/**
 * FILE: src/components/doodles/CrayonFilters.jsx
 * WHAT IT DOES
 *   A tiny hidden SVG that defines the 'wobble' filter every doodle uses (the hand-drawn look). Drawn once, near the top of the page.
 */
export default function CrayonFilters() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <filter id="crayon-line" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
