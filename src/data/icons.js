/**
 * FILE: src/data/icons.js
 * WHAT IT DOES
 *   Adapter: turns src/content/icons.json (custom icons) into { name: url }.
 */
import data from '../content/icons.json';
import { resolveAsset } from '../utils/asset';

// Custom icons added through the admin: { name: url }
export const customIcons = Object.fromEntries(data.map((i) => [i.name, resolveAsset(i.file)]));
