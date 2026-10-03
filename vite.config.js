import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base + hash routing lets the build work from any URL
// (github.io/<repo>/, a custom domain, or a local preview).
export default defineConfig({
  base: './',
  plugins: [react()],
});
