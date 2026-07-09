/**
 * Projects Listing Page
 * =====================
 *
 * Portfolio of completed projects.
 * Adapts to site branding via site.config.ts.
 */

import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { ProjectsPage } from '@/components/pages/projects-page';
import { getProjects } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Our Projects | Case Studies | ${siteConfig.business.name}`,
  description: `View our portfolio of completed projects. From residential to commercial, see our work in action across ${siteConfig.serviceAreas.join(', ')}.`,
  keywords: ['projects', 'case studies', 'portfolio', 'completed work', 'examples'],
  openGraph: {
    title: `Our Projects | Case Studies | ${siteConfig.business.name}`,
    description: `View our portfolio of completed projects. From residential to commercial developments.`,
    url: '/projects',
    type: 'website',
  },
};

export default async function ProjectsPageRoute() {
  const projects = await getProjects();

  return (
    <>
      <ProjectsPage
        projects={projects.map((p) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          heroImage: p.heroImage,
          date: p.year?.toString(),
          tags: [p.projectType],
        }))}
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
        ]}
        webpage={{
          '@type': 'CollectionPage',
          '@id': absUrl('/projects#collection'),
          url: absUrl('/projects'),
          name: `${siteConfig.business.name} Projects`,
          description: `Portfolio of completed projects. From residential to commercial developments.`,
        }}
      />
    </>
  );
}
