# Medium draft: tokenjuggler, explained like you're five

How to use this file: open a new Medium story, paste the title and text below, and put
each GIF where you see `[GIF: …]` (upload the file from `docs/medium/gifs/`; Medium
accepts GIFs via the "+" image button). Where it says `[LINK: …]`, paste the URL on its
own line and press Enter so Medium turns it into a card.

Live interactive page (after this PR is merged and deployed):
https://ishu0505.tech/explainers/tokenjuggler/

---

## Title
How my Python package juggles GPT, Gemini and Claude (explained like you're five)

## Subtitle
Three ice-cream shops, one helpful juggler, and a lot of "sorry, too busy".

---

Every AI provider limits how much you can ask per minute. Hit the limit and the answer
is a flat "429: too busy". If your app talks to GPT, Gemini and Claude, through several
providers each (OpenAI, AWS Bedrock, Vertex, Databricks…), you end up hand-writing the
same "try the next one" code again and again.

So I built **tokenjuggler**, a Python package that does the juggling for you.

[LINK: https://pypi.org/project/tokenjuggler/]
[LINK: https://github.com/ishu0505/token_juggler]

Here is how it works, the way I'd explain it to a five-year-old.

### The ice-cream shops

Imagine your app is hungry for ice cream (an AI answer). There are lots of shops that
sell the same flavour. Each shop only has so many seats, and the seats come back slowly.
If you walk into a full shop, it says "No".

The **model** is the flavour you want (like `gpt-5.6-sol`). A **deployment** is one
shop's door to it (like `gpt-5.6-sol@bedrock`), with its own seats and its own price.

tokenjuggler is the friend who walks in first and asks: "Who has room?"

### Save a seat before you sit

Before every call, tokenjuggler saves a seat for the request count, the input tokens
and the longest answer you allow (`max_output_tokens`). That way the answer can never be
bigger than the seat. And the choosing and the seat-saving happen in one go, as a single
Redis script, so five calls at once can never grab the same seat.

[GIF: shops-and-failover.gif — send calls, make Shop A grumpy, watch the next shop take over]

### When a shop says "too busy"

If a shop answers 429 (or 5xx, or times out), tokenjuggler does not knock on the same
door again. It moves to the next deployment, then to the model's `fallbacks` if you
listed any. A 429 also puts that shop "to rest" for as long as it asked (`Retry-After`),
so nobody wastes calls on it. If every shop is simply full, the call waits for the first
free seat (`max_wait_seconds`).

[GIF: follow-one-call.gif — one call, step by step]

Every try goes in a notebook: tokens, cost, speed and what happened, per project and per
shop. So you can finally answer "where did the money go?".

### Bucket or window?

"100 per 10 seconds" can be counted two ways. A **token bucket** (the default) refills
continuously and lets you pour a whole bucket at once, so in a rolling window you can
briefly reach about 2x. A **sliding window** is strict and never goes over. tokenjuggler
supports both, plus a safety margin (`headroom`, 0.95 by default).

[GIF: bucket-vs-window.gif — drag the burst size and watch the two lines]

### Sharing one pizza

Many projects can share the same provider accounts. Give each a **cap** (the most it may
use) and a **reserve** (a slice kept just for it, which can be lent out while it is idle).

### Try it

```bash
uv add "tokenjuggler[openai,gemini,anthropic]"
uv run tokenjuggler init -t minimal
uv run tokenjuggler check
```

```python
import tokenjuggler as juggle

tj = juggle.from_config("tokenjuggler.yaml", project="search-svc")
r = await tj.generate("gpt-5.6-sol", "Summarise this", max_output_tokens=2000)
print(r.text, r.deployment, r.cost_usd)
```

**Play with it yourself:** the toys above are live and clickable here:

[LINK: https://ishu0505.tech/explainers/tokenjuggler/]

Needs Python 3.12+. Source and docs: GitHub and PyPI links at the top.

---

## Notes for you (delete before posting)
- Medium cannot run JavaScript, so the GIFs show the toys and the link opens the real
  thing. Medium also embeds CodePen, JSFiddle and GitHub Gist links if you paste their
  URL on its own line. To use CodePen, create a Pen and paste the HTML, CSS and JS from
  `public/explainers/tokenjuggler/index.html` into its three panes, then paste the Pen
  URL here. I can't create the Pen for you (it needs your account).
- The GIFs were recorded in a sandbox with no internet, so they use fallback fonts
  instead of the hand-drawn Google fonts on the live page. Re-record them from the live
  page if you want them to match exactly.
- Check every claim against your README; the PyPI page of v0.1.0 looked out of date.
