/**
 * FILE: cloudflare/curl-easter-egg/worker.js
 *
 * WHAT IT DOES
 *   A tiny Cloudflare Worker that sits in front of the website.
 *     - A person in a browser            -> gets the normal website (nothing changes).
 *     - A command-line tool (curl, wget)
 *       asking for the home page "/"     -> gets the text in public/secret.txt instead
 *                                           (the easter egg banner).
 *     - Everything else (including /roll and /jingle.wav) passes straight through.
 *
 * HOW IT KNOWS: command-line tools announce themselves in the "User-Agent" header
 *   (curl sends "curl/8.x"). Browsers send something else.
 *
 * HOW TO DEPLOY: see cloudflare/curl-easter-egg/README.md
 */

// Words that mean "this is a command-line tool, not a browser".
const COMMAND_LINE_TOOLS = ['curl', 'wget', 'httpie'];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const isCommandLine = COMMAND_LINE_TOOLS.some((tool) => userAgent.includes(tool));
    const isHomePage = url.pathname === '/' || url.pathname === '';

    if (isCommandLine && isHomePage && request.method === 'GET') {
      // Fetch the banner file from the website itself.
      const banner = await fetch(new URL('/secret.txt', url.origin).toString(), {
        headers: { 'user-agent': 'easter-egg-worker' },
      });
      if (banner.ok) {
        return new Response(await banner.text(), {
          headers: {
            'content-type': 'text/plain; charset=utf-8',
            'cache-control': 'no-store',
            vary: 'User-Agent',
          },
        });
      }
      // If the banner is missing for some reason, fall through to the normal page.
    }

    return fetch(request); // everyone else: the normal website
  },
};
