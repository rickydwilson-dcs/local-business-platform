/**
 * `/locations/[slug]` — a single town's page, ported to the r9 design.
 * See `components/locations/location-detail-page.tsx` for the port's own
 * notes, including what the demoed prototype (Brighton) does that this
 * generalised template deliberately does not reproduce for the other 7
 * towns.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { SiteLocationDetailPage } from '@/components/locations/location-detail-page';
import { getLocations, getLocation, getTestimonialsByLocation } from '@/lib/content';
import { loadMdx } from '@/lib/mdx';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { getServiceAreaSchema } from '@/lib/schema';
import { parseCoordinates } from '@/lib/location-geo';
import {
  toLocationDisplayTitle,
  toTownNameFromSlug,
  dedupeBreadcrumbs,
} from '@/lib/location-card-meta';

/** Real, raw `content/locations/*.mdx` frontmatter shape (gray-matter data,
 *  not run through `LocationFrontmatterSchema` — see `lib/location-geo.ts`'s
 *  header on why `coordinates` isn't that schema's unrelated `coords`
 *  tuple). */
interface LocationFrontmatter {
  title: string;
  seoTitle?: string;
  description?: string;
  keywords?: string[];
  coordinates?: { lat: number; lng: number };
  hero?: { title?: string; description?: string; image?: string };
  heroImage?: string;
  breadcrumbs?: Array<{ title: string; href: string }>;
  faqs?: Array<{ question: string; answer: string }>;
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

  const fm = result.frontmatter as unknown as LocationFrontmatter;
  const displayTitle = toLocationDisplayTitle(fm.title);
  const title = fm.seoTitle || `${displayTitle} — ${siteConfig.business.name}`;
  const description = fm.description || `${displayTitle}, from ${siteConfig.business.name}.`;
  const heroImage = fm.hero?.image || fm.heroImage;

  return {
    title,
    description,
    keywords: fm.keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title: displayTitle,
      description,
      url: absUrl(`/locations/${slug}`),
      siteName: siteConfig.business.name,
      images: heroImage
        ? [{ url: getImageUrl(heroImage), width: 1200, height: 630, alt: displayTitle }]
        : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
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

  const coordinates = parseCoordinates(fm.coordinates);
  if (!coordinates) {
    throw new Error(
      `content/locations/${slug}.mdx has no valid "coordinates" frontmatter block — required to render its distance fact`
    );
  }

  const testimonials = await getTestimonialsByLocation(slug);
  const testimonial = testimonials[0]
    ? {
        text: testimonials[0].text,
        customerName: testimonials[0].customerName,
        customerRole: testimonials[0].customerRole,
      }
    : null;

  const displayTitle = toLocationDisplayTitle(fm.title);
  const townName = toTownNameFromSlug(slug);
  const faqs = fm.faqs || [];

  // Real per-town frontmatter breadcrumbs, deduplicated — see
  // `dedupeBreadcrumbs`'s header on the known `brighton.mdx` bug this
  // guards against without editing that file.
  const rawCrumbs = fm.breadcrumbs?.length
    ? fm.breadcrumbs
    : [
        { title: 'Home', href: '/' },
        { title: 'Locations', href: '/locations' },
        { title: fm.title, href: `/locations/${slug}` },
      ];
  const crumbs = dedupeBreadcrumbs(rawCrumbs);
  const breadcrumbItems = crumbs.map((item, index) => ({
    name: item.title,
    href: item.href,
    current: index === crumbs.length - 1,
  }));

  const locationSchema = getServiceAreaSchema(displayTitle, slug);

  const schemaNodes = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={breadcrumbItems.map(({ name, href }) => ({ name, url: href }))}
        webpage={{
          '@type': 'WebPage',
          '@id': absUrl(`/locations/${slug}#webpage`),
          url: absUrl(`/locations/${slug}`),
          name: displayTitle,
          description: fm.description || '',
        }}
        faqs={faqs}
      />
    </>
  );

  return (
    <SiteLocationDetailPage
      displayTitle={displayTitle}
      townName={townName}
      leadSource={fm.hero?.description || fm.description}
      coordinates={coordinates}
      faqs={faqs}
      mdxContent={mdxContent}
      testimonial={testimonial}
      breadcrumbs={breadcrumbItems}
      schemaNodes={schemaNodes}
      studioTown={siteConfig.business.address.city}
      studioPostcode={siteConfig.business.address.postalCode.split(' ')[0]}
    />
  );
}
