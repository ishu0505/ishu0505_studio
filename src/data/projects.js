import data from '../content/projects.json';
import { resolveAsset } from '../utils/asset';

export const projects = data.map((p) => ({
  ...p,
  image: p.image ? resolveAsset(p.image) : undefined,
  href: resolveAsset(p.href),
}));
