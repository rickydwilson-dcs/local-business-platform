/**
 * Project Detail Page
 * ===================
 *
 * Individual project page with MDX content rendering.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { SiteConfigSummary } from '@platform/core-components';
import { Schema } from '@platform/core-components';
import { VegaProjectDetailPage } from '@platform/themes/vega/pages';
import { getProjects, getProject } from '@/lib/content';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { loadMdx } from '@/lib/mdx';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY } from '@/lib/contact-info';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  const { frontmatter } = project;

  return {
    title: frontmatter.seoTitle || `${frontmatter.title} | ${siteConfig.business.name}`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: absUrl(`/projects/${slug}`),
      siteName: siteConfig.business.name,
      type: 'article',
      images: [
        {
          url: getImageUrl(frontmatter.heroImage),
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      images: [getImageUrl(frontmatter.heroImage)],
    },
    alternates: {
      canonical: absUrl(`/projects/${slug}`),
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const { frontmatter } = project;
  const { content: mdxContent } = await loadMdx({ baseDir: 'projects', slug });

  const breadcrumbItems = [
    { name: 'Projects', href: '/projects' },
    { name: frontmatter.title, href: `/projects/${slug}`, current: true },
  ];

  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone,
    phoneDisplay: PHONE_DISPLAY,
    address: { city: siteConfig.business.address.city },
    cta: siteConfig.cta,
    stats: siteConfig.credentials?.stats,
  };

  return (
    <>
      <VegaProjectDetailPage
        siteConfig={siteSummary}
        frontmatter={{
          title: frontmatter.title,
          description: frontmatter.description,
          heroImage: frontmatter.heroImage,
          date: frontmatter.year?.toString(),
          tags: frontmatter.category ? [frontmatter.category] : [],
          outcomes: frontmatter.results,
        }}
        mdxContent={mdxContent}
        breadcrumbs={breadcrumbItems}
      />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Projects', url: '/projects' },
          { name: frontmatter.title, url: `/projects/${slug}` },
        ]}
        webpage={{
          '@type': 'WebPage',
          '@id': absUrl(`/projects/${slug}#webpage`),
          url: absUrl(`/projects/${slug}`),
          name: frontmatter.title,
          description: frontmatter.description,
        }}
      />
    </>
  );
}
