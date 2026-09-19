/**
 * `/locations/[slug]` — the r9 port of
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/
 * location-detail.html` (Phase 3, inner-pages port, agent 3b), generalised
 * to all 8 `content/locations/*.mdx` towns rather than only the Brighton
 * reference page the design session hand-authored.
 *
 * Structure (matching the prototype's own section comments):
 *   1. `.crumb` + `.mast` — ink masthead: title, lead, distance + address
 *      facts.
 *   2. `.sec p--white` — the real MDX body (`mdxContent`) in `.prose
 *      .measure`, plus a real per-town testimonial if one exists.
 *   3. `.sec p--ink` — the real FAQ accordion from frontmatter `faqs`.
 * The chrome (`.bar`, `.menu`, `.pagefoot`) is `SiteChrome`'s, not this
 * page's.
 *
 * GENERALISED BEYOND THE DEMO — flagged in the Phase 3 report, not invented
 * here:
 *   - The prototype's masthead `lead` ("Brighton is one of the most
 *     competitive markets...") and body prose (four H2 sections, a
 *     "domestic vs commercial" section, an "in person" aside on 3/8 towns, a
 *     neighbouring-areas aside on another 3/8) are Agent G's own hand-typed,
 *     per-town narrative — not data any `content/locations/*.mdx` field
 *     carries for the other 7 towns, and reproducing it for all 8 would be
 *     content authoring, not a port. This component instead: (a) renders
 *     each town's REAL MDX body verbatim via `mdxContent` (still
 *     first-person plural — Phase 6's job, not this one's, same as
 *     `ServiceDetailPage.tsx`'s `mdxContent`), and (b) derives the masthead
 *     `lead` from the real `hero.description`/`description` field with only
 *     the mechanical singular-voice transform already established by
 *     `lib/service-card-meta.ts#toFirstPersonSingular` — never hand-typed
 *     per-town prose.
 *   - The "in person" / "the area around it" optional asides have no
 *     structured frontmatter signal to key off (they were the design
 *     session's own reading of each town's prose), so neither is
 *     reproduced. The "meeting in person" fact instead lives once, on
 *     `/locations` itself (`locations-list-page.tsx`'s checklist), computed
 *     for real from distance.
 *
 * DISTANCE FACT — Polegate's own page. The prototype's one demoed instance
 * (Brighton) always has a real, positive distance. Polegate's own page has
 * none (it IS the studio), so the first `.mast__meta` fact — a genuine
 * design gap, not decided by the prototype — is omitted entirely rather
 * than showing an invented "0 miles" or duplicating the second, constant
 * fact ("Polegate BN26 — Where I work from"). Flagged in the Phase 3 report.
 */

import Link from 'next/link';
import type { BreadcrumbItem } from '@platform/core-components';
import { milesFromStudio, type LatLng } from '@/lib/location-geo';
import { toFirstPersonSingular } from '@/lib/service-card-meta';

export interface LocationTestimonial {
  text: string;
  customerName: string;
  customerRole?: string;
}

export interface LocationDetailPageProps {
  /** Real MDX title, e.g. "Website Design for Tradespeople in Brighton" —
   *  reframed to the approved h1 by `lib/location-card-meta.ts`'s
   *  `toLocationDisplayTitle` in the route, not here. */
  displayTitle: string;
  townName: string;
  /** `hero.description` if present, else `description` — the real
   *  frontmatter field the masthead lead is derived from (see this file's
   *  header). */
  leadSource?: string;
  coordinates: LatLng;
  faqs: Array<{ question: string; answer: string }>;
  mdxContent: React.ReactNode;
  testimonial?: LocationTestimonial | null;
  breadcrumbs: BreadcrumbItem[];
  schemaNodes?: React.ReactNode;
  /** `site.config.ts`'s own registered business address — real, not
   *  invented. */
  studioTown: string;
  studioPostcode: string;
}

export function SiteLocationDetailPage({
  displayTitle,
  townName,
  leadSource,
  coordinates,
  faqs,
  mdxContent,
  testimonial,
  breadcrumbs,
  schemaNodes,
  studioTown,
  studioPostcode,
}: LocationDetailPageProps) {
  const miles = milesFromStudio(coordinates);
  const lead = leadSource ? toFirstPersonSingular(leadSource) : undefined;

  return (
    <>
      {schemaNodes}

      {/* ===== 1. BREADCRUMB + MASTHEAD — ink ============================ */}
      <div className="crumb p--ink" data-ground="ink">
        <nav aria-label="Breadcrumb">
          <ol>
            {breadcrumbs.map((item) =>
              item.current ? (
                <li key={item.href}>
                  <span aria-current="page">{item.name}</span>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href}>{item.name}</Link>
                </li>
              )
            )}
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">Areas I cover &middot; {townName}</p>
        <h1>{displayTitle}</h1>
        {lead && <p className="lead">{lead}</p>}
        <div className="mast__meta">
          {/* Omitted for the studio's own town (`miles === null`) — see this
              file's header on why "0 miles" is not shown. */}
          {miles !== null && (
            <div>
              <b>{miles} miles</b>
              <span>From the studio</span>
            </div>
          )}
          <div>
            <b>
              {studioTown} {studioPostcode}
            </b>
            <span>Where I work from</span>
          </div>
        </div>
      </header>

      {/* ===== 2. THE BODY — white ========================================= */}
      <section className="sec p--white" data-ground="white">
        <article className="prose measure">
          {mdxContent}
          {testimonial && (
            <blockquote>
              <p>{testimonial.text}</p>
              <cite>
                {testimonial.customerName}
                {testimonial.customerRole ? ` — ${testimonial.customerRole}` : ''}
              </cite>
            </blockquote>
          )}
        </article>
      </section>

      {/* ===== 3. QUESTIONS — ink ========================================= */}
      {faqs.length > 0 && (
        <section className="sec p--ink" data-ground="ink">
          <div className="measure">
            <p className="eyeless">{townName} questions</p>
            <h2 className="res">What people here ask first.</h2>
            <div className="qa">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <div className="qa__a">
                    <div>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
