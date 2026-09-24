/**
 * `/blog/[slug]` page body — ported class-for-class from
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/
 * blog-post.html`, the one post (`a-fast-team-needs-a-fast-website`) the
 * design session built out in full. The r9 chrome is `app/(site)/layout.tsx`
 * -> `SiteChrome`'s job; this renders only what sits inside it.
 *
 * session.md §3 2.3: this route is "the one place where the r9 chapter-panel
 * language has to yield to legibility" — one ground change for the body,
 * `.measure`'s 74ch, `.prose` doing the work.
 *
 * GENERALISED BEYOND THE DEMO, to all 21 real `content/blog/*.mdx` posts:
 *   - The `.jump` list is built by scanning the post's own `##`/`###`
 *     headings (`lib/blog-headings.ts`), not hand-typed — see that file's
 *     header on why its ids differ from the one demoed post's hand-picked
 *     short ids, though the rendered link TEXT for that post is identical.
 *   - "More in this topic" shows up to 3 other posts in the same category,
 *     with honest wording for 0 / 1 / 2+ others — the prototype only ever
 *     demoes the 1-other case (`website-design`, 2 posts total).
 *   - `.chips` render every real `tags` entry, hyphens read as spaces and
 *     each word capitalised — NOT links (no tag route exists; see
 *     `prototype/blog-post.html`'s own header on why static `.chip`s).
 */

import Link from 'next/link';
import type { BlogPost } from '@/lib/content';
import { BLOG_SECTOR_LABELS, toBlogSector } from '@/lib/blog-sectors';
import { TOPIC_ORDER, categoryOf, topicHeadingOf, topicOf } from '@/lib/blog-topics';
import { extractHeadings } from '@/lib/blog-headings';
import { formatMonthYear } from '@/lib/blog-format';
import { BlogProse } from './blog-prose';

function tagLabel(tag: string): string {
  return tag
    .split('-')
    .map((word) => (word.length === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join(' ');
}

export interface BlogPostPageProps {
  post: BlogPost;
  /** Raw MDX body — `getBlogPost(slug)`'s own `content` field, unedited. */
  content: string;
  /** Every other real post, for the "More in this topic" band. */
  allPosts: BlogPost[];
}

export function BlogPostPage({ post, content, allPosts }: BlogPostPageProps) {
  const topic = topicOf(post);
  const topicHeading = topicHeadingOf(post);
  const sector = toBlogSector(post.sector);
  const headings = extractHeadings(content).filter((h) => h.depth === 2);

  const sameTopic = allPosts.filter(
    (p) => p.slug !== post.slug && categoryOf(p) === categoryOf(post)
  );
  const related = sameTopic.slice(0, 3);

  let relatedLead: string;
  if (sameTopic.length === 0) {
    relatedLead =
      "There's nothing else under this topic yet — the rest of the library is two clicks away.";
  } else if (sameTopic.length === 1) {
    relatedLead =
      "There is one other guide under this topic so far, and you'll find it below. The library is still filling out — the whole of it is two clicks away.";
  } else {
    relatedLead = `There are ${sameTopic.length} more guides under this topic. The whole library is two clicks away.`;
  }

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
            {topic ? (
              <li>
                <Link href={`/blog/category/${topic}`}>{topicHeading}</Link>
              </li>
            ) : null}
            <li>
              <span aria-current="page">{post.title}</span>
            </li>
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">{topicHeading}</p>
        <h1>{post.title}</h1>
        {post.excerpt ? <p className="lead">{post.excerpt}</p> : null}

        <div className="mast__meta">
          <div>
            <b>{post.author.name}</b>
            <span>Written by</span>
          </div>
          <div>
            <b>{formatMonthYear(post.date)}</b>
            <span>Published</span>
          </div>
          {post.readingTime ? (
            <div>
              <b>{post.readingTime} min</b>
              <span>Read time</span>
            </div>
          ) : null}
          {sector ? (
            <div>
              <b>{BLOG_SECTOR_LABELS[sector]}</b>
              <span>Who it&rsquo;s for</span>
            </div>
          ) : null}
        </div>
      </header>

      {/* ===== 2. THE BODY — white ===== */}
      <section className="sec p--white" data-ground="white">
        <div className="measure">
          {headings.length > 0 ? (
            <nav className="jump" aria-labelledby="jump-l">
              <p className="eyeless" id="jump-l">
                In this guide
              </p>
              <ol>
                {headings.map((h) => (
                  <li key={h.slug}>
                    <a href={`#${h.slug}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <BlogProse content={content} />
        </div>
      </section>

      {/* ===== 3. FILED UNDER + WHERE NEXT — aqua ===== */}
      <section className="sec p--aqua" data-ground="aqua">
        {post.tags && post.tags.length > 0 ? (
          <>
            <p className="eyeless">Filed under</p>
            <div className="chips">
              {post.tags.map((tag) => (
                <span className="chip" key={tag}>
                  {tagLabel(tag)}
                </span>
              ))}
            </div>
          </>
        ) : null}

        <p className="eyeless" style={{ marginTop: 'clamp(56px,8vh,96px)' }}>
          More in this topic
        </p>
        <h2 className="res">{topicHeading}.</h2>
        <p className="lead">{relatedLead}</p>
        {related.length > 0 ? (
          <div className="work">
            {related.map((p) => (
              <Link className="row" href={`/blog/${p.slug}`} key={p.slug}>
                <span className="row__n">{p.title}</span>
                <span className="row__m">
                  {p.readingTime ? `${p.readingTime} min read` : null}
                  <em>{formatMonthYear(p.date)}</em>
                </span>
              </Link>
            ))}
          </div>
        ) : null}
        <p className="lead">
          <Link className="card__link" href="/blog" style={{ marginTop: 0 }}>
            All {allPosts.length} guides, across {TOPIC_ORDER.length} topics
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2 8h11M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </p>
      </section>
    </>
  );
}
