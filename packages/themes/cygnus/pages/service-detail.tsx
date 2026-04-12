import type { ServiceDetailPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function CygnusServiceDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
  schemaNodes,
}: ServiceDetailPageTemplateProps) {
  return (
    <div className="min-h-screen bg-surface-background font-body">
      {schemaNodes}

      {/* Breadcrumb */}
      <div className="bg-surface-muted py-4 px-8">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-2 text-xs font-body uppercase tracking-widest text-surface-muted-foreground">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {i > 0 && (
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              )}
              {crumb.current ? (
                <span className="text-brand-primary">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-brand-primary transition-colors">
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[819px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          {frontmatter.heroImage ? (
            <div
              className="w-full h-full bg-cover bg-center grayscale opacity-60"
              style={{ backgroundImage: `url(${frontmatter.heroImage})` }}
            />
          ) : (
            <div className="w-full h-full bg-surface-muted" />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--color-surface-background), var(--color-surface-background-40, rgba(19,19,19,0.4)), transparent)",
            }}
          />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end px-8 pb-20 max-w-screen-2xl mx-auto">
          {frontmatter.badge && (
            <span className="bg-brand-secondary text-on-brand-primary inline-block px-3 py-1 text-[10px] font-body uppercase tracking-widest mb-6 w-fit">
              {frontmatter.badge}
            </span>
          )}
          <h1 className="text-7xl md:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8 max-w-4xl text-surface-foreground">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <div className="flex items-center gap-6">
              <div className="h-[2px] w-24 bg-brand-primary" />
              <p className="text-surface-muted-foreground font-body uppercase tracking-[0.2em] text-sm">
                {frontmatter.description}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Service Description / MDX Content */}
      <section className="py-24 px-8 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="bg-brand-primary h-1 w-12" />
            <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-headings:font-headline prose-headings:font-bold prose-headings:italic prose-p:text-surface-muted-foreground prose-p:font-body prose-p:leading-relaxed prose-a:text-brand-primary prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground">
              {mdxContent}
            </div>
          </div>
          {/* Right side decorative area */}
          {frontmatter.heroImage && (
            <div className="relative aspect-[4/5] bg-surface-card group overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${frontmatter.heroImage})` }}
              />
              <div
                className="absolute bottom-0 right-0 p-8 border-l-4 border-brand-primary"
                style={{
                  background: "rgba(53, 53, 52, 0.4)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <p className="text-surface-foreground font-headline italic font-bold">
                  {siteConfig.name}
                </p>
                <p className="text-surface-muted-foreground text-xs font-body mt-1">
                  {siteConfig.tagline}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Bento Grid */}
      {frontmatter.benefits && frontmatter.benefits.length > 0 && (
        <section className="py-24 px-8 bg-surface-card">
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {frontmatter.benefits.map((benefit, index) => {
                const benefitIcons = [
                  "visibility",
                  "shield",
                  "edit_square",
                  "speed",
                  "verified",
                  "star",
                  "build",
                  "eco",
                ];
                return (
                  <div
                    key={index}
                    className="bg-surface-background p-8 group hover:bg-surface-muted transition-all duration-300"
                  >
                    <span className="material-symbols-outlined text-brand-primary text-4xl mb-6 block">
                      {benefitIcons[index % benefitIcons.length]}
                    </span>
                    <p className="text-surface-muted-foreground text-sm font-body leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Accordion */}
      {frontmatter.faqs && frontmatter.faqs.length > 0 && (
        <section className="py-24 px-8 bg-surface-background">
          <div className="max-w-3xl mx-auto">
            <h2 className="italic mb-12 text-5xl font-headline font-bold text-surface-foreground">
              Frequently Asked <span className="text-brand-primary italic">Questions</span>
            </h2>
            <div className="space-y-4">
              {frontmatter.faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group border-l-4 border-surface-card open:border-brand-primary transition-all duration-300"
                >
                  <summary className="flex justify-between items-center p-6 cursor-pointer bg-surface-card hover:bg-surface-muted transition-colors">
                    <span className="font-headline font-bold italic text-lg text-surface-foreground">
                      {faq.question}
                    </span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-surface-foreground">
                      expand_more
                    </span>
                  </summary>
                  <div className="p-6 text-surface-muted-foreground font-body leading-relaxed bg-surface-muted">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Panel */}
      <section className="p-8 md:p-12">
        <div className="max-w-screen-2xl mx-auto bg-brand-primary p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="relative z-10 max-w-2xl">
            <span className="text-on-brand-primary font-body uppercase tracking-widest text-xs font-bold mb-4 block">
              {siteConfig.tagline}
            </span>
            <p className="text-on-brand-primary font-headline font-bold text-xl italic mb-2">
              Ready to get started?
            </p>
            <h2 className="text-5xl md:text-6xl font-headline font-bold italic mb-8 text-on-brand-primary">
              Get a free quote
            </h2>
            {siteConfig.cta.phone.show && (
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Link
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-3 text-on-brand-primary font-headline font-bold text-2xl italic hover:opacity-80 transition-opacity"
                >
                  <span className="material-symbols-outlined">call</span>
                  {siteConfig.phoneDisplay}
                </Link>
              </div>
            )}
          </div>
          <div className="relative z-10">
            <Link
              href="/contact"
              className="bg-on-brand-primary text-brand-primary px-12 py-5 font-headline font-bold italic text-xl uppercase tracking-tighter hover:bg-surface-background transition-all duration-300 active:scale-95 inline-block"
            >
              Start Your Project
            </Link>
          </div>
          {/* Decorative BG element */}
          <div className="absolute -right-20 -bottom-20 opacity-10">
            <span className="material-symbols-outlined text-[300px]">commute</span>
          </div>
        </div>
      </section>
    </div>
  );
}
