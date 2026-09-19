/**
 * `/projects/[slug]` page body — ported class-for-class from
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/
 * project-detail.html`, the case study the design session actually built
 * out in full (Colossus Scaffolding — "the one case study with both a
 * complete narrative and a real media asset", per that file's own header
 * comment). The r9 chrome is `app/(site)/layout.tsx`'s job; this renders
 * only what sits inside it.
 *
 * GENERALISED BEYOND THE DEMO. The prototype shows exactly one instance of
 * this template. Porting it to all 13 `content/projects/*.mdx` files means
 * deciding, for the 12 the design never rendered, what varies safely and
 * what doesn't:
 *
 *   - `.mast__meta` ships 3 fields (Sector / Launched / Type of job), not
 *     Colossus's 5 (adds "Where they work" and "Site size"). Those two
 *     aren't reliably real for every project — "East Sussex" is wrong for a
 *     national eCommerce client, and a page count exists in frontmatter for
 *     none of the 13 — so rather than invent them per project, this ships
 *     only what's honestly derivable for all 13. Flagged in the Phase 2
 *     report.
 *   - The "More like this" related pair is the demoed Colossus -> [DJ Fox,
 *     DCH Automotive] override where the design specified it
 *     (`lib/project-cards.ts`'s `RELATED_OVERRIDES`), and a same-sector
 *     algorithm everywhere else, falling back across sectors for the two
 *     single-member sectors (property, creative). The heading/lead sentence
 *     ("N of 13 are X — the other M are …") is a real, always-accurate
 *     portfolio statistic either way, so it renders unconditionally except
 *     for those two single-member sectors, where it would misdescribe the
 *     filler cards shown below it — a generic heading/lead replaces it
 *     there instead.
 */

import Link from 'next/link';
import {
  SECTOR_KEYS,
  SECTOR_LABELS,
  SECTOR_PLURAL_LABEL,
  capitalise,
  numberWord,
} from '@/lib/project-sectors';
import {
  JOB_TYPE_BY_TAG,
  PROJECT_CARDS,
  PROJECT_ORDER,
  RELATED_OVERRIDES,
  withContentFields,
} from '@/lib/project-cards';
import type { Project } from '@/lib/content';
import { ProjectCard } from './project-card';
import { ProjectProse } from './project-prose';

export interface ProjectDetailPageProps {
  slug: string;
  frontmatter: Project;
  /** Raw MDX body — unedited, see `project-prose.tsx`'s header on why voice
   *  conversion is out of scope here. */
  content: string;
}

const CHECK = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8.5l3.2 3.2L13 4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ARROW = (
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

function joinWithAnd(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function formatLaunched(date: unknown): string | null {
  if (typeof date !== 'string') return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

export function ProjectDetailPage({
  slug,
  frontmatter: rawFrontmatter,
  content,
}: ProjectDetailPageProps) {
  const frontmatter = withContentFields(rawFrontmatter);
  const copy = PROJECT_CARDS[slug];
  const sector = copy?.sector;
  const sectorLabel = sector ? SECTOR_LABELS[sector] : undefined;
  const displayName = copy?.displayName ?? frontmatter.title;

  const rawTag = Array.isArray(frontmatter.tags) ? frontmatter.tags[0] : undefined;
  const jobType =
    typeof rawTag === 'string'
      ? (JOB_TYPE_BY_TAG[rawTag] ?? capitalise(rawTag.replace(/-/g, ' ')))
      : null;
  const launched = formatLaunched(frontmatter.date);

  const media = copy?.media;
  const mediaNote = copy?.detailNote ?? copy?.note;

  // ---- "More like this" -------------------------------------------------
  const override = RELATED_OVERRIDES[slug];
  const sameSectorOthers = sector
    ? PROJECT_ORDER.filter((s) => s !== slug && PROJECT_CARDS[s]?.sector === sector)
    : [];
  const relatedSlugs: string[] =
    override ??
    (sameSectorOthers.length >= 2
      ? sameSectorOthers.slice(0, 2)
      : [
          ...sameSectorOthers,
          ...PROJECT_ORDER.filter((s) => s !== slug && !sameSectorOthers.includes(s)),
        ].slice(0, 2));

  const relatedIsSectorTrue = !!sector && sameSectorOthers.length >= 2;
  const sectorCountTotal = sector
    ? PROJECT_ORDER.filter((s) => PROJECT_CARDS[s]?.sector === sector).length
    : 0;
  const otherSectorKeys = SECTOR_KEYS.filter((k) => k !== sector);

  return (
    <>
      {/* ===== 1. BREADCRUMB + MASTHEAD + MEDIA — ink ===== */}
      <div className="crumb p--ink" data-ground="ink">
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/projects">Work</Link>
            </li>
            <li>
              <span aria-current="page">{displayName}</span>
            </li>
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">Case study{sectorLabel ? ` · ${sectorLabel}` : ''}</p>
        <h1>{displayName}</h1>
        {frontmatter.description ? <p className="lead">{frontmatter.description}</p> : null}

        <div className="mast__meta">
          {sectorLabel ? (
            <div>
              <b>{sectorLabel}</b>
              <span>Sector</span>
            </div>
          ) : null}
          {launched ? (
            <div>
              <b>{launched}</b>
              <span>Launched</span>
            </div>
          ) : null}
          {jobType ? (
            <div>
              <b>{jobType}</b>
              <span>Type of job</span>
            </div>
          ) : null}
        </div>

        <div className="mast__media">
          {media ? (
            <video
              muted
              loop
              playsInline
              controls
              preload="none"
              poster={media.poster}
              aria-label={media.detailAlt ?? media.alt}
            >
              <source src={media.video} type="video/mp4" />
            </video>
          ) : (
            <div className="slot">
              <span className="slot__i" aria-hidden="true" />
              <span className="slot__t">Awaiting footage</span>
              <span className="slot__s">Capture not yet taken</span>
            </div>
          )}
        </div>
        {mediaNote ? <p className="card__note">{mediaNote}</p> : null}
      </header>

      {/* ===== 2. THE NARRATIVE — white ===== */}
      <section className="sec p--white" data-ground="white">
        <ProjectProse content={content} />
      </section>

      {/* ===== 3. OUTCOMES — ink ===== */}
      {frontmatter.outcomes && frontmatter.outcomes.length > 0 ? (
        <section className="sec p--ink" data-ground="ink">
          <div className="measure">
            <p className="eyeless">In short</p>
            <h2 className="res">What it did.</h2>
            <div className="detail__l">
              {frontmatter.outcomes.map((outcome) => (
                <div key={outcome}>
                  {CHECK} {outcome}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ===== 4. RELATED — paper ===== */}
      <section className="sec p--paper" data-ground="paper">
        <p className="eyeless">More like this</p>
        <h2 className="res">
          {relatedIsSectorTrue && sector
            ? `Two more from the ${sector} side.`
            : 'Two more from the portfolio.'}
        </h2>
        <p className="lead">
          {relatedIsSectorTrue && sector ? (
            <>
              {capitalise(numberWord(sectorCountTotal))} of the {numberWord(PROJECT_ORDER.length)}{' '}
              case studies are {SECTOR_PLURAL_LABEL[sector]} &mdash; the other{' '}
              {numberWord(PROJECT_ORDER.length - sectorCountTotal)} are{' '}
              {joinWithAnd(otherSectorKeys)}.{' '}
            </>
          ) : (
            "Whatever the sector, chances are I've already built something close to it. "
          )}
          <Link className="card__link" href="/projects" style={{ marginTop: 0 }}>
            See all {PROJECT_ORDER.length}
            {ARROW}
          </Link>
        </p>

        <div className="cards cards--2">
          {relatedSlugs.map((relatedSlug) => {
            const relatedCopy = PROJECT_CARDS[relatedSlug];
            return relatedCopy ? (
              <ProjectCard
                key={relatedSlug}
                slug={relatedSlug}
                copy={relatedCopy}
                context="related"
              />
            ) : null;
          })}
        </div>
      </section>
    </>
  );
}
