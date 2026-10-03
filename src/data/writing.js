import data from '../content/writing.json';
import { resolveAsset } from '../utils/asset';

export const articles = data.articles.map((a) => ({
  ...a,
  image: resolveAsset(a.image),
  href: resolveAsset(a.href),
}));

export const writingLinks = data.links.map((l) => ({ ...l, href: resolveAsset(l.href) }));
