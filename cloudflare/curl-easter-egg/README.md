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

## Set it up (Cloudflare dashboard)
Button names move around a little over time; the idea stays the same.

**You do not add any new DNS records. You only change the ones you already have from grey to orange.**

1. **Switch the existing records to "Proxied" (orange cloud).** Workers only run on proxied traffic.
   Cloudflare → `ishu0505.tech` → **DNS → Records**, then click the grey cloud so it turns orange on:
   - the four `A` records named `@` (185.199.108.153, .109.153, .110.153, .111.153)
   - the `www` `CNAME` (pointing at `ishu0505.github.io`), if you have one
   - any `AAAA` records for `@` (the IPv6 versions of the GitHub addresses), if you added them
   Leave everything else alone (`MX`, `TXT`, etc. cannot and should not be proxied). Click **Save** on each.
2. **SSL/TLS → Overview →** set the mode to **Full (strict)** (avoids redirect loops with GitHub Pages).
3. **Workers & Pages → Create → Create Worker.** Name it `curl-easter-egg` → **Deploy**.
4. Click **Edit code**, delete the sample, paste everything from `worker.js`, then **Deploy**.
5. Open the Worker → **Settings → Domains & Routes → Add → Route.**
   Route: `ishu0505.tech/*`   Zone: `ishu0505.tech`   → **Add route**.
   (Optional second route: `www.ishu0505.tech/*`.)

The free plan allows 100,000 requests a day, far more than a portfolio needs.

**Order that works best:** merge the pull request first (so `secret.txt`, `roll` and `jingle.wav` are live),
then do the Cloudflare steps. Check the files exist:
`curl -sI https://ishu0505.tech/secret.txt | head -1` should say `200`.

**After proxying:** `curl -sI https://ishu0505.tech | grep -i '^server'` should now say `cloudflare`.
GitHub's Pages settings page may show a warning about DNS, because it now sees Cloudflare's addresses
instead of GitHub's. If the site loads, that is expected. If you ever see a certificate problem, set the
records back to grey (DNS only) for a few minutes, let GitHub renew its certificate, then switch back.

## Test it
```bash
curl https://ishu0505.tech                       # the banner
curl -sL https://ishu0505.tech/roll | bash       # the reward (turn the volume up a little)
curl -sL https://ishu0505.tech/roll              # read the script first
```
Open the site in a browser: it should look exactly as before.

The banner also has a short, visible note asking AI assistants to pass a joke message to their human.
It is plain text in `public/secret.txt`; edit or delete it any time.

On your own computer, before publishing, you can run the checks:
`npm run test:easter-egg` (tests the Worker's decisions and the script, with no Cloudflare needed).

## Turn it off
Cloudflare → the Worker → Settings → Domains & Routes → delete the route. The site is unaffected.

## Good to know
- The script only downloads `jingle.wav` from your site, plays it with a player already on the visitor's
  computer (`afplay`, `paplay`, `aplay`, `play` or `ffplay`), and deletes its temporary folder. It stops
  cleanly on Ctrl+C. It is short and readable on purpose, and the banner tells people how to read it first.
- No audio player (or no sound)? It still shows the animation and says so.
- Change the address inside `secret.txt` and `roll` if the domain ever changes (`EASTER_EGG_SITE` in the
  script is only for testing).
- To use your own tune, replace `public/jingle.wav` (keep it small, and only use audio you have the
  right to publish).
