/**
 * AI-generated project-card background videos, uploaded directly to R2
 * under `dcs/projects/video/` (not copied from a prototype — unlike
 * `home-assets.ts`, which is scoped to homepage media only).
 *
 * These 8 clips were generated 2026-09-26 via the Higgsfield CLI
 * (`seedance_2_0_mini`, 16:9, 720p, 5s, no audio — matching the existing
 * three real-media clips' 1280x720/~5s profile) and uploaded with
 * `tools/upload-dcs-project-videos-to-r2.ts`. Each poster is the 4th frame
 * of its clip, extracted with ffmpeg — except the two regenerated on
 * 2026-09-27, whose posters are taken from mid-clip instead. `preload="none"`
 * means the poster is all a visitor sees unless they hover, so it is worth
 * it being a representative frame rather than the opening one.
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
  'nicola-noble-tuition': {
    video: `${PREFIX}nicola-noble-tuition.mp4`,
    poster: `${PREFIX}nicola-noble-tuition.jpg`,
  },
  'silvero-homes': {
    video: `${PREFIX}silvero-homes.mp4`,
    poster: `${PREFIX}silvero-homes.jpg`,
  },
  // Regenerated 2026-09-27: the first clip showed an engine bay. DCH fit
  // vehicle security systems — dashcams and the like — and do not work on
  // engines. Re-cut as a dashcam being fitted to a windscreen. New filenames
  // for the same cache reason as luna-landings above.
  'dch-automotive': {
    video: `${PREFIX}dch-automotive-v2.mp4`,
    poster: `${PREFIX}dch-automotive-v2.jpg`,
  },
  // Regenerated 2026-09-27: the first clip showed leather being stitched on an
  // antique machine, which is wrong twice over — Luna Landings sells cloth
  // products. Re-cut as plain cotton on a modern machine. New filenames
  // rather than an overwrite: R2 objects are served with a 1-year immutable
  // cache, so replacing a key in place does not reach anyone who has already
  // loaded it.
  'luna-landings': {
    video: `${PREFIX}luna-landings-v2.mp4`,
    poster: `${PREFIX}luna-landings-v2.jpg`,
  },
  'bexhill-removals': {
    video: `${PREFIX}bexhill-removals.mp4`,
    poster: `${PREFIX}bexhill-removals.jpg`,
  },
};
