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
  content/            ALL the editable content, as plain JSON (profile, projects, hobbies, resume,
                      writing, stickers, icons) + schema.js (the rules the build checks)
  data/               thin adapters that turn content/*.json into what the components use
  sections/           one file per tile: exports { id, title, icon, tone, stickers, Preview, Full }
    index.js          the list/order of tiles
  components/
    BentoGrid.jsx     lays out the tiles and switches home <-> focus layout
    Tile.jsx          one tile; animates between home / main / rail modes
    Header.jsx
    doodles/          hand-drawn icons, stickers and the crayon SVG filter
    ui/               small reusable pieces (Card, Tags, Button, ResumeDownload)
  hooks/
    useActiveSection.js   keeps the open tile in the URL hash (#resume)
  styles/             tokens (colours/spacing), base, bento (layout), ui, sections
  utils/asset.js      builds correct URLs for files in public/
```

### Common edits

- **Update your resume / job info:** `src/content/resume.json` (and replace `public/assets/resume/Ishaan-parmar-resume.pdf`).
- **Add a project:** add an object to `src/content/projects.json`.
- **Change hobbies:** `src/content/hobbies.json`.
- **Add a new tile:** create `src/sections/XSection.jsx`, list it in `src/sections/index.js`, and give it a grid area in `src/styles/bento.css`.
- **Colours:** `src/styles/tokens.css`.

### Content check
`npm run build` first runs `npm run validate` (`scripts/validate-content.mjs`). It checks every file in
`src/content/` (required fields, colours, icon names, that referenced images/PDFs exist in `public/`) and
stops with a plain-English list of problems, so a typo can never replace the live site.

## Look & feel

A hand-drawn "crayon" style: thick wobbly outlines, hard offset shadows, paper-grain fills, and doodle
stickers stuck on the tiles. Everything is plain CSS plus small SVGs, so it works on phones too.

- **Icons** live in `src/components/doodles/icons.jsx`. They are original drawings made for this site
  (no icon packs, no brand logos or copyrighted characters). Use one anywhere with `<Doodle name="coffee" />`.
- **Stickers** per tile are in `src/content/stickers.json` (icon, size, rotation, position).
- **Favourite things** (the Hobbies tile) are in `src/content/hobbies.json`.
- **Fonts:** Patrick Hand and Gochi Hand (SIL Open Font License), bundled via `@fontsource`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Custom domain: `public/CNAME` holds `ishu0505.tech`. In **Settings → Pages → Custom domain** enter the same name, and point DNS
(Cloudflare) at GitHub Pages: four `A` records for `@` (185.199.108.153, .109.153, .110.153, .111.153) and a `www` CNAME to
`ishu0505.github.io`, all "DNS only" until GitHub issues the HTTPS certificate.

## Contact

iparmar0505@gmail.com

## License

MIT
