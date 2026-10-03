/**
 * FILE: src/components/doodles/icons.jsx
 * WHAT IT DOES
 *   All the built-in doodle icons, drawn by hand as SVG in a 64x64 box (no icon packs, no logos).
 *   To add one: add a new  name: (<>...</>),  entry below. It then appears in the admin pickers.
 *   ICON_NAMES (bottom) is the list of names; scripts/validate-content.mjs reads this file too.
 */
const INK = '#2a2a35';

// Build a path from a list of grid points (used for the pixel heart).
const pixelPath = (points, unit, ox, oy) =>
  points.map(([x, y], i) => `${i ? 'L' : 'M'}${ox + x * unit} ${oy + y * unit}`).join(' ') + ' Z';

const HEART_POINTS = [
  [1, 0], [3, 0], [3, 1], [4, 1], [4, 0], [6, 0], [6, 1], [7, 1], [7, 3], [6, 3], [6, 4],
  [5, 4], [5, 5], [4, 5], [4, 6], [3, 6], [3, 5], [2, 5], [2, 4], [1, 4], [1, 3], [0, 3], [0, 1], [1, 1],
];

export const ICONS = {
  // running shoe
  shoe: (
    <>
      <path d="M8 42 V22 Q8 17 13 17 H22 Q26 27 35 29 L50 33 Q58 35 58 43 Z" fill="#ff9ec7" />
      <path d="M6 43 H58 V50 Q58 54 54 54 H10 Q6 54 6 50 Z" fill="#fff" />
      <path d="M15 38 Q28 29 42 39" />
      <path d="M26 22 L31 18 M31 26 L36 22" />
    </>
  ),
  // finisher medal
  medal: (
    <>
      <path d="M18 6 L30 28 M46 6 L34 28" />
      <circle cx="32" cy="42" r="15" fill="#ffd95c" />
      <path d="M32 34 l2.8 5.6 6.2 .9 -4.5 4.4 1.1 6.2 -5.6-2.9 -5.6 2.9 1.1-6.2 -4.5-4.4 6.2-.9z" fill="#fff" />
    </>
  ),
  // anime-style cat
  cat: (
    <>
      <path d="M11 28 L11 8 L25 17 Q32 15.5 39 17 L53 8 L53 28 Q56 36 52 42 Q46 54 32 54 Q18 54 12 42 Q8 36 11 28 Z" fill="#fff3e0" />
      <ellipse cx="23" cy="33" rx="4" ry="6" fill={INK} />
      <ellipse cx="41" cy="33" rx="4" ry="6" fill={INK} />
      <circle cx="24.5" cy="30.5" r="1.6" fill="#fff" stroke="none" />
      <circle cx="42.5" cy="30.5" r="1.6" fill="#fff" stroke="none" />
      <path d="M30 41 H34 L32 44 Z" fill="#ff7aa8" />
      <path d="M32 44 Q29 48 26 45 M32 44 Q35 48 38 45" />
      <path d="M8 40 L16 41 M8 46 L16 44 M56 40 L48 41 M56 46 L48 44" />
      <ellipse cx="17" cy="42" rx="3" ry="2" fill="#ffb3cf" stroke="none" />
      <ellipse cx="47" cy="42" rx="3" ry="2" fill="#ffb3cf" stroke="none" />
    </>
  ),
  // chess king (strategy / anime)
  king: (
    <>
      <path d="M32 4 V19 M25 10 H39" />
      <path d="M26 20 Q21 20 21 27 Q21 33 27 35 L23 46 H41 L37 35 Q43 33 43 27 Q43 20 38 20 Z" fill="#c9b6ff" />
      <path d="M15 57 H49 L45 46 H19 Z" fill="#c9b6ff" />
      <path d="M26 28 H38" />
    </>
  ),
  // game controller
  gamepad: (
    <>
      <path d="M14 20 H50 Q60 20 60 35 Q60 47 52 47 Q46 47 44 41 H20 Q18 47 12 47 Q4 47 4 35 Q4 20 14 20 Z" fill="#9de5c0" />
      <path d="M18 27 V37 M13 32 H23" />
      <circle cx="44" cy="29" r="3" fill="#ff9ec7" />
      <circle cx="51" cy="34" r="3" fill="#ffd95c" />
    </>
  ),
  // compass (adventure games)
  compass: (
    <>
      <path d="M26 8 Q32 0 38 8" />
      <circle cx="32" cy="35" r="22" fill="#ffe27a" />
      <path d="M32 17 L39 35 L25 35 Z" fill="#ff7a7a" />
      <path d="M32 53 L39 35 L25 35 Z" fill="#fff" />
      <circle cx="32" cy="35" r="2" fill={INK} />
    </>
  ),
  // mushroom (post-apocalyptic games)
  mushroom: (
    <>
      <path d="M24 34 V48 Q24 56 32 56 Q40 56 40 48 V34" fill="#fff" />
      <path d="M6 34 Q6 8 32 8 Q58 8 58 34 Z" fill="#ff8f8f" />
      <circle cx="20" cy="22" r="4" fill="#fff" />
      <circle cx="38" cy="18" r="3" fill="#fff" />
      <circle cx="46" cy="28" r="3" fill="#fff" />
    </>
  ),
  // secret-agent sunglasses
  sunglasses: (
    <>
      <path d="M6 26 H28 V36 Q28 46 19 46 H15 Q6 46 6 36 Z" fill="#3b4a6b" />
      <path d="M36 26 H58 V36 Q58 46 49 46 H45 Q36 46 36 36 Z" fill="#3b4a6b" />
      <path d="M28 30 Q32 25 36 30" />
      <path d="M6 28 L2 22 M58 28 L62 22" />
      <path d="M12 31 L17 31 M42 31 L47 31" stroke="#fff" />
    </>
  ),
  // dumbbell (calisthenics / fitness)
  dumbbell: (
    <>
      <path d="M17 32 H47" />
      <rect x="5" y="22" width="7" height="20" rx="3" fill="#8ec5ff" />
      <rect x="11" y="16" width="8" height="32" rx="3" fill="#8ec5ff" />
      <rect x="45" y="16" width="8" height="32" rx="3" fill="#8ec5ff" />
      <rect x="52" y="22" width="7" height="20" rx="3" fill="#8ec5ff" />
    </>
  ),
  // coffee
  coffee: (
    <>
      <path d="M19 18 Q15 13 19 8 M28 18 Q24 12 28 6 M37 18 Q33 13 37 8" />
      <path d="M10 25 H46 V39 Q46 52 28 52 Q10 52 10 39 Z" fill="#fff" />
      <path d="M10 25 H46 V31 H10 Z" fill="#b57b4f" />
      <path d="M46 29 H50 Q58 29 58 36 Q58 43 47 43" />
      <path d="M6 58 H50" />
    </>
  ),
  // code window
  code: (
    <>
      <rect x="4" y="9" width="56" height="46" rx="8" fill="#fff" />
      <path d="M4 21 H60" />
      <circle cx="12" cy="15" r="1.8" fill="#ff7a7a" />
      <circle cx="19" cy="15" r="1.8" fill="#ffd95c" />
      <circle cx="26" cy="15" r="1.8" fill="#6fd8a0" />
      <path d="M24 30 L16 38 L24 46 M40 30 L48 38 L40 46 M35 28 L29 48" />
    </>
  ),
  // pixel heart (game dev)
  heart: (
    <>
      <path d={pixelPath(HEART_POINTS, 7, 7.5, 12)} fill="#ff7aa8" />
      <path d="M16 20 H21" stroke="#fff" />
    </>
  ),
  // git branch (open source)
  branch: (
    <>
      <path d="M18 18 V46" />
      <path d="M46 30 Q46 42 18 42" />
      <circle cx="18" cy="13" r="6" fill="#8ec5ff" />
      <circle cx="18" cy="51" r="6" fill="#9de5c0" />
      <circle cx="46" cy="24" r="6" fill="#ffd95c" />
    </>
  ),
  // penguin (linux)
  penguin: (
    <>
      <ellipse cx="32" cy="33" rx="18" ry="23" fill="#3b4a6b" />
      <ellipse cx="32" cy="38" rx="10" ry="15" fill="#fff" />
      <circle cx="26" cy="21" r="4" fill="#fff" />
      <circle cx="38" cy="21" r="4" fill="#fff" />
      <circle cx="27" cy="22" r="1.5" fill={INK} stroke="none" />
      <circle cx="37" cy="22" r="1.5" fill={INK} stroke="none" />
      <path d="M28 27 H36 L32 33 Z" fill="#ffb347" />
      <path d="M14 34 Q7 44 14 50 M50 34 Q57 44 50 50" />
      <ellipse cx="24" cy="57" rx="7" ry="3.5" fill="#ffb347" />
      <ellipse cx="40" cy="57" rx="7" ry="3.5" fill="#ffb347" />
    </>
  ),
  // fedora hat (a nod to the distro)
  fedora: (
    <>
      <path d="M14 38 Q14 12 32 12 Q50 12 50 38 Z" fill="#7aa7ff" />
      <path d="M22 18 Q32 25 42 18" />
      <path d="M14 33 Q32 40 50 33" strokeWidth="5" stroke="#2f4ea0" />
      <ellipse cx="32" cy="42" rx="28" ry="9" fill="#a9c4ff" />
      <path d="M14 38 Q32 46 50 38" />
    </>
  ),
  // pencil
  pencil: (
    <>
      <path d="M10 54 L14 40 L42 12 Q46 8 50 12 L52 14 Q56 18 52 22 L24 50 Z" fill="#ffe27a" />
      <path d="M14 40 L24 50 M38 16 L48 26" />
      <path d="M10 54 L14 40 L24 50 Z" fill="#ffd0b3" />
    </>
  ),
  // speech bubble
  speech: (
    <>
      <path d="M8 10 H56 Q60 10 60 14 V38 Q60 42 56 42 H32 L19 55 V42 H8 Q4 42 4 38 V14 Q4 10 8 10 Z" fill="#fff" />
      <path d="M24 17 V29 M24 35 V35.5" />
      <path d="M36 22 Q36 16 42 16 Q48 16 48 22 Q48 26 42 28 V31 M42 36 V36.5" />
    </>
  ),
  // filler doodles
  star: <path d="M32 5 L39 24 L59 25 L43 38 L49 57 L32 46 L15 57 L21 38 L5 25 L25 24 Z" fill="#ffe27a" />,
  sparkle: <path d="M32 4 Q35 28 60 32 Q35 36 32 60 Q29 36 4 32 Q29 28 32 4 Z" fill="#fff3a8" />,
  bolt: <path d="M36 4 L14 36 H28 L24 60 L50 24 H34 Z" fill="#ffd95c" />,
  squiggle: <path d="M4 40 Q12 20 20 40 T36 40 T52 40 T62 36" fill="none" />,
};

export const ICON_NAMES = Object.keys(ICONS);
