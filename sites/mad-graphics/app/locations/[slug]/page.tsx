/**
 * Location Detail Page
 * ====================
 *
 * Individual location page with MDX content rendering.
 * Uses the site's dark editorial style with local components.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Schema, type LocationFrontmatter } from '@platform/core-components';
import { getLocations, getLocation } from '@/lib/content';
import { loadMdx } from '@/lib/mdx';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { getServiceAreaSchema } from '@/lib/schema';
import { LocationPageHero } from '@/components/ui/location-page-hero';
import { CtaBand } from '@/components/ui/cta-band';

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

  const fm = result.frontmatter as unknown as LocationFrontmatter;
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

  const fm = result.frontmatter as unknown as LocationFrontmatter;
  const { content: mdxContent } = await loadMdx({ baseDir: 'locations', slug });

  const locationName = fm.title;
  const heroImage = fm.hero?.image || fm.heroImage;
  const faqs = fm.faqs || [];

  // SEO-003: LocalBusiness schema for location page
  const locationSchema = getServiceAreaSchema(locationName, slug);

  return (
    <>
      {/* SEO-003: LocalBusiness schema for location page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />

      <div>
        {/* Hero Section */}
        <LocationPageHero
          title={fm.hero?.title || `Print & graphics in ${locationName}`}
          locationName={locationName}
          description={fm.hero?.description || fm.description || ''}
          heroImage={heroImage ? getImageUrl(heroImage) : undefined}
          phone={fm.hero?.phone || siteConfig.business.phone}
          trustBadges={fm.hero?.trustBadges}
          ctaText={fm.hero?.ctaText || 'Get Free Quote'}
          ctaUrl={fm.hero?.ctaUrl || '/contact'}
        />

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
                <span className="label-overline mb-4 inline-block">{locationName}</span>
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

        {/* CTA */}
        <CtaBand
          headline={`Ready to start your ${locationName} project?`}
          subtext={`Contact ${siteConfig.business.name} for a free quote. Our team knows ${locationName} inside out.`}
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
