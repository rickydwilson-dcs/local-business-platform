/**
 * `.card` — a single portfolio card, ported class-for-class from
 * `prototype/projects-list.html:164-441`. Shared by the `/projects` grid
 * (`projects-filter-section.tsx`) and the "More like this" related pair on
 * `/projects/[slug]` (`project-detail-page.tsx`), exactly as
 * `project-detail.html:266-305` reuses the same `.cards.cards--2` markup
 * rather than a separate related-card treatment (see that file's own
 * "G12 RESOLVED" comment).
 *
 * `.slot` (the "Awaiting footage" placeholder) is NOT scaffolding — it is
 * the design's honesty mechanism for the ten case studies with no real
 * video yet, and is rendered whenever `copy.media` is absent. Do not give it
 * a stand-in screenshot.
 */

import Link from 'next/link';

import { HoverVideo } from './hover-video';
import { SECTOR_LABELS } from '@/lib/project-sectors';
import type { ProjectCardCopy } from '@/lib/project-cards';

export interface ProjectCardProps {
  slug: string;
  copy: ProjectCardCopy;
  /** `related`: use `copy.relatedSlotNote` in place of the generic slot
   *  copy when present (`project-detail.html`'s DJ Fox / DCH Automotive
   *  related cards). `list`: the `/projects` grid's own generic copy. */
  context?: 'list' | 'related';
  /** Only the filterable `/projects` grid needs `data-sector` — the related
   *  pair on a case study page is never filtered. */
  withSectorAttr?: boolean;
  /** The sector filter's hide mechanism (`ProjectsFilterSection`) — the
   *  native `hidden` ATTRIBUTE on the `.card` anchor itself, matching
   *  `prototype/projects-list.html`'s own JS (`c.hidden = !match`) and the
   *  `.cards--2 .card[hidden]{display:none}` author-origin rule that makes
   *  it work (`inner-pages.css` §A1 — see the file's own header comment on
   *  why `[hidden]` alone is not enough in this kit). Left off `ProjectCard`
   *  entirely wraps it in a non-card element, which would stop it being a
   *  direct grid child of `.cards--2` — so this stays a prop on the anchor,
   *  never a wrapper `<div hidden>`. */
  hidden?: boolean;
}

const CASE_STUDY_ARROW = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M2 8h11M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ProjectCard({
  slug,
  copy,
  context = 'list',
  withSectorAttr = false,
  hidden = false,
}: ProjectCardProps) {
  const slotNote =
    context === 'related' && copy.relatedSlotNote ? copy.relatedSlotNote : 'Capture not yet taken';

  return (
    <Link
      className="card"
      href={`/projects/${slug}`}
      data-sector={withSectorAttr ? copy.sector : undefined}
      hidden={hidden}
    >
      <div className="card__t card__t--row">
        {copy.displayName} <small>{copy.subtitle}</small>
      </div>
      <div className="card__well">
        {copy.media ? (
          <HoverVideo src={copy.media.video} poster={copy.media.poster} alt={copy.media.alt} />
        ) : (
          <div className="slot">
            <span className="slot__i" aria-hidden="true" />
            <span className="slot__t">Awaiting footage</span>
            <span className="slot__s">{slotNote}</span>
          </div>
        )}
        <span className="card__tag">{SECTOR_LABELS[copy.sector]}</span>
        <div className="card__s">
          <span>{copy.summary}</span>
        </div>
      </div>
      <div className="card__meta">
        <p>{copy.metaLine}</p>
        {copy.note ? <span className="card__note">{copy.note}</span> : null}
        <span className="card__link">
          Read the case study
          {CASE_STUDY_ARROW}
        </span>
      </div>
    </Link>
  );
}
