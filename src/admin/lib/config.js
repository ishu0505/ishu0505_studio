/**
 * FILE: src/admin/lib/config.js
 * WHAT IT DOES
 *   Settings for the admin: which repo/branch it edits, commit message prefix, file size limits.
 *   If the repository is ever renamed, change OWNER / REPO here.
 */
export const OWNER = 'ishu0505';
export const REPO = 'ishu0505_studio';
export const BRANCH = 'main';
export const API = 'https://api.github.com';
export const DEPLOY_WORKFLOW_NAME = 'Deploy to GitHub Pages';
export const COMMIT_PREFIX = 'Admin: ';
export const EDIT_BRANCH = 'content-edits'; // used only if main is protected

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_PDF_BYTES = 5 * 1024 * 1024;
export const MAX_ICON_BYTES = 200 * 1024;
