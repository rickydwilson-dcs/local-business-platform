import type React from 'react';
import type { ProjectDetailPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import {
  Breadcrumbs,
  BlogPostHero,
  ArticleCallout,
  FAQSection,
  CTASection,
} from '@platform/core-components';

const categoryLabels: Record<string, string> = {
  heritage: 'Heritage Project',
  'new-build': 'New Build Project',
  renovation: 'Renovation Project',
  maintenance: 'Maintenance Project',
  emergency: 'Emergency Project',
};

export interface OrionProjectDetailPageProps extends ProjectDetailPageTemplateProps {
  /** Category of the project (used for hero label) */
  category?: string;
  /** Location name displayed in hero */
  locationName?: string;
  /** Year of completion */
  year?: number;
  /** Duration of the project */
  duration?: string;
  /** Project summary data for the callout */
  projectSummary?: React.ReactNode;
  /** Client testimonial */
  clientTestimonial?: { text: string; type: string; rating?: number };
  /** FAQs */
  faqs?: Array<{ question: string; answer: string }>;
  /** Related projects */
  relatedProjects?: React.ReactNode;
}

export function OrionProjectDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
  category,
  locationName,
  year,
  duration,
  projectSummary,
  clientTestimonial,
  faqs,
  relatedProjects,
}: OrionProjectDetailPageProps) {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div>
        <article>
          {/* Hero Section */}
          <BlogPostHero
            variant="project"
            title={frontmatter.title}
            description={frontmatter.description || ''}
            category={category || 'project'}
            categoryLabel={category ? (categoryLabels[category] || category) : 'Project'}
            locationName={locationName || ''}
            year={year || new Date().getFullYear()}
            duration={duration}
            heroImage={frontmatter.heroImage || ''}
          />

          {/* Article Content */}
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <div className="max-w-4xl mx-auto">
                {/* Project Summary */}
                {projectSummary}

                {/* Prose Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4">
                  {mdxContent}
                </div>

                {/* Outcomes */}
                {frontmatter.outcomes && frontmatter.outcomes.length > 0 && (
                  <ArticleCallout variant="success" title="Outcomes" items={frontmatter.outcomes} />
                )}

                {/* Client Testimonial */}
                {clientTestimonial && (
                  <ArticleCallout
                    variant="quote"
                    quote={clientTestimonial.text}
                    author={clientTestimonial.type}
                    rating={clientTestimonial.rating}
                  />
                )}
              </div>
            </div>
          </section>

          {/* FAQs */}
          {faqs && faqs.length > 0 && (
            <FAQSection items={faqs} variant="default" />
          )}

          {/* CTA Section */}
          <CTASection
            title="Ready to Start Your Project?"
            description={`Contact our expert team for a free consultation and quote. ${siteConfig.name} is ready to help.`}
            primaryButtonText="Get Free Quote"
            primaryButtonUrl="/contact"
          />
        </article>

        {/* Related Projects */}
        {relatedProjects}
      </div>
    </>
  );
}
