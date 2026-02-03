/**
 * Location Detail Page
 * ====================
 *
 * Individual location page with MDX content rendering.
 * Features hero, local services, FAQs, and CTA.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Schema } from '@/components/Schema';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { LocationHero } from '@/components/ui/location-hero';
import { FAQSection, type FAQItem } from '@/components/ui/faq-section';
import { CTASection } from '@/components/ui/cta-section';
import { getLocations, getLocation } from '@/lib/content';
import { loadMdx } from '@/lib/mdx';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

/** Location frontmatter shape */
interface LocationFrontmatter {
  title: string;
  seoTitle?: string;
  description?: string;
  keywords?: string[];
  hero?: {
    title?: string;
    description?: string;
    image?: string;
    trustBadges?: string[];
  };
  heroImage?: string;
  faqs?: FAQItem[];
  towns?: string[];
}

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams() {
  const locations = await getLocations();
  return locations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getLocation(slug);

  if (!result) {
    return {
      title: 'Location Not Found',
      description: 'The requested location could not be found.',
    };
  }

  const fm = result.frontmatter as LocationFrontmatter;
  const title = fm.seoTitle || `Services in ${fm.title} | ${siteConfig.business.name}`;
  const description =
    fm.description || `Professional services in ${fm.title} from ${siteConfig.business.name}.`;
  const heroImage = fm.hero?.image || fm.heroImage;

  return {
    title,
    description,
    keywords: fm.keywords,
    openGraph: {
      title: `Services in ${fm.title}`,
      description,
      url: absUrl(`/locations/${slug}`),
      siteName: siteConfig.business.name,
      images: heroImage
        ? [
            {
              url: getImageUrl(heroImage),
              width: 1200,
              height: 630,
              alt: `Services in ${fm.title}`,
            },
          ]
        : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Services in ${fm.title}`,
      description,
      images: heroImage ? [getImageUrl(heroImage)] : undefined,
    },
    alternates: {
      canonical: absUrl(`/locations/${slug}`),
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const result = await getLocation(slug);

  if (!result) {
    notFound();
  }

  const fm = result.frontmatter as LocationFrontmatter;
  const { content: mdxContent } = await loadMdx({ baseDir: 'locations', slug });

  const locationName = fm.title;
  const heroImage = fm.hero?.image || fm.heroImage;
  const faqs = fm.faqs || [];
  const towns = fm.towns || [];

  const breadcrumbItems = [
    { name: 'Locations', href: '/locations' },
    { name: locationName, href: `/locations/${slug}`, current: true },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <LocationHero
          title={fm.hero?.title || `Professional Services in ${locationName}`}
          description={fm.hero?.description || fm.description || ''}
          heroImage={heroImage}
          phone={siteConfig.business.phone}
          trustBadges={fm.hero?.trustBadges}
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

        {/* Towns/Areas Served */}
        {towns.length > 0 && (
          <section className="section-standard bg-surface-subtle">
            <div className="container-standard">
              <h2 className="heading-section mb-8 text-center">Areas We Serve in {locationName}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {towns.map((town, index) => (
                  <div
                    key={index}
                    className="bg-surface-background rounded-lg p-4 text-center border border-surface-border"
                  >
                    <span className="text-surface-foreground font-medium">{town}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <FAQSection
            items={faqs}
            title="Frequently Asked Questions"
            location={locationName}
            variant="location"
            phone={siteConfig.business.phone}
          />
        )}

        {/* CTA Section */}
        <CTASection
          title={`Ready for Professional Services in ${locationName}?`}
          description={`Contact ${siteConfig.business.name} for a free quote. Our local team knows ${locationName} and is ready to help.`}
          primaryButtonText="Get Free Quote"
          primaryButtonUrl="/contact"
          secondaryButtonText={`Call ${siteConfig.business.phone}`}
          secondaryButtonUrl={`tel:${siteConfig.business.phone.replace(/\s/g, '')}`}
        />
      </main>

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/locations' },
          { name: locationName, url: `/locations/${slug}` },
        ]}
        webpage={{
          '@type': 'WebPage',
          '@id': absUrl(`/locations/${slug}#webpage`),
          url: absUrl(`/locations/${slug}`),
          name: `Services in ${locationName}`,
          description: fm.description || '',
        }}
        faqs={faqs}
      />
    </>
  );
}
