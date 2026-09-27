/**
 * AI-generated project-card background videos, uploaded directly to R2
 * under `dcs/projects/video/` (not copied from a prototype — unlike
 * `home-assets.ts`, which is scoped to homepage media only).
 *
 * These 8 clips were generated 2026-09-26 via the Higgsfield CLI
 * (`seedance_2_0_mini`, 16:9, 720p, 5s, no audio — matching the existing
 * three real-media clips' 1280x720/~5s profile) and uploaded with
 * `tools/upload-dcs-project-videos-to-r2.ts`. Each poster is the 4th frame
 * of its clip, extracted with ffmpeg.
 *
 * Provenance, at the user's explicit direction: `project-cards.ts`'s
 * "MEDIA HONESTY" comment previously documented the absence of media on
 * these 8 cards as a deliberate honesty mechanism, not a gap to fill. The
 * user asked to override that and fill them with generic, sector-matched
 * b-roll — same spirit as the 3 client-provided stock clips (no capture of
 * the built website, no faces, no readable text/logos), but AI-generated
 * rather than client-sourced. Recorded here rather than silently blended
 * into `home-assets.ts` so that distinction stays visible.
 */

export interface ProjectVideoAsset {
  video: string;
  poster: string;
}

const PREFIX = 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/projects/video/';

export const PROJECT_VIDEO_ASSETS: Record<string, ProjectVideoAsset> = {
  'sanctuary-ida': {
    video: `${PREFIX}sanctuary-ida.mp4`,
    poster: `${PREFIX}sanctuary-ida.jpg`,
  },
  'dj-fox-electrical': {
    video: `${PREFIX}dj-fox-electrical.mp4`,
    poster: `${PREFIX}dj-fox-electrical.jpg`,
  },
  'mad-graphics': {
    video: `${PREFIX}mad-graphics.mp4`,
    poster: `${PREFIX}mad-graphics.jpg`,
  },
  'nicola-noble-tuition': {
    video: `${PREFIX}nicola-noble-tuition.mp4`,
    poster: `${PREFIX}nicola-noble-tuition.jpg`,
  },
  'silvero-homes': {
    video: `${PREFIX}silvero-homes.mp4`,
    poster: `${PREFIX}silvero-homes.jpg`,
  },
  'dch-automotive': {
    video: `${PREFIX}dch-automotive.mp4`,
    poster: `${PREFIX}dch-automotive.jpg`,
  },
  'luna-landings': {
    video: `${PREFIX}luna-landings.mp4`,
    poster: `${PREFIX}luna-landings.jpg`,
  },
  'bexhill-removals': {
    video: `${PREFIX}bexhill-removals.mp4`,
    poster: `${PREFIX}bexhill-removals.jpg`,
  },
};
