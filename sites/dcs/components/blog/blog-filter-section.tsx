'use client';

/**
 * `.filterset` + the seven `.topic` blocks + `.empty` — the real, working
 * two-axis filter on `/blog`. Ported behaviour-for-behaviour from
 * `prototype/blog-list.html:679-761` (its own "THE TWO-AXIS FILTER" script),
 * generalising the same pattern `components/projects/projects-filter-
 * section.tsx` already established for the single-axis `/projects` filter:
 *
 *   (a) TWO AXES that compose — topic AND sector, intersected. A topic block
 *       with no matching row in the current sector hides itself.
 *   (b) THE CAP LIFTS WHEN YOU FILTER. At rest each topic shows at most four
 *       posts (`CAP`, below) — the answer to D4's "must not degrade into a
 *       wall at 40-60 posts" (kit-additions-f.css F-03, notes-f.md §3.1: the
 *       index measures the same height at 40 posts as at 60). The moment
 *       either axis narrows, the capped rows come back.
 *   (c) hides with the `hidden` ATTRIBUTE on the `.row` anchor, matching
 *       `inner-pages.css`'s global `[hidden]{display:none !important}`
 *       (line 1822/2723), which is what makes the bare attribute win over
 *       `.row{display:grid}`.
 *   (d) announces via `.count`'s `role="status" aria-live="polite"`.
 *
 * The five zero-count sector chips carry `aria-disabled="true"` rather than
 * `disabled`, so they stay in the tab order (the count is the one thing a
 * keyboard user wants from an empty chip) and the click handler ignores
 * them — `inner-pages.css`'s `.paytoggle button[aria-disabled="true"]` rule
 * (F-02) supplies the dimmed treatment.
 */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BLOG_SECTOR_BY_SLUG, BLOG_SECTOR_KEYS, BLOG_SECTOR_LABELS } from '@/lib/blog-sectors';
import { TOPIC_LABELS, type TopicSlug } from '@/lib/blog-topics';
import { formatMonthYear } from '@/lib/blog-format';

const CAP = 4;

export interface LibraryRow {
  slug: string;
  title: string;
  readingTime?: number;
  date: string;
}

export interface LibraryTopic {
  slug: TopicSlug;
  heading: string;
  description: string;
  /** Every post in this category, already sorted newest-first. */
  rows: LibraryRow[];
}

export interface BlogFilterSectionProps {
  topics: LibraryTopic[];
  totalPosts: number;
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

export function BlogFilterSection({ topics, totalPosts }: BlogFilterSectionProps) {
  const [topicFilter, setTopicFilter] = useState<'all' | TopicSlug>('all');
  const [sectorFilter, setSectorFilter] = useState<'all' | (typeof BLOG_SECTOR_KEYS)[number]>(
    'all'
  );

  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const key of BLOG_SECTOR_KEYS) counts[key] = 0;
    for (const sector of Object.values(BLOG_SECTOR_BY_SLUG)) counts[sector] += 1;
    return counts;
  }, []);

  const wide = topicFilter === 'all' && sectorFilter === 'all';

  const computed = topics.map((topic) => {
    const topicHit = topicFilter === 'all' || topic.slug === topicFilter;
    const rowsWithHit = topic.rows.map((row, index) => {
      const sector = BLOG_SECTOR_BY_SLUG[row.slug];
      const sectorHit = sectorFilter === 'all' || sector === sectorFilter;
      const hit = topicHit && sectorHit;
      const capped = wide && index >= CAP;
      return { row, sector, hit, visible: hit && !capped };
    });
    const matches = rowsWithHit.filter((r) => r.hit).length;
    return { topic, rowsWithHit, hidden: !(topicHit && matches > 0) };
  });

  const shown = computed.reduce((n, t) => n + t.rowsWithHit.filter((r) => r.visible).length, 0);

  const countText = wide
    ? `${totalPosts} guides across ${topics.length} topics`
    : shown === 0
      ? `Nothing matches ${[
          topicFilter !== 'all' ? TOPIC_LABELS[topicFilter] : null,
          sectorFilter !== 'all' ? BLOG_SECTOR_LABELS[sectorFilter] : null,
        ]
          .filter(Boolean)
          .join(' + ')}`
      : `Showing ${shown} of ${totalPosts} — ${[
          topicFilter !== 'all' ? TOPIC_LABELS[topicFilter] : null,
          sectorFilter !== 'all' ? BLOG_SECTOR_LABELS[sectorFilter] : null,
        ]
          .filter(Boolean)
          .join(' + ')}`;

  return (
    <>
      <div className="filterset" id="filterset">
        <div className="filterax">
          <p className="eyeless" id="lbl-topic">
            Topic
          </p>
          <div className="paytoggle" id="f-topic" role="group" aria-labelledby="lbl-topic">
            <button
              type="button"
              aria-pressed={topicFilter === 'all'}
              onClick={() => setTopicFilter('all')}
            >
              All <span aria-hidden="true">{totalPosts}</span>
            </button>
            {topics.map((topic) => (
              <button
                key={topic.slug}
                type="button"
                aria-pressed={topicFilter === topic.slug}
                onClick={() => setTopicFilter(topic.slug)}
              >
                {TOPIC_LABELS[topic.slug]}
              </button>
            ))}
          </div>
        </div>
        <div className="filterax">
          <p className="eyeless" id="lbl-sector">
            Who it&rsquo;s for
          </p>
          <div className="paytoggle" id="f-sector" role="group" aria-labelledby="lbl-sector">
            <button
              type="button"
              aria-pressed={sectorFilter === 'all'}
              onClick={() => setSectorFilter('all')}
            >
              Anyone
            </button>
            {BLOG_SECTOR_KEYS.map((key) => {
              const count = sectorCounts[key];
              const disabled = count === 0;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={sectorFilter === key}
                  aria-disabled={disabled ? 'true' : undefined}
                  onClick={() => {
                    if (disabled) return;
                    setSectorFilter(key);
                  }}
                >
                  {BLOG_SECTOR_LABELS[key]} <span aria-hidden="true">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        <span className="count" id="count" role="status" aria-live="polite">
          {countText}
        </span>
      </div>

      {computed.map(({ topic, rowsWithHit, hidden }) => (
        <section className="topic" data-topic={topic.slug} key={topic.slug} hidden={hidden}>
          <div className="topic__h">
            <h3>{topic.heading}</h3>
            <Link className="card__link" href={`/blog/category/${topic.slug}`}>
              {topic.rows.length} {topic.rows.length === 1 ? 'guide' : 'guides'}
              <ArrowIcon />
            </Link>
          </div>
          <p className="topic__d">{topic.description}</p>
          <div className="work">
            {rowsWithHit.map(({ row, sector, visible }) => (
              <Link
                key={row.slug}
                className="row"
                href={`/blog/${row.slug}`}
                data-sector={sector}
                hidden={!visible}
              >
                <span className="row__n">{row.title}</span>
                <span className="row__m">
                  {row.readingTime ? `${row.readingTime} min read` : null}
                  <em>{formatMonthYear(row.date)}</em>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div className="empty" id="empty" data-show={shown === 0 ? 'true' : 'false'}>
        <h3>Nothing under both of those yet.</h3>
        <p>
          The library is still filling out &mdash; try one filter at a time, or{' '}
          <a href="mailto:mail@digitalconsultingservices.co.uk">ask me the question directly</a>.
        </p>
      </div>
    </>
  );
}
