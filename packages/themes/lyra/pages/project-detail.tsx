import type { ProjectDetailPageTemplateProps } from '@platform/core-components';
import { Breadcrumbs, CTASection } from '@platform/core-components';

export function LyraProjectDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
}: ProjectDetailPageTemplateProps) {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-cardBorder">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div>
        {/* Hero/Title Section */}
        <section className="py-20 md:py-24 bg-surface-background">
          <div className="container-standard">
            <div className="max-w-4xl mx-auto">
              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-brand-primary/10 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-foreground mb-4 leading-tight">
                {frontmatter.title}
              </h1>
              {frontmatter.description && (
                <p className="text-xl text-surface-muted-foreground">{frontmatter.description}</p>
              )}
            </div>
          </div>
        </section>

        {/* MDX Content */}
        <section className="py-20 md:py-24 bg-surface-muted">
          <div className="container-standard">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground">
                {mdxContent}
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes */}
        {frontmatter.outcomes && frontmatter.outcomes.length > 0 && (
          <section className="py-20 md:py-24 bg-surface-background">
            <div className="container-standard">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-surface-foreground mb-6">Outcomes</h2>
                <ul className="space-y-3">
                  {frontmatter.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-brand-primary mt-1 flex-shrink-0">&#10003;</span>
                      <span className="text-surface-muted-foreground">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <CTASection
          title="Ready to Start Your Project?"
          description={`Contact our expert team for a free consultation and quote. ${siteConfig.name} is ready to help.`}
          primaryButtonText="Get Free Quote"
          primaryButtonUrl="/contact"
        />
      </div>
    </>
  );
}
