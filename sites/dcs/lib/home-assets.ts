/**
 * DCS homepage media — single source of truth for R2 asset URLs.
 *
 * These 18 URLs were produced by `tools/copy-dcs-home-assets.ts`, which copied
 * 17 objects from the r9 prototype's R2 prefix
 * (`prototypes/2026-08-17_dcs-homepage-redesign/assets/`) to a production
 * prefix (`dcs/home/`) via server-side S3 CopyObject calls, plus one asset
 * (the NP Racing rider-spotlight clip) that already lives at its own
 * production path under `npracing-v1/videos/` and was deliberately left
 * alone. The full record — including real HTTP HEAD responses captured at
 * copy time — is at
 * `output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/assets-manifest.json`.
 *
 * No other file should hold a raw R2 URL literal for these assets — import
 * from here instead. Re-run `npx tsx tools/copy-dcs-home-assets.ts --verify`
 * to confirm these URLs are still live before relying on this list.
 */

export interface HomeAsset {
  url: string;
  contentType: 'video/mp4' | 'image/jpeg';
}

export const HOME_ASSETS = {
  'work-clothing-kings.video': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/the-clothing-kings.mp4',
    contentType: 'video/mp4',
  },
  'work-clothing-kings.poster': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/the-clothing-kings.jpg',
    contentType: 'image/jpeg',
  },
  'work-cuddle-plush.video': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/cuddle-plush-fabrics.mp4',
    contentType: 'video/mp4',
  },
  'work-cuddle-plush.poster': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/cuddle-plush-fabrics.jpg',
    contentType: 'image/jpeg',
  },
  'work-np-racing.video': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/npracing-v1/videos/rider-spotlight-2026-08.mp4',
    contentType: 'video/mp4',
  },
  'work-np-racing.poster': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/np-racing.jpg',
    contentType: 'image/jpeg',
  },
  'work-sm-commercial.video': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/sm-commercial.mp4',
    contentType: 'video/mp4',
  },
  'work-sm-commercial.poster': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/sm-commercial.jpg',
    contentType: 'image/jpeg',
  },
  'work-colossus.video': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/colossus-scaffolding.mp4',
    contentType: 'video/mp4',
  },
  'work-colossus.poster': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/colossus-scaffolding.jpg',
    contentType: 'image/jpeg',
  },
  'work-ink.video': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/vid-ink.mp4',
    contentType: 'video/mp4',
  },
  'work-ink.poster': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/poster-ink.jpg',
    contentType: 'image/jpeg',
  },
  'work-ecommerce.video': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/ecommerce-packing.mp4',
    contentType: 'video/mp4',
  },
  'work-ecommerce.poster': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/video/ecommerce-packing.jpg',
    contentType: 'image/jpeg',
  },
  'web-phone-on-site': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/img/web/phone-on-site.jpg',
    contentType: 'image/jpeg',
  },
  'web-laptop-store': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/img/web/laptop-store.jpg',
    contentType: 'image/jpeg',
  },
  'web-abstract-mesh': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/img/web/abstract-mesh.jpg',
    contentType: 'image/jpeg',
  },
  'web-sector-office': {
    url: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dcs/home/img/web/sector-office.jpg',
    contentType: 'image/jpeg',
  },
} as const satisfies Record<string, HomeAsset>;

export type HomeAssetName = keyof typeof HOME_ASSETS;
