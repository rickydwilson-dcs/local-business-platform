'use client';

/**
 * `.filterset` + the flat `.libr` list + `.libr__topics` + `.libr__more`
 * + `.empty` — the real, working topic filter on `/blog`.
 *
 * R2 RESTRUCTURE, 2026-09-26. Ported from
 * `output/sessions/2026-09/2026-09-26_dcs-blog-index-redesign/prototype/
 * blog-list.html`; that session's `session.md` carries the measurements and
 * the reasoning.
 *
 * WHAT CHANGED FROM THE PHASE 3b VERSION. This used to render seven
 * `.topic` sections, each a 35.2px `h3` plus a 62ch `.topic__d`, capped at
 * four rows apiece. That was ~120 words of scaffolding explaining categories
 * the titles already explained, and it restarted the reader's eye seven
 * times before anything could be picked. The chips were always the better
 * topic affordance — you press one rather than scrolling past seven — so the
 * headings go and the chips stay.
 *
 * THE SCALE CONSTRAINT SURVIVES. notes-f.md §0 (inner-pages design session)
 * is explicit that the index's height must be a function of the number of
 * TOPICS, not the number of posts — measured identical at 40 and 60 posts.
 * That is now carried by `CAP` + "show all" rather than by four-per-topic:
 * twelve rows at rest whatever the library holds, and the cap lifts the
 * moment a chip narrows the list. Height at rest is a function of the cap.
 *
 * THE SEVEN TOPIC DESCRIPTIONS ARE NOT LOST. `TOPIC_DESCRIPTIONS` is already
 * the masthead `.lead` on `/blog/category/[slug]` (see `lib/blog-topics.ts`'s
 * header and `blog-category-page.tsx`) — they keep the one surface where
 * they are the page's own intro rather than one of seven competing for the
 * same screen. Nothing was deleted to make this change.
 *
 * Contract kept from the previous version:
 *   (a) hides with the `hidden` ATTRIBUTE on the `.row` anchor, matching
 *       `inner-pages.css`'s global `[hidden]{display:none !important}`,
 *       which is what makes the bare attribute win over `.row{display:grid}`.
 *   (b) announces via `.count`'s `role="status" aria-live="polite"`.
 *   (c) no sector axis — Ricky declined the chips 2026-09-19, and
 *       `lib/blog-sectors.ts`'s header is explicit that it is not an
 *       invitation to re-add them.
 */

import Link from 'next/link';
import { useState } from 'react';
import { TOPIC_LABELS, TOPIC_ORDER, type TopicSlug } from '@/lib/blog-topics';
import { formatMonthYear } from '@/lib/blog-format';

/** Rows visible at rest. Twelve rather than the old four-per-topic: one
 *  screenful and a bit, enough that the list reads as a library rather than
 *  as a teaser, and bounded so 60 posts measure the same as 21. */
const CAP = 12;

export interface LibraryRow {
  slug: string;
  title: string;
  readingTime?: number;
  date: string;
  /** `null` for a post whose `category` is not one of the seven real values.
   *  It still renders and still appears under "All" — it simply carries no
   *  topic label and matches no chip. The old seven-block layout dropped
   *  such a post from the page entirely; a flat list does not have to. */
  topic: TopicSlug | null;
}

export interface BlogFilterSectionProps {
  /** Every post, newest-first — the featured one INCLUDED. See
   *  `blog-list-page.tsx` for why the spotlight and the library overlap. */
  rows: LibraryRow[];
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

export function BlogFilterSection({ rows }: BlogFilterSectionProps) {
  const [topic, setTopic] = useState<'all' | TopicSlug>('all');
  const [expanded, setExpanded] = useState(false);

  const total = rows.length;
  const wide = topic === 'all';

  const computed = rows.map((row, index) => {
    const hit = wide || row.topic === topic;
    // the cap only bites in the unfiltered, unexpanded view
    const capped = wide && !expanded && index >= CAP;
    return { row, visible: hit && !capped, hit };
  });

  const shown = computed.filter((r) => r.visible).length;
  const matches = computed.filter((r) => r.hit).length;

  const countText = wide
    ? expanded
      ? `Showing all ${total} guides`
      : `Showing ${shown} of ${total} guides`
    : matches === 0
      ? `Nothing under ${TOPIC_LABELS[topic]}`
      : `Showing ${shown} of ${total} — ${TOPIC_LABELS[topic]}`;

  function pick(next: 'all' | TopicSlug) {
    setTopic(next);
    setExpanded(false);
  }

  return (
    <>
      <div className="filterset" id="filterset">
        <div className="filterax">
          <p className="eyeless" id="lbl-topic">
            Topic
          </p>
          <div className="paytoggle" id="f-topic" role="group" aria-labelledby="lbl-topic">
            <button type="button" aria-pressed={wide} onClick={() => pick('all')}>
              All <span aria-hidden="true">{total}</span>
            </button>
            {TOPIC_ORDER.map((slug) => (
              <button
                key={slug}
                type="button"
                aria-pressed={topic === slug}
                onClick={() => pick(slug)}
              >
                {TOPIC_LABELS[slug]}
              </button>
            ))}
          </div>
        </div>
        <span className="count" id="count" role="status" aria-live="polite">
          {countText}
        </span>
      </div>

      <div className="work libr" id="libr">
        {computed.map(({ row, visible }) => (
          <Link
            key={row.slug}
            className="row"
            href={`/blog/${row.slug}`}
            data-topic={row.topic ?? undefined}
            hidden={!visible}
          >
            <span className="row__n">{row.title}</span>
            <span className="row__m">
              {row.topic ? <b className="row__t">{TOPIC_LABELS[row.topic]}</b> : null}
              {row.readingTime ? <span>{row.readingTime} min read</span> : null}
              <em>{formatMonthYear(row.date)}</em>
            </span>
          </Link>
        ))}
      </div>

      {/* The seven category pages' only way in — see inner-pages.css R2-04.
          Real anchors in the server-rendered HTML, not behind a chip. */}
      <nav className="libr__topics" aria-label="Topic pages">
        <span>Topic pages</span>
        {TOPIC_ORDER.map((slug) => (
          <Link key={slug} href={`/blog/category/${slug}`}>
            {TOPIC_LABELS[slug]}
          </Link>
        ))}
      </nav>

      <div className="libr__more" id="more" hidden={!(wide && !expanded)}>
        <button
          className="btn btn--ghost"
          type="button"
          id="showall"
          onClick={() => setExpanded(true)}
        >
          Show all {total} guides
          <ArrowIcon />
        </button>
      </div>

      <div className="empty" id="empty" data-show={matches === 0 ? 'true' : 'false'}>
        <h3>Nothing under that topic yet.</h3>
        <p>
          The library is still filling out &mdash; or{' '}
          <a href="mailto:mail@digitalconsultingservices.co.uk">ask me the question directly</a>.
        </p>
      </div>
    </>
  );
}
