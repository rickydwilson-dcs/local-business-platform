/**
 * Image stub for showcase — returns placeholder URLs.
 * Core components import from @/lib/image; this satisfies that import.
 */

export function getImageUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `https://placehold.co/1200x800/e5e7eb/6b7280?text=${encodeURIComponent('Showcase')}`;
}

export function generateImageAlt(
  serviceName: string,
  _locationName?: string,
  customAlt?: string,
  _brandName?: string
): string {
  return customAlt ?? `${serviceName} — Showcase`;
}

export function generateImageTitle(
  serviceName: string,
  _locationName?: string,
  customTitle?: string,
  _brandName?: string
): string {
  return customTitle ?? `${serviceName} — Showcase`;
}

export function getImageSizes(layout: 'full' | 'half' | 'third' | 'card'): string {
  const sizeMap = {
    full: '100vw',
    half: '(max-width: 768px) 100vw, 50vw',
    third: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  };
  return sizeMap[layout];
}

export function isValidImagePath(path: string | undefined | null): path is string {
  if (!path || typeof path !== 'string') return false;
  if (path.startsWith('http://') || path.startsWith('https://')) return true;
  const exts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];
  return exts.some(ext => path.toLowerCase().endsWith(ext));
}
