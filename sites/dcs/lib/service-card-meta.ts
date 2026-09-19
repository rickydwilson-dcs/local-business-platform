/**
 * Curated presentation metadata for the six `content/services/*.mdx` items,
 * ported from the approved design
 * (`output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/services-list.html`
 * and `service-detail.html`).
 *
 * WHY THIS FILE EXISTS RATHER THAN READING EVERYTHING FROM FRONTMATTER.
 * The `/services` list page and the "other five" panel on `/services/[slug]`
 * both need a few things no `content/services/*.mdx` frontmatter field
 * carries: a fixed narrative ORDER (the design tells a story — the build,
 * then what attaches to it, then the ongoing relationship — not alphabetical
 * order), a `.svccard`/`.bar` GROUND colour per card, and short stat/label
 * microcopy the design authored directly in the prototype rather than
 * deriving from a structured field.
 *
 * Every figure below is real and cited, not invented:
 *   - £750 / £45 come from `components/home/home-data.ts`'s `TIERS[0]`
 *     (`starter`), the same canonical figures `/pricing` renders.
 *   - "2–3 weeks" and "one business day" are the literal answers given in
 *     `content/services/web-design.mdx` and
 *     `content/services/monthly-management.mdx`'s own FAQs.
 *   - "30 days" is `home-data.ts`'s own cancellation-notice line (`CANCEL`
 *     copy, ~line 215) and matches `monthly-management.mdx`'s FAQ.
 *   - The WooCommerce/Stripe/PayPal and £5.50-per-user figures are the
 *     platform/pricing facts stated in `ecommerce.mdx` and
 *     `google-workspace.mdx`'s own FAQs.
 *
 * TITLES. `displayTitle` below is shorter than the real MDX `title` for all
 * six services, sentence-case rather than Title Case. This mirrors what
 * `services-list.html` itself does for every card, not only the two the
 * design session's own notes call out by name ("Website Design for
 * Tradespeople" -> "Website Design", "Local SEO for Tradespeople" -> "Local
 * SEO") — e.g. the prototype also renders "eCommerce websites" for a page
 * whose real title is "eCommerce Websites for Small Businesses". Ported
 * verbatim from the prototype for all six, since the settled design does it
 * uniformly; flagged in the Phase 2 report as a design detail broader than
 * the two the notes named explicitly. The full MDX `title` is still what
 * renders as the page's own `<h1>`, in metadata, and in breadcrumbs — only
 * the list-page CARD title and the "other five" row label are shortened.
 */

import { TIERS } from '@/components/home/home-data';

const STARTER = TIERS.find((t) => t.key === 'starter');
if (!STARTER) {
  throw new Error('TIERS has no "starter" tier — service-card-meta.ts depends on it');
}

export type CardGround = 'ink' | 'magenta' | 'navy' | 'aqua';

export interface ServiceStat {
  fig: string;
  label: string;
}

export interface ServiceCardMeta {
  /** Must match a real `content/services/<slug>.mdx` filename. */
  slug: string;
  ground: CardGround;
  /** `.svccard--wide` in the design — cards 01 and 06 only. */
  wide?: boolean;
  /** The design's own shortened, sentence-case card/row title (see header). */
  displayTitle: string;
  /** `.svccard__d` blurb. Real `content/services/<slug>.mdx` `description`,
   *  with only the recorded plural -> singular voice edit applied at render
   *  time (`toFirstPersonSingular` in `ServicesPage.tsx`) — not hand-typed
   *  here, so a future content edit to the MDX flows through automatically. */
  stats: ServiceStat[];
  /** `.svccard__l` link label, e.g. "How a build works". */
  linkLabel: string;
  /** The `.work .row` pairing shown on every OTHER service's "other five"
   *  panel (`service-detail.html:264-291`). `meta` is the bold `.row__m`
   *  line, `sub` the `<em>` beneath it. */
  otherRow: { meta: string; sub: string };
}

/**
 * Design order (`services-list.html`'s own numbering, 01/06 .. 06/06):
 * the build everything attaches to, then the two things that attach to it
 * directly (shop, local search), then the two operational add-ons
 * (reporting, email), then the ongoing relationship last — immediately
 * before the navy footer, matching the homepage's own aqua -> navy close.
 */
export const SERVICE_CARDS: readonly ServiceCardMeta[] = [
  {
    slug: 'web-design',
    ground: 'ink',
    wide: true,
    displayTitle: 'Website design',
    stats: [
      { fig: STARTER.upfront.fig, label: 'Upfront build from' },
      { fig: STARTER.monthly.fig + '/month', label: 'Pay monthly from' },
      { fig: '2–3 weeks', label: 'Typical build' },
    ],
    linkLabel: 'How a build works',
    otherRow: { meta: `From ${STARTER.monthly.fig}/month`, sub: 'Website build & management' },
  },
  {
    slug: 'ecommerce',
    ground: 'magenta',
    displayTitle: 'eCommerce websites',
    stats: [
      { fig: 'WooCommerce', label: 'Platform' },
      { fig: 'Stripe & PayPal', label: 'Checkout' },
    ],
    linkLabel: 'How a shop is built',
    otherRow: { meta: 'WooCommerce', sub: 'Built, loaded and managed' },
  },
  {
    slug: 'local-seo',
    ground: 'navy',
    displayTitle: 'Local SEO',
    stats: [
      { fig: 'Included', label: 'With every build' },
      { fig: 'Service + location pages', label: 'What it adds' },
    ],
    linkLabel: "What's included",
    otherRow: { meta: 'Built in as standard', sub: 'Included with every build' },
  },
  {
    slug: 'analytics',
    ground: 'ink',
    displayTitle: 'Analytics & reporting',
    stats: [
      { fig: 'GA4 + Search Console', label: 'Set up for you' },
      { fig: 'Monthly', label: 'Plain-English report' },
    ],
    linkLabel: 'What a report covers',
    otherRow: { meta: 'Plain-English monthly', sub: 'Analytics and Search Console' },
  },
  {
    slug: 'google-workspace',
    ground: 'magenta',
    displayTitle: 'Google Workspace business email',
    stats: [
      { fig: 'One-off setup', label: 'What I charge' },
      { fig: 'From £5.50 per user', label: 'Google bills you' },
    ],
    linkLabel: 'How setup works',
    otherRow: { meta: 'One-off setup', sub: 'Google bills you directly' },
  },
  {
    slug: 'monthly-management',
    ground: 'aqua',
    wide: true,
    displayTitle: 'Ongoing website management',
    stats: [
      { fig: STARTER.monthly.fig + '/month', label: 'Fully managed, from' },
      { fig: 'One business day', label: 'Typical content change' },
      { fig: '30 days', label: 'Notice to cancel' },
    ],
    linkLabel: "What's covered",
    otherRow: { meta: `From ${STARTER.monthly.fig}/month`, sub: 'Hosting, updates, support' },
  },
] as const;

export function getServiceCardMeta(slug: string): ServiceCardMeta | undefined {
  return SERVICE_CARDS.find((c) => c.slug === slug);
}

/** The masthead's four site-wide stats, real across both `/services` and
 *  every `/services/[slug]` — see this file's header for citations. */
export const SERVICE_HERO_STATS: readonly ServiceStat[] = [
  { fig: STARTER.upfront.fig, label: 'Upfront build from' },
  { fig: STARTER.monthly.fig + '/month', label: 'Pay monthly from' },
  { fig: '2–3 weeks', label: 'Typical build' },
  { fig: '30 days', label: 'Notice to cancel' },
] as const;

/** "One" .. "Six" — the design writes the services count as a word
 *  (`services-list.html:111`, "Six"), not a numeral. Bounded to what a
 *  service list realistically needs; anything past ten falls back to the
 *  numeral rather than guessing a word. */
const COUNT_WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
];
export function countWord(n: number): string {
  return COUNT_WORDS[n] ?? String(n);
}

/**
 * The recorded voice edit for this page's card copy — "we/our/us" ->
 * "I/my/me" — applied at render time to the real MDX `description` rather
 * than baked into a hand-typed string, so a future content edit still flows
 * through. Deliberately narrow (whole-word, common pronoun forms only): this
 * is short marketing microcopy, not body prose, where the generic "judgement
 * call, not a regex" caution for Phase 6's MDX voice pass applies.
 */
export function toFirstPersonSingular(text: string): string {
  return text
    .replace(/\bWe\b/g, 'I')
    .replace(/\bwe\b/g, 'I')
    .replace(/\bOur\b/g, 'My')
    .replace(/\bour\b/g, 'my')
    .replace(/\bUs\b/g, 'Me')
    .replace(/\bus\b/g, 'me');
}
