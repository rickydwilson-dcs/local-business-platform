/**
 * Build Detail Page — the "documented car" template
 * ===================================================
 *
 * Shared template for any `builds` MDX entry with `pageStatus: 'built'`, rendered at
 * `/builds/[slug]` (see app/builds/[slug]/page.tsx). This is ONE template used by both the
 * P1800 Candy and E-type pages today — not two one-off layouts — driven entirely by a build's
 * frontmatter (BuildFrontmatter, lib/content-schemas.ts) plus its real MDX body content.
 *
 * Ported from the approved static prototype's two "documented car" pages, both read in full:
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/volvo-p1800.html
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/etype-941pvo.html
 *
 * WHAT THE REAL TEMPLATE IS (structure, not styling — verified against both files' markup):
 *
 * 1. PER-CAR ACCENT. Each page themes itself to its own car's paint via `--accent` (fill) and
 *    `--accent-ink` (text/rules): `#3C5563`/`#A3BFCE` on the E-type (Opalescent Silver Blue),
 *    `#A61C24`/`#E4776C` on the P1800 (Candy Red). Both are declared as `@property` custom
 *    properties at the top of each prototype file and repeated as `data-accent`/`data-ink`
 *    attributes on its scroll sections. Here they come from the build's own `accent` frontmatter
 *    and are set as `--build-accent` / `--build-accent-ink` on the page wrapper, falling back to
 *    the theme's brand tokens when a build has no verified paint colour. Everything accented on
 *    the page reads those two variables — nothing references the site-wide red directly, which
 *    is what previously put candy-red furniture on a blue car.
 *
 * 2. HERO. A full-bleed photographic stage: eyebrow label, h1 at
 *    `clamp(2.75rem,min(7.6vw,12vh),6.75rem)` capped at 17ch, a `.lede` line, a back link, and a
 *    `<figcaption>` with a bold lead-in plus regular continuation. The prototype cross-fades
 *    between two photographic "stops" on scroll (`.plate` → `.resolve`); that motion is
 *    deliberately NOT reproduced — this renders the stop the page opens on, plus its real
 *    caption, and the second stop is carried in the build's photo sections so no approved
 *    photograph is dropped.
 *
 * 3. NUMBERED CHAPTER BANDS. Every section opens with a hairline rule, a short accent tab, a
 *    large accent chapter number (`.chapter__mark`) and a small-caps `.chapter__kind` eyebrow —
 *    and then, as a separate and much larger element, the `.h-major` display headline. Those are
 *    three distinct pieces of copy in the prototype ("01" + "THE RECORD" + "One car, documented in
 *    full"), never one, and no chapter headline is ever underlined. An MDX `##` heading is one
 *    string, so both halves are written into it with a `|` between them and split by
 *    `remarkBuildStructure` — see its doc comment. A heading with no `|` is eyebrow-only, which is
 *    what the prototype's plaque chapters are.
 *
 * 4. TWO-COLUMN NARRATIVE. `.section-head` is a two-column grid above 60rem: headline in the left
 *    column, its opening prose in the right. Where a section's body is a record spec table, the
 *    prototype puts that table in a half-width column too (`.lot-two` on both pages' §01,
 *    `.pairing` on the E-type's "The other car") — see `asTwoColumn`. Within a section,
 *    `article.entry` is a
 *    `minmax(0,5fr) minmax(0,9fr)` grid — stage/date meta, `h3.h-sub` title and byline on the
 *    left, prose and an optional `figure.bound` photo on the right (four of these on the P1800's
 *    log). `ol` becomes either the numbered `.stages` list (when its items carry a trailing
 *    `(duration)`) or the roman-numbered `.spec-list`; a `- **Label:** value` list becomes the
 *    auction-lot `dl.record` spec table, and a `- **450 hours** — descriptor` list becomes the
 *    `ul.proof` stat band (etype-941pvo.html's "450 hrs" moment). All of that is produced by
 *    `remarkBuildStructure` below, from the MDX body as already written.
 *
 * 5. PLAQUE. `figure.plaque` sets a quote over a full-width photograph of the finished car, with
 *    the attribution and follow-on prose beneath. A `>` blockquote in the body renders as this
 *    treatment whenever the build has a `plaque` photo, and as an ordinary pull-quote otherwise.
 *
 * 6. PHOTO SECTIONS. The prototype interleaves its photo grids into the narrative (two on the
 *    P1800, one on the E-type) rather than appending one gallery at the end, so `photoSections`
 *    carries `afterSection` — the ordinal of the `##` section each grid follows — and each photo
 *    carries the prototype's own alt text and two-part caption. `galleryImages` (plain URLs or
 *    photo objects) is still supported as a single trailing grid for builds that only have a
 *    flat list.
 *
 * The frontmatter-derived "record" panel is rendered only for builds whose MDX body does NOT
 * already contain its own `- **Label:** value` record list. Both of today's builds do (it is how
 * the prototype's own section 01 is written), so on those two pages the body's list IS the spec
 * table; without this check the page showed two "01" chapters and two overlapping record tables.
 * A sparse future build with no body record list still gets the frontmatter panel.
 */

import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import type { Build } from '@/lib/content';
import type { BuildCaption, BuildPhoto, BuildPhotoSection } from '@/lib/content-schemas';
import { ADDRESS, BUSINESS_EMAIL, PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { SourcingGapNotice } from '@/components/sourcing-gap-notice';
import { Play } from 'lucide-react';

const TEXT_SHADOW_SOFT =
  '[text-shadow:0_1px_24px_rgba(11,11,12,0.92),0_1px_4px_rgba(11,11,12,0.7)]';
const TEXT_SHADOW_STRONG =
  '[text-shadow:0_1px_28px_rgba(11,11,12,0.94),0_1px_4px_rgba(11,11,12,0.7)]';

/** `--page` in the prototype. */
const PAGE = 'mx-auto w-[min(1360px,100%-3rem)]';
/** `--hair` / `--hair-2`, the prototype's two hairline weights. */
const HAIR = 'border-[rgba(232,228,220,0.14)]';
const HAIR_2 = 'border-[rgba(232,228,220,0.07)]';
/** `.prose` — Newsreader (`font-prose`), 22.6em measure, `#CFCAC1`. */
const PROSE =
  'max-w-[22.6em] font-prose text-[clamp(1.125rem,0.5vw+1rem,1.375rem)] font-light leading-[1.62] text-[#CFCAC1] [font-variant-numeric:normal]';
/** `.label` — Archivo micro-caps. */
const LABEL = 'text-[0.6875rem] font-medium uppercase tracking-[0.2em]';
/** `.caption` — the small grey figcaption voice. */
const CAPTION = 'max-w-[44em] text-[0.8125rem] leading-[1.55] text-surface-muted-foreground';

/** Human labels for the enum fields, only used when the field is actually set. */
const BUILD_TYPE_LABEL: Record<NonNullable<Build['buildType']>, string> = {
  'concours-restoration': 'Concours restoration',
  'resto-mod': 'Resto-mod',
  'race-car': 'Race car',
};

const STATUS_LABEL: Record<Build['status'], string> = {
  completed: 'Completed',
  'in-progress': 'In the workshop now',
};

/* ════════════════════════════════════════════════════════════════════════════════════════════
   Minimal local mdast shapes — enough for the structural transform below without pulling in
   @types/mdast as a new dependency for four node kinds.
   ══════════════════════════════════════════════════════════════════════════════════════════ */

interface MdNode {
  type: string;
  children?: MdNode[];
  value?: string;
  depth?: number;
  ordered?: boolean;
  url?: string;
  alt?: string | null;
  title?: string | null;
  data?: { hName?: string; hProperties?: Record<string, unknown> };
}

/** A block-level carrier node: `blockquote`'s hast handler wraps block children correctly. */
function carrier(hName: string, children: MdNode[], hProperties?: Record<string, unknown>): MdNode {
  return { type: 'blockquote', data: { hName, ...(hProperties ? { hProperties } : {}) }, children };
}

/** An inline-level carrier node: `paragraph`'s handler renders one element around inlines. */
function inlineCarrier(hName: string, children: MdNode[]): MdNode {
  return { type: 'paragraph', data: { hName }, children };
}

function plainText(node: MdNode): string {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(plainText).join('');
}

/** Roman numerals for the `.spec-list` numbering (i, ii, iii…) — the prototype's own device. */
const ROMAN: readonly string[] = [
  'i',
  'ii',
  'iii',
  'iv',
  'v',
  'vi',
  'vii',
  'viii',
  'ix',
  'x',
  'xi',
  'xii',
];
function roman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

/** Drop a trailing `:` from the last text node of a `**Label:**` run. */
function withoutTrailingColon(children: MdNode[]): MdNode[] {
  const out = children.slice();
  const last = out[out.length - 1];
  if (last && typeof last.value === 'string' && last.value.endsWith(':')) {
    out[out.length - 1] = { ...last, value: last.value.slice(0, -1) };
  }
  return out;
}

/** Drop the leading whitespace / em-dash separator left behind after lifting a `**Label**` out. */
function withoutLeadingSeparator(children: MdNode[]): MdNode[] {
  const out = children.slice();
  const first = out[0];
  if (first && typeof first.value === 'string') {
    const trimmed = first.value.replace(/^[\s]*(?:[—–-]\s*)?/, '');
    if (trimmed) out[0] = { ...first, value: trimmed };
    else out.shift();
  }
  return out;
}

/**
 * `- **Marque:** Jaguar` → a `dl.record` row. Returns null when the item isn't that shape.
 *
 * `withSwatch` marks the build's FIRST record list — the identity block, where the prototype sets
 * a `<span class="swatch">` chip of the car's own paint beside the colour name
 * (`<dd><span class="swatch"><i></i>Candy Red</span></dd>` on volvo-p1800.html,
 * `…Opalescent Silver Blue…` on etype-941pvo.html). Later record lists on the same page — the
 * P1800's paint specification, the E-type's Aston Martin panel — carry a `Colour`/`Car` row too
 * and deliberately do NOT get a chip there, which is why this is positional rather than a
 * label-only match.
 */
function recordRow(item: MdNode, withSwatch: boolean): MdNode | null {
  if (!item.children || item.children.length !== 1) return null;
  const para = item.children[0];
  if (para.type !== 'paragraph' || !para.children?.length) return null;
  const [first, ...rest] = para.children;
  if (first.type !== 'strong' || !plainText(first).trim().endsWith(':')) return null;
  const label = withoutTrailingColon(first.children ?? []);
  const labelText = label.map(plainText).join('').trim().toLowerCase();
  const isColour = withSwatch && (labelText === 'colour' || labelText === 'color');
  return {
    type: 'listItem',
    data: { hName: 'brecordrow' },
    children: [
      inlineCarrier('brecorddt', label),
      inlineCarrier(isColour ? 'brecordddswatch' : 'brecorddd', withoutLeadingSeparator(rest)),
    ],
  };
}

/**
 * `- **450 hours** — Panel work through primer…` → one row of the prototype's `ul.proof` stat
 * band (etype-941pvo.html: a large `.proof__fig` numeral beside a `.proof__what` descriptor,
 * hairline-ruled top and bottom). Distinguished from a record row by the absence of the trailing
 * colon on the bold run, and required to carry a digit so an ordinary bold-led list can never be
 * mistaken for one.
 */
function statRow(item: MdNode): MdNode | null {
  if (!item.children?.length) return null;
  const para = item.children[0];
  if (para.type !== 'paragraph' || !para.children?.length) return null;
  const [first, ...rest] = para.children;
  if (first.type !== 'strong') return null;
  const figure = plainText(first).trim();
  if (!/\d/.test(figure) || figure.endsWith(':')) return null;
  const note = withoutLeadingSeparator(rest);
  if (!note.length) return null;
  return {
    type: 'listItem',
    data: { hName: 'bstatitem' },
    children: [inlineCarrier('bstatfig', first.children ?? []), inlineCarrier('bstatwhat', note)],
  };
}

/** `1. **Name** — note *(2 days)*` → a `.stages` / `.spec-list` row. */
function stageRow(item: MdNode, n: number, numbered: boolean): MdNode | null {
  if (!item.children?.length) return null;
  const para = item.children[0];
  if (para.type !== 'paragraph' || !para.children?.length) return null;
  const [first, ...rest] = para.children;
  if (first.type !== 'strong') return null;

  const body = rest.slice();
  let time: MdNode[] | null = null;
  const last = body[body.length - 1];
  if (last && last.type === 'emphasis') {
    const text = plainText(last).trim();
    const match = /^\((.+)\)$/.exec(text);
    if (match) {
      time = [{ type: 'text', value: match[1] }];
      body.pop();
    }
  }

  const children: MdNode[] = [
    inlineCarrier(numbered ? 'bstagen' : 'bspecn', [
      { type: 'text', value: numbered ? String(n).padStart(2, '0') : roman(n) },
    ]),
    inlineCarrier('bstagename', first.children ?? []),
    inlineCarrier('bstagenote', withoutLeadingSeparator(body)),
  ];
  if (time) children.push(inlineCarrier('bstagetime', time));
  // Any further block children of the list item (a second paragraph, say) follow the note.
  children.push(...item.children.slice(1));

  return {
    type: 'listItem',
    data: { hName: numbered ? 'bstage' : 'bspecitem' },
    children,
  };
}

/** Document-order state that has to survive across sections within one render. */
interface BlockState {
  /** How many `dl.record` lists have been emitted so far — see `recordRow`'s `withSwatch`. */
  records: number;
}

/** Lists → record tables / stage lists / stat bands; a lone image paragraph → a bound figure. */
function mapBlocks(nodes: MdNode[], state: BlockState): MdNode[] {
  return nodes.map((node) => {
    if (node.type === 'list' && node.children?.length) {
      if (!node.ordered) {
        const withSwatch = state.records === 0;
        const rows = node.children.map((item) => recordRow(item, withSwatch));
        if (rows.every((row): row is MdNode => row !== null)) {
          state.records += 1;
          return { ...node, data: { hName: 'brecord' }, children: rows };
        }
        const stats = node.children.map(statRow);
        if (stats.every((row): row is MdNode => row !== null)) {
          return { ...node, data: { hName: 'bstatband' }, children: stats };
        }
        return node;
      }
      // A trailing `*(duration)*` on any item marks the nine-stages list; without one this is
      // the owner's-specification list, which the prototype numbers in roman numerals.
      const numbered = node.children.some((item) => {
        const para = item.children?.[0];
        const last = para?.children?.[para.children.length - 1];
        return !!last && last.type === 'emphasis' && /^\(.+\)$/.test(plainText(last).trim());
      });
      const rows = node.children.map((item, i) => stageRow(item, i + 1, numbered));
      if (rows.every((row): row is MdNode => row !== null)) {
        return {
          ...node,
          data: { hName: numbered ? 'bstages' : 'bspeclist' },
          children: rows,
        };
      }
      return node;
    }

    if (
      node.type === 'paragraph' &&
      node.children?.length === 1 &&
      node.children[0].type === 'image'
    ) {
      // Lift the image out of its paragraph so the figure isn't nested inside a <p>. The
      // caption travels in the markdown image title as "Bold lead-in|regular continuation".
      return { ...node.children[0], data: { hName: 'bfigure' } };
    }

    return node;
  });
}

/** Group a section's body into `article.entry` blocks, one per `###` heading. */
function groupEntries(nodes: MdNode[]): MdNode[] {
  const out: MdNode[] = [];
  let index = 0;

  while (index < nodes.length) {
    const node = nodes[index];
    if (node.type !== 'heading' || node.depth !== 3) {
      out.push(node);
      index += 1;
      continue;
    }

    const body: MdNode[] = [];
    index += 1;
    while (index < nodes.length) {
      const next = nodes[index];
      if (next.type === 'heading' && (next.depth ?? 6) <= 3) break;
      body.push(next);
      index += 1;
    }

    // The prototype splits an entry's heading into a stage/date eyebrow and the title itself
    // ("Stage 09 — Out in the daylight" + "We photographed it more than we painted it"); the MDX
    // writes both in one heading, so split here, where the heading is still plain text.
    const headingText = plainText(node);
    const split = /^(.*?):\s*[“"](.+)[”"]\s*$/.exec(headingText);
    const head: MdNode[] = split
      ? [
          inlineCarrier('bentrymeta', [{ type: 'text', value: split[1] }]),
          { ...node, children: [{ type: 'text', value: split[2] }] },
        ]
      : [node];

    // A paragraph that is nothing but bold text is the entry's byline ("**Dave — paint and
    // finish**"). The prototype nests it INSIDE the meta rail alongside the date and title
    // (`header.entry__head` > `.entry__meta` + `.entry__by`, volvo-p1800.html ~L1483-1492), so it
    // must be a child of `bentryhead` — not a sibling of it. As a sibling it became the SECOND
    // child of the two-column `.entry__grid`, which put the attribution chip in the wide right
    // column and wrapped the prose and photo onto row 2 of the narrow 5fr rail: the entry read as
    // one ~464px column with ~62% of the row empty, instead of meta-left / prose-and-photo-right.
    const first = body[0];
    if (
      first?.type === 'paragraph' &&
      first.children?.length === 1 &&
      first.children[0].type === 'strong'
    ) {
      head.push(inlineCarrier('bentryby', first.children[0].children ?? []));
      body.shift();
    }
    const children: MdNode[] = [carrier('bentryhead', head), carrier('bentrybody', body)];
    out.push(carrier('bentry', children));
  }

  return out;
}

/** True when `node` is one of the carriers `mapBlocks` produces. */
function isCarrier(node: MdNode | undefined, hName: string): boolean {
  return !!node && node.data?.hName === hName;
}

/**
 * The prototype's two side-by-side record layouts — `.lot-two` and `.pairing`. Both set a
 * `dl.record` spec table in a HALF-width right column rather than letting it run the full measure,
 * and both appear once per page:
 *
 *   `.lot-two`   (volvo-p1800.html §01, etype-941pvo.html §01) — the section's opening paragraph
 *                stays beside the headline in `.section-head`; the remaining body prose goes in
 *                the left column and the record table in the right.
 *   `.pairing`   (etype-941pvo.html §05, "The other car") — a photograph left, record right.
 *
 * Without this, a section whose body is just a record list rendered that table across the whole
 * 1360px measure.
 */
function asTwoColumn(intro: MdNode[], body: MdNode[]): { intro: MdNode[]; body: MdNode[] } | null {
  if (body.length === 1 && isCarrier(body[0], 'brecord') && intro.length > 1) {
    return {
      intro: intro.slice(0, 1),
      body: [
        carrier('blottwo', [carrier('blotcol', intro.slice(1)), carrier('blotcol', [body[0]])]),
      ],
    };
  }
  if (body.length === 2 && isCarrier(body[0], 'bfigure') && isCarrier(body[1], 'brecord')) {
    return {
      intro,
      body: [carrier('blottwo', [carrier('blotcol', [body[0]]), carrier('blotcol', [body[1]])])],
    };
  }
  return null;
}

interface BuildStructureOptions {
  /** `paintSpec.section` — that section gets `.paintspec`'s own two columns, not `.lot-two`. */
  paintSpecSection?: number;
}

/**
 * Reshapes the MDX body into the prototype's real section anatomy without touching a word of
 * its copy: each `##` heading plus the run of paragraphs that follows it becomes the
 * two-column `.section-head`, everything else in that section becomes the full-width body, and
 * `###` sub-headings become `article.entry` blocks.
 *
 * CHAPTER HEADINGS. The prototype's chapter opening is three separate things, never one: the
 * numeral, a small-caps `.chapter__kind` eyebrow, and a separate, much larger `.h-major` display
 * headline ("THE RECORD" + "One car, documented in full"). An MDX `##` heading is one string, so
 * both halves are written into it with a `|` between them — `## The record | One car, documented
 * in full` — and split here: the left half becomes the eyebrow carried on the section carrier's
 * `kind` attribute, the right half becomes the `h2`. A heading with no `|` is eyebrow-only, which
 * is exactly what the prototype's plaque chapters are (volvo-p1800.html §03 "The signature" has a
 * chapter band and no headline at all).
 */
function remarkBuildStructure(options: BuildStructureOptions = {}) {
  return (tree: MdNode) => {
    const children = tree.children ?? [];
    const out: MdNode[] = [];
    const state: BlockState = { records: 0 };
    let index = 0;
    let ordinal = 0;

    // Anything before the first `##` stays where it is.
    while (
      index < children.length &&
      !(children[index].type === 'heading' && children[index].depth === 2)
    ) {
      out.push(children[index]);
      index += 1;
    }

    while (index < children.length) {
      const heading = children[index];
      index += 1;
      ordinal += 1;
      const rest: MdNode[] = [];
      while (
        index < children.length &&
        !(children[index].type === 'heading' && children[index].depth === 2)
      ) {
        rest.push(children[index]);
        index += 1;
      }

      // Lists and images are converted first, so that the "leading run of paragraphs" that
      // becomes the section head can't accidentally swallow an image-only paragraph (a
      // `figure.bound` photo) — those are no longer paragraph nodes once mapped.
      const mapped = mapBlocks(rest, state);
      const intro: MdNode[] = [];
      let cursor = 0;
      while (cursor < mapped.length && mapped[cursor].type === 'paragraph') {
        intro.push(mapped[cursor]);
        cursor += 1;
      }

      const body = groupEntries(mapped.slice(cursor));

      const headingText = plainText(heading);
      const pipe = headingText.indexOf('|');
      const kind = (pipe === -1 ? headingText : headingText.slice(0, pipe)).trim();
      const headline = pipe === -1 ? '' : headingText.slice(pipe + 1).trim();

      // `.paintspec` supplies its own two columns for the section it is attached to.
      const split = ordinal === options.paintSpecSection ? null : asTwoColumn(intro, body);
      const headIntro = split ? split.intro : intro;
      const bodyNodes = split ? split.body : body;

      // `.section-head`: headline in the left column, its opening prose in the right. Both go
      // inside one carrier so the component can make that pair — and only that pair — a grid.
      const headChildren: MdNode[] = [];
      if (headline) {
        headChildren.push(
          carrier('bstitle', [{ ...heading, children: [{ type: 'text', value: headline }] }])
        );
      }
      if (headIntro.length) headChildren.push(carrier('bsintro', headIntro));

      const sectionChildren: MdNode[] = [];
      if (headChildren.length) sectionChildren.push(carrier('bshead', headChildren));
      if (bodyNodes.length) sectionChildren.push(carrier('bsbody', bodyNodes));
      out.push(carrier('bsection', sectionChildren, kind ? { kind } : undefined));
    }

    tree.children = out;
  };
}

/* ════════════════════════════════════════════════════════════════════════════════════════════
   Shared presentational pieces
   ══════════════════════════════════════════════════════════════════════════════════════════ */

type Children = { children?: ReactNode };

/** A two-part figcaption: bold lead-in, regular continuation. */
function Caption({ caption, className = '' }: { caption?: BuildCaption; className?: string }) {
  if (!caption) return null;
  return (
    <p className={`m-0 ${CAPTION} ${className}`}>
      <b className="font-medium text-surface-foreground">{caption.lead}</b>
      {caption.rest ? ` ${caption.rest}` : null}
    </p>
  );
}

/**
 * `.chapter` — hairline rule, short accent tab, large accent chapter number, and the small-caps
 * `.chapter__kind` eyebrow. The band never carries the display headline: that is a separate,
 * larger `.h-major` element in `.section-head` below it.
 */
function ChapterBand({ no, kind }: { no: string; kind?: string }) {
  return (
    <div
      className={`relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 border-t ${HAIR} pt-[clamp(5.5rem,13vh,10rem)] before:absolute before:-top-[2px] before:left-0 before:h-[3px] before:w-[clamp(3.5rem,8vw,6rem)] before:bg-[var(--build-accent-ink)] before:content-['']`}
    >
      <span
        aria-hidden="true"
        className="text-[clamp(1.75rem,3vw,2.5rem)] font-extralight leading-none tracking-[-0.02em] text-[var(--build-accent-ink)]"
      >
        {no}
      </span>
      {kind ? (
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-surface-muted-foreground">
          {kind}
        </span>
      ) : (
        <span />
      )}
    </div>
  );
}

/** One row of the frontmatter "record" panel — omitted entirely when `value` is empty. */
function Fact({ label, value }: { label: string; value?: ReactNode }) {
  if (!value) return null;
  return (
    <div
      className={`grid grid-cols-[minmax(9rem,15ch)_minmax(0,1fr)] gap-x-6 gap-y-1 border-b ${HAIR_2} py-[0.85rem] last:border-b-0 min-[960px]:grid-cols-[minmax(11rem,18ch)_minmax(0,1fr)]`}
    >
      <dt className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-surface-muted-foreground pt-[0.28rem]">
        {label}
      </dt>
      <dd className="m-0 font-prose text-[1.0625rem] font-light leading-[1.5] text-surface-foreground [font-variant-numeric:normal]">
        {value}
      </dd>
    </div>
  );
}

/** Normalises `galleryImages`' plain-URL form to the same shape as a photo object. */
function asPhoto(entry: string | BuildPhoto): BuildPhoto {
  return typeof entry === 'string' ? { src: entry } : entry;
}

function PhotoGrid({ photos, columns = 2 }: { photos: BuildPhoto[]; columns?: 2 | 3 }) {
  return (
    <div
      className={`grid gap-[clamp(1rem,2.2vw,1.75rem)] pb-[clamp(2rem,5vh,3.5rem)] sm:grid-cols-2 ${
        columns === 3 ? 'lg:grid-cols-3' : ''
      }`}
    >
      {photos.map((photo) => (
        <figure
          key={photo.src}
          className={`m-0 border-t ${HAIR_2} bg-surface-muted pt-3 ${photo.wide ? 'sm:col-span-full' : ''}`}
        >
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Image
              src={photo.src}
              alt={photo.alt ?? ''}
              fill
              quality={58}
              sizes="(min-width:64rem) 33vw, (min-width:40rem) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {photo.caption && (
            <figcaption className="pt-[0.7rem]">
              <Caption caption={photo.caption} />
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/** One interleaved photo section — optionally its own numbered chapter band. */
function PhotoSectionBlock({ section, no }: { section: BuildPhotoSection; no?: string }) {
  return (
    <div className={section.kind || section.title ? 'pt-0' : 'pt-[clamp(2rem,5vh,3rem)]'}>
      {no && (section.kind || section.title) && <ChapterBand no={no} kind={section.kind} />}
      {(section.title || section.intro) && (
        <div className="grid gap-5 pt-[clamp(1.75rem,4vh,2.75rem)] pb-[clamp(2.5rem,6vh,4.5rem)] min-[960px]:grid-cols-2 min-[960px]:items-start min-[960px]:gap-[clamp(2rem,4vw,4rem)]">
          {section.title && (
            <h2 className="m-0 max-w-[18ch] whitespace-pre-line font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground">
              {section.title}
            </h2>
          )}
          {section.intro && <p className={`m-0 ${PROSE}`}>{section.intro}</p>}
        </div>
      )}
      <PhotoGrid photos={section.photos} columns={section.columns} />
    </div>
  );
}

/**
 * `section.contact` — the closing "Enquiries" band, the last chapter of both prototype pages
 * (volvo-p1800.html §09, etype-941pvo.html §06). A full-bleed photographic plate under two
 * stacked darkening gradients, then the chapter band, the display headline, a three-column
 * contact strip, the "ask for" paragraph, and the link home. It sits INSIDE this page component,
 * above app/layout.tsx's shared `SiteFooter`, exactly as the prototype's `<section class="contact">`
 * sits inside `<main>` above its own `<footer class="colophon">`.
 *
 * WHERE EACH PIECE OF COPY COMES FROM — nothing here is invented:
 *
 *  - Headline, eyebrow and the "Ask for…" paragraph are transcribed from the prototype markup.
 *    Both pages carry the identical headline; the paragraph's first sentence and its closing two
 *    sentences are the P1800 page's (volvo-p1800.html ~L1695-1698), which are about the business
 *    rather than about that one car, so they are correct on any build page. The E-type page's
 *    middle sentences are car-specific ("This E-type went home to its owner…") and deliberately
 *    are NOT generalised — carrying them would need a new per-build content field, and the
 *    business-level wording says the same thing without asserting anything car-specific.
 *
 *  - Telephone and email are `lib/contact-info.ts` (i.e. `site.config.ts`'s `business`), NOT the
 *    prototype's hardcoded strings, so this strip can never drift from the header, the footer and
 *    the schema.org JSON-LD. The values agree today (01323 552827 / info@dpmautobody.co.uk); the
 *    displayed phone is `PHONE_DISPLAY`'s grouping, which is what the rest of the site shows.
 *
 *  - The workshop line is `ADDRESS.locality`/`ADDRESS.region` — DPM has no confirmed street
 *    address or postcode yet (both are empty and marked UNCONFIRMED in site.config.ts), and the
 *    prototype's own line is "Berwick, East Sussex", which is what those two fields hold.
 *    "By appointment" is the prototype's second line verbatim; `business.hours` is still all
 *    `TBC`, so there is no real opening-hours source to prefer over it.
 *
 *  - "David Pearce-Martin" is DPM's director, named in this site's own CLAUDE.md as well as in
 *    both prototype pages. There is no contact-person field in site.config.ts to read it from.
 *
 *  - The plate photograph is the build's own `heroImage`. The prototype hand-picks a different
 *    whole-car frame per page (the P1800's `slide-04`, the E-type's `gallery/front`), and no rule
 *    over `photoSections` reproduces both — first-photo matches the E-type and last-photo matches
 *    the P1800. Rather than hardcode two slugs into a template used by every build, this reuses
 *    the one photograph every build is guaranteed to have and which is already approved for this
 *    page. It carries `alt=""`: it is decorative here, restating a photo the page has already
 *    shown with real alt text.
 */
/**
 * Video chapter — renders a build's confirmed `video` (lib/content-schemas.ts's
 * `BuildVideoSchema`) as a responsive embed. Uses youtube-nocookie.com, allow-listed in
 * next.config.ts's `frame-src` — a plain youtube.com/youtu.be iframe would be silently dropped by
 * CSP with no visible error, the same class of bug documented in the root CLAUDE.md's CSP notes.
 */
function BuildVideoSection({ fm, no }: { fm: Build; no: string }) {
  if (!fm.video) return null;

  return (
    <div className={PAGE}>
      <ChapterBand no={no} kind={fm.video.type === 'professional' ? 'On film' : 'The film'} />
      <div className="pt-7 pb-[clamp(3rem,8vh,5rem)]">
        <div className="relative aspect-video w-full overflow-clip bg-surface-muted">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${fm.video.id}`}
            title={`${fm.title} — film`}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Video links chapter — a build's `videoLinks` (lib/content-schemas.ts) rendered as thumbnail
 * cards that open the video on YouTube, rather than an embedded player. Chosen over `video` for
 * the resto-mod's three-part restoration video, at Ricky's direction 2026-09-12: it is raw,
 * unedited footage David shot himself, and a straight embed oversells it — a link with the real
 * thumbnail sets the right expectation before anyone clicks through. Thumbnails come from
 * `i.ytimg.com` (YouTube's own thumbnail CDN, allow-listed in next.config.ts's `img-src`) rather
 * than any locally-hosted still, since none exists per video and the real YouTube thumbnail is
 * one fewer asset to source or keep in sync.
 */
function BuildVideoLinksSection({ fm, no }: { fm: Build; no: string }) {
  if (!fm.videoLinks?.length) return null;

  // Tailwind's static scanner needs a complete, literal class name — not a runtime-interpolated
  // one (`sm:grid-cols-${n}` compiles to zero CSS, the same class of bug the root CLAUDE.md's
  // Tailwind notes document) — so the column count is a lookup, not a template string.
  const GRID_COLS: Record<number, string> = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
  };
  const gridColsClass = GRID_COLS[Math.min(fm.videoLinks.length, 3)];

  return (
    <div className={PAGE}>
      <ChapterBand no={no} kind="On film" />
      <div className={`grid gap-5 pt-7 pb-[clamp(3rem,8vh,5rem)] ${gridColsClass}`}>
        {fm.videoLinks.map((link) => (
          <a
            key={link.id}
            href={`https://www.youtube.com/watch?v=${link.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="relative aspect-video w-full overflow-clip bg-surface-muted">
              <Image
                src={`https://i.ytimg.com/vi/${link.id}/hqdefault.jpg`}
                alt={`${link.label} — opens on YouTube`}
                fill
                quality={45}
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[rgba(11,11,12,0.24)] transition-colors duration-500 group-hover:bg-[rgba(11,11,12,0.1)]" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-[rgba(232,228,220,0.5)] bg-[rgba(11,11,12,0.55)] text-surface-foreground transition-colors duration-500 group-hover:border-surface-foreground">
                  <Play
                    className="h-5 w-5 translate-x-[1px]"
                    aria-hidden="true"
                    fill="currentColor"
                  />
                </span>
              </span>
            </div>
            <p className="mt-3 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-surface-muted-foreground transition-colors duration-500 group-hover:text-surface-foreground">
              {link.label}
              <span className="sr-only"> (opens on YouTube in a new tab)</span>
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

function EnquiriesSection({ fm, no }: { fm: Build; no: string }) {
  const workshop = [ADDRESS.locality, ADDRESS.region].filter(Boolean).join(', ');
  /** `.contact__rows a, .contact__rows p` — one hairline-ruled row each, Newsreader, light. */
  const ROW = `m-0 block border-b ${HAIR_2} py-[1.15rem] font-prose text-[clamp(1.1875rem,2vw,1.625rem)] font-light text-surface-foreground no-underline [font-variant-numeric:normal] transition-colors duration-[400ms] min-[960px]:border-b-0`;
  const ROW_LABEL =
    'mb-[0.4rem] block text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground';

  return (
    <section id="contact" aria-labelledby="build-contact-h" className="relative overflow-clip">
      <div className="absolute inset-0">
        {fm.heroImage && (
          <Image
            src={fm.heroImage}
            alt=""
            fill
            quality={58}
            sizes="100vw"
            className="scale-[1.08] object-cover object-[50%_40%] brightness-[1.14] saturate-[1.06]"
          />
        )}
        {/* `.contact__plate::after` — the prototype's two stacked scrims, in its own order. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,12,0.86)_0%,rgba(11,11,12,0.5)_46%,rgba(11,11,12,0.94)_100%),linear-gradient(to_right,rgba(11,11,12,0.93)_0%,rgba(11,11,12,0.72)_44%,rgba(11,11,12,0.3)_80%,rgba(11,11,12,0.5)_100%)]" />
      </div>

      <div
        className={`relative z-[2] ${PAGE} pb-[clamp(5rem,12vh,9rem)] pt-[clamp(5.5rem,15vh,11rem)]`}
      >
        <ChapterBand no={no} kind="Enquiries" />

        <h2
          id="build-contact-h"
          className={`mt-[clamp(1.75rem,4vh,2.75rem)] mb-0 max-w-[18ch] font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground ${TEXT_SHADOW_SOFT}`}
        >
          Bring us the car you are not willing to compromise on.
        </h2>

        {/* `.contact__rows` — stacked and hairline-ruled below 60rem, three columns above it. */}
        <div
          className={`mt-[clamp(2.5rem,6vh,4rem)] grid border-t ${HAIR} min-[960px]:grid-cols-3 min-[960px]:gap-x-[clamp(2rem,4vw,4rem)]`}
        >
          {/* `PHONE_TEL` is digits only — the `tel:` scheme is added at the call site here, the
              same way site-header.tsx and site-footer.tsx do it. */}
          <a href={`tel:${PHONE_TEL}`} className={`${ROW} hover:text-[var(--build-accent-ink)]`}>
            <small className={ROW_LABEL}>Telephone</small>
            {PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${BUSINESS_EMAIL}`}
            className={`${ROW} break-words hover:text-[var(--build-accent-ink)]`}
          >
            <small className={ROW_LABEL}>Email</small>
            {BUSINESS_EMAIL}
          </a>
          <p className={ROW}>
            <small className={ROW_LABEL}>Workshop</small>
            {workshop}
            <br />
            By appointment
          </p>
        </div>

        <p className={`mt-[clamp(2.5rem,6vh,4rem)] mb-0 ${PROSE} ${TEXT_SHADOW_SOFT}`}>
          Ask for{' '}
          <strong className="font-medium text-surface-foreground">David Pearce-Martin</strong>. He
          would rather see a car than quote from photographs of one, so the first conversation
          usually ends with a date to bring it over. Dave, Ellis and Paul are who you will meet when
          you do.
        </p>

        <p className="mt-[clamp(2.5rem,6vh,3.5rem)] mb-0">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 border-b border-[var(--build-accent-ink)] pb-[0.2rem] ${LABEL} text-surface-foreground no-underline transition-colors duration-300 hover:text-[var(--build-accent-ink)]`}
          >
            <span aria-hidden="true">&larr;</span>
            Back to the homepage
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════════════════
   MDX component map
   ══════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * Page-local MDX component map for the build narrative — near-black auction-lot typography, not
 * the shared @/mdx-components' generic rounded-card look. Section ordinals come from
 * `remarkBuildStructure`'s document-order output: one closure counter per render, incremented as
 * each sibling `bsection` renders, which is how the display numbers and the `afterSection`
 * placement of photo sections and the paint swatch stay in step with the body.
 */
function createBuildMdxComponents(
  fm: Build,
  chapterNumbers: string[],
  photoNumbers: Map<number, string>
) {
  let ordinal = 0;
  const photoSections = fm.photoSections ?? [];

  return {
    /* ---------- section anatomy ---------- */
    bsection: function BuildSection({ children, kind }: Children & { kind?: string }) {
      ordinal += 1;
      const mine = ordinal;
      const attached = photoSections.filter((section) => section.afterSection === mine);
      return (
        <>
          <section className="scroll-mt-[5.5rem]" data-section={mine}>
            <ChapterBand
              no={chapterNumbers[mine - 1] ?? String(mine).padStart(2, '0')}
              kind={kind}
            />
            {children}
          </section>
          {attached.map((section) => (
            <PhotoSectionBlock
              key={section.photos[0].src}
              section={section}
              no={photoNumbers.get(mine)}
            />
          ))}
        </>
      );
    },
    bshead: function BuildSectionHead({ children }: Children) {
      return (
        <div className="grid items-start gap-5 pb-[clamp(2.5rem,6vh,4.5rem)] pt-[clamp(1.75rem,4vh,2.75rem)] min-[960px]:grid-cols-2 min-[960px]:gap-[clamp(2rem,4vw,4rem)]">
          {children}
        </div>
      );
    },
    /** The heading is the grid's own left-column child — no extra wrapper. */
    bstitle: function BuildSectionTitle({ children }: Children) {
      return <>{children}</>;
    },
    bsintro: function BuildSectionIntro({ children }: Children) {
      return <div>{children}</div>;
    },
    bsbody: function BuildSectionBody({ children }: Children) {
      // `.paintspec` (P1800 only): the section's spec table set beside a swatch of the car's own
      // paint. The swatch is built from `--build-accent` with color-mix'd shadow/highlight stops
      // rather than hardcoded hexes, so it can never disagree with the car's accent.
      if (fm.paintSpec && fm.paintSpec.section === ordinal) {
        return (
          <div className="grid items-start gap-[clamp(2rem,4vw,4rem)] pb-[clamp(2rem,5vh,3.5rem)] min-[960px]:grid-cols-2">
            <div
              role="img"
              aria-label={fm.paintSpec.swatchLabel}
              className="h-[clamp(9rem,22vw,15rem)] border border-[rgba(232,228,220,0.14)] bg-[linear-gradient(104deg,color-mix(in_srgb,var(--build-accent)_55%,black)_0%,var(--build-accent)_42%,color-mix(in_srgb,var(--build-accent)_70%,white)_58%,var(--build-accent)_72%,color-mix(in_srgb,var(--build-accent)_40%,black)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
            />
            <div>{children}</div>
          </div>
        );
      }
      return <div className="pb-[clamp(2rem,5vh,3.5rem)]">{children}</div>;
    },
    /**
     * `.lot-two` / `.pairing` — two equal columns above 60rem, stacked below, so a record spec
     * table occupies half the measure rather than all of it. See `asTwoColumn`.
     */
    blottwo: function BuildLotTwo({ children }: Children) {
      return (
        <div className="min-[960px]:grid min-[960px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-[960px]:items-start min-[960px]:gap-[clamp(2rem,4vw,4.5rem)]">
          {children}
        </div>
      );
    },
    blotcol: function BuildLotColumn({ children }: Children) {
      return <div className="mt-8 first:mt-0 min-[960px]:mt-0">{children}</div>;
    },

    /* ---------- entries (`###`) ---------- */
    bentry: function BuildEntry({ children }: Children) {
      return (
        <article
          className={`border-t ${HAIR_2} py-[clamp(2.75rem,7vh,4.5rem)] min-[992px]:grid min-[992px]:grid-cols-[minmax(0,5fr)_minmax(0,9fr)] min-[992px]:items-start min-[992px]:gap-[clamp(2rem,4vw,4.5rem)]`}
        >
          {children}
        </article>
      );
    },
    bentryhead: function BuildEntryHead({ children }: Children) {
      return <header>{children}</header>;
    },
    bentryby: function BuildEntryBy({ children }: Children) {
      return (
        <p className="mt-[1.35rem] mb-0 flex items-center gap-[0.85rem] text-[0.875rem] text-surface-muted-foreground">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 flex-none place-items-center rounded-full border border-[var(--build-accent-ink)] font-prose text-[0.9375rem] text-[var(--build-accent-ink)]"
          >
            {typeof children === 'string' ? children.trim().charAt(0) : null}
          </span>
          <span>{children}</span>
        </p>
      );
    },
    bentrybody: function BuildEntryBody({ children }: Children) {
      return <div className="mt-7 min-[992px]:mt-0">{children}</div>;
    },

    /* ---------- `dl.record` spec table ---------- */
    brecord: function BuildRecord({ children }: Children) {
      return <dl className={`m-0 grid border-t ${HAIR} p-0`}>{children}</dl>;
    },
    brecordrow: function BuildRecordRow({ children }: Children) {
      return (
        <div
          className={`grid grid-cols-[minmax(9rem,15ch)_minmax(0,1fr)] gap-x-6 gap-y-1 border-b ${HAIR_2} py-[0.85rem] min-[960px]:grid-cols-[minmax(11rem,18ch)_minmax(0,1fr)]`}
        >
          {children}
        </div>
      );
    },
    brecorddt: function BuildRecordDt({ children }: Children) {
      return (
        <dt className="pt-[0.28rem] text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-surface-muted-foreground">
          {children}
        </dt>
      );
    },
    brecorddd: function BuildRecordDd({ children }: Children) {
      return (
        <dd className="m-0 font-prose text-[1.0625rem] font-light leading-[1.5] text-surface-foreground [font-variant-numeric:normal]">
          {children}
        </dd>
      );
    },
    /**
     * `.swatch` — the identity block's colour row, with a chip of the car's own paint beside the
     * name. The chip is `--build-accent` (the build's `accent.base`), so it can never disagree
     * with the colour the rest of the page is accented in.
     */
    brecordddswatch: function BuildRecordDdSwatch({ children }: Children) {
      return (
        <dd className="m-0 font-prose text-[1.0625rem] font-light leading-[1.5] text-surface-foreground [font-variant-numeric:normal]">
          <span className="inline-flex items-center gap-[0.7rem]">
            <i
              aria-hidden="true"
              className={`h-[1.15rem] w-[2.25rem] flex-none border ${HAIR} bg-[var(--build-accent)]`}
            />
            {children}
          </span>
        </dd>
      );
    },

    /* ---------- `ul.proof` stat band ---------- */
    bstatband: function BuildStatBand({ children }: Children) {
      return (
        <ul className={`m-0 mt-[clamp(2rem,5vh,3rem)] grid list-none border-t ${HAIR} p-0`}>
          {children}
        </ul>
      );
    },
    bstatitem: function BuildStatItem({ children }: Children) {
      return (
        <li
          className={`grid gap-2 border-b ${HAIR_2} py-[clamp(1.5rem,3.5vh,2.25rem)] min-[960px]:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] min-[960px]:items-baseline min-[960px]:gap-[clamp(2rem,4vw,3.5rem)]`}
        >
          {children}
        </li>
      );
    },
    bstatfig: function BuildStatFigure({ children }: Children) {
      return (
        <span className="font-prose text-[clamp(2rem,4vw,3.25rem)] font-extralight leading-none tracking-[-0.01em] text-surface-foreground [font-variant-numeric:normal]">
          {children}
        </span>
      );
    },
    bstatwhat: function BuildStatWhat({ children }: Children) {
      return (
        <span className="max-w-[34em] text-[0.9375rem] leading-[1.55] text-surface-muted-foreground">
          {children}
        </span>
      );
    },

    /* ---------- `.stages` and `.spec-list` ---------- */
    bstages: function BuildStages({ children }: Children) {
      return <ol className="m-0 max-w-[68rem] list-none p-0">{children}</ol>;
    },
    bstage: function BuildStage({ children }: Children) {
      return (
        <li
          className={`grid items-baseline gap-x-7 gap-y-[0.35rem] border-t ${HAIR_2} py-[1.4rem] last:border-b last:border-b-[rgba(232,228,220,0.07)] min-[992px]:grid-cols-[3rem_minmax(0,15rem)_minmax(0,1fr)_auto]`}
        >
          {children}
        </li>
      );
    },
    bspeclist: function BuildSpecList({ children }: Children) {
      return <ol className={`m-0 list-none border-t ${HAIR} p-0`}>{children}</ol>;
    },
    bspecitem: function BuildSpecItem({ children }: Children) {
      return (
        <li
          className={`grid items-baseline gap-x-7 gap-y-[0.3rem] border-b ${HAIR_2} py-[1.15rem] md:grid-cols-[3.5rem_minmax(0,17rem)_minmax(0,1fr)]`}
        >
          {children}
        </li>
      );
    },
    bstagen: function BuildStageNumber({ children }: Children) {
      return (
        <span className="text-[0.8125rem] tracking-[0.1em] text-[var(--build-accent-ink)]">
          {children}
        </span>
      );
    },
    bspecn: function BuildSpecNumber({ children }: Children) {
      return (
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[var(--build-accent-ink)]">
          {children}
        </span>
      );
    },
    bstagename: function BuildStageName({ children }: Children) {
      return (
        <span className="font-prose text-[clamp(1.1875rem,1.8vw,1.5rem)] font-light leading-[1.2] text-surface-foreground">
          {children}
        </span>
      );
    },
    bstagenote: function BuildStageNote({ children }: Children) {
      return (
        <span className="max-w-[30em] text-[0.875rem] leading-[1.55] text-surface-muted-foreground">
          {children}
        </span>
      );
    },
    bstagetime: function BuildStageTime({ children }: Children) {
      return (
        <span className="whitespace-nowrap text-[0.8125rem] text-surface-muted-foreground min-[992px]:text-right">
          {children}
        </span>
      );
    },

    /* ---------- `figure.bound` — a photo inside the narrative ---------- */
    bfigure: function BuildBoundFigure({
      src,
      alt,
      title,
    }: {
      src?: string;
      alt?: string;
      title?: string;
    }) {
      if (!src) return null;
      const [lead, rest] = (title ?? '').split('|');
      return (
        <figure className={`m-0 mt-9 border-t ${HAIR} pt-4`}>
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Image
              src={src}
              alt={alt ?? ''}
              fill
              quality={58}
              sizes="(min-width:62rem) 60vw, 100vw"
              className="object-cover"
            />
          </div>
          {lead && (
            <figcaption className="pt-[0.85rem]">
              <Caption caption={{ lead, rest: rest || undefined }} />
            </figcaption>
          )}
        </figure>
      );
    },

    /* ---------- ordinary markdown ---------- */
    h2: function BuildMdxH2(p: ComponentPropsWithoutRef<'h2'>) {
      return (
        // No top margin: the prototype's `.section-head` h2 has `margin: 0` and the band's own
        // `padding-top: clamp(1.75rem,4vh,2.75rem)` already supplies that space (`bshead` carries
        // it). A margin here as well double-counted it and dropped the headline ~44px below the
        // top of the prose beside it — the interleaved photo sections' h2, which reviewed clean,
        // never had one.
        <h2
          className="m-0 max-w-[18ch] font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground"
          id={p.id}
        >
          {p.children}
        </h2>
      );
    },
    /** The stage/date eyebrow split out of an entry heading by `remarkBuildStructure`. */
    bentrymeta: function BuildEntryMeta({ children }: Children) {
      return (
        <span className="mb-[1.35rem] block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-surface-muted-foreground">
          {children}
        </span>
      );
    },
    h3: function BuildMdxH3(p: ComponentPropsWithoutRef<'h3'>) {
      return (
        <h3
          id={p.id}
          className="m-0 max-w-[22ch] font-heading text-[clamp(1.375rem,2.1vw,1.9375rem)] font-light leading-[1.08] tracking-[-0.034em] text-surface-foreground"
        >
          {p.children}
        </h3>
      );
    },
    p: function BuildMdxP(p: ComponentPropsWithoutRef<'p'>) {
      return <p className={`mt-0 mb-[1.15em] last:mb-0 ${PROSE}`}>{p.children}</p>;
    },
    ul: function BuildMdxUl(p: ComponentPropsWithoutRef<'ul'>) {
      return <ul className={`m-0 my-6 list-none border-t ${HAIR} p-0`}>{p.children}</ul>;
    },
    ol: function BuildMdxOl(p: ComponentPropsWithoutRef<'ol'>) {
      return <ol className={`m-0 my-6 list-none border-t ${HAIR} p-0`}>{p.children}</ol>;
    },
    li: function BuildMdxLi(p: ComponentPropsWithoutRef<'li'>) {
      return (
        <li
          className={`max-w-[42em] border-b ${HAIR_2} py-[0.9rem] font-prose text-[clamp(1.0625rem,0.4vw+0.95rem,1.25rem)] font-light leading-[1.55] text-[#CFCAC1] [font-variant-numeric:normal]`}
        >
          {p.children}
        </li>
      );
    },
    /**
     * `figure.plaque` when the build has a plaque photograph — a quote set over a full-width
     * photo of the finished car, attribution beneath — and an ordinary pull-quote otherwise.
     */
    blockquote: function BuildMdxBlockquote(p: ComponentPropsWithoutRef<'blockquote'>) {
      const plaque = fm.plaque;
      if (!plaque) {
        return (
          <blockquote
            className={`my-10 max-w-[38em] border-l-2 border-[var(--build-accent-ink)] pl-6 font-heading text-[clamp(1.1875rem,1.9vw,1.5625rem)] font-light italic leading-[1.45] text-surface-foreground`}
          >
            {p.children}
          </blockquote>
        );
      }
      return (
        <figure className="m-0 my-[clamp(3rem,8vh,6rem)]">
          <div className="relative h-[clamp(56lvh,72vw,86lvh)] overflow-hidden">
            <Image
              src={plaque.image}
              alt={plaque.alt ?? ''}
              fill
              quality={72}
              sizes="100vw"
              className="scale-[1.03] object-cover object-[50%_44%] brightness-[1.1] saturate-[1.06]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,12,0.42)_0%,rgba(11,11,12,0)_18%,rgba(11,11,12,0.18)_42%,rgba(11,11,12,0.68)_62%,rgba(11,11,12,0.93)_80%,rgba(11,11,12,0.99)_100%)]" />
            <div
              /*
               * The quote's own `clamp(1.3125rem,2.5vw,2.125rem)` (34px at 1440) has to beat the
               * `.prose` size the MDX `p` component carries (`clamp(1.125rem,0.5vw+1rem,1.375rem)`,
               * 22px at 1440), so it is restated on the `[&_p]` descendant selector — which
               * outranks the paragraph's own single-class utility. It used to pass `inherit` as
               * that arbitrary value instead, and Tailwind compiles an arbitrary `text-…` whose
               * value is not a length as a COLOUR: it emitted `color: inherit` and no font-size at
               * all, so the plaque quote silently rendered at the 22px prose size — 1.5x too
               * small, on both build pages. Restate the real clamp; never `inherit` here.
               */
              className={`absolute inset-x-0 bottom-[clamp(1.75rem,4.5vh,3.25rem)] z-[2] px-[clamp(1rem,3vw,2.5rem)] font-prose text-[clamp(1.3125rem,2.5vw,2.125rem)] font-extralight leading-[1.26] text-surface-foreground [font-variant-numeric:normal] [text-wrap:balance] [&_p]:m-0 [&_p]:max-w-[26em] [&_p]:font-prose [&_p]:text-[clamp(1.3125rem,2.5vw,2.125rem)] [&_p]:font-extralight [&_p]:leading-[1.26] [&_p]:text-surface-foreground ${TEXT_SHADOW_SOFT}`}
            >
              {p.children}
            </div>
          </div>
          <figcaption
            className={`mt-[clamp(1.5rem,3vh,2rem)] border-t ${HAIR} pt-[clamp(1.75rem,4vh,2.75rem)]`}
          >
            <Caption caption={plaque.caption} />
          </figcaption>
        </figure>
      );
    },
    strong: function BuildMdxStrong(p: ComponentPropsWithoutRef<'strong'>) {
      return <strong className="font-medium text-surface-foreground">{p.children}</strong>;
    },
    em: function BuildMdxEm(p: ComponentPropsWithoutRef<'em'>) {
      return <em className="italic text-surface-foreground">{p.children}</em>;
    },
    hr: function BuildMdxHr() {
      return <hr className={`my-10 border-t ${HAIR_2}`} />;
    },
    a: function BuildMdxA(p: ComponentPropsWithoutRef<'a'>) {
      const href = typeof p.href === 'string' ? p.href : '';
      if (href.startsWith('/')) {
        return (
          <Link
            href={href}
            className="text-surface-foreground underline decoration-[var(--build-accent-ink)] underline-offset-4 transition-colors duration-300 hover:text-[var(--build-accent-ink)]"
          >
            {p.children}
          </Link>
        );
      }
      return (
        <a
          {...p}
          target="_blank"
          rel="noopener noreferrer"
          className="text-surface-foreground underline decoration-[var(--build-accent-ink)] underline-offset-4 transition-colors duration-300 hover:text-[var(--build-accent-ink)]"
        />
      );
    },
  };
}

function buildLede(fm: Build): string {
  const parts: string[] = [];
  if (fm.buildDuration) parts.push(fm.buildDuration);
  if (fm.hoursOfLabour) parts.push(`${fm.hoursOfLabour} of labour`);
  if (fm.chassisNumber) parts.push(`Chassis ${fm.chassisNumber}`);
  return parts.join(' · ');
}

/** `##` headings in the body, used to lay out the chapter numbering before anything renders. */
function countBodySections(source: string): number {
  return (source.match(/^##[^#]/gm) ?? []).length;
}

export interface BuildDetailPageProps {
  frontmatter: Build;
  /** Raw MDX body (frontmatter already stripped) — rendered here via next-mdx-remote/rsc. */
  mdxSource: string;
}

export function BuildDetailPage({ frontmatter: fm, mdxSource }: BuildDetailPageProps) {
  const lede = buildLede(fm);
  const heroLabel = ['Documented build', [fm.make, fm.model].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(' · ');

  // See the file header: the body's own `- **Label:** value` list IS the prototype's section-01
  // spec table, so the frontmatter-derived panel is only for builds that don't have one.
  const bodyHasRecord = /^\s*-\s+\*\*[^*]+:\*\*/m.test(mdxSource);
  const sectionCount = countBodySections(mdxSource);
  const photoSections = fm.photoSections ?? [];

  /**
   * Chapter numbering, laid out in document order before render: the frontmatter record panel
   * (when shown), then each body section, with a headed photo section taking the next number
   * wherever it is attached. Matches the prototype's own numbering on both of today's pages.
   */
  const chapterNumbers: string[] = [];
  const photoNumbers = new Map<number, string>();
  let counter = bodyHasRecord ? 0 : 1;
  for (let section = 1; section <= sectionCount; section += 1) {
    counter += 1;
    chapterNumbers.push(String(counter).padStart(2, '0'));
    for (const photoSection of photoSections) {
      if (photoSection.afterSection === section && (photoSection.kind || photoSection.title)) {
        counter += 1;
        photoNumbers.set(section, String(counter).padStart(2, '0'));
      }
    }
  }
  /**
   * "Enquiries" is the last numbered chapter on both prototype pages, so it simply continues the
   * sequence rather than carrying a number of its own — 09 on the P1800, which is exactly what
   * volvo-p1800.html's own band reads. The E-type lands on 07 where its prototype reads 06,
   * because this template gives its plaque chapter ("The trust") a numbered band and the
   * prototype does not; continuing the sequence keeps the page internally consistent, which a
   * hardcoded 06 would not.
   */
  const videoNumber = fm.video ? String(counter + 1).padStart(2, '0') : undefined;
  const hasVideoLinks = Boolean(fm.videoLinks?.length);
  const videoLinksNumber = hasVideoLinks
    ? String(counter + (fm.video ? 2 : 1)).padStart(2, '0')
    : undefined;
  const trailingChapters = (fm.video ? 1 : 0) + (hasVideoLinks ? 1 : 0);
  const enquiriesNumber = String(counter + trailingChapters + 1).padStart(2, '0');

  const accentStyle = {
    '--build-accent': fm.accent?.base ?? 'var(--color-brand-primary)',
    '--build-accent-ink': fm.accent?.ink ?? 'var(--color-brand-primary-hover)',
  } as CSSProperties;

  const trailingGallery = (fm.galleryImages ?? []).map(asPhoto);

  return (
    <div className="bg-surface-background" style={accentStyle}>
      {/* ============ Hero ============ */}
      <section
        id="top"
        aria-labelledby="build-hero-h"
        className="relative flex min-h-[100lvh] flex-col justify-end overflow-clip"
      >
        {fm.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={fm.heroImage}
              alt={fm.heroImageAlt ?? `${fm.title} — photographed by DPM Autobody`}
              fill
              priority
              quality={72}
              sizes="100vw"
              className="scale-[1.08] object-cover object-center brightness-[1.35] saturate-[1.15]"
            />
          </div>
        )}
        {/* Lightened 2026-09-12 — the un-curated real workshop photography behind most builds'
            heroes (unlike the two flagship pages' professionally lit shots) read as too dark
            under the original brightness-[1.1] + these same scrim opacities: the car itself was
            hard to make out, not just the text-legibility area. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,12,0.36)_0%,rgba(11,11,12,0.12)_38%,rgba(11,11,12,0.48)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,11,12,0.72)_0%,rgba(11,11,12,0.46)_38%,rgba(11,11,12,0.12)_68%,rgba(11,11,12,0.02)_100%)]" />

        <div
          className={`relative z-[2] ${PAGE} pb-[clamp(3rem,7vh,4.5rem)] pt-[clamp(7rem,18vh,12rem)]`}
        >
          <p className={`m-0 ${LABEL} text-[var(--build-accent-ink)] ${TEXT_SHADOW_SOFT}`}>
            {heroLabel}
          </p>
          <h1
            id="build-hero-h"
            className={`mt-[0.6rem] mb-[1.6rem] max-w-[17ch] font-heading text-[clamp(2.75rem,min(7.6vw,12vh),6.75rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground ${TEXT_SHADOW_STRONG}`}
          >
            {fm.title}
          </h1>
          {lede && (
            <p
              className={`m-0 max-w-[23em] font-prose text-[clamp(1.25rem,1.4vw+0.9rem,1.875rem)] font-extralight leading-[1.45] text-[#D6D1C8] [font-variant-numeric:normal] ${TEXT_SHADOW_SOFT}`}
            >
              {lede}
            </p>
          )}
          {fm.sourcingGaps && fm.sourcingGaps.length > 0 && (
            <div className="mt-[clamp(1.5rem,4vh,2.25rem)]">
              <SourcingGapNotice gaps={fm.sourcingGaps} />
            </div>
          )}
          <p className="mt-[clamp(2rem,5vh,3rem)]">
            <Link
              href="/library"
              className={`inline-flex items-center gap-2 border-b ${HAIR} pb-[0.2rem] ${LABEL} text-surface-muted-foreground no-underline transition-colors duration-300 hover:text-surface-foreground ${TEXT_SHADOW_SOFT}`}
            >
              &larr;&nbsp; Back to the builds
            </Link>
          </p>
          {fm.heroCaption && (
            <figcaption className="mt-[clamp(2.5rem,6vh,4rem)]">
              <Caption caption={fm.heroCaption} className={TEXT_SHADOW_SOFT} />
            </figcaption>
          )}
        </div>
      </section>

      {/* ============ The record — frontmatter panel, for builds with no body record list ==== */}
      {!bodyHasRecord && (
        <div className={PAGE}>
          <ChapterBand no="01" kind="The record" />
          <div className="grid gap-8 pb-[clamp(3rem,8vh,5rem)] pt-7 min-[960px]:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] min-[960px]:gap-16">
            <h2 className="max-w-[18ch] font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground">
              One car,
              <br />
              documented in full
            </h2>
            <dl className={`m-0 border-t ${HAIR} p-0`}>
              <Fact label="Marque" value={fm.make} />
              <Fact label="Model" value={fm.model} />
              {/* `variant` is a deliberately loose free-text distinguisher per the schema
                  (sometimes a colour like "Candy Red", sometimes an identifier like "941 PVO")
                  — labelling it generically as "Variant" avoids asserting it's a colour when
                  it might not be. */}
              <Fact label="Variant" value={fm.variant} />
              <Fact label="Year" value={fm.year} />
              <Fact label="Chassis" value={fm.chassisNumber} />
              <Fact label="Status" value={STATUS_LABEL[fm.status]} />
              <Fact label="Build" value={fm.buildDuration} />
              <Fact label="Labour" value={fm.hoursOfLabour} />
              <Fact
                label="Type"
                value={fm.buildType ? BUILD_TYPE_LABEL[fm.buildType] : undefined}
              />
              <Fact label="Owner" value={fm.ownerName} />
              <Fact label="Commissioned by" value={fm.commissionerName} />
            </dl>
          </div>
        </div>
      )}

      {/* ============ The full record — real restoration narrative ============ */}
      <div className={`${PAGE} pb-[clamp(4rem,10vh,6rem)]`}>
        <MDXRemote
          source={mdxSource}
          components={createBuildMdxComponents(fm, chapterNumbers, photoNumbers)}
          options={{
            mdxOptions: {
              remarkPlugins: [
                remarkGfm,
                [remarkBuildStructure, { paintSpecSection: fm.paintSpec?.section }],
              ],
              /*
               * `rehype-autolink-headings` is deliberately NOT used here (it is still used for
               * ordinary MDX pages via lib/mdx.tsx). Its `behavior: 'wrap'` put every chapter
               * headline inside an `<a href="#slug">`, which this page's own `a` component then
               * rendered underlined — and, because the href is a fragment rather than a `/` path,
               * as a `target="_blank"` external link. Neither prototype page underlines or links a
               * chapter headline. `rehype-slug` stays, so the ids the sections scroll to remain.
               */
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
      </div>

      {/* ============ Trailing gallery — only for a flat `galleryImages` list ============ */}
      {trailingGallery.length > 0 && (
        <div className={`${PAGE} pb-[clamp(4rem,10vh,6rem)]`}>
          <ChapterBand no="—" kind="The photographs" />
          <div className="pt-7">
            <PhotoGrid photos={trailingGallery} columns={3} />
          </div>
        </div>
      )}

      {/* ============ The film — only for a build with a confirmed video ==================== */}
      {videoNumber && <BuildVideoSection fm={fm} no={videoNumber} />}

      {/* ============ Video links — link-out cards, for raw/multi-part footage =============== */}
      {videoLinksNumber && <BuildVideoLinksSection fm={fm} no={videoLinksNumber} />}

      {/* ============ Enquiries — the page's closing chapter, above the shared footer ======= */}
      <EnquiriesSection fm={fm} no={enquiriesNumber} />
    </div>
  );
}
