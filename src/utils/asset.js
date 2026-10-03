// Resolve a file in /public against the configured Vite base,
// so links keep working on github.io/<repo>/ and on a custom domain.
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

// Content files store local files as paths ("assets/images/x.jpg") and
// external links as full URLs. This turns either into something usable in the page.
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i;
export const resolveAsset = (value) => (EXTERNAL.test(value) ? value : asset(value));
