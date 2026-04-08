/**
 * Service Detail Page
 * ===================
 *
 * Individual service page with MDX content rendering.
 * Features hero, benefits, about section, FAQs, and CTA.
 * Supports location-specific service pages with location-aware breadcrumbs and schema.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Schema, type FAQItem, type AboutContent } from '@platform/core-components';
import { ServicePageHero } from '@/components/ui/service-page-hero';
import { CtaBand } from '@/components/ui/cta-band';
import { deriveLocationContext, getAreaServed } from '@platform/core-components/lib/location-utils';
import { getServices, getService } from '@/lib/content';
import { getLocationSlugs } from '@/lib/locations-config';
import { loadMdx } from '@/lib/mdx';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

/** Service frontmatter shape */
interface ServiceFrontmatter {
  title: string;
  seoTitle?: string;
  description?: string;
  badge?: string;
  keywords?: string[];
  hero?: { image?: string };
  heroImage?: string;
  benefits?: string[];
  faqs?: FAQItem[];
  about?: AboutContent;
}

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getService(slug);

  if (!result) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }

  const fm = result.frontmatter as ServiceFrontmatter;
  const serviceName = fm.title
    .replace(' Services', '')
    .replace(' Solutions', '')
    .replace(' Systems', '');

  // Location-aware title generation
  const knownLocations = await getLocationSlugs();
  const locationContext = deriveLocationContext(slug, knownLocations);

  let title = fm.seoTitle || `${fm.title} | ${siteConfig.business.name}`;
  if (locationContext && locationContext.isLocationSpecific) {
    title =
      fm.seoTitle || `${serviceName} ${locationContext.locationName} | ${siteConfig.business.name}`;
  }

  const description = fm.description || `Learn about our ${fm.title} services.`;
  const heroImage = fm.hero?.image || fm.heroImage;

  return {
    title,
    description,
    keywords: fm.keywords,
    openGraph: {
      title: fm.title,
      description,
      url: absUrl(`/services/${slug}`),
      siteName: siteConfig.business.name,
      images: heroImage
        ? [
            {
              url: getImageUrl(heroImage),
              width: 1200,
              height: 630,
              alt: `${fm.title} - ${siteConfig.business.name}`,
            },
          ]
        : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fm.title,
      description,
      images: heroImage ? [getImageUrl(heroImage)] : undefined,
    },
    alternates: {
      canonical: absUrl(`/services/${slug}`),
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const result = await getService(slug);

  if (!result) {
    notFound();
  }

  const fm = result.frontmatter as ServiceFrontmatter;
  const { content: mdxContent } = await loadMdx({ baseDir: 'services', slug });

  const serviceName = fm.title
    .replace(' Services', '')
    .replace(' Solutions', '')
    .replace(' Systems', '');

  const heroImage = fm.hero?.image || fm.heroImage;
  const benefits = fm.benefits || [];
  const faqs = fm.faqs || [];
  const about = fm.about;

  // Detect if this is a location-specific service
  const knownLocations = await getLocationSlugs();
  const locationContext = deriveLocationContext(slug, knownLocations);
  const isLocationSpecific = locationContext !== null && locationContext.isLocationSpecific;

  // Build location-aware areaServed for Schema
  const areaServed =
    isLocationSpecific && locationContext
      ? getAreaServed(locationContext.location)
      : siteConfig.serviceAreas;

  return (
    <>
      <div>
        {/* Hero Section */}
        <ServicePageHero
          title={fm.title}
          description={fm.description || ''}
          badge={fm.badge}
          heroImage={heroImage ? getImageUrl(heroImage) : undefined}
          phone={siteConfig.business.phone}
        />

        {/* Benefits Section */}
        {benefits.length > 0 && (
          <section className="py-20 bg-surface-muted">
            <div className="max-w-7xl mx-auto px-8">
              <div className="mb-12">
                <h2 className="text-4xl font-headline font-bold">
                  Why choose our {serviceName.toLowerCase()}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 py-4">
                    <div className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full mt-2.5" />
                    <span className="text-surface-foreground font-body text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        {about && (
          <section className="py-20 bg-surface-background">
            <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-7">
                  <span className="label-overline mb-6 inline-block">About this service</span>
                  <h2 className="text-4xl font-headline font-bold mb-8">
                    Professional {serviceName}
                  </h2>
                  <p className="text-surface-muted-foreground text-lg leading-relaxed mb-10">
                    {about.whatIs}
                  </p>

                  <h3 className="text-xl font-headline font-bold mb-6">
                    When you need {serviceName.toLowerCase()}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {about.whenNeeded.map((need, i) => (
                      <div key={i} className="flex items-start gap-3 py-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full mt-2" />
                        <span className="text-surface-foreground text-sm">{need}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5 pt-12 lg:pt-24">
                  <div className="bg-surface-muted p-10 border-l-4 border-brand-primary">
                    <h3 className="text-xl font-headline font-bold mb-6">What you achieve</h3>
                    <div className="space-y-4">
                      {about.whatAchieve.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full mt-2" />
                          <span className="text-surface-foreground text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                    {about.keyPoints && about.keyPoints.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-surface-card-border">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-surface-muted-foreground mb-4">
                          Key points
                        </h4>
                        <div className="space-y-3">
                          {about.keyPoints.map((point, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="text-brand-primary text-xs mt-0.5">&#9632;</span>
                              <span className="text-surface-foreground text-sm">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MDX Content */}
        <section className="py-20 bg-surface-background">
          <div className="max-w-7xl mx-auto px-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-headings:font-headline prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground">
                {mdxContent}
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="py-20 bg-surface-muted">
            <div className="max-w-7xl mx-auto px-8">
              <div className="mb-16">
                <h2 className="text-5xl font-headline font-bold">Frequently asked questions</h2>
              </div>
              <div className="divide-y divide-surface-card-border max-w-4xl">
                {faqs.map((faq, i) => (
                  <details key={i} className="group py-8">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="text-xl font-headline font-bold text-surface-foreground pr-8">
                        {faq.question}
                      </h3>
                      <span className="material-symbols-outlined text-brand-primary transition-transform group-open:rotate-45 flex-shrink-0">
                        add
                      </span>
                    </summary>
                    <p className="text-surface-muted-foreground leading-relaxed mt-4 max-w-3xl">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <CtaBand
          headline={`Ready for professional ${serviceName.toLowerCase()}?`}
          subtext={`Contact ${siteConfig.business.name} for a free quote. Our team is ready to help.`}
          primaryLabel="Get Free Quote"
          primaryHref="/contact"
          secondaryLabel={siteConfig.business.phone}
          secondaryHref={`tel:${siteConfig.business.phone.replace(/\s/g, '')}`}
        />
      </div>

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={
          isLocationSpecific && locationContext
            ? [
                { name: 'Home', url: '/' },
                { name: 'Locations', url: '/locations' },
                {
                  name: locationContext.locationName,
                  url: `/locations/${locationContext.locationSlug}`,
                },
                { name: serviceName, url: `/services/${slug}` },
              ]
            : [
                { name: 'Home', url: '/' },
                { name: 'Services', url: '/services' },
                { name: serviceName, url: `/services/${slug}` },
              ]
        }
        service={{
          id: `/services/${slug}#service`,
          url: `/services/${slug}`,
          name: fm.title,
          description: fm.description || '',
          serviceType: serviceName,
          areaServed,
        }}
        faqs={faqs}
      />
    </>
  );
}
