import Link from 'next/link';
import { LegalToc, type LegalTocItem } from './legal-toc';

/**
 * The shared body template for all three legal routes (`/privacy-policy`,
 * `/cookie-policy`, `/terms-and-conditions`), completing the port alongside
 * `LegalHero`. Source design:
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/legal.html`
 * (Agent H, `notes-h.md`).
 *
 * ONE TEMPLATE, THREE ROUTES. The prototype's `?doc=` switcher that let a
 * reviewer flip between all three bodies in one static HTML file is a
 * prototype device ONLY, documented as such in the prototype's own header
 * comment, and is NOT ported — each route below is its own real Next.js
 * page rendering its own real content through this one shared component.
 *
 * Renders:
 *   - `.legal` — the two-column reading grid: `LegalToc` (the sticky rail)
 *     beside `article.prose.legal__body` (`children` — the actual clause
 *     content, authored per-route because each document's structure
 *     differs: dl-style term lists, tables, an `.mast__meta` reuse for the
 *     contact block, and Terms' closing `<hr>` note. Restyling three
 *     genuinely different bodies into one opaque prop would either lose
 *     structure or reinvent a mini templating layer — `children` keeps each
 *     route's markup visible and diffable against its own clauses).
 *   - the closing "the other two documents" band — `.svcs`/`.svc`, a spare
 *     pattern already in the kit (design-kit.md §6.2) reused rather than
 *     invented, per `notes-h.md` §1. Links point at the real sibling routes.
 *
 * The `.bar`/`.menu`/`.pagefoot` chrome and the ink breadcrumb+masthead
 * (`LegalHero`) are NOT rendered here.
 */

export interface LegalOtherDoc {
  href: string;
  name: string;
  description: string;
}

interface LegalDocumentProps {
  tocItems: LegalTocItem[];
  otherDocs: LegalOtherDoc[];
  children: React.ReactNode;
}

export function LegalDocument({ tocItems, otherDocs, children }: LegalDocumentProps) {
  return (
    <>
      <section className="sec p--white" data-ground="white">
        <div className="legal">
          <LegalToc items={tocItems} />
          <article className="prose legal__body">{children}</article>
        </div>
      </section>

      <section className="sec p--ink" data-ground="ink">
        <p className="eyeless">Also legal</p>
        <h2 className="res">The other two documents.</h2>
        <div className="svcs">
          {otherDocs.map((doc) => (
            <Link key={doc.href} className="svc" href={doc.href}>
              <span className="svc__n">{doc.name}</span>
              <span className="svc__d">{doc.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
