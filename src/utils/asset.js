/**
 * FILE: src/utils/asset.js
 * WHAT IT DOES
 *   Turns a file path into a working URL:
 *     asset('assets/x.jpg')        -> a file in /public (works on github.io/<repo>/ and custom domains)
 *     resolveAsset(value)         -> same, but leaves full links (https:, mailto:) untouched
 */
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

// Content files store local files as paths ("assets/images/x.jpg") and
// external links as full URLs. This turns either into something usable in the page.
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i;
export const resolveAsset = (value) => (EXTERNAL.test(value) ? value : asset(value));
