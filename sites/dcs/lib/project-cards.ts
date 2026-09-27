/**
 * Per-project card copy for `/projects` and `/projects/[slug]`.
 *
 * `ProjectFrontmatterSchema` (`packages/core-components/src/lib/
 * content-schemas.ts`) has no field for a card's short display name, its
 * `.card__t small` subtitle, the one-line `.card__s` summary shown over the
 * video/slot well, or the `.card__meta p` line underneath — the approved
 * design authored those specifically for the compact card treatment, and
 * they read as condensed rewrites of the MDX `description`/`outcomes`
 * fields rather than values mechanically derivable from them. This file
 * records that authored copy, keyed by the real `content/projects/*.mdx`
 * slug, ported verbatim from
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/
 * projects-list.html` (cards) and `project-detail.html` (the one demoed
 * case study, Colossus).
 *
 * Everything else on both pages — meta description, the prose body, the
 * `outcomes:` list — is read live from the MDX frontmatter/body via
 * `lib/content.ts`, never duplicated here.
 *
 * MEDIA HONESTY (see `.slot` in `projects-list.html`'s own header comment):
 * all eleven projects now carry a `media` entry, so no card falls through
 * to the `.slot` "Awaiting footage" placeholder any more — the placeholder
 * logic itself is left in place in `ProjectCard` for any future project
 * added without media. Three (`the-clothing-kings`, `colossus-scaffolding`,
 * `cuddle-plush-fabrics`) are real R2 video assets, sector-representative
 * stock the client provided. The other eight were, until 2026-09-26,
 * deliberately left without media as an honesty mechanism (flagged in the
 * Phase 2 brief as NOT scaffolding to remove) — at the user's explicit
 * request that decision was overridden and they were filled with
 * AI-generated sector b-roll (Higgsfield CLI, see
 * `sites/dcs/lib/project-video-assets.ts` for full provenance), matching
 * the same "no capture of the site, no faces, no readable text/logos"
 * spirit as the three stock clips. `note` on all eleven still reads
 * "Sector footage — not a capture of the website", which remains true for
 * both the stock and the AI-generated clips.
 */

import { HOME_ASSETS } from './home-assets';
import { PROJECT_VIDEO_ASSETS } from './project-video-assets';
import type { SectorKey } from './project-sectors';
import type { Project } from './content';

/**
 * `ProjectFrontmatterSchema` (`packages/core-components/src/lib/
 * content-schemas.ts`) declares `completionDate`/`year`/`results`/no `tags`
 * field for project frontmatter — but `scripts/validate-content.ts` only
 * ever validates `services` and `locations` (`mode === 'all' | 'services' |
 * 'locations'`; `projects` is not a case), so that schema has never actually
 * been enforced against `content/projects/*.mdx`. All 11 real files instead
 * use `date`, `tags` and `outcomes` — none of which exist on the inferred
 * `Project` type, so reading them needs a cast to this observed shape
 * rather than a schema fix, which is out of scope for a route-level port
 * and would touch every site sharing `content-schemas.ts`. Flagged in the
 * Phase 2 report as a pre-existing platform gap, not something introduced
 * here.
 */
export interface ProjectContentFields {
  date?: string;
  tags?: string[];
  outcomes?: string[];
}

export function withContentFields(frontmatter: Project): Project & ProjectContentFields {
  return frontmatter as Project & ProjectContentFields;
}

export interface ProjectMedia {
  video: string;
  poster: string;
  /** Alt text used on the compact list-card well. */
  alt: string;
  /** Alt text used on the case-study masthead, when it differs (more
   *  descriptive — the masthead media is much larger). Falls back to `alt`. */
  detailAlt?: string;
}

export interface ProjectCardCopy {
  sector: SectorKey;
  /** `.card__t` main text — the short display name, distinct from the MDX
   *  `title` (which is SEO-length, e.g. "Colossus Scaffolding — New Website
   *  from Scratch"). */
  displayName: string;
  /** `.card__t small` — a short descriptor badge. */
  subtitle: string;
  /** `.card__s` — the one-line summary shown over the well on hover/focus. */
  summary: string;
  /** `.card__meta p` — the single-line outcome shown under the tag. */
  metaLine: string;
  /** `.card__note` — media credit line, only present on the 3 real-media
   *  projects. */
  note?: string;
  /** The masthead media caption on the project's OWN detail page, when it
   *  differs from `note` (only written for Colossus, the one case study the
   *  design demoed in full). Falls back to `note`. */
  detailNote?: string;
  media?: ProjectMedia;
  /**
   * `.slot__s` text used ONLY when this project's card appears inside
   * another project's "More like this" related grid — `project-detail.html`
   * gives DJ Fox and DCH Automotive a "Live at <domain>" line there instead
   * of the generic "Capture not yet taken" their own `/projects` list card
   * uses. Falls back to the generic slot copy everywhere else.
   */
  relatedSlotNote?: string;
}

export const PROJECT_CARDS: Record<string, ProjectCardCopy> = {
  'the-clothing-kings': {
    sector: 'retail',
    displayName: 'The Clothing Kings',
    subtitle: 'Custom apparel',
    summary:
      'An eCommerce store for a work-wear retailer specialising in corporate apparel — customer logo uploads, dynamic pricing by print method and placement, and a simple checkout.',
    metaLine: 'Dynamic pricing that changes with the print method and where the logo goes.',
    note: 'Pictured: an embroidery machine stitching a logo onto a polo shirt. Sector footage — not a capture of the website.',
    media: {
      video: HOME_ASSETS['work-clothing-kings.video'].url,
      poster: HOME_ASSETS['work-clothing-kings.poster'].url,
      alt: 'An embroidery machine stitching a logo onto a navy polo shirt.',
    },
  },
  'sanctuary-ida': {
    sector: 'studios',
    displayName: 'Sanctuary Ida',
    subtitle: 'Yoga school',
    summary:
      'An online booking platform for a yoga school, with calendar management, capacity controls and Google Maps integration.',
    metaLine:
      'Students book and pay for classes on the site, with capacity limits handled automatically.',
    note: 'Pictured: a yoga mat and a lit candle in a studio space. Sector footage — not a capture of the website.',
    media: {
      video: PROJECT_VIDEO_ASSETS['sanctuary-ida'].video,
      poster: PROJECT_VIDEO_ASSETS['sanctuary-ida'].poster,
      alt: 'A rolled yoga mat and a lit candle on a sunlit wooden studio floor.',
    },
  },
  'colossus-scaffolding': {
    sector: 'trades',
    displayName: 'Colossus Scaffolding',
    subtitle: '30-page build',
    summary:
      'A 30-page site for an East Sussex scaffolding contractor who had no online presence at all — built to win commercial work as well as rank locally.',
    metaLine: 'First enquiry from Google within three weeks of launch.',
    note: 'Pictured: scaffolding across the front of a brick terrace. Sector footage — not a capture of the website.',
    detailNote:
      'Pictured: scaffolding erected across the front of a brick terrace. Sector footage — not a capture of the website. A screen recording of the site has not been taken yet.',
    media: {
      video: HOME_ASSETS['work-colossus.video'].url,
      poster: HOME_ASSETS['work-colossus.poster'].url,
      alt: 'Scaffolding poles erected across the front of a brick terrace.',
      detailAlt:
        'Scaffolding poles erected across the front of a brick terrace with white sash windows.',
    },
  },
  'cuddle-plush-fabrics': {
    sector: 'retail',
    displayName: 'Cuddle Plush Fabrics',
    subtitle: '5+ years running',
    summary:
      "An eCommerce store for one of Europe's leading specialist fabric retailers — Google product feed, international shipping, and a large catalogue kept accurate.",
    metaLine: 'One of my longest-running client relationships — over five years and counting.',
    note: 'Pictured: a folded bolt of fabric. Sector footage — not a capture of the website.',
    media: {
      video: HOME_ASSETS['work-cuddle-plush.video'].url,
      poster: HOME_ASSETS['work-cuddle-plush.poster'].url,
      alt: 'A folded bolt of pale green fabric.',
    },
  },
  'dj-fox-electrical': {
    sector: 'trades',
    displayName: 'DJ Fox Electrical',
    subtitle: '20+ pages',
    summary:
      "An electrician's site on the DCS platform — service pages for domestic, commercial and EV charging work, plus location pages across East Sussex.",
    metaLine: 'Full 20+ page site, live on Vercel at djfoxelectrical.com.',
    note: 'Pictured: an electrician connecting wires inside a consumer unit. Sector footage — not a capture of the website.',
    media: {
      video: PROJECT_VIDEO_ASSETS['dj-fox-electrical'].video,
      poster: PROJECT_VIDEO_ASSETS['dj-fox-electrical'].poster,
      alt: "An electrician's gloved hands connecting wires inside an open consumer unit.",
    },
    relatedSlotNote: 'Live at djfoxelectrical.com — capture not yet taken',
  },
  'mad-graphics': {
    sector: 'creative',
    displayName: 'Mad Graphics',
    subtitle: 'Agency rebuild',
    summary:
      'A redesign for a marketing agency that needed a site as dynamic as the work it showcases — live Instagram feed, bold service icons, Google Maps.',
    metaLine: 'Scroll-triggered animation linking imagery directly to each service.',
    note: 'Pictured: colour swatches and design proofs on a studio desk. Sector footage — not a capture of the website.',
    media: {
      video: PROJECT_VIDEO_ASSETS['mad-graphics'].video,
      poster: PROJECT_VIDEO_ASSETS['mad-graphics'].poster,
      alt: 'Colour swatches and printed design proofs arranged on a studio desk.',
    },
  },
  'nicola-noble-tuition': {
    sector: 'studios',
    displayName: 'Nicola Noble Tuition',
    subtitle: 'Online learning',
    summary:
      "An 11+ tutor's teaching taken online after Covid, with lesson content and paid resources protected behind a paywall.",
    metaLine: 'Nationwide reach, replacing a local-only model.',
    note: 'Pictured: handwritten notes in an open notebook. Sector footage — not a capture of the website.',
    media: {
      video: PROJECT_VIDEO_ASSETS['nicola-noble-tuition'].video,
      poster: PROJECT_VIDEO_ASSETS['nicola-noble-tuition'].poster,
      alt: 'A hand writing with a pencil in an open notebook on a wooden desk.',
    },
  },
  'silvero-homes': {
    sector: 'property',
    displayName: 'Silvero Homes',
    subtitle: 'Property agency',
    summary:
      "A site for a property development agency, built around the brand's own identity to present luxury homes with clarity and confidence.",
    metaLine: 'Clean, minimal design approved on the first presentation.',
    note: 'Pictured: a modern luxury home exterior at golden hour. Sector footage — not a capture of the website.',
    media: {
      video: PROJECT_VIDEO_ASSETS['silvero-homes'].video,
      poster: PROJECT_VIDEO_ASSETS['silvero-homes'].poster,
      alt: 'A modern luxury house exterior with large glass windows at golden hour.',
    },
  },
  'dch-automotive': {
    sector: 'trades',
    displayName: 'DCH Automotive',
    subtitle: 'Trade launch',
    summary:
      'An automotive specialist’s first website — work showcase, accreditations, and a live Instagram feed keeping the site current between jobs.',
    metaLine: 'A professional online presence established from a standing start.',
    note: 'Pictured: a mechanic working on a car engine bay. Sector footage — not a capture of the website.',
    media: {
      video: PROJECT_VIDEO_ASSETS['dch-automotive'].video,
      poster: PROJECT_VIDEO_ASSETS['dch-automotive'].poster,
      alt: "A mechanic's gloved hands working on a car engine bay under a work light.",
    },
    relatedSlotNote: 'Live at dch-one.vercel.app — capture not yet taken',
  },
  'luna-landings': {
    sector: 'retail',
    displayName: 'Luna Landings',
    subtitle: 'Made-to-order',
    summary:
      'A made-to-order store with a product configurator and worldwide shipping, built around a fulfilment model that carries no stock at all.',
    metaLine: 'Automatic work orders raised for the production team at checkout.',
    note: 'Pictured: hands guiding material through a production line machine. Sector footage — not a capture of the website.',
    media: {
      video: PROJECT_VIDEO_ASSETS['luna-landings'].video,
      poster: PROJECT_VIDEO_ASSETS['luna-landings'].poster,
      alt: 'Hands guiding material through a small production line machine.',
    },
  },
  'bexhill-removals': {
    sector: 'trades',
    displayName: 'Bexhill Removals',
    subtitle: 'Minimal trade site',
    summary:
      "A clean, minimal removals site built after competitor research, with the client's first real creative freedom.",
    metaLine: 'Design approved on the first presentation — no revisions.',
    note: 'Pictured: moving boxes being loaded into a removals van. Sector footage — not a capture of the website.',
    media: {
      video: PROJECT_VIDEO_ASSETS['bexhill-removals'].video,
      poster: PROJECT_VIDEO_ASSETS['bexhill-removals'].poster,
      alt: 'Cardboard moving boxes being loaded into the back of a removals van.',
    },
  },
};

/**
 * `.mast__meta` "Type of job" on a case-study page, derived from the MDX
 * frontmatter's own `tags[0]` — every one of the 11 project files uses one
 * of these values (`website-rebuild` is kept for a future rebuild case study;
 * no current project carries it). Not authored per project; genuinely computed
 * from real content, unlike the copy above.
 */
export const JOB_TYPE_BY_TAG: Record<string, string> = {
  'website-build': 'New build',
  'website-rebuild': 'Rebuild',
  'website-redesign': 'Redesign',
  ecommerce: 'eCommerce build',
};

/**
 * The one related pair the design actually demoed
 * (`project-detail.html:266-305`, Colossus's "More like this"): DJ Fox
 * Electrical and DCH Automotive specifically, not just "two other trades
 * projects" — both are real, live, deployed sites (see `MEMORY.md` → "Live
 * Sites"), which is presumably *why* those two and not another trades
 * project. The other 10 case studies have no demoed related pair to
 * port, so `project-detail-page.tsx` falls back to a same-sector algorithm
 * for them — flagged in the Phase 2 report as a generalisation beyond what
 * the approved design shows.
 */
export const RELATED_OVERRIDES: Record<string, [string, string]> = {
  'colossus-scaffolding': ['dj-fox-electrical', 'dch-automotive'],
};

/** Canonical display order — `projects-list.html`'s own card order
 *  (1-13, less the two fictitious placeholder case studies removed on
 *  2026-09-27), used for the list grid and as the related-section fallback's
 *  iteration order. */
export const PROJECT_ORDER: string[] = [
  'the-clothing-kings',
  'sanctuary-ida',
  'colossus-scaffolding',
  'cuddle-plush-fabrics',
  'dj-fox-electrical',
  'mad-graphics',
  'nicola-noble-tuition',
  'silvero-homes',
  'dch-automotive',
  'luna-landings',
  'bexhill-removals',
];
