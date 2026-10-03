/**
 * FILE: src/admin/lib/files.js
 * WHAT IT DOES
 *   Prepare files for upload: read as base64, shrink images, check PDFs and PNG icons.
 *   Every function throws an Error with a friendly message when a file is not acceptable.
 */
import { MAX_ICON_BYTES, MAX_IMAGE_BYTES, MAX_PDF_BYTES } from './config';

export function readAsBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(blob);
  });
}

export const textToBase64 = (text) => {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin);
};

export const dataUrl = (mime, base64) => `data:${mime};base64,${base64}`;
export const approxBytes = (base64) => Math.floor((base64.length * 3) / 4);

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('That file could not be read as an image.'));
    img.src = url;
  });

/** Photos are shrunk to max 1600px wide so the repo (and the site) stay light. */
export async function prepareImage(file) {
  if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) throw new Error('Use a PNG, JPG or WebP image.');
  if (file.size > MAX_IMAGE_BYTES * 3) throw new Error('That image is very large. Pick one under 15 MB.');
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const maxW = 1600;
    const scale = Math.min(1, maxW / img.width);
    let mime = file.type === 'image/jpg' ? 'image/jpeg' : file.type;
    let ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
    let base64;
    if (scale < 1 || file.size > MAX_IMAGE_BYTES) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      if (mime === 'image/png' && file.size > MAX_IMAGE_BYTES) {
        mime = 'image/jpeg';
        ext = 'jpg';
      }
      const blob = await new Promise((res) => canvas.toBlob(res, mime, 0.86));
      base64 = await readAsBase64(blob);
    } else {
      base64 = await readAsBase64(file);
    }
    if (approxBytes(base64) > MAX_IMAGE_BYTES) throw new Error('That image is still over 5 MB after shrinking. Try a smaller one.');
    return { base64, mime, ext };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function preparePdf(file) {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) throw new Error('Please choose a PDF file.');
  if (file.size > MAX_PDF_BYTES) throw new Error('That PDF is over 5 MB. Compress it and try again.');
  const base64 = await readAsBase64(file);
  if (!atob(base64.slice(0, 12)).startsWith('%PDF')) throw new Error('That file does not look like a real PDF.');
  return { base64, mime: 'application/pdf' };
}

export async function preparePngIcon(file) {
  if (file.type !== 'image/png') throw new Error('Use an SVG or a PNG file.');
  if (file.size > MAX_ICON_BYTES) throw new Error('That icon is over 200 KB. Use a smaller image.');
  const base64 = await readAsBase64(file);
  return { base64, mime: 'image/png' };
}
