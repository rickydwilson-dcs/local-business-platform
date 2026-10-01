export const TONES = ['colour', 'sepia', 'bw'] as const;
export type Tone = (typeof TONES)[number];

export type PhotoState = 'shown' | 'featured' | 'hidden';

/** One photo as committed in content/photos.json. */
export interface Photo {
  id: string;
  n: number;
  album: string;
  /** Capture time of day, "HH:MM", or null when the file had no EXIF time. */
  t: string | null;
  w: number;
  h: number;
  /** The photographer's seed: the enhanced ten. Curation overrides it. */
  featured: boolean;
  enhanced: boolean;
  /** Safe behind the hero title (no baked-in lettering, not a collage). */
  heroOk: boolean;
  /** 16px blurred WebP data URIs, one per tone. */
  ph: Record<Tone, string>;
}

export interface Chapter {
  id: string;
  title: string;
  kicker: string;
  from: string;
  to: string;
  blurb: string;
}

/** A photo as the gallery page receives it: curation applied, chapter assigned. */
export interface GalleryPhoto extends Photo {
  chapter: string;
}

export interface GalleryData {
  mediaBase: string;
  chapters: (Chapter & { photos: GalleryPhoto[] })[];
  /** Ids in hero order: heroOrder first, then any other hero-safe favourite. */
  hero: string[];
  /** How many of `hero` lead on every screen; the rest are added on portrait screens only. */
  heroLead: number;
}

export interface Curation {
  version: number;
  updatedAt: string | null;
  /** Departures from each photo's seed only; a photo absent here is shown/featured per its seed. */
  photos: Record<string, PhotoState>;
}
