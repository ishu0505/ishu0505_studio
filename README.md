# Ishaan Parmar — portfolio

A bento-style portfolio built with **React + Vite** and **Framer Motion**.
The front page is a grid of tiles (About, Projects, Resume, Hobbies, Writing, Contact).
Click a tile and it expands to fill most of the page while the others shrink into a rail
(a bottom bar on mobile). `Esc`, the ✕ button, or the browser Back button returns to the grid.

[visit ishaanparmar.online](https://ishaanparmar.online/)

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Project structure

```
public/assets/        static files served as-is (images, resume PDF, report)
src/
  main.jsx            entry point, loads the styles
  App.jsx             page shell: header + bento grid + Esc handling
  data/               ALL the content lives here — edit text without touching components
    profile.js  projects.js  resume.js  hobbies.js  writing.js
  sections/           one file per tile: exports { id, title, emoji, tone, Preview, Full }
    index.js          the list/order of tiles
  components/
    BentoGrid.jsx     lays out the tiles and switches home <-> focus layout
    Tile.jsx          one tile; animates between home / main / rail modes
    Header.jsx
    ui/               small reusable pieces (Card, Tags, Button, ResumeDownload)
  hooks/
    useActiveSection.js   keeps the open tile in the URL hash (#resume)
  styles/             tokens (colours/spacing), base, bento (layout), ui, sections
  utils/asset.js      builds correct URLs for files in public/
```

### Common edits

- **Update your resume / job info:** `src/data/resume.js` (and replace `public/assets/resume/Ishaan-parmar-resume.pdf`).
- **Add a project:** add an object to `src/data/projects.js`.
- **Change hobbies:** `src/data/hobbies.js`.
- **Add a new tile:** create `src/sections/XSection.jsx`, list it in `src/sections/index.js`, and give it a grid area in `src/styles/bento.css`.
- **Colours:** `src/styles/tokens.css`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Contact

iparmar0505@gmail.com

## License

MIT
