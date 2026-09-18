/**
 * `/services/[slug]` — the r9 port of
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/service-detail.html`,
 * generalised to all six services rather than only the `web-design`
 * reference page the design session hand-authored.
 *
 * Structure (matching the prototype's own section comments):
 *   1. `.crumb` + `.mast` — ink masthead: title, description, CTAs, the
 *      site-wide stat row (`lib/service-card-meta.ts#SERVICE_HERO_STATS`).
 *   2. `.sec p--white` — the real MDX body (`mdxContent`) in `.prose
 *      .measure`, plus a real service testimonial if one exists.
 *   3. `.sec p--ink` — the "Everything, in one price" checklist and FAQ
 *      accordion. The checklist is OMITTED when `frontmatter.benefits` is
 *      empty — see the note below.
 *   4. `.sec p--aqua` — "The other five", linking to every other service.
 * The chrome (`.bar`, `.menu`, `.pagefoot`) is `SiteChrome`'s, not this
 * page's.
 *
 * FLAG — the "Everything, in one price" `.detail__l` checklist. The
 * prototype's reference page hand-authors six checklist lines
 * (`service-detail.html:218-223`) paraphrased from `web-design.mdx`'s body
 * and FAQ prose. No `content/services/*.mdx` file has a structured
 * `benefits` array (`ServiceFrontmatter.benefits` exists on the TypeScript
 * interface but is unpopulated everywhere), so there is no generic source to
 * draw a checklist from for any of the six services without hand-typing
 * design content into this component — out of scope for a port. This
 * section renders only when `frontmatter.benefits` is populated (true of
 * none of the six services today); flagged in the Phase 2 report rather than
 * invented.
 *
 * FLAG — the mid-body photo + quote. The reference page's `<figure>` is a
 * real, named case-study photo (`colossus-scaffolding.jpg`) captioned
 * honestly as a photo of the client's scaffolding, not a website screenshot
 * — content specific to that one testimonial, not a generic per-service
 * field. It is not reproduced here. The testimonial itself (when
 * `getTestimonialsByService(slug)` returns one) renders as a `.prose
 * blockquote` after the MDX body rather than mid-paragraph, because
 * `mdxContent` is opaque compiled output with no anchor point to splice
 * into — flagged in the Phase 2 report.
 */

import Link from 'next/link';
import type { ServiceDetailPageTemplateProps } from '@platform/core-components';
import { CONTACT } from '@/components/home/home-data';
import { SERVICE_CARDS, SERVICE_HERO_STATS, getServiceCardMeta } from '@/lib/service-card-meta';

export interface ServiceTestimonial {
  text: string;
  customerName: string;
  customerRole?: string;
}

export interface SiteServiceDetailPageProps extends ServiceDetailPageTemplateProps {
  /** The current service's own slug — needed to build "the other five" and
   *  to look up this service's `SERVICE_CARDS` entry. Not part of the shared
   *  `ServiceDetailPageTemplateProps` (other sites' service pages have no
   *  such list), so it is added here rather than widening that shared type. */
  slug: string;
  /** Real `getTestimonialsByService(slug)` result, first entry if any. */
  testimonial?: ServiceTestimonial | null;
  /**
   * `content/services/<slug>.mdx`'s own `hero.heading` / `hero.subheading`
   * frontmatter — every service MDX carries this pair, and it is the exact
   * source of the approved masthead's `<h1>` and `.lead`
   * (`service-detail.html:91-93`: "A website that works as hard as you do" /
   * "Bespoke, mobile-first websites…" is `web-design.mdx`'s `hero.heading` /
   * `hero.subheading` verbatim, already first-person singular — unlike the
   * plural `description` field). Falls back to `frontmatter.title`/
   * `description` when a service has no `hero` block.
   */
  heroHeading?: string;
  heroSubheading?: string;
}

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

export function SiteServiceDetailPage({
  frontmatter,
  mdxContent,
  breadcrumbs,
  schemaNodes,
  slug,
  testimonial,
  heroHeading,
  heroSubheading,
}: SiteServiceDetailPageProps) {
  const meta = getServiceCardMeta(slug);
  const otherServices = SERVICE_CARDS.filter((c) => c.slug !== slug);

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
        <p className="eyeless">
          Services
          {meta
            ? ` · ${String(SERVICE_CARDS.indexOf(meta) + 1).padStart(2, '0')} / ${String(SERVICE_CARDS.length).padStart(2, '0')}`
            : ''}
        </p>
        <h1>{heroHeading || frontmatter.title}</h1>
        {(heroSubheading || frontmatter.description) && (
          <p className="lead">{heroSubheading || frontmatter.description}</p>
        )}
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
          {SERVICE_HERO_STATS.map((stat) => (
            <div key={stat.label}>
              <b>{stat.fig}</b>
              <span>{stat.label}</span>
            </div>
          ))}
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

      {/* ===== 3. INCLUDED + QUESTIONS — ink =============================== */}
      {(frontmatter.benefits?.length || frontmatter.faqs?.length) && (
        <section className="sec p--ink" data-ground="ink">
          <div className="measure">
            {frontmatter.benefits && frontmatter.benefits.length > 0 && (
              <>
                <p className="eyeless">What you get</p>
                <h2 className="res">Everything, in one price.</h2>
                <div className="detail__l">
                  {frontmatter.benefits.map((benefit) => (
                    <div key={benefit}>
                      <CheckIcon />
                      {benefit}
                    </div>
                  ))}
                </div>
              </>
            )}

            {frontmatter.faqs && frontmatter.faqs.length > 0 && (
              <>
                <h2
                  className="res"
                  style={
                    frontmatter.benefits && frontmatter.benefits.length > 0
                      ? { marginTop: 'clamp(56px,8vh,96px)' }
                      : undefined
                  }
                >
                  Common questions
                </h2>
                <div className="qa">
                  {frontmatter.faqs.map((faq) => (
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
              </>
            )}
          </div>
        </section>
      )}

      {/* ===== 4. THE OTHER FIVE SERVICES — aqua =========================== */}
      <section className="sec p--aqua" data-ground="aqua">
        <p className="eyeless">More services</p>
        <h2 className="res">The other five.</h2>
        <p className="lead">
          Every one of them is something I already do for the sites I look after. Nothing here is a
          bolt-on somebody else delivers.
        </p>
        <div className="work">
          {otherServices.map((other) => (
            <Link key={other.slug} className="row" href={`/services/${other.slug}`}>
              <span className="row__n">{other.displayTitle}</span>
              <span className="row__m">
                {other.otherRow.meta}
                <em>{other.otherRow.sub}</em>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
