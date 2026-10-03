import Tile from './Tile';

// Lays out every section as a tile. The grid switches between a front-page
// layout and a focus layout (one big tile + a rail of small ones) via CSS;
// each Tile just reports which mode it is in.
export default function BentoGrid({ sections, active, onOpen, onClose }) {
  return (
    <main className={`bento ${active ? 'bento--focus' : 'bento--home'}`}>
      {sections.map((section, index) => (
        <Tile
          key={section.id}
          section={section}
          index={index}
          mode={!active ? 'home' : active === section.id ? 'main' : 'rail'}
          onOpen={onOpen}
          onClose={onClose}
        />
      ))}
    </main>
  );
}
