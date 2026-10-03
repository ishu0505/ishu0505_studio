/**
 * FILE: vite.config.js
 * WHAT IT DOES
 *   Settings for the build tool (Vite).
 *   - base './'  : the built site works from any address (github.io/<repo>/ or a custom domain).
 *   - CSP        : a Content-Security-Policy is added to the BUILT page (not in `npm run dev`).
 *                  It limits where the page may load code from and where it may send data,
 *                  which protects the admin token even if something went wrong elsewhere.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'", // React/Framer Motion set inline styles
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.github.com", // the admin talks to GitHub, nothing else
  "frame-src https:", //                          live-demo previews + the contact form
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://docs.google.com",
].join('; ');

function addContentSecurityPolicy() {
  return {
    name: 'add-content-security-policy',
    apply: 'build',
    transformIndexHtml: (html) => html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}">`),
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), addContentSecurityPolicy()],
});
