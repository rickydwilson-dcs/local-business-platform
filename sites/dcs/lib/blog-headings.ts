/**
 * Heading extraction + slugification for `/blog/[slug]`'s in-page jump list
 * (`.jump`, ported from `prototype/blog-post.html:145-152`).
 *
 * The demoed prototype hand-picks its own short ids ("speed-is-a-trust-
 * signal" for a heading reading "Speed is a trust signal, not a vanity
 * metric") — a curated label, not a literal slug of the full heading text.
 * Generalising to all 21 posts needs a MECHANICAL slug so every post gets a
 * correct, working jump list without hand-tuning 21 sets of ids (the same
 * class of generalisation `components/projects/project-detail-page.tsx`'s
 * header makes explicit for its own demoed-instance-only fields). Flagged in
 * the Phase 3 report: the one demoed post's jump-list ids will differ from
 * this mechanical slug, though the rendered LINK TEXT is identical.
 *
 * Reuses this codebase's existing `slugify()`
 * (`packages/core-components/src/lib/site-utils.ts`, re-exported from
 * `@/lib/site`) rather than importing `github-slugger` — that package is a
 * transitive dependency of `rehype-slug`, not a direct one, and pnpm's
 * strict `node_modules` layout means it cannot be `import`ed here without
 * adding it as a direct dependency, and rather than writing a second,
 * near-duplicate slugify. `blog-prose.tsx`'s `h2`/`h3` renderer uses this
 * SAME function (not `rehype-slug`) to assign the real DOM `id`, so the jump
 * list's `href`s are always guaranteed to match — internal consistency, not
 * byte-parity with any particular slugger library.
 */

import { slugify } from '@/lib/site';
export { slugify };

export interface BlogHeading {
  depth: 2 | 3;
  text: string;
  slug: string;
}

/** Regex line scan over the raw MDX body, skipping fenced code blocks. Only
 *  `##`/`###` headings are collected — `.prose h2[id],h3[id]` is the only
 *  scroll-margin rule `inner-pages.css` defines, and none of the 21 posts
 *  nests a heading inside a fence. */
export function extractHeadings(content: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  let inFence = false;

  for (const line of content.split('\n')) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const h3 = /^###\s+(.+?)\s*$/.exec(line);
    if (h3) {
      headings.push({ depth: 3, text: h3[1], slug: slugify(h3[1]) });
      continue;
    }
    const h2 = /^##\s+(.+?)\s*$/.exec(line);
    if (h2) {
      headings.push({ depth: 2, text: h2[1], slug: slugify(h2[1]) });
    }
  }

  return headings;
}
