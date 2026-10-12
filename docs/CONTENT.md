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

## A project with several buttons (GitHub + PyPI, docs, ...)
Add `hrefLabel` (name of the main button) and a `links` list:

```json
{
  "id": "tokenjuggler",
  "title": "tokenjuggler",
  "category": "Open source · on PyPI",
  "tech": "Python · Redis · GPT, Gemini & Claude",
  "href": "https://github.com/ishu0505/token_juggler",
  "hrefLabel": "GitHub",
  "links": [{ "label": "PyPI", "href": "https://pypi.org/project/tokenjuggler/" }],
  "tone": "mint"
}
```
In the admin: *Projects & demos* → open the project → **Main button name** and **Extra buttons**.

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

## Where the same thing lives in the admin
| File | Admin screen |
|---|---|
| `projects.json` | Projects & demos |
| `writing.json` | Writing |
| `hobbies.json` | Hobbies |
| `resume.json`, resume PDF | Resume |
| `profile.json` | About & contact |
| `stickers.json` | Stickers |
| `icons.json` | Icons |

## Hosting your own interactive page

Any folder in `public/` is published as-is. The tokenjuggler explainer lives in
`public/explainers/tokenjuggler/index.html` and is linked from JSON with the plain path
`explainers/tokenjuggler/` (as a project button or an article `href`). To add another one,
copy that folder, edit the HTML, and add a card that points at the new folder.
