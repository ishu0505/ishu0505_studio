/**
 * FILE: src/data/profile.js
 * WHAT IT DOES
 *   Adapter: src/content/profile.json + turns file paths into real URLs. Edit the JSON (or use the admin), not this file.
 */
import data from '../content/profile.json';
import { resolveAsset } from '../utils/asset';

// Content lives in src/content/profile.json (edited by hand or via the admin).
export const profile = {
  ...data,
  avatar: resolveAsset(data.avatar),
  resume: { url: resolveAsset(data.resume.path), filename: data.resume.filename },
};
