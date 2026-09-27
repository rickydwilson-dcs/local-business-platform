/**
 * `/projects` page body — ported class-for-class from
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/
 * projects-list.html`. The r9 chrome (`.bar`, `.menu`, `footer.pagefoot`) is
 * rendered by `app/(site)/layout.tsx`'s `SiteChrome`; this component renders
 * only what sits inside it — the breadcrumb, masthead, the filterable
 * portfolio grid and the testimonials panel.
 *
 * Content:
 *   - The 11 `.card`s come from the real `content/projects/*.mdx` files via
 *     `getProjects()`, joined against `lib/project-cards.ts`'s authored card
 *     copy (see that file's header for why a join, not a duplicate).
 *   - The `.quote`s (decision D3: no standalone `/reviews` route) come from
 *     the real `content/testimonials/*.mdx` files via `getTestimonials()` —
 *     rendered in whatever order that returns (sorted by testimonial date,
 *     descending), not hand-ordered to match the prototype's presentation
 *     order, since the point of reading real content is to let it be real.
 *     The prototype showed three, but all three (Sarah T. the Eastbourne
 *     plumber, Mark H. the Brighton electrician, Dave C. the Lewes
 *     scaffolder) were fabricated alongside the two fictitious case studies
 *     and were deleted on 2026-09-27. `content/testimonials/` is now empty,
 *     so the whole aqua panel is skipped — the markup below is live code
 *     waiting on real client feedback, not scaffolding to delete. Add one
 *     real `.mdx` file and the panel returns, counting itself correctly.
 */

import Link from 'next/link';
import { capitalise, numberWord } from '@/lib/project-sectors';
import { PROJECT_CARDS, PROJECT_ORDER } from '@/lib/project-cards';
import type { Project, Testimonial } from '@/lib/content';
import { ProjectsFilterSection } from './projects-filter-section';

export interface ProjectsListPageProps {
  projects: Project[];
  testimonials: Testimonial[];
}

export function ProjectsListPage({ projects, testimonials }: ProjectsListPageProps) {
  const total = projects.length;
  const sectorCount = new Set(projects.map((p) => PROJECT_CARDS[p.slug]?.sector).filter(Boolean))
    .size;

  // Canonical order first, then any project not in the hand-curated order
  // (a new `content/projects/*.mdx` file with no card copy yet) appended —
  // fails safe rather than silently dropping it from the grid.
  const known = PROJECT_ORDER.filter((slug) => projects.some((p) => p.slug === slug));
  const rest = projects.map((p) => p.slug).filter((slug) => !known.includes(slug));
  const orderedSlugs = [...known, ...rest];

  // Built as one string rather than inline JSX: a `{expr} client{expr}` split
  // across lines renders as "One client , quoted as written." — JSX keeps the
  // line break between the text node and the plural expression as a space.
  const quoteLead = `${capitalise(numberWord(testimonials.length))} ${
    testimonials.length === 1 ? 'client' : 'clients'
  }, quoted as written.`;

  const cards = orderedSlugs
    .map((slug) => {
      const copy = PROJECT_CARDS[slug];
      return copy ? { slug, copy } : null;
    })
    .filter((c): c is { slug: string; copy: (typeof PROJECT_CARDS)[string] } => c !== null);

  return (
    <>
      {/* ===== 1. BREADCRUMB + MASTHEAD — ink ===== */}
      <div className="crumb p--ink" data-ground="ink">
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <span aria-current="page">Work</span>
            </li>
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">Portfolio</p>
        <h1>
          Real clients.
          <br />
          Real outcomes.
        </h1>
        <p className="lead">
          {capitalise(numberWord(total))} builds across {numberWord(sectorCount)} sectors. A
          specialist fabric retailer and an 11+ tutor sit alongside a scaffolder and an electrician
          &mdash; filter by whichever is closest to yours.
        </p>

        <div className="mast__meta">
          <div>
            <b>{total}</b>
            <span>Case studies here</span>
          </div>
          <div>
            <b>{sectorCount} sectors</b>
            <span>Fabric shop to scaffolder</span>
          </div>
          <div>
            <b>Since 2014</b>
            <span>Longest client relationship</span>
          </div>
          <div>
            <b>One person</b>
            <span>Design, build and support</span>
          </div>
        </div>
      </header>

      {/* ===== 2. THE GRID — white ===== */}
      <section className="sec p--white" data-ground="white" id="work">
        <p className="eyeless">The work</p>
        <h2 className="res">
          Pick the one that
          <br />
          looks like your business.
        </h2>

        <ProjectsFilterSection projects={cards} />
      </section>

      {/* ===== 3. TESTIMONIALS — aqua ===== */}
      {/* Rendered only when there is real feedback to show — the panel's copy
          counts what `getTestimonials()` returns, so an empty content
          directory drops the section rather than announcing "zero clients". */}
      {testimonials.length > 0 && (
        <section className="sec p--aqua" data-ground="aqua">
          <p className="eyeless">Client feedback</p>
          <h2 className="res">In their words.</h2>
          <p className="lead">{quoteLead}</p>

          <div className="quotes">
            {testimonials.map((t) => (
              <figure key={t.slug}>
                <blockquote className="quote quote--sm">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="quote__a">
                  {t.customerName} {t.customerRole ? <span>&mdash; {t.customerRole}</span> : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* The r9 chrome's own footer (`app/(site)/layout.tsx` -> `SiteChrome`
          -> `PageFooter`) supplies the closing `.pagefoot`; deliberately not
          duplicated here. The footer's own "Start a project" copy is shared
          across every inner route (`components/site/end-main.tsx`) rather
          than per-page, which is a Phase 1 decision, not this page's — this
          page's own footer heading/lead in the approved prototype ("Got a
          business that isn't a trade? Good.") is flagged in the Phase 2
          report as not reproduced for that reason. */}
    </>
  );
}
