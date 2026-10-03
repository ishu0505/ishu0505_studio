# Using the admin

Open **`https://ishu0505.tech/#/admin`** (works on your phone too).

## First time: create a token

A *token* is a long password that lets the admin save changes to your GitHub repository.
It is **never stored in the website's code**: you paste it into the admin on your own device.

1. Go to <https://github.com/settings/personal-access-tokens/new>.
2. **Token name:** `site admin`. **Expiration:** 90 days is a good choice (maximum 1 year).
3. **Repository access:** *Only select repositories* → `ishu0505/ishu0505_studio`.
4. **Permissions → Repository permissions:**
   - **Contents: Read and write** (needed to save)
   - **Actions: Read-only** (optional: lets the admin show when the site is live)
5. **Generate token**, copy it (starts with `github_pat_`), and paste it into the admin login.
6. Optional: type the expiry date in the login box and the admin will remind you a week before.

Tips: keep the token in a password manager. Never paste it in chat, email or the repo.
If you lose or leak it: delete it at <https://github.com/settings/personal-access-tokens> and make a new one.

## Day to day

- **Left menu:** About & contact, Projects & demos, Hobbies, Resume, Writing, Stickers, Icons.
- A **pink dot** on a menu item means it has unpublished changes.
- Click an item to open it; use ↑ ↓ to reorder, ⧉ to duplicate, ✕ to delete.
- Nothing goes live until you press **Publish** (bottom bar). It saves everything as **one** change.
- After publishing, the bar says *Saved… rebuilding* and then **Live** (about a minute).
- **Discard** throws away unpublished edits. **Undo last publish** takes back your latest publish.
- If the bar shows a red "thing to fix", Publish stays off until you fix it.

## Resume PDF
Resume → *Upload new resume PDF*. The new file replaces the old one at the same address, so the
Download button needs no change. Max 5 MB.

## Pictures
Pick an existing picture or *Upload new*. Big photos are shrunk to 1600 px wide automatically.

## Icons and stickers
- **Icons → Add your own icon:** upload an SVG/PNG or paste SVG code. It then shows up in every icon picker.
- **Stickers:** pick a tile, add/remove stickers, drag them in the preview, or type exact numbers.
  Positions are pixels (`-20`) or percentages (`15%`).

## Live demos
In *Projects & demos* set **Type → Live demo**. See [DEMOS.md](DEMOS.md).

## Safety
- Anyone can open the admin page, but without your token it can do nothing.
- The token can only touch this one repository and stops working on its expiry date.
- Your edits are checked before publishing, and again by the build. A bad edit can never replace the live site.
- Every publish is a normal Git commit starting with `Admin:`, so there is a full history.

## Troubleshooting
| Message | Meaning / fix |
|---|---|
| "GitHub rejected this token" | Wrong, expired or revoked token. Make a new one. |
| "This token can read the repository but not change it" | Give it *Contents: Read and write*. |
| "changed by someone else" | Someone (or a pull request) changed the same file. Press *Reload latest* and redo your edit. |
| "The rebuild failed" | The old site is still online. Open the details link, or use *Undo last publish*. |
| "main only takes pull requests" | The admin opened a pull request instead; merge it on GitHub to publish. |
