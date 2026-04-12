import type { ProjectDetailPageTemplateProps } from '@platform/core-components';
import {
  Breadcrumbs,
  FAQSection,
  CTASection,
} from '@platform/core-components';

export function NovaProjectDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
}: ProjectDetailPageTemplateProps) {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div>
        {/* Hero Section */}
        <section className="bg-brand-primary py-16 md:py-24">
          <div className="container-standard">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{frontmatter.title}</h1>
            {frontmatter.description && (
              <p className="text-xl text-white/90 max-w-3xl">{frontmatter.description}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-6">
              {frontmatter.date && (
                <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {frontmatter.date}
                </span>
              )}
              {frontmatter.tags &&
                frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </section>

        {/* MDX Content */}
        <section className="section-standard bg-surface-background">
          <div className="container-standard">
            <div className="max-w-4xl mx-auto">
              {/* Outcomes */}
              {frontmatter.outcomes && frontmatter.outcomes.length > 0 && (
                <div className="mb-10 p-6 bg-brand-secondary/10 border-l-4 border-brand-secondary rounded-xl">
                  <h2 className="text-lg font-bold text-surface-foreground mb-4">
                    Project Outcomes
                  </h2>
                  <ul className="space-y-2">
                    {frontmatter.outcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-surface-muted-foreground">
                        <span className="text-brand-primary font-bold mt-0.5">&#10003;</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4">
                {mdxContent}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Start Your Project?"
          description={`Contact our expert team for a free consultation and quote. ${siteConfig.name} is ready to help.`}
          primaryButtonText="Get Free Quote"
          primaryButtonUrl="/contact"
          secondaryButtonText={`Call ${siteConfig.phoneDisplay}`}
          secondaryButtonUrl={`tel:${siteConfig.phone}`}
        />
      </div>
    </>
  );
}
