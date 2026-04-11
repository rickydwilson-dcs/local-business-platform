import type { ProjectDetailPageTemplateProps } from '@platform/core-components';
import { Breadcrumbs, FAQSection, CTASection } from '@platform/core-components';

export function CygnusProjectDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
}: ProjectDetailPageTemplateProps) {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-card-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div>
        <article>
          {/* Hero */}
          <section className="section-standard bg-surface-inverse">
            <div className="container-standard">
              <div className="max-w-4xl mx-auto">
                {frontmatter.tags && frontmatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {frontmatter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-brand-primary text-on-brand-primary text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-surface-foreground">
                  {frontmatter.title}
                </h1>
                {frontmatter.description && (
                  <p className="text-xl text-surface-secondary-foreground">
                    {frontmatter.description}
                  </p>
                )}
                {frontmatter.date && (
                  <p className="mt-4 text-sm text-surface-muted-foreground">
                    Completed:{' '}
                    {new Date(frontmatter.date).toLocaleDateString('en-GB', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground">
                  {mdxContent}
                </div>

                {/* Outcomes */}
                {frontmatter.outcomes && frontmatter.outcomes.length > 0 && (
                  <div className="mt-12 p-6 bg-surface-card border border-surface-card-border rounded-xl">
                    <h2 className="text-xl font-bold text-surface-foreground mb-4">Outcomes</h2>
                    <ul className="space-y-3">
                      {frontmatter.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-brand-primary mt-1">&#10003;</span>
                          <span className="text-surface-muted-foreground">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CTA */}
          <CTASection
            title="Ready to Start Your Project?"
            description={`Contact our expert team for a free consultation and quote. ${siteConfig.name} is ready to help.`}
            primaryButtonText="Get Free Quote"
            primaryButtonUrl="/contact"
          />
        </article>
      </div>
    </>
  );
}
