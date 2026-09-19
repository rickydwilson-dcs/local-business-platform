import Link from 'next/link';

/**
 * Restyled for the r9 inner-pages port (Phase 3c). Source design:
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/legal.html`
 * (Agent H, `notes-h.md`).
 *
 * `.crumb` (two levels: Home / this document, matching `404.html`'s call
 * that a legal page carries no `[aria-current]` route-nav highlight) plus
 * `.mast`/`.mast__meta` — the same breadcrumb + masthead shape every other
 * r9 inner page uses (`components/about/about-page.tsx`). The chrome's own
 * `.bar`/`.menu`/`.pagefoot` are NOT rendered here — `app/(site)/layout.tsx`
 * supplies those.
 *
 * `metaItems` replaces the old single `lastUpdated` line: the approved
 * design folds "last updated" into the first `.mast__meta` figure alongside
 * two more per-document facts (section count, and a third fact specific to
 * each document — ICO / cookie category count / governing law). Each page
 * authors its own three figures rather than this component inventing them.
 */

export interface LegalMetaItem {
  value: string;
  label: string;
}

interface LegalHeroProps {
  title: string;
  current: string;
  metaItems: LegalMetaItem[];
}

export function LegalHero({ title, current, metaItems }: LegalHeroProps) {
  return (
    <>
      <div className="crumb p--ink" data-ground="ink">
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <span aria-current="page">{current}</span>
            </li>
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">Legal</p>
        <h1>{title}</h1>
        <div className="mast__meta">
          {metaItems.map((item) => (
            <div key={item.label}>
              <b>{item.value}</b>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </header>
    </>
  );
}
