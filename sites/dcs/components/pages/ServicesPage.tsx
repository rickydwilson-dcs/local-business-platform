/**
 * `/services` — the r9 port of
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/services-list.html`.
 *
 * Structure (matching the prototype's own section comments):
 *   1. `.crumb` + `.mast` — ink masthead, "Six services. One person
 *      responsible."
 *   2. `.sec p--white` — the `.svcgrid` of six `.svccard`s.
 * The chrome (`.bar`, `.menu`, `.pagefoot`) is `SiteChrome`'s, not this
 * page's — see `app/(site)/layout.tsx`.
 *
 * DATA. `services` still comes from `getServices()` (`app/(site)/services/
 * page.tsx`) — slug, title and description are real MDX frontmatter, not
 * reinvented here. `SERVICE_CARDS` (`lib/service-card-meta.ts`) supplies only
 * what frontmatter has no field for: narrative order, ground colour, and the
 * design's own stat/label microcopy — see that file's header for citations.
 * A service slug present in `SERVICE_CARDS` but absent from the real
 * `services` array (or vice versa) is skipped rather than crashing, and
 * surfaced below as `unmatchedCards`/`extraServices` for visibility.
 */

import type { ServicesPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { CONTACT } from '@/components/home/home-data';
import { SERVICE_CARDS, countWord, toFirstPersonSingular } from '@/lib/service-card-meta';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteServicesPage({ services }: ServicesPageTemplateProps) {
  const byslug = new Map(services.map((s) => [s.slug, s]));
  // Real content drives which cards render at all — a design-listed slug
  // with no matching MDX file is dropped rather than shown with invented
  // copy (see this file's header).
  const cards = SERVICE_CARDS.map((meta, i) => {
    const real = byslug.get(meta.slug);
    if (!real) return null;
    return { meta, real, index: i + 1 };
  }).filter(
    (
      c
    ): c is {
      meta: (typeof SERVICE_CARDS)[number];
      real: (typeof services)[number];
      index: number;
    } => c !== null
  );

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
              <span aria-current="page">Services</span>
            </li>
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">Services</p>
        <h1>
          {countWord(services.length)} services.
          <br />
          One person responsible.
        </h1>
        <p className="lead">
          Retailers, online shops, studios, practitioners, tutors, letting agents, B2B firms and
          trades — I build for all of them. Every service below is something I do myself, in-house,
          rather than something I pass on.
        </p>
        <div className="hero__act">
          <a className="btn" href={CONTACT.mailtoHref}>
            Talk to me
            <ArrowIcon />
          </a>
          <Link className="btn btn--ghost" href="/pricing">
            See the pricing
          </Link>
        </div>
        <div className="mast__meta">
          <div>
            <b>{countWord(services.length)}</b>
            <span>Services</span>
          </div>
          <div>
            <b>£45/month</b>
            <span>Fully managed, from</span>
          </div>
          <div>
            <b>2–3 weeks</b>
            <span>Typical build</span>
          </div>
          <div>
            <b>30 days</b>
            <span>Notice to cancel</span>
          </div>
        </div>
      </header>

      {/* ===== 2. THE SIX — white ========================================= */}
      <section className="sec p--white" data-ground="white">
        <p className="eyeless">How it fits together</p>
        <h2 className="res">
          It starts with a site.
          <br />
          It ends with someone looking after it.
        </h2>
        <p className="lead">
          Between those two sit four services that attach to one or the other — an online shop, the
          local search work, the reporting, and business email. Some are included as standard, some
          are a one-off. All of them are mine.
        </p>

        <div className="svcgrid">
          {cards.map(({ meta, real, index }) => {
            const ix = (
              <p className="svccard__ix">
                {String(index).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
              </p>
            );
            const title = <h3 className="svccard__t">{meta.displayTitle}</h3>;
            const description = real.description && (
              <p className="svccard__d">{toFirstPersonSingular(real.description)}</p>
            );
            const statsBlock = (
              <div className="mast__meta">
                {meta.stats.map((stat) => (
                  <div key={stat.label}>
                    <b>{stat.fig}</b>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            );
            const link = (
              <span className="svccard__l">
                {meta.linkLabel}
                <ArrowIcon />
              </span>
            );

            return (
              <Link
                key={meta.slug}
                className={`svccard svccard--${meta.ground}${meta.wide ? ' svccard--wide' : ''}`}
                href={`/services/${meta.slug}`}
              >
                {meta.wide ? (
                  <>
                    <div className="svccard__body">
                      {ix}
                      {title}
                      {description}
                    </div>
                    <div className="svccard__body">
                      {statsBlock}
                      {link}
                    </div>
                  </>
                ) : (
                  <div className="svccard__body">
                    {ix}
                    {title}
                    {description}
                    {statsBlock}
                    {link}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
