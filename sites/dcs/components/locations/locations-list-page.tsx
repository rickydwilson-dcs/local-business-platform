/**
 * `/locations` — the r9 port of
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/
 * locations-list.html` (Phase 3, inner-pages port, agent 3b).
 *
 * Structure (matching the prototype's own section comments):
 *   1. `.crumb` + `.mast` — ink masthead, "Eight towns. The whole UK."
 *   2. `.sec p--white` — `.work work--loc` nearest-first row list.
 *   3. `.sec p--ink` — "What doesn't change by town", a `.detail__l`
 *      checklist of facts true everywhere.
 * The chrome (`.bar`, `.menu`, `.pagefoot`) is `SiteChrome`'s, not this
 * page's — see `app/(site)/layout.tsx`. The footer's "Areas I cover" column
 * (`components/site/page-footer.tsx`, built from `LOCATION_LINKS`) is this
 * tier's only cross-link between the eight towns, per D2 — no separate
 * nav band is rendered here or on the detail page.
 *
 * ORDERING IS REAL. `locations` is pre-sorted nearest-first by
 * `lib/location-geo.ts`'s haversine distance from the studio's own
 * `site.config.ts` coordinates against each town's real frontmatter
 * `coordinates` — never a hardcoded list. See that file's header for the
 * reference-point citation.
 */

import Link from 'next/link';
import type { ContentItem } from '@/lib/content';
import { sortLocationsNearestFirst } from '@/lib/location-geo';
import { LOCATION_ROW_META, joinWithAnd, toTownNameFromSlug } from '@/lib/location-card-meta';
import { countWord } from '@/lib/service-card-meta';
import { TIERS } from '@/components/home/home-data';

const STARTER_TIER = TIERS.find((t) => t.key === 'starter');
if (!STARTER_TIER) {
  throw new Error('TIERS has no "starter" tier — locations-list-page.tsx depends on it');
}
// Re-bound to a freshly-narrowed const: TypeScript's control-flow narrowing
// of `STARTER_TIER` above doesn't survive into the nested component
// function below, but a plain assignment's inferred type does.
const STARTER = STARTER_TIER;

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

/** `studioTown` is `site.config.ts`'s own registered business address city
 *  ("Polegate") — real, not invented — used in the masthead lead and the
 *  "meeting in person" checklist line. */
export interface LocationsListPageProps {
  locations: ContentItem[];
  studioTown: string;
}

export function SiteLocationsListPage({ locations, studioTown }: LocationsListPageProps) {
  // `townName` is the plain town ("Brighton"), not the real MDX `title`
  // ("Website Design for Tradespeople in Brighton") — every row label, the
  // filterbar and the "what doesn't change" copy need the former.
  const ordered = sortLocationsNearestFirst(locations).map((o) => ({
    ...o,
    townName: toTownNameFromSlug(o.location.slug),
  }));
  const nearest = ordered[0];
  const farthest = ordered[ordered.length - 1];
  const maxMiles = Math.max(...ordered.map((o) => o.miles ?? 0));

  // Real towns within 10 miles of the studio, nearest first, excluding the
  // studio's own town — feeds checklist item 5 below. On the real data this
  // computes to Hailsham, Eastbourne, Seaford, matching the approved design's
  // own claim (`prototype/locations-list.html:231`) exactly, because it is
  // the same real distances the design's own author computed by hand.
  const within10 = ordered.filter((o) => o.miles !== null && o.miles <= 10).map((o) => o.townName);

  return (
    <>
      {/* ===== 1. BREADCRUMB + MASTHEAD — ink ============================ */}
      <div className="crumb p--ink" data-ground="ink">
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <span aria-current="page">Locations</span>
            </li>
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">Areas I cover</p>
        <h1>
          {countWord(ordered.length)} towns.
          <br />
          The whole UK.
        </h1>
        <p className="lead">
          {countWord(ordered.length)} towns near enough that I know the market in each one, and an
          office in {studioTown} if you&rsquo;d rather have the conversation in person. Everything
          else runs remotely as standard, which is why where you are has never decided whether I can
          take the work on.
        </p>
        <div className="mast__meta">
          <div>
            <b>{countWord(ordered.length)}</b>
            <span>Named areas</span>
          </div>
          <div>
            <b>{maxMiles} miles</b>
            <span>The furthest</span>
          </div>
          <div>
            <b>UK-wide</b>
            <span>Everywhere else</span>
          </div>
        </div>
      </header>

      {/* ===== 2. THE EIGHT — white ======================================= */}
      <section className="sec p--white" data-ground="white">
        <p className="eyeless">Areas with their own page</p>
        <h2 className="res">Nearest first.</h2>
        <p className="lead">
          Each one has its own page, because the market in each is genuinely different &mdash; a
          specialist fabric retailer and an 11+ tutor sit alongside a scaffolder and an electrician,
          so the trade you&rsquo;re in matters less here than the town you work in.
        </p>

        <div className="filterbar">
          <p className="count">{countWord(ordered.length)} areas</p>
          <p className="count">
            {nearest.townName} to {farthest.townName}
          </p>
        </div>

        <div className="work work--loc">
          {ordered.map(({ location, miles, townName }) => {
            const differentiator =
              LOCATION_ROW_META[location.slug] ?? `One of the ${ordered.length} areas I cover`;
            const distanceLabel =
              miles === null ? 'Where I work from' : `${miles} miles from the studio`;
            return (
              <Link key={location.slug} className="row" href={`/locations/${location.slug}`}>
                <span className="row__n">{townName}</span>
                <span className="row__m">
                  {differentiator}
                  <em>{distanceLabel}</em>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== 3. WHAT DOESN'T CHANGE BY TOWN — ink ======================= */}
      <section className="sec p--ink" data-ground="ink">
        <div className="measure">
          <p className="eyeless">The same everywhere</p>
          <h2 className="res">What doesn&rsquo;t change by town.</h2>
          <p className="lead">
            These {countWord(ordered.length).toLowerCase()} pages exist because local search is real
            &mdash; someone in {farthest.townName} searches for web design in {farthest.townName},
            and Google wants a page that is actually about {farthest.townName}. So each one leads on
            what is genuinely different about working there. Everything that doesn&rsquo;t change by
            town is here, once.
          </p>

          <div className="detail__l">
            <div>
              <CheckIcon /> The same build at the same price wherever you are &mdash; from{' '}
              {STARTER.upfront.fig} upfront, or from {STARTER.monthly.fig} a month
            </div>
            <div>
              <CheckIcon /> The same two to three weeks from sign-off to live
            </div>
            <div>
              <CheckIcon /> Local SEO for your own town and the areas around it, included as
              standard
            </div>
            <div>
              <CheckIcon /> Run remotely by default, so nothing about the build depends on being
              nearby
            </div>
            <div>
              <CheckIcon /> A meeting in person if you&rsquo;d rather &mdash; the office is in{' '}
              {studioTown}
              {within10.length > 0 && (
                <>, and {joinWithAnd(within10)} are all inside ten miles of it</>
              )}
            </div>
          </div>

          <p className="lead" style={{ marginTop: 'clamp(28px,4vh,44px)' }}>
            Not on the list? It makes no difference to the work. I&rsquo;ve built for businesses
            from Cornwall to the Cairngorms, and the {countWord(ordered.length).toLowerCase()} above
            are simply the ones close enough that I can be there by lunchtime.
          </p>
        </div>
      </section>
    </>
  );
}
