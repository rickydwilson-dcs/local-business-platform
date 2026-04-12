import type { ServiceDetailPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function CastorServiceDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
  schemaNodes,
}: ServiceDetailPageTemplateProps) {
  return (
    <>
      {schemaNodes}

      {/* Breadcrumb */}
      <nav className="max-w-[1280px] mx-auto px-6 md:px-8 py-6">
        <ol className="flex items-center space-x-2 text-surface-muted-foreground text-xs font-body uppercase tracking-widest">
          {breadcrumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center space-x-2">
              {i > 0 && (
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              )}
              {crumb.current ? (
                <span className="text-brand-accent font-semibold">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-brand-accent transition-colors">
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[614px] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-10" style={{ background: "rgba(26,58,107,0.75)" }} />
        {/* TODO: wire to heroImage prop or R2 asset */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: frontmatter.heroImage
              ? `url('${frontmatter.heroImage}')`
              : "url('/images/hero-service.jpg')",
          }}
        />
        <div className="relative z-20 max-w-[1280px] mx-auto px-6 md:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="font-headline text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6">
              {frontmatter.title}
            </h1>
            {frontmatter.description && (
              <p className="font-body text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                {frontmatter.description}
              </p>
            )}
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-accent text-white font-semibold rounded-lg hover:brightness-110 active:translate-y-[1px] transition-all"
            >
              Request a Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Description & Benefits */}
      <section className="py-16 md:py-24 bg-surface-muted">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* MDX Content */}
            <div className="lg:col-span-7">
              <h2 className="font-headline text-surface-foreground text-3xl md:text-4xl font-bold mb-6">
                Expert {frontmatter.title.toLowerCase()} for {siteConfig.address.city} homes
              </h2>
              <div className="space-y-6 text-surface-muted-foreground font-body text-lg leading-[1.65] prose prose-lg max-w-none prose-headings:text-surface-foreground prose-headings:font-headline prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-strong:text-surface-foreground">
                {mdxContent}
              </div>
            </div>

            {/* Why Choose Us Card */}
            <div className="lg:col-span-5">
              <div className="bg-surface-card p-8 rounded-xl border border-surface-subtle shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
                <h3 className="font-headline font-bold text-xl text-brand-primary mb-6">
                  Why choose {siteConfig.name}?
                </h3>
                {frontmatter.benefits && frontmatter.benefits.length > 0 && (
                  <div className="space-y-6">
                    {frontmatter.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <span
                          className="material-symbols-outlined text-brand-accent"
                          style={{
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          verified
                        </span>
                        <div>
                          <p className="font-body font-semibold text-surface-foreground">
                            {benefit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <h2 className="font-headline text-surface-foreground text-3xl md:text-4xl font-bold mb-12 text-center">
            Our recent work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gallery image 1 */}
            <div className="group relative overflow-hidden rounded-xl h-80 md:h-[450px] bg-surface-muted">
              {/* TODO: wire to gallery images from frontmatter or R2 */}
              <div className="w-full h-full bg-surface-muted transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-brand-primary/60 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-body font-medium">Recent project</p>
              </div>
            </div>
            {/* Gallery image 2 (staggered) */}
            <div className="group relative overflow-hidden rounded-xl h-80 md:h-[400px] md:mt-12 bg-surface-muted">
              <div className="w-full h-full bg-surface-muted transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-brand-primary/60 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-body font-medium">Recent project</p>
              </div>
            </div>
            {/* Gallery image 3 */}
            <div className="group relative overflow-hidden rounded-xl h-80 md:h-[450px] bg-surface-muted">
              <div className="w-full h-full bg-surface-muted transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-brand-primary/60 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-body font-medium">Recent project</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      {frontmatter.faqs && frontmatter.faqs.length > 0 && (
        <section className="py-16 md:py-24 bg-surface-muted">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <h2 className="font-headline text-surface-foreground text-3xl md:text-4xl font-bold mb-12 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {frontmatter.faqs.map((faq, i) => (
                <details key={i} className="group border-b border-surface-subtle py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="text-lg font-headline font-bold text-brand-primary group-hover:text-brand-accent transition-colors">
                      {faq.question}
                    </span>
                    <span className="material-symbols-outlined transition-transform text-brand-accent group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="mt-4 text-surface-muted-foreground leading-relaxed font-body">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Panel */}
      <section className="py-16 md:py-24" id="contact">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="bg-brand-primary rounded-2xl p-10 md:p-16 text-center shadow-xl overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="font-headline text-white text-3xl md:text-4xl font-bold mb-6">
                Ready to book?
              </h2>
              <p className="font-body text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Get in touch for a transparent, no-obligation quote. Our team is ready to help you
                find the perfect solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-accent text-white font-semibold rounded-lg hover:brightness-110 active:translate-y-[1px] transition-all"
                >
                  Get a quote
                </Link>
                {siteConfig.cta.phone.show && (
                  <Link
                    href={`tel:${siteConfig.phone}`}
                    className="w-full sm:w-auto px-8 py-4 bg-transparent border-[1.5px] border-white text-white font-semibold rounded-lg hover:bg-white/10 active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    {siteConfig.phoneDisplay}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
