/**
 * `/blog` page body — ported class-for-class from
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/
 * blog-list.html`. The r9 chrome is `app/(site)/layout.tsx`'s job; this
 * renders only what sits inside it: the masthead, the "Latest" magenta band,
 * the topic-capped library (white) and the "Who it's for" aqua band.
 *
 * Content is real `content/blog/*.mdx` frontmatter via `getBlogPosts()` —
 * nothing here is invented except the two provisional axes documented in
 * `lib/blog-topics.ts` (topic display copy, approved design text) and
 * `lib/blog-sectors.ts` (the "who it's for" axis — PROVISIONAL, see that
 * file's header).
 *
 * THE WALL FIX (D4, kit-additions-f.css F-03): each topic block caps at 4
 * posts at rest; capped rows are handed to `/blog/category/[slug]` via the
 * "N guides" link, and the cap lifts the moment either filter axis narrows.
 * This is `components/blog/blog-filter-section.tsx`'s job — a client
 * component, because the filter is real and interactive, not mocked.
 */

import Link from 'next/link';
import type { BlogPost } from '@/lib/content';
import { BLOG_SECTOR_KEYS, BLOG_SECTOR_LABELS, toBlogSector } from '@/lib/blog-sectors';
import {
  TOPIC_DESCRIPTIONS,
  TOPIC_HEADINGS,
  TOPIC_ORDER,
  categoryOf,
  topicLabelOf,
} from '@/lib/blog-topics';
import { formatMonthYear, formatReadingTimeRange, formatShortMonthYear } from '@/lib/blog-format';
import { BlogFilterSection, type LibraryTopic } from './blog-filter-section';

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
   *  function component only resolves inside a real Next.js RSC render (the
   *  same reason `components/projects/projects-list-page.tsx` takes
   *  `projects`/`testimonials` as props rather than fetching them itself). */
  posts: BlogPost[];
}

export function BlogListPage({ posts }: BlogListPageProps) {
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const recentFour = posts.filter((p) => p.slug !== featured?.slug).slice(0, 4);
  const featuredSector = toBlogSector(featured?.sector);

  const readingTimeRange = formatReadingTimeRange(posts.map((p) => p.readingTime));
  const latest = posts[0] ? formatShortMonthYear(posts[0].date) : null;

  const topics: LibraryTopic[] = TOPIC_ORDER.map((slug) => ({
    slug,
    heading: TOPIC_HEADINGS[slug],
    description: TOPIC_DESCRIPTIONS[slug],
    rows: posts
      .filter((p) => categoryOf(p) === slug)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        readingTime: p.readingTime,
        date: p.date,
        sector: toBlogSector(p.sector),
      })),
  }));

  const sectorCounts: Record<string, number> = {};
  for (const key of BLOG_SECTOR_KEYS) sectorCounts[key] = 0;
  for (const post of posts) {
    const sector = toBlogSector(post.sector);
    if (sector) sectorCounts[sector] += 1;
  }
  const populatedSectors = BLOG_SECTOR_KEYS.filter((k) => sectorCounts[k] > 0);
  const emptySectors = BLOG_SECTOR_KEYS.filter((k) => sectorCounts[k] === 0);

  // Approved copy for the two sectors the library actually has posts in
  // today (`blog-list.html:480-481`). A future third populated sector falls
  // back to a generic suffix rather than crashing.
  const SECTOR_BULLET_SUFFIX: Partial<Record<(typeof BLOG_SECTOR_KEYS)[number], string>> = {
    trades: `across all ${TOPIC_ORDER.length} topics`,
    motorsport: 'on speed under load',
  };

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
          business found online. Start with the problem you have, not the trade you happen to be in.
        </p>

        <div className="mast__meta">
          <div>
            <b>{posts.length}</b>
            <span>Guides in the library</span>
          </div>
          <div>
            <b>{TOPIC_ORDER.length} topics</b>
            <span>Grouped by problem</span>
          </div>
          {readingTimeRange ? (
            <div>
              <b>{readingTimeRange}</b>
              <span>Typical read</span>
            </div>
          ) : null}
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
          <h2 className="res">Most recent first.</h2>
          <p className="lead">
            The newest guide, and the four behind it. Everything else is grouped by topic further
            down.
          </p>

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
                  {featuredSector ? (
                    <div>
                      <b>{BLOG_SECTOR_LABELS[featuredSector]}</b>
                      <span>Who it&rsquo;s for</span>
                    </div>
                  ) : null}
                </div>
                <span className="svccard__l">
                  Read the guide
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          </div>

          <div className="svcs">
            {recentFour.map((post) => (
              <Link className="svc" href={`/blog/${post.slug}`} key={post.slug}>
                <span className="svc__n">{post.title}</span>
                <span className="svc__d">
                  {post.readingTime ? `${post.readingTime} min · ` : null}
                  {formatMonthYear(post.date)} &middot; {topicLabelOf(post)}
                </span>
              </Link>
            ))}
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
          Seven topics, each one a problem rather than an industry. Trades turn up inside them as
          worked examples &mdash; a scaffolder&rsquo;s site and a fabric shop&rsquo;s have more in
          common than either would guess.
        </p>

        <BlogFilterSection topics={topics} totalPosts={posts.length} />
      </section>

      {/* ===== 4. WHO IT'S FOR — aqua ===== */}
      <section className="sec p--aqua" data-ground="aqua">
        <p className="eyeless">Who it&rsquo;s for</p>
        <h2 className="res">Mostly trades &mdash; for now.</h2>
        <p className="lead">
          {sectorCounts.trades ?? 0} of these {posts.length} guides were written for trades and
          contractors, because that is where most of my work started. The work itself has moved on,
          and the library is built so the rest sit in the same place rather than in a separate
          section.
        </p>

        <div className="twoup">
          <div>
            <h3>Written so far</h3>
            <div className="detail__l">
              {populatedSectors.map((key) => (
                <div key={key}>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8.5l3.2 3.2L13 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>{' '}
                  {BLOG_SECTOR_LABELS[key]} &mdash; {sectorCounts[key]}{' '}
                  {sectorCounts[key] === 1 ? 'guide' : 'guides'}
                  {SECTOR_BULLET_SUFFIX[key] ? `, ${SECTOR_BULLET_SUFFIX[key]}` : ''}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3>Not yet, but the shelf is there</h3>
            <p className="twoup__p">
              {emptySectors.map((k) => BLOG_SECTOR_LABELS[k]).join(', ')}. I have built for all{' '}
              {emptySectors.length === 4 ? 'four' : emptySectors.length} &mdash; the case studies
              are on the work page &mdash; and the guides go under the same {TOPIC_ORDER.length}{' '}
              topics when they are written, not into a second blog.
            </p>
            <p className="twoup__p">
              If you run one of those and want the answer to something before I get round to writing
              it up, ask me. It is the fastest route to a guide getting written.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
