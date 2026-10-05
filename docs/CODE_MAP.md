# Code map: what is where

Written for someone new to coding. Every source file also starts with a short comment
saying what it does (look for `FILE:` at the top).

## The big picture

```
src/content/*.json   <- ALL the words, links, colours and sticker positions (the "data")
        │
src/data/*.js        <- tiny adapters that hand that data to the screens
        │
src/sections/*.jsx   <- one file per TILE (About, Projects, Resume, Hobbies, Writing, Contact)
        │
src/components/      <- reusable pieces (grid, tile, cards, icons)
        │
src/styles/*.css     <- how everything looks
```

The **admin** (`src/admin/`) is a separate screen that edits `src/content/*.json` and
saves the changes to GitHub. GitHub then rebuilds and publishes the site.

## Folder by folder

| Folder / file | What it is |
|---|---|
| `index.html` | The one HTML page. Page title, tab icon, then loads `src/main.jsx`. |
| `vite.config.js` | Build settings (and the security policy added to the built page). |
| `package.json` | The project's list of tools and the `npm run ...` commands. |
| `.github/workflows/deploy.yml` | The robot that builds and publishes the site when `main` changes. |
| `public/` | Files copied as-is to the site: images, resume PDF, icons, `CNAME`, tab icons, and the curl easter egg files (`secret.txt`, `roll`, `jingle.wav`). |
| `cloudflare/curl-easter-egg/` | The small Cloudflare Worker + setup guide for the `curl` easter egg. |
| `scripts/validate-content.mjs` | Checks `src/content/` before every build. |
| `tests/` | The admin test with a pretend GitHub (`npm run test:e2e`) and the easter egg test (`npm run test:easter-egg`). |
| `docs/` | These guides. |

### `src/content/` — the editable content (JSON)

| File | Controls |
|---|---|
| `profile.json` | Name, job title, intro, photo, email, links, "current job" card, skills tags, certificate, resume PDF path |
| `projects.json` | Every project and live demo |
| `hobbies.json` | The Hobbies tile (title, caption, icons, colour) |
| `resume.json` | Jobs, education, certifications, skills |
| `writing.json` | Articles and link cards |
| `stickers.json` | The doodles stuck on each tile (icon, size, tilt, position) |
| `icons.json` | Your own uploaded icons |
| `schema.js` | The **rules** for all of the above (required fields, allowed colours...) |

### `src/sections/` — one file per tile
Each exports `{ id, title, icon, tone, stickers, Preview, Full }`.
`Preview` is what shows on the front page, `Full` is what shows when the tile is open.
`index.js` is the list of tiles in order.

### `src/components/`
| File | What it does |
|---|---|
| `BentoGrid.jsx` | Lays out all tiles; switches between front page and "one big tile + rail". |
| `Tile.jsx` | One tile, animating between its three modes. |
| `hoverLayout.js` | The numbers for "hovered tile grows, others make room". |
| `Header.jsx` | Top bar. |
| `DemoCard.jsx`, `DemoPreview.jsx` | The live-demo card and its pop-up preview window. |
| `doodles/icons.jsx` | **All built-in icons** (hand-drawn SVG). Add new ones here. |
| `doodles/Doodle.jsx` | Draws an icon by name. |
| `doodles/Stickers.jsx` | Draws the stickers on a tile. |
| `doodles/CustomIcons.jsx` | Lets uploaded icons work like built-in ones. |
| `ui/` | Small pieces: `Card`, `Button`, `Tags`, `ResumeDownload`. |

### `src/styles/`
`tokens.css` (colours, spacing, fonts) → `base.css` (page basics) → `bento.css` (tile grid) →
`ui.css` (buttons/cards/stickers) → `sections.css` (tile contents, demos).

### `src/admin/` — the admin screen

```
AdminApp.jsx            front door: checking / login / editor
admin.css               admin-only styles
context/AdminContext    shares the three hooks below with every admin screen
hooks/
  useSession.js         log in / log out (token)
  useSiteContent.js     the content you are editing (original vs draft), uploads, problems
  usePublisher.js       Publish, Undo and "is it live yet?"
  useFileEditor.js      tiny helper: read/change one content file
  useNoIndex.js         tells search engines to ignore the admin page
lib/                    plain helpers with no screens
  config.js             which repo/branch to edit, size limits
  token.js              where the token is remembered (this browser only)
  githubClient.js       talks to GitHub's web API
  publish.js            "save everything as ONE commit", undo, wait for the rebuild
  content.js            helpers for the JSON files
  files.js              prepare uploads (shrink images, check PDFs)
  sanitizeSvg.js        cleans uploaded/pasted SVG icons
fields/                 form pieces (text boxes, colour dots, icon picker, image picker, list editor)
editors/                one editor per area (Profile, Projects, Hobbies, Resume, Writing, Stickers, Icons)
components/             Login, Studio (layout + menu), PublishBar, PublishStatus
```

**To add a new editor:** write it in `editors/`, then add one line to `SECTIONS` in
`components/Studio.jsx`.

## How a change travels (admin)

1. You edit → only your **draft** changes (`useSiteContent`).
2. **Publish** → `usePublisher` → `publish.js` sends all changed files to GitHub as one commit.
3. The push to `main` starts `.github/workflows/deploy.yml`.
4. The workflow runs the content check, builds the site, and publishes it (about a minute).
5. The admin watches that run and shows **Live** when it succeeds.

## Common jobs

| I want to… | Do this |
|---|---|
| Change text/links/colours | Use the admin, or edit the JSON in `src/content/` |
| Add a new built-in icon | Add an entry in `src/components/doodles/icons.jsx` |
| Add a tile | See the note at the top of `src/sections/index.js` |
| Change the colours of the whole site | `src/styles/tokens.css` |
| Check the content for mistakes | `npm run validate` |
| Run the site on my computer | `npm install` then `npm run dev` |
| Test the admin | `npm run build`, serve it (`npx vite preview`), `npm run test:e2e` |
