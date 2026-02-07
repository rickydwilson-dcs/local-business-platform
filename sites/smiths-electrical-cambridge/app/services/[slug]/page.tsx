/**
 * Service Detail Page
 * ===================
 *
 * Individual service page with MDX content rendering.
 * Features hero, benefits, about section, FAQs, and CTA.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  Schema,
  Breadcrumbs,
  ServiceHero,
  ServiceAbout,
  ServiceBenefits,
  FAQSection,
  CTASection,
  type FAQItem,
  type AboutContent,
} from '@platform/core-components';
import { getServices, getService } from '@/lib/content';
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
  const title = fm.seoTitle || `${fm.title} | ${siteConfig.business.name}`;
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
              alt: fm.title,
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

  const breadcrumbItems = [
    { name: 'Services', href: '/services' },
    { name: serviceName, href: `/services/${slug}`, current: true },
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
        <ServiceHero
          title={fm.title}
          description={fm.description || ''}
          badge={fm.badge}
          heroImage={heroImage}
          phone={siteConfig.business.phone}
        />

        {/* Benefits Section */}
        {benefits.length > 0 && <ServiceBenefits items={benefits} />}

        {/* About Section */}
        {about && <ServiceAbout serviceName={serviceName} slug={slug} about={about} />}

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
            phone={siteConfig.business.phone}
          />
        )}

        {/* CTA Section */}
        <CTASection
          title={`Ready for Professional ${serviceName}?`}
          description={`Contact ${siteConfig.business.name} today for a free quote. Our expert team is ready to help with your ${serviceName.toLowerCase()} needs.`}
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
          { name: 'Services', url: '/services' },
          { name: serviceName, url: `/services/${slug}` },
        ]}
        service={{
          id: `/services/${slug}#service`,
          url: `/services/${slug}`,
          name: fm.title,
          description: fm.description || '',
          serviceType: serviceName,
          areaServed: siteConfig.serviceAreas,
        }}
        faqs={faqs}
      />
    </>
  );
}
