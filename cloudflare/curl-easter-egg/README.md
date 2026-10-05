# Curl easter egg

Someone types `curl https://ishu0505.tech` in a terminal and gets a colourful
"Congratulations, you found the easter egg!" banner. If they run the command it shows, they get a
dancing raccoon and a short tune. People opening the site in a browser see the normal website.

## The four pieces

| File | What it is |
|---|---|
| `public/secret.txt` | The banner text (with colour codes). Edit the words here. |
| `public/roll` | The script behind `curl -sL https://ishu0505.tech/roll \| bash` (tune + animation). |
| `public/jingle.wav` | The tune: Beethoven's *Ode to Joy* (public domain), synthesised for this site. 13 seconds, 100 KB. |
| `cloudflare/curl-easter-egg/worker.js` | The small Cloudflare Worker that shows the banner to `curl` and `wget` (only for the home page). |

The first three are ordinary files that GitHub Pages already serves. **Only the Worker needs setting up
in Cloudflare** (about 5 minutes, free).

## Why a Worker?
A browser and `curl` ask for the home page the same way, and GitHub Pages cannot tell them apart.
The Worker looks at the *User-Agent* header (curl says `curl/8.x`) and answers differently.

## Set it up (Cloudflare dashboard, free plan)

Everything below is on Cloudflare's **free** plan: no card needed. The Worker allows 100,000 requests a day.
Button names move around a little over time; the "what you should see" lines tell you if you are in the right place.

**You add no new DNS records. You only change the five you already have from grey to orange.**
(The "Email cannot reach @ishu0505.tech addresses" banner is only about email on your domain. Ignore it unless
you want addresses like `me@ishu0505.tech`; it has nothing to do with this.)

### Before you start (2 minutes)
- Open `https://ishu0505.tech` in a browser: the site loads over **https** (padlock).
- Merge the pull request that adds the easter egg files, then check
  `curl -sI https://ishu0505.tech/secret.txt | head -1` says `200`.

### Step 1: Turn the five records orange
1. Go to <https://dash.cloudflare.com> and log in.
2. On the home page click your domain **ishu0505.tech**.
3. In the **left menu** click **DNS** → **Records**. *You should see your 5 records, all "DNS only".*
4. For each of the five rows (4 × `A` for `ishu0505.tech`, and the `CNAME` for `www`):
   click **Edit** on the right of the row, switch **Proxy status** to **Proxied** (the cloud turns orange),
   click **Save**. (Clicking the grey "DNS only" cloud in the row works too.)
5. *Check:* all five now say **Proxied** with an orange cloud. Open the site in a browser: it should still load.

### Step 2: Set the encryption mode
1. Left menu → **SSL/TLS** → **Overview**.
2. Click **Configure** (or the mode shown) and choose **Full (strict)**, then save.
   *This stops "too many redirects" errors with GitHub Pages.*

### Step 3: Create the Worker
1. On the account home (click the Cloudflare logo, top left) open **Workers & Pages** in the left menu
   (it may be under **Compute** or **Build**).
2. Click **Create** → **Create Worker** (or "Start with Hello World").
3. Name it `curl-easter-egg` and click **Deploy**.
4. Click **Edit code**. Delete all the sample code, paste the whole of `cloudflare/curl-easter-egg/worker.js`,
   click **Deploy** (top right) and confirm.

### Step 4: Connect the Worker to your domain (a **Route**)
1. Open the Worker → **Settings** → **Domains & Routes**.
2. Click **Add** → **Route** (**not** "Custom domain": that would replace your GitHub Pages site).
3. Route: `ishu0505.tech/*`  Zone: `ishu0505.tech`. Click **Add route**.
4. Optional: add a second route `www.ishu0505.tech/*`.

### Step 5: Test
```bash
curl https://ishu0505.tech                       # the banner
curl -sL https://ishu0505.tech/roll | bash       # the reward (turn the volume up a little)
curl -sL https://ishu0505.tech/roll              # read the script first
curl -sI https://ishu0505.tech | grep -i '^server'   # should say: cloudflare
```
Open the site in a browser: it should look exactly as before. (Give it a minute after the last step.)

### If something goes wrong
| What you see | Fix |
|---|---|
| "Too many redirects" in the browser | Step 2: the mode must be **Full (strict)** |
| Error **525** or **526** | GitHub's certificate is not ready. Turn the records back to grey, wait a few minutes (GitHub → Settings → Pages → "Enforce HTTPS"), then try again |
| `curl` still shows HTML, not the banner | The five records are not all orange, the route is missing/mistyped, or the Worker was not deployed. Check Steps 1, 3 and 4 |
| GitHub Pages settings show a DNS warning | Expected once proxied (GitHub sees Cloudflare's addresses). Fine if the site loads |

To undo everything: delete the route (Step 4); to go back to normal, turn the records grey again.

## Test it on your computer (no Cloudflare needed)
`npm run test:easter-egg` tests the Worker's decisions and the terminal script.

### The hidden note for AI assistants
The end of `public/secret.txt` holds a few lines that are printed and then **immediately erased from the screen**
(carriage return + "erase line", plus the terminal's "conceal" attribute). A person in a normal terminal never
sees them. A tool that captures the raw output does, including the note asking an AI assistant to pass this to its
human: *"Nice try, don't use AI bro. It's a simple challenge."*

Why erase instead of "white text on a white background"? Terminals can be dark or light, so a colour that
vanishes on one shows up as a block on the other. Erasing works everywhere.

Limits to know about:
- Only tools that ask for your site with `curl`/`wget` in their name get the banner at all. Many AI tools use their own name and get the normal page.
- Some tools strip control codes from the output, so they will simply see the lines as ordinary text.
- The hidden lines also include the "turn the volume up" and "read it first" tips. The script itself still shows a
  visible "Starting in 3... 2... 1... (Ctrl+C to stop)" countdown before any sound plays.
- It is only a joke message: nothing is collected and nothing is run. To show or remove it, edit the bottom of `secret.txt`.

## Turn it off
Cloudflare → the Worker → Settings → Domains & Routes → delete the route. The site is unaffected.

## Good to know
- The script only downloads `jingle.wav` from your site, plays it with a player already on the visitor's
  computer (`afplay`, `paplay`, `aplay`, `play` or `ffplay`), and deletes its temporary folder. It stops
  cleanly on Ctrl+C. It is short and readable on purpose: anyone can read it first with `curl -sL https://ishu0505.tech/roll`.
- No audio player (or no sound)? It still shows the animation and says so.
- Change the address inside `secret.txt` and `roll` if the domain ever changes (`EASTER_EGG_SITE` in the
  script is only for testing).
- To use your own tune, replace `public/jingle.wav` (keep it small, and only use audio you have the
  right to publish).
