/**
 * `/blog` page body.
 *
 * R2 RESTRUCTURE, 2026-09-26. Ported from
 * `output/sessions/2026-09/2026-09-26_dcs-blog-index-redesign/prototype/
 * blog-list.html`; that session's `session.md` holds the measurements, the
 * before/after and the decisions.
 *
 * THE PAGE IS TWO ZONES NOW, NOT FOUR. It used to run masthead lead →
 * "Most recent first" band → library intro → "Mostly trades" band: four
 * editorial set-pieces, 984 words and 26 links for 21 posts, wrapped around
 * a list. Measured at a 1600px viewport the restructure takes it from
 * 6,202px to 4,214px and from 1,012 words to 445; at 390px, from 8,822px to
 * 4,719px.
 *
 * What went, and why:
 *   - THE `.svcs` "FOUR BEHIND IT" LIST. Every post in it reappeared in the
 *     library below — that duplication is where 26 links for 21 posts came
 *     from. The magenta band's own h2 and lead went with it: the eyebrow
 *     plus the card says "latest" without a third voice saying it.
 *   - THE SEVEN `.topic` HEADINGS AND DESCRIPTIONS. See
 *     `blog-filter-section.tsx`'s header. The descriptions are not deleted —
 *     they are already the masthead lead on `/blog/category/[slug]`.
 *   - THE AQUA "WHO IT'S FOR" BAND (Ricky, 2026-09-26). It was 566px
 *     explaining what has NOT been written yet, sitting between the reader
 *     and the footer.
 *   - TWO OF THE FOUR `.mast__meta` STATS. "7 topics / Grouped by problem"
 *     duplicated the chip row 600px below it; "5–7 min / Typical read"
 *     restated a figure that is on every row.
 *
 * GROUND SEQUENCE is now ink → magenta → white → navy. No two adjacent
 * panels share a ground and navy still closes (design-kit.md §1.2); aqua no
 * longer appears on this page at all.
 *
 * CONSEQUENCE WORTH KNOWING: the aqua band was the `sector` axis's only
 * surface on this index, so this file no longer reads `lib/blog-sectors.ts`.
 * That axis still backs `blog-post-page.tsx` and `blog-category-page.tsx`.
 */

import Link from 'next/link';
import type { BlogPost } from '@/lib/content';
import { topicLabelOf, topicOf } from '@/lib/blog-topics';
import { formatMonthYear, formatShortMonthYear } from '@/lib/blog-format';
import { BlogFilterSection, type LibraryRow } from './blog-filter-section';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface BlogListPageProps {
  /** Every real post, already newest-first (`getBlogPosts()`'s own sort) —
   *  fetched by the route (`app/(site)/blog/page.tsx`), not here. This
   *  component is a plain synchronous function so it can be rendered by
   *  `@testing-library/react`'s client renderer in tests; an `async`
   *  function component only resolves inside a real Next.js RSC render. */
  posts: BlogPost[];
}

export function BlogListPage({ posts }: BlogListPageProps) {
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const latest = posts[0] ? formatShortMonthYear(posts[0].date) : null;

  /* THE FEATURED POST IS IN THE LIST TOO, and that is deliberate.
   *
   * The first cut of this restructure excluded it, to keep the magenta band
   * and the index disjoint. That broke the filter: pressing "Design and
   * speed" returned 1 result when the library holds 2, with the missing one
   * sitting in a band 900px above and no longer visibly part of that result
   * set.
   *
   * So the model is: THE MAGENTA BAND IS A SPOTLIGHT, THE LIST IS THE
   * COMPLETE LIBRARY. One post appears twice instead of five — and that one
   * is the post being deliberately pointed at, which is what a spotlight is
   * for. */
  const rows: LibraryRow[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    readingTime: p.readingTime,
    date: p.date,
    topic: topicOf(p),
  }));

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
              <span aria-current="page">Blog</span>
            </li>
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">Blog</p>
        <h1>The questions I get asked most.</h1>
        <p className="lead">
          {posts.length === 1 ? 'One' : posts.length}{' '}
          {posts.length === 1 ? 'plain-English guide' : 'plain-English guides'} on getting a small
          business found online.
        </p>

        <div className="mast__meta">
          <div>
            <b>{posts.length}</b>
            <span>Guides in the library</span>
          </div>
          {latest ? (
            <div>
              <b>{latest}</b>
              <span>Latest guide</span>
            </div>
          ) : null}
        </div>
      </header>

      {/* ===== 2. LATEST — magenta ===== */}
      {featured ? (
        <section className="sec p--magenta" data-ground="magenta">
          <p className="eyeless">Latest</p>

          <div className="svcgrid">
            <Link className="svccard svccard--ink svccard--wide" href={`/blog/${featured.slug}`}>
              <div className="svccard__body">
                <p className="svccard__ix">Featured &middot; {topicLabelOf(featured)}</p>
                <h3 className="svccard__t">{featured.title}</h3>
                {featured.excerpt ? <p className="svccard__d">{featured.excerpt}</p> : null}
              </div>
              <div className="svccard__body">
                <div className="mast__meta">
                  {featured.readingTime ? (
                    <div>
                      <b>{featured.readingTime} min</b>
                      <span>Read time</span>
                    </div>
                  ) : null}
                  <div>
                    <b>{formatMonthYear(featured.date)}</b>
                    <span>Published</span>
                  </div>
                </div>
                <span className="svccard__l">
                  Read the guide
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      {/* ===== 3. THE LIBRARY — white ===== */}
      <section className="sec p--white" data-ground="white" id="library">
        <p className="eyeless">The library</p>
        <h2 className="res">
          Start with the problem,
          <br />
          not the sector.
        </h2>
        <p className="lead">
          Seven topics, each one a problem rather than an industry. Pick one, or read straight down.
        </p>

        <BlogFilterSection rows={rows} />
      </section>
    </>
  );
}
