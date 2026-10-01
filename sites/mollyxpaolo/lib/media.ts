/** URL and naming helpers shared by the gallery components (client-safe: no env access). */
import type { Photo, Tone } from './types';

export type Variant = 'w480' | 'w1080' | 'w2048' | '4k' | 'original';
export type DownloadSize = '4k' | 'original';

/** Filename words per tone, as the downloads are named. */
export const TONE_FILE: Record<Tone, string> = {
  colour: 'colour',
  sepia: 'sepia',
  bw: 'black-and-white',
};

/** Average MB per photo by size and tone, from the upload dry run (5,252 objects, 6.71GB). */
export const AVG_MB: Record<DownloadSize, Record<Tone, number>> = {
  '4k': { colour: 1.37, sepia: 1.37, bw: 1.25 },
  original: { colour: 4.9, sepia: 5.4, bw: 3.2 },
};

export const ar = (p: Pick<Photo, 'w' | 'h'>) => p.w / p.h;

export function mediaUrl(base: string, p: Pick<Photo, 'id'>, tone: Tone, variant: Variant): string {
  const ext = variant === '4k' || variant === 'original' ? 'jpg' : 'webp';
  return `${base}${tone}/${variant}/${p.id}.${ext}`;
}

export function srcsetFor(base: string, p: Pick<Photo, 'id' | 'w'>, tone: Tone): string {
  return ([480, 1080, 2048] as const)
    .map((w) => `${mediaUrl(base, p, tone, `w${w}`)} ${Math.min(w, p.w)}w`)
    .join(', ');
}

/** "13:31" → "1:31 pm". */
export function clock(t: string | null): string {
  if (!t) return '';
  const [hh, m] = t.split(':').map(Number);
  const h = hh % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${hh >= 12 ? 'pm' : 'am'}`;
}

export function downloadName(p: Pick<Photo, 'n'>, tone: Tone, size: DownloadSize): string {
  return `MollyxPaolo-${String(p.n).padStart(3, '0')}-${TONE_FILE[tone]}-${size === '4k' ? '4K' : 'full'}.jpg`;
}
