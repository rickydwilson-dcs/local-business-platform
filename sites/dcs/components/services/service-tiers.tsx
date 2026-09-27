/**
 * `<Tiers>` / `<Tier>` — the in-prose tier band (kit.css §J).
 *
 * WHY THIS EXISTS. `content/services/google-workspace.mdx` expressed Google's
 * three Workspace plans as three bold pseudo-headings, each followed by a
 * bullet list whose LAST bullet was not a feature at all but an editorial
 * verdict ("This is what most tradespeople need."). That is the worst kind of
 * list: it looks like a spec sheet, reads like prose, and gives the reader no
 * way to compare the three without scrolling between them. The design fix and
 * the markup fix are the same fix — give the comparison a shape.
 *
 * WHY A COMPONENT AND NOT A TSX SECTION. Root `CLAUDE.md`'s MDX-Only Content
 * rule: the tier names, prices and features are content and stay in the MDX
 * file. This file contributes markup only — every string a visitor reads is a
 * prop written in `google-workspace.mdx`.
 *
 * WHY ROWS AND NOT A THREE-UP CARD GRID. The band renders inside `.measure`,
 * which is 74ch (~700px). Three cards in 700px is ~220px each, which is too
 * narrow for a price and five features, and breaking out of the measure means
 * a `100vw` negative-margin trick that double-counts the desktop scrollbar.
 * Stacked rows are also the kit's own desktop pricing idiom (`.tiers`/`.tier`,
 * kit.css §17) rather than a new one.
 *
 * THE SELECTED ROW. `recommended` fills the row with ink and swaps its checks
 * to aqua. That is `.tier[aria-selected="true"]{background:var(--ink)}`'s
 * language (kit.css:759) — the design already says "this is the one" by
 * filling it — and the magenta pill is `.tcard__b` verbatim (kit.css:805).
 * It is a static emphasis, not a control: nothing here is clickable, so the
 * row is an `<article>`, not the `<button role="tab">` the pricing picker uses.
 *
 * WHY FEATURES ARE `<TierItem>` CHILDREN AND NOT A `features={[...]}` PROP.
 * `next-mdx-remote` v6 ships `blockJS: true` by default, and that default runs
 * a remark plugin (`plugins/remove-javascript-expressions`) which strips every
 * JS expression from the tree — `{variable}` nodes AND, specifically,
 * `mdxJsxAttributeValueExpression` attribute values. An array prop written in
 * MDX is therefore SILENTLY DROPPED: the component is still called, its
 * string attributes all arrive intact, and only the expression one is missing,
 * so it surfaces as `Cannot read properties of undefined (reading 'map')`
 * rather than as anything pointing at MDX. Verified by logging the real props
 * reaching this component, then reading the plugin. Passing `blockJS: false`
 * would restore array props by turning that hardening off for every service
 * MDX file; element children need no expression at all, so the default stands.
 *
 * PRICES AND COMMAS. `.tierrow__f` carries no `font-variant-numeric` and no
 * monospaced face, per kit.css §17's trap — both give a thousands comma a full
 * digit advance and render "GBP 1,995" as "1 , 995". None of Google's three
 * figures has a comma today; the rule is kept so one can be added safely.
 */

import type { ReactNode } from 'react';

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5l3.2 3.2L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface TierProps {
  /** Plan name, e.g. "Business Starter". */
  name: string;
  /** The headline figure, e.g. "£5.50". Written with its currency symbol so
   *  the MDX author controls it, not this component. */
  price: string;
  /** What the figure is per, e.g. "per user / month". Rendered as the
   *  `<small>` beneath it — `.tier__f small`'s job (kit.css:768). */
  unit: string;
  /** One line on who the plan is for. This is where the editorial verdict
   *  that used to be the last bullet belongs. */
  note: string;
  /** The plan's features, as `<TierItem>` children. Real features only — no
   *  verdicts; the verdict is `note`. */
  children: ReactNode;
  /** Fills the row with ink. At most one tier in a band should set it. */
  recommended?: boolean;
  /** Label for the pill on the recommended row. */
  badge?: string;
}

export function Tier({ name, price, unit, note, children, recommended, badge }: TierProps) {
  return (
    <article className={recommended ? 'tierrow tierrow--rec' : 'tierrow'}>
      {recommended && badge && <span className="tierrow__b">{badge}</span>}
      <div className="tierrow__h">
        <span>
          <span className="tierrow__n">{name}</span>
          <span className="tierrow__s">{note}</span>
        </span>
        <span className="tierrow__f">
          {price}
          <small>{unit}</small>
        </span>
      </div>
      <ul className="tierrow__l">{children}</ul>
    </article>
  );
}

export interface TierItemProps {
  children: ReactNode;
}

/** One feature line. The check is `aria-hidden` — the `<li>` already carries
 *  the semantics, and "tick, professional email at your domain" read aloud is
 *  noise. Colour comes from `.tierrow__l svg` (magenta), flipped to aqua
 *  inside `.tierrow--rec` by the kit's own accent rule. */
export function TierItem({ children }: TierItemProps) {
  return (
    <li>
      <CheckIcon />
      <span>{children}</span>
    </li>
  );
}

export interface TiersProps {
  children: ReactNode;
}

export function Tiers({ children }: TiersProps) {
  return <div className="tierband">{children}</div>;
}
