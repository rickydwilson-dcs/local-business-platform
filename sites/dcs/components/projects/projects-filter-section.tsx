'use client';

/**
 * `.filterbar` + `.cards.cards--2#grid` + `.empty` — the real, working
 * sector filter on `/projects`. Ported behaviour-for-behaviour from
 * `prototype/projects-list.html:126-449` and its own script (same file,
 * "4. THE SECTOR FILTER" — real, not mocked, so the interaction can be
 * judged"):
 *
 *   (a) hides with the `hidden` ATTRIBUTE on the `.card` anchor itself, not
 *       inline `style.display` — `inner-pages.css`'s `.cards--2 .card[hidden]`
 *       rule (§A1) is the author-origin rule that makes the bare attribute
 *       work against `.cards--2 .card{display:block}`.
 *   (b) announces via `role="status" aria-live="polite"` on `.count`.
 *   (c) the reveal stagger restart the prototype's script performs on `#grid`
 *       (`grid.classList.remove('in')` then re-add) is NOT reproduced here:
 *       `.sec`'s own `.in` (added once, by `HomeBehaviour`'s reveal latch,
 *       and never removed — "so a `.res` heading can never flicker back")
 *       already satisfies the plain descendant selector `.in .card` for
 *       every card regardless of `#grid`'s own class list, so toggling `.in`
 *       on `#grid` specifically is inert once the section has been scrolled
 *       into view even in the prototype's own standalone page — see
 *       `kit.css`'s `.in .card{transform:translateY(0)}` (a descendant
 *       selector, not `.cards--2.in .card`). Flagged, not fixed: this is a
 *       cosmetic micro-interaction (a filtered-in card appears already
 *       settled rather than re-animating), not a functional gap.
 */

import { useState } from 'react';

import { ProjectCard } from './project-card';
import { SECTOR_KEYS, SECTOR_LABELS, type SectorKey } from '@/lib/project-sectors';
import type { ProjectCardCopy } from '@/lib/project-cards';

type Filter = 'all' | SectorKey;

export interface ProjectsFilterSectionProps {
  projects: { slug: string; copy: ProjectCardCopy }[];
}

export function ProjectsFilterSection({ projects }: ProjectsFilterSectionProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const total = projects.length;
  const shownCount = projects.filter((p) => filter === 'all' || p.copy.sector === filter).length;

  return (
    <>
      <div className="filterbar">
        <div className="paytoggle" id="filters" role="group" aria-label="Filter by sector">
          <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            All <span aria-hidden="true">{total}</span>
          </button>
          {SECTOR_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {SECTOR_LABELS[key]}
            </button>
          ))}
        </div>
        <span className="count" id="count" role="status" aria-live="polite">
          {filter === 'all'
            ? `Showing all ${total}`
            : `Showing ${shownCount} of ${total} — ${SECTOR_LABELS[filter]}`}
        </span>
      </div>

      <div className="cards cards--2" id="grid">
        {projects.map(({ slug, copy }) => (
          <ProjectCard
            key={slug}
            slug={slug}
            copy={copy}
            withSectorAttr
            hidden={filter !== 'all' && copy.sector !== filter}
          />
        ))}
      </div>

      <div className="empty" id="empty" data-show={shownCount === 0 ? 'true' : 'false'}>
        <h3>Nothing here yet.</h3>
        <p>
          No case study in this sector &mdash;{' '}
          <a href="mailto:mail@digitalconsultingservices.co.uk">get in touch</a> and be the first.
        </p>
      </div>
    </>
  );
}
