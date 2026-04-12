/**
 * Service Detail Page — thin wrapper around OrionServiceDetailPage
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { SiteConfigSummary } from '@platform/core-components';
import { Schema, type FAQItem, type AboutContent } from '@platform/core-components';
import { getServices, getService } from '@/lib/content';
import { loadMdx } from '@/lib/mdx';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY } from '@/lib/contact-info';
import { OrionServiceDetailPage } from '@platform/themes/orion/pages';

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

const siteSummary: SiteConfigSummary = {
  name: siteConfig.business.name,
  tagline: siteConfig.tagline,
  phone: siteConfig.business.phone,
  phoneDisplay: PHONE_DISPLAY,
  address: { city: siteConfig.business.address.city },
  cta: siteConfig.cta,
  stats: siteConfig.credentials?.stats,
};

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

  const breadcrumbItems = [
    { name: 'Services', href: '/services' },
    { name: serviceName, href: `/services/${slug}`, current: true },
  ];

  const schemaNodes = (
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
  );

  return (
    <OrionServiceDetailPage
      siteConfig={siteSummary}
      frontmatter={{
        title: fm.title,
        description: fm.description,
        badge: fm.badge,
        heroImage,
        benefits,
        faqs,
      }}
      mdxContent={mdxContent}
      breadcrumbs={breadcrumbItems}
      schemaNodes={schemaNodes}
      about={about}
    />
  );
}
