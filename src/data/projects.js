/**
 * FILE: src/data/projects.js
 * WHAT IT DOES
 *   Adapter: src/content/projects.json + turns image paths into real URLs.
 */
import data from '../content/projects.json';
import { resolveAsset } from '../utils/asset';

export const projects = data.map((p) => ({
  ...p,
  image: p.image ? resolveAsset(p.image) : undefined,
  href: resolveAsset(p.href),
}));
