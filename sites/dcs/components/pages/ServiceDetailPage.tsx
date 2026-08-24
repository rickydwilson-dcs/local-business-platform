import type { ServiceDetailPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';

export function SiteServiceDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
  schemaNodes,
}: ServiceDetailPageTemplateProps) {
  return (
    <div className="min-h-screen font-body">
      {schemaNodes}

      {/* ─── Breadcrumb ──────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="max-w-[1200px] mx-auto px-6 pt-5 pb-2">
        <ol className="flex items-center gap-1.5 text-sm text-surface-muted-foreground flex-wrap">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true" className="select-none">
                  &gt;
                </span>
              )}
              {item.current ? (
                <span className="text-surface-foreground font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-brand-primary transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-primary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          {frontmatter.badge && (
            <span className="inline-block bg-white/20 text-white text-xs font-semibold font-body uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              {frontmatter.badge}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-headline text-white mb-4 leading-[1.1] max-w-3xl">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="text-lg md:text-xl text-white/80 font-body leading-relaxed max-w-2xl">
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
              <h2 className="font-headline font-bold text-2xl md:text-3xl text-surface-foreground mb-6">
                About this service
              </h2>

              <div className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-surface-foreground prose-a:text-brand-primary prose-strong:text-surface-foreground">
                {mdxContent}
              </div>

              {frontmatter.benefits && frontmatter.benefits.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-headline font-bold text-xl text-surface-foreground mb-4">
                    What you get
                  </h3>
                  <ul className="space-y-3">
                    {frontmatter.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span
                          className="material-symbols-outlined text-xl leading-none mt-0.5 flex-shrink-0"
                          style={{
                            fontVariationSettings: "'FILL' 1",
                            color: 'var(--color-success, #16a34a)',
                          }}
                          aria-hidden="true"
                        >
                          check_circle
                        </span>
                        <span className="text-surface-foreground font-body leading-snug">
                          {benefit}
                        </span>
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
                <div className="bg-brand-primary text-white rounded-[20px] p-6">
                  <h3 className="font-headline font-bold text-xl mb-2">Ready to get started?</h3>
                  <p className="text-white/80 text-sm font-body mb-5 leading-relaxed">
                    Contact {siteConfig.name} today for a free, no-obligation quote.
                  </p>

                  {siteConfig.cta.phone.show && (
                    <Link
                      href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-white font-semibold font-body mb-4 hover:text-white/80 transition-colors"
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
                    className="block w-full bg-white text-brand-primary text-center px-6 py-3 rounded-xl font-bold font-body text-sm hover:bg-white/90 transition-colors"
                  >
                    {siteConfig.cta.primary.label}
                  </Link>
                </div>

                {/* FAQ accordion */}
                {frontmatter.faqs && frontmatter.faqs.length > 0 && (
                  <div className="bg-surface-card rounded-[20px] border border-surface-card-border p-6">
                    <h3 className="font-headline font-bold text-lg text-surface-foreground mb-4">
                      Common questions
                    </h3>
                    <div className="space-y-2">
                      {frontmatter.faqs.map((faq, index) => (
                        <details
                          key={index}
                          className="group border border-surface-card-border rounded-xl overflow-hidden"
                        >
                          <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-surface-muted transition-colors">
                            <span className="font-semibold text-sm text-surface-foreground font-body leading-snug">
                              {faq.question}
                            </span>
                            <span
                              className="material-symbols-outlined text-brand-primary flex-shrink-0 text-lg leading-none transition-transform group-open:rotate-180"
                              aria-hidden="true"
                            >
                              expand_more
                            </span>
                          </summary>
                          <div className="px-4 pb-4 text-sm text-surface-muted-foreground font-body leading-relaxed">
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
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-surface-foreground mb-2">
              Ready to get more enquiries?
            </h2>
            <p className="text-surface-foreground/70 font-body">
              Let {siteConfig.name} handle it — contact us today.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 bg-brand-primary text-white px-10 py-4 rounded-xl text-base font-bold font-body shadow-lg hover:opacity-90 transition-opacity text-center"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
