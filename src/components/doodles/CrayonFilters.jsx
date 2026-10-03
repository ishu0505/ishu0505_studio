// Shared SVG filter used by every doodle: a gentle wobble on the lines so they
// look drawn by hand. Rendered once at the top of the app.
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
