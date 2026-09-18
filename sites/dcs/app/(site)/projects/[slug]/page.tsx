/**
 * `/projects/[slug]` — a case study, ported to the r9 design.
 * See `components/projects/project-detail-page.tsx` for the port's own
 * notes (in particular: what's generalised beyond the one demoed prototype
 * instance, Colossus Scaffolding).
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { ProjectDetailPage } from '@/components/projects/project-detail-page';
import { getProjects, getProject } from '@/lib/content';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

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
    robots: { index: true, follow: true },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: absUrl(`/projects/${slug}`),
      siteName: siteConfig.business.name,
      type: 'article',
      ...(frontmatter.heroImage && {
        images: [
          {
            url: getImageUrl(frontmatter.heroImage),
            width: 1200,
            height: 630,
            alt: frontmatter.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      ...(frontmatter.heroImage && { images: [getImageUrl(frontmatter.heroImage)] }),
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

  const { frontmatter, content } = project;

  return (
    <>
      <ProjectDetailPage slug={slug} frontmatter={frontmatter} content={content} />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          // "Work", matching the rendered breadcrumb and the primary nav
          // label (`components/site/site-chrome-data.ts`) — see the same
          // note in `app/(site)/projects/page.tsx`.
          { name: 'Work', url: '/projects' },
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
