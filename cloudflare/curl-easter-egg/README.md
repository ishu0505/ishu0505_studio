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

1. **Turn the orange cloud on** (Workers only run on proxied traffic).
   Cloudflare → `ishu0505.tech` → **DNS → Records**. For the four `A` records and the `www` record,
   click the grey cloud so it turns **orange (Proxied)**, then **Save**.
2. **SSL/TLS → Overview →** set the mode to **Full (strict)** (avoids redirect loops with GitHub Pages).
3. **Workers & Pages → Create → Create Worker.** Name it `curl-easter-egg` → **Deploy**.
4. Click **Edit code**, delete the sample, paste everything from `worker.js`, then **Deploy**.
5. Open the Worker → **Settings → Domains & Routes → Add → Route.**
   Route: `ishu0505.tech/*`   Zone: `ishu0505.tech`   → **Add route**.
   (Optional second route: `www.ishu0505.tech/*`.)

The free plan allows 100,000 requests a day, far more than a portfolio needs.

## Test it
```bash
curl https://ishu0505.tech                       # the banner
curl -sL https://ishu0505.tech/roll | bash       # the reward (turn the volume up a little)
curl -sL https://ishu0505.tech/roll              # read the script first
```
Open the site in a browser: it should look exactly as before.

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
