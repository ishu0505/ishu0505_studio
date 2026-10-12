/**
 * FILE: src/data/writing.js
 * WHAT IT DOES
 *   Adapter: src/content/writing.json + turns image/link paths into real URLs.
 */
import data from '../content/writing.json';
import { resolveAsset } from '../utils/asset';

export const articles = data.articles.map((a) => ({
  ...a,
  image: a.image ? resolveAsset(a.image) : undefined,
  href: resolveAsset(a.href),
}));

export const writingLinks = data.links.map((l) => ({ ...l, href: resolveAsset(l.href) }));
