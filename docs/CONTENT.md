# Adding content by hand (JSON)

Everything on the site comes from the files in `src/content/`. You can edit them here (a pull request) or
in the **admin** (`/#/admin`), which edits the very same files, so the two always agree.
Run `npm run validate` any time: it checks the files and explains any mistake in plain English.

## A project that is just a link
Add an object to the list in `src/content/projects.json` (new ones at the top show first):

```json
{
  "id": "my-project",
  "title": "My project",
  "category": "Machine Learning",
  "tech": "Python · PyTorch",
  "href": "https://github.com/ishu0505/my-project",
  "tone": "blue",
  "image": "assets/images/my-picture.jpg"
}
```
`id` must be unique. `tone` is one of: blue, yellow, pink, mint, lilac, peach, white, cream.
`image` is optional (the file must be in `public/assets/images/`).

## A project with several buttons (GitHub + PyPI, Explained simply, ...)
Add `hrefLabel` (name of the main button) and a `links` list:

```json
{
  "id": "ocr-my-gpu",
  "title": "ocr_my_gpu",
  "category": "GPU Benchmark · Phase 2",
  "tech": "Python · SGLang vs vLLM · Qwen3-VL · RTX 4060 8GB",
  "href": "https://github.com/ishu0505/ocr_my_gpu",
  "hrefLabel": "GitHub",
  "links": [{ "label": "Explained simply", "href": "explainers/ocr-my-gpu/" }],
  "tone": "yellow",
  "image": "assets/images/ocr-my-gpu-thumb.svg"
}
```
In the admin: *Projects & demos* → open the project → **Main button name** and **Extra buttons**.

> **Front-page Projects tile preview:** The first **two** projects in `src/content/projects.json` that have an `"image"` field are shown as the two overlapping square thumbnails on the main page **Projects** tile (currently `ocr-my-gpu-thumb.svg` and `tokenjuggler-thumb.svg`). You can change or reorder them anytime in `/#/admin` (*Projects & demos*).

## A private / confidential project (link to a write-up only)
Point `href` at the public write-up and say it is private in `category`; share nothing else:

```json
{
  "id": "adaptive-fraud-detection",
  "title": "Adaptive Fraud Detection",
  "category": "Private project",
  "tech": "Self-improving ML fraud detection · read the write-up on Medium",
  "href": "https://medium.com/...",
  "tone": "peach"
}
```

## A live demo
See [DEMOS.md](DEMOS.md) (`"kind": "demo"` plus a `demo` section).

## An article
Add an object to `articles` in `src/content/writing.json`. The picture is optional:

```json
{
  "id": "my-article",
  "title": "My article title",
  "category": "Fraud detection · ML",
  "date": "Oct 12, 2026",
  "summary": "One or two sentences about it.",
  "href": "https://medium.com/...",
  "tone": "mint"
}
```
Add `"image": "assets/images/cover.jpg"` for a cover picture.

> **Front-page Articles & Blogs tile headline:** The very first article (`articles[0]`) in `src/content/writing.json` is displayed as the main headline on the front-page **Articles & Blogs** tile (currently `tokenjuggler-explained`). Reorder articles with the ↑ ↓ buttons in `/#/admin` (*Writing*) to change which headline appears on the front page.

## Front-page layout presets (`profile.json`)
Set `"layout"` in `src/content/profile.json` (or pick a preset card under `/#/admin` → *About & contact* → **Front-page layout**):
- `"projects-first"` *(default — Option 1)*: **Projects** (`2×2` top-left hero), **Articles & Blogs** (`2×1` bottom-left), **Profile** (`2×1` top-right horizontal banner), **Resume** (`1×2`), **Hobbies** (`1×1`), **Contact** (`1×1`).
- `"profile-top-left"` *(Option 2)*: **Profile** (`2×1` top-left), **Articles & Blogs** (`2×1` mid-left), **Projects** (`2×2` top-right hero), **Resume** (`2×1` bottom-left), **Hobbies** (`1×1`), **Contact** (`1×1`).
- `"dual-showcase"` *(Option 3)*: Top row of `1×1` compact tiles (**Profile**, **Resume**, **Hobbies**, **Contact**) above side-by-side `2×2` **Projects** and `2×2` **Articles & Blogs** hero tiles.
- `"classic"`: Original layout with **Profile** (`2×2` top-left), **Projects** (`2×1` top-right), **Resume** (`1×2`), **Hobbies** (`1×2`), **Articles & Blogs** (`1×1`), **Contact** (`1×1`).

## Where the same thing lives in the admin
| File | Admin screen |
|---|---|
| `projects.json` | Projects & demos |
| `writing.json` | Writing |
| `hobbies.json` | Hobbies |
| `resume.json`, resume PDF | Resume |
| `profile.json` (including `"layout"` preset) | About & contact |
| `stickers.json` | Stickers |
| `icons.json` | Icons |

## Hosting your own interactive page

Any folder in `public/` is published as-is:
- **`tokenjuggler` explainer:** `public/explainers/tokenjuggler/index.html` → linked from JSON as `explainers/tokenjuggler/`
- **`ocr_my_gpu` explainer:** `public/explainers/ocr-my-gpu/index.html` → linked from JSON as `explainers/ocr-my-gpu/`

To add another interactive explainer, copy one of those folders under `public/explainers/`, edit the HTML, and add a project button or article in `src/content/` (or via `/#/admin`) pointing to `explainers/<your-folder>/`.
