import type { ServiceDetailPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';

/**
 * Arrow glyph used for every link/button hover-slide in the r9 language —
 * lifted verbatim from `components/site-header.tsx`'s CTA pill, and shared
 * with `ServicesPage.tsx` so the interaction matches across the list/detail
 * route family.
 */
function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-300 ${className}`}
    >
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

export function SiteServiceDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
  schemaNodes,
}: ServiceDetailPageTemplateProps) {
  return (
    <div className="min-h-screen font-sans">
      {schemaNodes}

      {/* ─── Hero (breadcrumb lives inside it, matching ServicesPage) ──────────── */}
      <header className="bg-brand-primary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/70 flex-wrap">
              {breadcrumbs.map((item, index) => (
                <li key={item.href} className="flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden="true" className="select-none">
                      <span className="material-symbols-outlined text-sm leading-none align-middle">
                        chevron_right
                      </span>
                    </span>
                  )}
                  {item.current ? (
                    <span className="text-white font-semibold" aria-current="page">
                      {item.name}
                    </span>
                  ) : (
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {frontmatter.badge && (
            <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-5">
              {frontmatter.badge}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[0.95] max-w-3xl">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
              {frontmatter.description}
            </p>
          )}
        </div>
      </header>

      {/* ─── Two-column body ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* ── Left: content + benefits ─────────────────────────────────── */}
            <div className="lg:col-span-2">
              <h2 className="font-extrabold tracking-tight text-2xl md:text-3xl text-surface-foreground mb-6">
                About this service
              </h2>

              <div className="prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-surface-foreground prose-a:text-brand-primary prose-strong:text-surface-foreground">
                {mdxContent}
              </div>

              {frontmatter.benefits && frontmatter.benefits.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-extrabold tracking-tight text-xl text-surface-foreground mb-4">
                    What you get
                  </h3>
                  <ul className="space-y-3">
                    {frontmatter.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span
                          className="material-symbols-outlined text-success text-xl leading-none mt-0.5 flex-shrink-0"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          check_circle
                        </span>
                        <span className="text-surface-foreground leading-snug">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ── Right: sticky sidebar ────────────────────────────────────── */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* CTA card */}
                <div className="bg-brand-primary text-white rounded-[22px] p-6">
                  <h3 className="font-extrabold tracking-tight text-xl mb-2">
                    Ready to get started?
                  </h3>
                  <p className="text-white/80 text-sm mb-5 leading-relaxed">
                    Contact {siteConfig.name} today for a free, no-obligation quote.
                  </p>

                  {siteConfig.cta.phone.show && (
                    <Link
                      href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-white font-semibold mb-4 transition-colors hover:text-white/80"
                    >
                      <span
                        className="material-symbols-outlined text-xl leading-none"
                        aria-hidden="true"
                      >
                        call
                      </span>
                      {siteConfig.phoneDisplay}
                    </Link>
                  )}

                  <Link
                    href="/contact"
                    className="group flex w-full items-center justify-center gap-2 bg-white text-brand-primary text-center px-6 py-3 rounded-full font-bold text-sm transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {siteConfig.cta.primary.label}
                    <ArrowIcon className="group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* FAQ accordion */}
                {frontmatter.faqs && frontmatter.faqs.length > 0 && (
                  <div className="bg-surface-card rounded-[22px] border border-surface-card-border p-6">
                    <h3 className="font-extrabold tracking-tight text-lg text-surface-foreground mb-4">
                      Common questions
                    </h3>
                    <div className="space-y-2">
                      {frontmatter.faqs.map((faq, index) => (
                        <details
                          key={index}
                          className="group border border-surface-card-border rounded-xl overflow-hidden"
                        >
                          <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-surface-muted transition-colors">
                            <span className="font-semibold text-sm text-surface-foreground leading-snug">
                              {faq.question}
                            </span>
                            <span
                              className="material-symbols-outlined text-brand-primary flex-shrink-0 text-lg leading-none transition-transform group-open:rotate-180"
                              aria-hidden="true"
                            >
                              expand_more
                            </span>
                          </summary>
                          <div className="px-4 pb-4 text-sm text-surface-muted-foreground leading-relaxed">
                            {faq.answer}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent py-16">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-surface-foreground mb-2">
              Ready to get more enquiries?
            </h2>
            <p className="text-surface-foreground/70">
              Let {siteConfig.name} handle it — contact us today.
            </p>
          </div>
          <Link
            href="/contact"
            className="group flex-shrink-0 inline-flex items-center gap-2 bg-brand-primary text-white px-10 py-4 rounded-full text-base font-bold shadow-lg transition-transform duration-300 hover:-translate-y-1 text-center"
          >
            Get in Touch
            <ArrowIcon className="group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
