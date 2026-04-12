import type { ServiceDetailPageTemplateProps } from "@platform/core-components";
import Link from "next/link";
import { Breadcrumbs } from "@platform/core-components";

export function NovaServiceDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
  schemaNodes,
}: ServiceDetailPageTemplateProps) {
  const serviceName = frontmatter.title
    .replace(" Services", "")
    .replace(" Solutions", "")
    .replace(" Systems", "");

  return (
    <>
      {schemaNodes}

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm font-medium text-zinc-500">
        <Breadcrumbs items={breadcrumbs} />
      </nav>

      {/* Hero Section — dark overlay on image */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: frontmatter.heroImage ? `url(${frontmatter.heroImage})` : undefined,
          }}
        >
          {/* TODO: Default hero image fallback */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(26,26,26,0.6)", backdropFilter: "blur(2px)" }}
          />
        </div>
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="text-xl md:text-2xl text-zinc-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              {frontmatter.description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-brand-primary text-white px-10 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-all shadow-xl"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/services"
              className="bg-brand-secondary text-white px-10 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-all shadow-xl"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      {frontmatter.benefits && frontmatter.benefits.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left copy */}
            <div>
              <h2 className="font-headline italic text-4xl md:text-5xl text-brand-accent mb-6">
                Why Choose Our {serviceName}
              </h2>
              {frontmatter.description && (
                <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                  {frontmatter.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-brand-secondary font-bold">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span>Quality Guaranteed by {siteConfig.name}</span>
              </div>
            </div>

            {/* Benefits cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {frontmatter.benefits.slice(0, 4).map((benefit, index) => {
                const isPrimary = index % 2 === 0;
                return (
                  <div
                    key={index}
                    className={`bg-surface-muted p-8 rounded-xl border-l-4 shadow-sm ${
                      isPrimary ? "border-brand-primary" : "border-brand-secondary"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-4xl mb-4 ${
                        isPrimary ? "text-brand-primary" : "text-brand-secondary"
                      }`}
                    >
                      {isPrimary ? "check_circle" : "star"}
                    </span>
                    <h3 className="font-bold text-xl mb-2 text-surface-foreground">{benefit}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* MDX Content */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <div className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-surface-foreground prose-p:text-zinc-600 prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-zinc-600">
          {mdxContent}
        </div>
      </section>

      {/* FAQ Section — CSS-only accordions */}
      {frontmatter.faqs && frontmatter.faqs.length > 0 && (
        <section className="py-24 max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-primary font-bold tracking-widest uppercase text-sm">
              Everything you need to know
            </span>
            <h2 className="font-headline italic text-4xl mt-2 text-surface-foreground">
              Common Questions
            </h2>
          </div>
          <div className="space-y-4">
            {frontmatter.faqs.map((faq, index) => (
              <details
                key={index}
                className="border-2 border-zinc-100 rounded-xl overflow-hidden group"
              >
                <summary className="w-full flex justify-between items-center p-6 text-left hover:bg-surface-muted transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-bold text-lg text-surface-foreground">{faq.question}</span>
                  <span className="material-symbols-outlined text-brand-primary transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-zinc-600 leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA Panel */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-brand-primary rounded-3xl p-12 md:p-20 relative overflow-hidden text-white">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24"
            style={{ backgroundColor: "rgba(91,168,41,0.3)" }}
          />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline italic text-4xl md:text-5xl font-bold mb-6">
                Ready for Professional {serviceName}?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join hundreds of local businesses in {siteConfig.address.city} who trust{" "}
                {siteConfig.name}. Get a no-obligation quote today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="bg-white text-brand-primary px-8 py-4 rounded-lg font-extrabold text-lg shadow-lg hover:scale-105 transition-transform"
                >
                  Get a Free Quote
                </Link>
                {siteConfig.cta.phone.show && (
                  <Link
                    href={`tel:${siteConfig.phone}`}
                    className="bg-brand-accent text-white px-8 py-4 rounded-lg font-extrabold text-lg shadow-lg hover:bg-black transition-colors"
                  >
                    Call {siteConfig.phoneDisplay}
                  </Link>
                )}
              </div>
            </div>

            {/* Info card */}
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-brand-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined">timer</span>
                  </div>
                  <div>
                    <p className="font-bold text-xl leading-tight">Fast Turnaround</p>
                    <p className="text-white/70 text-sm">Quick, reliable service every time</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined">star</span>
                  </div>
                  <div>
                    <p className="font-bold text-xl leading-tight">5-Star Service</p>
                    <p className="text-white/70 text-sm">Rated excellent by our customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
