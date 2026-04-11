import type { LocationDetailPageTemplateProps } from '@platform/core-components';
import { Breadcrumbs, LocationHero, FAQSection, CTASection } from '@platform/core-components';

export function CygnusLocationDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
  schemaNodes,
}: LocationDetailPageTemplateProps) {
  const locationName = frontmatter.title;
  const faqs = frontmatter.faqs || [];

  return (
    <>
      {schemaNodes}

      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-card-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div>
        {/* Hero */}
        <LocationHero
          title={frontmatter.hero?.title || `Professional Services in ${locationName}`}
          description={frontmatter.hero?.description || frontmatter.description || ''}
          heroImage={frontmatter.heroImage}
          phone={siteConfig.phone}
        />

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
        {faqs.length > 0 && (
          <FAQSection
            items={faqs}
            title="Frequently Asked Questions"
            location={locationName}
            variant="location"
            phone={siteConfig.phone}
          />
        )}

        {/* CTA */}
        <CTASection
          title={`Ready for Professional Services in ${locationName}?`}
          description={`Contact ${siteConfig.name} for a free quote. Our local team knows ${locationName} and is ready to help.`}
          primaryButtonText="Get Free Quote"
          primaryButtonUrl="/contact"
          secondaryButtonText={`Call ${siteConfig.phone}`}
          secondaryButtonUrl={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
        />
      </div>
    </>
  );
}
