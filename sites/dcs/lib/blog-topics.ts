/**
 * The seven real blog `category` values, and the display copy the r9 design
 * uses for each of them.
 *
 * SOURCE: `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/
 * prototype/blog-list.html` and `blog-category.html` — every string below is
 * copied off those approved, signed-off pages (notes-f.md §5.3 records the
 * same mapping). The `category` slugs themselves are real frontmatter values
 * (verified by counting `content/blog/*.mdx`: local-seo 6, costs-and-value 3,
 * website-content 3, industry-guides 3, getting-found-online 3,
 * website-design 2, business-tools 1 = 21, seven categories — NOT eight; an
 * earlier brief/session.md said eight, which notes-f.md §8.1 flags as wrong).
 *
 * TOPIC_ROW_DESCRIPTORS's `local-seo` entry is the one value NOT sourced
 * from a prototype: `blog-category.html` only demoes the `local-seo` page
 * itself, so its own row never appears in that page's "other topics" list —
 * the six values that DO appear there (for the other six topics) are
 * copied verbatim. Rather than invent new prose for the missing seventh,
 * that slot reuses `TOPIC_LABELS['local-seo']` ("Local search"), which is
 * itself approved design text used elsewhere on the same pages. Flagged in
 * the Phase 3 report as a design detail the prototype doesn't cover.
 */

export const TOPIC_ORDER = [
  'local-seo',
  'getting-found-online',
  'costs-and-value',
  'website-content',
  'industry-guides',
  'website-design',
  'business-tools',
] as const;

export type TopicSlug = (typeof TOPIC_ORDER)[number];

/** Short filter-chip labels (`blog-list.html:228-234`). */
export const TOPIC_LABELS: Record<TopicSlug, string> = {
  'local-seo': 'Local search',
  'getting-found-online': 'Getting found',
  'costs-and-value': 'Costs and value',
  'website-content': 'Site content',
  'industry-guides': 'Sector guides',
  'website-design': 'Design and speed',
  'business-tools': 'Tools and email',
};

/** The problem-led prose heading used as both the topic block's `<h3>` on
 *  `/blog` and the `<h1>` on `/blog/category/[slug]` (`blog-list.html:255-
 *  437`, `blog-category.html:105`). */
export const TOPIC_HEADINGS: Record<TopicSlug, string> = {
  'local-seo': 'Showing up in local search',
  'getting-found-online': 'Getting found in the first place',
  'costs-and-value': 'Working out what to spend',
  'website-content': 'Deciding what goes on the site',
  'industry-guides': 'What a site needs, sector by sector',
  'website-design': 'Making it fast and usable',
  'business-tools': 'The tools around the website',
};

/** `.topic__d` on `/blog` — also reused as the category page's masthead
 *  `.lead` for the six topics `blog-category.html` never demoed (only
 *  `local-seo` has a hand-written, topic-specific masthead lead in the
 *  prototype; see `components/blog/blog-category-page.tsx`'s header). */
export const TOPIC_DESCRIPTIONS: Record<TopicSlug, string> = {
  'local-seo':
    'The map pack, reviews, structured data, and the pages that make a business findable in the town it actually works in.',
  'getting-found-online':
    'Starting from nothing — or from a Facebook page — and turning the visits you do get into enquiries.',
  'costs-and-value':
    'What a website really costs, what SEO is worth paying for, and whether to buy it outright or monthly.',
  'website-content':
    'Which pages you actually need, what to write on them, and how to let proof of work do the selling instead of adjectives.',
  'industry-guides':
    "Worked examples. What changes when the business is an electrician rather than a plumber — and, more usefully, what doesn't.",
  'website-design':
    'How a site is built decides how fast it feels, and how fast it feels decides whether anyone waits around to read it.',
  'business-tools':
    'Professional email, and the handful of other things worth setting up once and then forgetting about.',
};

/** `.row__m em` short descriptor for a topic when it appears in another
 *  topic page's "other topics" list (`blog-category.html:196-219`). See this
 *  file's header re: the `local-seo` value. */
export const TOPIC_ROW_DESCRIPTORS: Record<TopicSlug, string> = {
  'local-seo': TOPIC_LABELS['local-seo'], // not in any prototype — see header
  'getting-found-online': 'Starting from nothing',
  'costs-and-value': 'Costs and value',
  'website-content': 'Pages and copy',
  'industry-guides': 'Worked examples',
  'website-design': 'Design and speed',
  'business-tools': 'Email and admin',
};

/**
 * Shared post -> topic helpers, used by all three `/blog` routes.
 *
 * `BlogFrontmatterSchema.category` (`packages/core-components/src/lib/
 * content-schemas.ts`) is typed against a 5-value legacy enum that does not
 * match the 7 real values this site's content actually uses — a pre-existing
 * schema/content drift this port does not fix (`getBlogPosts()` never runs
 * the frontmatter through Zod's `.parse()`, only casts it, so nothing breaks
 * at runtime). `categoryOf` widens to `string` so comparing a post's category
 * against a `TopicSlug` doesn't trip TS2367 ("this comparison appears to be
 * unintentional because the types have no overlap").
 */
export interface BlogPostLike {
  category: unknown;
}

export function categoryOf(post: BlogPostLike): string {
  return post.category as string;
}

/** A post's topic slug, when it is one of the 7 real values (always, for
 *  real content) — falls back to the raw category string for a future post
 *  with an unmapped value, rather than throwing. */
export function topicOf(post: BlogPostLike): TopicSlug | null {
  const category = categoryOf(post);
  return (TOPIC_ORDER as readonly string[]).includes(category) ? (category as TopicSlug) : null;
}

export function topicLabelOf(post: BlogPostLike): string {
  const topic = topicOf(post);
  return topic ? TOPIC_LABELS[topic] : categoryOf(post);
}

export function topicHeadingOf(post: BlogPostLike): string {
  const topic = topicOf(post);
  return topic ? TOPIC_HEADINGS[topic] : categoryOf(post);
}
