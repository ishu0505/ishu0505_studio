// Resolve a file in /public against the configured Vite base,
// so links keep working on github.io/<repo>/ and on a custom domain.
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
