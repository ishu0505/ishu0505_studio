import data from '../content/profile.json';
import { resolveAsset } from '../utils/asset';

// Content lives in src/content/profile.json (edited by hand or via the admin).
export const profile = {
  ...data,
  avatar: resolveAsset(data.avatar),
  resume: { url: resolveAsset(data.resume.path), filename: data.resume.filename },
};
