import type { ServiceDetailPageTemplateProps } from '@platform/core-components';
import {
  Breadcrumbs,
  ServiceHero,
  ServiceBenefits,
  ServiceAbout,
  FAQSection,
  CTASection,
  type AboutContent,
} from '@platform/core-components';

export interface OrionServiceDetailPageProps extends ServiceDetailPageTemplateProps {
  /** About section content */
  about?: AboutContent;
}

export function OrionServiceDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
  schemaNodes,
  about,
}: OrionServiceDetailPageProps) {
  const serviceName = frontmatter.title
    .replace(' Services', '')
    .replace(' Solutions', '')
    .replace(' Systems', '');

  return (
    <>
      {schemaNodes}

      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div>
        {/* Hero Section */}
        <ServiceHero
          title={frontmatter.title}
          description={frontmatter.description || ''}
          badge={frontmatter.badge}
          heroImage={frontmatter.heroImage}
          phone={siteConfig.phone}
        />

        {/* Benefits Section */}
        {frontmatter.benefits && frontmatter.benefits.length > 0 && (
          <ServiceBenefits items={frontmatter.benefits} />
        )}

        {/* About Section */}
        {about && (
          <ServiceAbout
            serviceName={serviceName}
            slug=""
            about={about}
          />
        )}

        {/* MDX Content */}
        <section className="section-standard bg-surface-background">
          <div className="container-standard">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground">
                {mdxContent}
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        {frontmatter.faqs && frontmatter.faqs.length > 0 && (
          <FAQSection
            items={frontmatter.faqs}
            title="Frequently Asked Questions"
            phone={siteConfig.phone}
          />
        )}

        {/* CTA Section */}
        <CTASection
          title={`Ready for Professional ${serviceName}?`}
          description={`Contact ${siteConfig.name} today for a free quote. Our expert team is ready to help with your ${serviceName.toLowerCase()} needs.`}
          primaryButtonText="Get Free Quote"
          primaryButtonUrl="/contact"
          secondaryButtonText={`Call ${siteConfig.phoneDisplay}`}
          secondaryButtonUrl={`tel:${siteConfig.phone}`}
        />
      </div>
    </>
  );
}
