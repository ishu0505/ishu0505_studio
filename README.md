# Ishaan Parmar — portfolio

A bento-style portfolio built with **React + Vite** and **Framer Motion**.
The front page is a grid of tiles (About, Projects, Resume, Hobbies, Writing, Contact).
Click a tile and it expands to fill most of the page while the others shrink into a rail
(a bottom bar on mobile). `Esc`, the ✕ button, or the browser Back button returns to the grid.

[visit ishu0505.tech](https://ishu0505.tech/)

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Documentation

- [docs/CODE_MAP.md](docs/CODE_MAP.md): **what is where**, folder by folder (start here)
- [docs/ADMIN.md](docs/ADMIN.md): how to use the admin page and create the token
- [docs/DEMOS.md](docs/DEMOS.md): adding live demos (Streamlit, Hugging Face, AWS...)

## Admin

Open `/#/admin` on the live site to edit everything (content, icons, stickers, resume PDF, images)
without touching code. Changes are saved to this repo and the site republishes automatically.

### Common edits

- **Update your resume / job info:** `src/content/resume.json` (and replace `public/assets/resume/Ishaan-parmar-resume.pdf`).
- **Add a project:** add an object to `src/content/projects.json`.
- **Change hobbies:** `src/content/hobbies.json`.
- **Add a new tile:** create `src/sections/XSection.jsx`, list it in `src/sections/index.js`, and give it a grid area in `src/styles/bento.css`.
- **Colours:** `src/styles/tokens.css`.

### Tests
`npm run test:e2e` drives the admin against a pretend GitHub (needs `npm i -D playwright` once, and the site
served with `npm run build && npx vite preview --port 4173`).

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
