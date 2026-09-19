/**
 * `/blog/category/[slug]` page body — ported class-for-class from
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/
 * blog-category.html`. THIS ROUTE DID NOT EXIST BEFORE THIS PORT — see
 * `app/(site)/blog/category/[slug]/page.tsx`'s header.
 *
 * The prototype only demoes ONE of the seven topics (`local-seo`, the
 * largest at 6 posts — "the only one where the index's four-post cap
 * actually withholds anything"). Generalising to all 7:
 *   - The masthead `.lead` on the demoed page is bespoke prose written for
 *     `local-seo` specifically, distinct from `.topic__d`'s shorter text on
 *     `/blog`. No such bespoke paragraph exists for the other 6 topics, and
 *     writing 6 new ones would be inventing content a port must not invent
 *     (root `CLAUDE.md`: "this is a port, not a design exercise"). This
 *     component reuses `TOPIC_DESCRIPTIONS` (already-approved design copy,
 *     shared with `/blog`'s own topic blocks) as the masthead lead for
 *     every topic, including `local-seo` — flagged in the Phase 3 report.
 *   - `mast__meta`'s reading-time/year ranges and "who it's for" are
 *     computed from the real posts in each topic, not copied numbers.
 */

import Link from 'next/link';
import type { BlogPost } from '@/lib/content';
import { BLOG_SECTOR_BY_SLUG, BLOG_SECTOR_LABELS, type BlogSectorKey } from '@/lib/blog-sectors';
import {
  TOPIC_DESCRIPTIONS,
  TOPIC_HEADINGS,
  TOPIC_ORDER,
  TOPIC_ROW_DESCRIPTORS,
  categoryOf,
  type TopicSlug,
} from '@/lib/blog-topics';
import { formatMonthYear, formatReadingTimeRange, formatYearRange } from '@/lib/blog-format';

function joinWithAnd(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function ArrowIcon() {
  return (
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
}

export interface BlogCategoryPageProps {
  topic: TopicSlug;
  /** Every real post in this category, already newest-first. */
  posts: BlogPost[];
  /** Every real post across the whole blog — used only to count the other 6
   *  topics for the "other topics" row list below (`categoryOf`-filtered
   *  per topic), so this route needs no second content fetch. */
  allPosts: BlogPost[];
}

export function BlogCategoryPage({ topic, posts, allPosts }: BlogCategoryPageProps) {
  const index = TOPIC_ORDER.indexOf(topic);
  const heading = TOPIC_HEADINGS[topic];
  const otherTopics = TOPIC_ORDER.filter((t) => t !== topic);
  const otherTopicCounts: Record<TopicSlug, number> = TOPIC_ORDER.reduce(
    (acc, t) => {
      acc[t] = allPosts.filter((p) => categoryOf(p) === t).length;
      return acc;
    },
    {} as Record<TopicSlug, number>
  );

  const readingTimeRange = formatReadingTimeRange(posts.map((p) => p.readingTime));
  const yearRange = formatYearRange(posts.map((p) => p.date));

  const sectors = Array.from(
    new Set(posts.map((p) => BLOG_SECTOR_BY_SLUG[p.slug]).filter((s): s is BlogSectorKey => !!s))
  );
  const sectorLabel =
    sectors.length > 0 ? joinWithAnd(sectors.map((s) => BLOG_SECTOR_LABELS[s])) : null;

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
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <span aria-current="page">{heading}</span>
            </li>
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">
          Blog &middot; Topic {index + 1} of {TOPIC_ORDER.length}
        </p>
        <h1>{heading}</h1>
        <p className="lead">{TOPIC_DESCRIPTIONS[topic]}</p>

        <div className="mast__meta">
          <div>
            <b>
              {posts.length} {posts.length === 1 ? 'guide' : 'guides'}
            </b>
            <span>In this topic</span>
          </div>
          {readingTimeRange ? (
            <div>
              <b>{readingTimeRange}</b>
              <span>Typical read</span>
            </div>
          ) : null}
          {yearRange ? (
            <div>
              <b>{yearRange}</b>
              <span>Written between</span>
            </div>
          ) : null}
          {sectorLabel ? (
            <div>
              <b>{sectorLabel}</b>
              <span>Who they&rsquo;re for</span>
            </div>
          ) : null}
        </div>
      </header>

      {/* ===== 2. ALL THE GUIDES — magenta ===== */}
      <section className="sec p--magenta" data-ground="magenta">
        <p className="eyeless">All {posts.length === 1 ? 'one' : posts.length}</p>
        <h2 className="res">Every guide in this topic.</h2>
        <p className="lead">
          Newest first. Each one stands on its own &mdash; there is no order you have to read them
          in.
        </p>

        <div className="svcs">
          {posts.map((post) => (
            <Link className="svc" href={`/blog/${post.slug}`} key={post.slug}>
              <span className="svc__n">{post.title}</span>
              <span className="svc__d">
                {post.excerpt ?? post.description}
                <em>
                  {post.readingTime ? `${post.readingTime} min · ` : null}
                  {formatMonthYear(post.date)}
                </em>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 3. THE OTHER TOPICS — white ===== */}
      <section className="sec p--white" data-ground="white">
        <p className="eyeless">Other topics</p>
        <h2 className="res">The other {otherTopics.length}.</h2>
        <p className="lead">
          Every guide in the library sits under one of {TOPIC_ORDER.length} topics, and the topics
          are problems rather than industries.
        </p>

        <div className="work">
          {otherTopics.map((t) => (
            <Link className="row" href={`/blog/category/${t}`} key={t}>
              <span className="row__n">{TOPIC_HEADINGS[t]}</span>
              <span className="row__m">
                {otherTopicCounts[t]} {otherTopicCounts[t] === 1 ? 'guide' : 'guides'}
                <em>{TOPIC_ROW_DESCRIPTORS[t]}</em>
              </span>
            </Link>
          ))}
        </div>

        <p className="lead">
          <Link className="card__link" href="/blog" style={{ marginTop: 0 }}>
            Back to the whole library
            <ArrowIcon />
          </Link>
        </p>
      </section>
    </>
  );
}
