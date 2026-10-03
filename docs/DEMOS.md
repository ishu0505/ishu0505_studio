# Live demos

A **demo** is a project that runs somewhere else (Streamlit, Hugging Face, AWS, DigitalOcean, another GitHub repo...).
This website only **links** to it, so each demo keeps its own repo, its own build and its own hosting.

## Add a demo (admin)
Projects & demos → *Add project* → **Type: Live demo**, then fill in:

| Field | Meaning |
|---|---|
| Main link | Where the card itself goes (often the repo or a write-up) |
| Demo address | The running app |
| Code repository | Optional "Code ↗" button |
| Hosted on | Shows a badge (Streamlit, Hugging Face, AWS, DigitalOcean, Vercel, Netlify, Render, GitHub Pages, Other) |
| Show a preview window | Adds a **Preview** button that opens the demo inside the page |
| Note | Small italic text, e.g. "Free tier: first load can take a minute." |

The same thing in JSON (`src/content/projects.json`):

```json
{
  "id": "image-captioner",
  "title": "Image captioner",
  "category": "Demo",
  "tech": "PyTorch · Streamlit",
  "href": "https://github.com/ishu0505/image-captioner",
  "tone": "mint",
  "kind": "demo",
  "demo": {
    "url": "https://image-captioner.streamlit.app",
    "repoUrl": "https://github.com/ishu0505/image-captioner",
    "host": "streamlit",
    "embed": true,
    "note": "Free tier: the first load can take a minute."
  }
}
```

## How a demo is built and deployed
Each demo has **its own repository** with its own automation:

- **Streamlit Community Cloud:** connect the demo repo; every push redeploys.
- **Hugging Face Spaces:** push the app to a Space; it builds automatically.
- **AWS / DigitalOcean:** deploy from the demo repo with its own GitHub Actions workflow (build image, push, restart).
- **Another static site:** GitHub Pages in that repo.

Nothing in this portfolio repo has to change when a demo redeploys; the link stays the same.

## About the preview window
- It uses an `<iframe>`. Some hosts forbid being shown inside another site; then the preview stays blank.
  The **Live demo** button always works, and the preview window has an "Open in new tab" link.
- The site's security policy allows previews from any `https://` address.
- Free tiers (Streamlit, Hugging Face, Render...) go to sleep. The first visit can take up to a minute;
  put that in the **Note**.
- Previews run in a restricted sandbox (scripts, forms and pop-ups allowed; no access to this site).
