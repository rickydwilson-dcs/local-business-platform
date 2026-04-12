import type { ServiceDetailPageTemplateProps } from "@platform/core-components";
import Link from "next/link";
import Image from "next/image";

export function LyraServiceDetailPage({
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
    <main className="pt-24">
      {schemaNodes}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm font-body uppercase tracking-widest text-surface-muted-foreground">
        <nav className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center space-x-2">
              {index > 0 && (
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              )}
              {crumb.current ? (
                <span className="text-surface-foreground font-semibold">{crumb.name}</span>
              ) : (
                <Link
                  href={crumb.href || "#"}
                  className="hover:text-brand-primary transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="z-10">
          {frontmatter.badge && (
            <span className="inline-block bg-brand-accent text-surface-foreground px-3 py-1 text-xs font-bold uppercase tracking-tighter mb-6 rounded-sm font-body">
              {frontmatter.badge}
            </span>
          )}
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-brand-primary leading-[1.1] mb-6">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="text-xl text-surface-muted-foreground max-w-lg mb-8 leading-relaxed font-body">
              {frontmatter.description}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <Link
              href={siteConfig.cta.primary.href}
              className="bg-brand-primary text-white px-8 py-4 rounded-md font-medium text-lg hover:shadow-lg transition-all flex items-center group"
            >
              {siteConfig.cta.primary.label}
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
        <div className="relative h-[500px] w-full bg-surface-muted rounded-lg overflow-hidden group">
          {frontmatter.heroImage ? (
            <Image
              src={frontmatter.heroImage}
              alt={frontmatter.title}
              fill
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-primary/20 to-[var(--color-brand-dark)]/10" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(22,53,38,0.3), transparent)" }}
          />
        </div>
      </section>

      {/* Service Overview / MDX Content */}
      <section className="bg-surface-muted py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <h2 className="text-3xl font-headline font-bold text-brand-primary mb-6">
              About This Service
            </h2>
            <div className="w-20 h-1 bg-brand-secondary mb-8" />
            <div className="prose prose-lg max-w-none text-surface-muted-foreground font-body leading-relaxed prose-headings:text-brand-primary prose-headings:font-headline prose-a:text-brand-primary prose-strong:text-surface-foreground">
              {mdxContent}
            </div>
          </div>

          {/* Benefits sidebar */}
          {frontmatter.benefits && frontmatter.benefits.length > 0 && (
            <div className="md:col-span-6 md:col-start-7 bg-surface-card p-8 md:p-12 rounded-xl shadow-sm border-l-4 border-brand-primary self-start">
              <h3 className="font-headline text-2xl font-bold mb-8 text-brand-primary italic">
                Why Choose {siteConfig.name}
              </h3>
              <ul className="space-y-6">
                {frontmatter.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="material-symbols-outlined text-brand-secondary mr-4">
                      check_circle
                    </span>
                    <div>
                      <span className="font-bold block text-surface-foreground font-body">
                        {benefit}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Accordion */}
      {frontmatter.faqs && frontmatter.faqs.length > 0 && (
        <section className="bg-surface-muted py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl font-headline font-bold text-center text-brand-primary mb-16">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {frontmatter.faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-surface-card rounded-lg p-6 shadow-sm open:shadow-md transition-all"
                >
                  <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-lg text-brand-primary font-body">
                    {faq.question}
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
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
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative bg-brand-primary rounded-2xl overflow-hidden p-12 md:p-20 flex flex-col items-center text-center">
          {/* Background decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-dark)] rounded-full blur-3xl opacity-30 -mr-32 -mt-32" />
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-white mb-6">
            Ready for Professional {serviceName}?
          </h2>
          <p className="text-[var(--color-brand-light)] text-xl max-w-2xl mb-12 font-body opacity-80">
            Contact {siteConfig.name} today for a free quote. Our expert team is ready to help with
            your {serviceName.toLowerCase()} needs.
          </p>
          <Link
            href={siteConfig.cta.primary.href}
            className="bg-brand-accent text-surface-foreground px-10 py-5 rounded-md font-bold text-lg hover:brightness-110 transition-all shadow-xl"
          >
            {siteConfig.cta.primary.label}
          </Link>
        </div>
      </section>
    </main>
  );
}
