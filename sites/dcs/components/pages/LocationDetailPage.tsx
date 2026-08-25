import type { LocationDetailPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';

export function SiteLocationDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
  schemaNodes,
}: LocationDetailPageTemplateProps) {
  const locationName = frontmatter.hero?.title || frontmatter.title;

  return (
    <div className="min-h-screen font-sans">
      {schemaNodes}

      {/* ─── Standalone breadcrumb (above hero) ──────────────────────────────── */}
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
      <header className="bg-brand-primary py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <span className="inline-block mb-5 text-xs md:text-sm font-extrabold uppercase tracking-[0.14em] text-white/70">
            Service Area
          </span>
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold font-heading text-white mb-5 leading-[0.95] tracking-[-0.03em] max-w-3xl">
            {locationName}
          </h1>
          {(frontmatter.hero?.description || frontmatter.description) && (
            <p className="text-lg md:text-xl text-white/80 font-sans leading-relaxed max-w-2xl">
              {frontmatter.hero?.description || frontmatter.description}
            </p>
          )}
        </div>
      </header>

      {/* ─── Two-column body ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* ── Left: MDX prose content ──────────────────────────────────── */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-extrabold prose-headings:tracking-[-0.02em] prose-headings:text-surface-foreground prose-a:text-brand-primary">
                {mdxContent}
              </div>
            </div>

            {/* ── Right: sticky sidebar ────────────────────────────────────── */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* CTA card */}
                <div className="bg-brand-primary text-white rounded-[18px] p-6">
                  <span className="inline-block mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white/60">
                    Get Started
                  </span>
                  <h3 className="font-heading font-extrabold text-xl mb-2 tracking-[-0.02em] leading-tight">
                    Get your website in {frontmatter.title}
                  </h3>
                  <p className="text-white/80 text-sm font-sans mb-5 leading-relaxed">
                    {siteConfig.name} helps local tradespeople in {frontmatter.title} get found
                    online and win more enquiries.
                  </p>

                  {siteConfig.cta.phone.show && (
                    <Link
                      href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-white font-semibold font-sans mb-4 hover:text-white/80 transition-colors"
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
                    className="block w-full bg-white text-brand-primary text-center px-6 py-3 rounded-full font-bold font-sans text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {siteConfig.cta.primary.label}
                  </Link>
                </div>

                {/* FAQ accordion */}
                {frontmatter.faqs && frontmatter.faqs.length > 0 && (
                  <div className="bg-surface-card rounded-[18px] border border-surface-card-border p-6">
                    <h3 className="font-heading font-extrabold text-lg text-surface-foreground mb-4 tracking-[-0.02em]">
                      Common questions
                    </h3>
                    <div className="space-y-2">
                      {frontmatter.faqs.map((faq, index) => (
                        <details
                          key={index}
                          className="group border border-surface-card-border rounded-xl overflow-hidden"
                        >
                          <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-surface-muted transition-colors">
                            <span className="font-semibold text-sm text-surface-foreground font-sans leading-snug">
                              {faq.question}
                            </span>
                            <span
                              className="material-symbols-outlined text-brand-primary flex-shrink-0 text-lg leading-none transition-transform group-open:rotate-180"
                              aria-hidden="true"
                            >
                              expand_more
                            </span>
                          </summary>
                          <div className="px-4 pb-4 text-sm text-surface-muted-foreground font-sans leading-relaxed">
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
            <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-surface-foreground mb-2 tracking-[-0.02em] leading-[1.05]">
              Ready to get more enquiries from {frontmatter.title}?
            </h2>
            <p className="text-surface-foreground/70 font-sans">
              Let {siteConfig.name} build you a website that wins local customers.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 bg-brand-primary text-white px-10 py-4 rounded-full text-base font-bold font-sans shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-16px_rgba(214,0,107,0.8)] text-center"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
