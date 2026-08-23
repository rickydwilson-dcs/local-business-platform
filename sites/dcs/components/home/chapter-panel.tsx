/**
 * The r9 prototype's shared chapter opener — a `.cornerfill` strip
 * immediately followed by a `.panel` section. Ported class-name for
 * class-name from `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html`.
 *
 * Every `.panel` in the prototype is preceded by a `.cornerfill` sibling
 * div (never a child) — see e.g. lines 810-815 (before `#work`) and
 * 868-873 (before `#services`) of the prototype source. `.panel`'s top
 * corners are cut into a curve (`border-radius` + `overflow:hidden` on the
 * ancestor), which reveals whatever paints behind them as the section
 * scrolls up over the page — that "whatever" is the `.cornerfill`, sized to
 * exactly the corner radius and pinned with `position:sticky;top:0` so it
 * sits right there while the reveal happens.
 *
 * The colour that makes that illusion work is the colour of the PANE
 * ABOVE this boundary in the prototype's own markup, not the colour of the
 * panel this component is opening. Concretely, from the prototype:
 *
 *   boundary                                    cornerfill  panel opened
 *   ------------------------------------------  ----------  -------------
 *   hero (ink)          -> work intro            cf--ink     p--white #work
 *   work's wstack (ink) -> services intro        cf--ink     p--magenta #services
 *   services' svcstack  -> process (no id)        cf--magenta p--ink
 *   process (ink)       -> pricing intro          cf--ink     p--white #pricing
 *   pricing (white)     -> faq intro              cf--white   p--magenta #faq
 *   faq (magenta)       -> quote (no id)           cf--magenta p--aqua
 *   quote (aqua)        -> end intro               cf--aqua    p--navy.end #end
 *
 * This component only ever renders the cornerfill it is explicitly told to
 * — it never infers the colour from `panelBg`, because (see the services
 * boundary above) the two are frequently different. Callers pass
 * `cornerfillColor` explicitly for exactly this reason: get the pairing
 * wrong and a section curve reveals the wrong colour underneath it.
 *
 * Used by `work-stack.tsx` (opens `#work`) and `services-stack.tsx` (opens
 * `#services`) in this phase; the remaining boundaries above belong to
 * other components (process/pricing/faq/quote/end) and are not built here.
 */

import type { ReactNode } from 'react';

/** Matches the prototype's `cf--*` corner-fill modifiers actually in use. */
export type CornerfillColor = 'ink' | 'white' | 'magenta' | 'aqua';

/** Matches the prototype's `p--*` panel background modifiers. */
export type PanelBg = 'ink' | 'white' | 'magenta' | 'navy' | 'aqua';

export interface ChapterPanelProps {
  /**
   * Colour of the pane immediately above this boundary in document order —
   * sets `cf--{cornerfillColor}` on the sticky corner-fill strip. This is
   * NOT necessarily the same as `panelBg`; see the table above.
   */
  cornerfillColor: CornerfillColor;
  /** Sets `p--{panelBg}` on the `.panel` section itself. */
  panelBg: PanelBg;
  /**
   * The section's `data-ground` attribute, read by the scroll-linked bar
   * colour swap (Phase 6). Usually equal to `panelBg`, but kept separate
   * since the prototype treats them as independent attributes.
   */
  dataGround: string;
  /** Anchor id for in-page nav, e.g. `"work"`, `"services"`, `"pricing"`. */
  id?: string;
  /** Extra class(es) appended after `p--{panelBg}`, e.g. `"end"`. */
  className?: string;
  children: ReactNode;
}

export function ChapterPanel({
  cornerfillColor,
  panelBg,
  dataGround,
  id,
  className,
  children,
}: ChapterPanelProps) {
  const panelClassName = className ? `panel p--${panelBg} ${className}` : `panel p--${panelBg}`;

  return (
    <>
      <div className={`cornerfill cf--${cornerfillColor}`} aria-hidden="true" />
      <section className={panelClassName} id={id} data-ground={dataGround}>
        {children}
      </section>
    </>
  );
}
