/**
 * Projects Listing Page — thin wrapper around OrionProjectsPage
 */

import type { Metadata } from 'next';
import type { SiteConfigSummary } from '@platform/core-components';
import { Schema } from '@platform/core-components';
import { getProjects } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY } from '@/lib/contact-info';
import { OrionProjectsPage } from '@platform/themes/orion/pages';

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

const siteSummary: SiteConfigSummary = {
  name: siteConfig.business.name,
  tagline: siteConfig.tagline,
  phone: siteConfig.business.phone,
  phoneDisplay: PHONE_DISPLAY,
  address: { city: siteConfig.business.address.city },
  cta: siteConfig.cta,
  stats: siteConfig.credentials?.stats,
};

export default async function ProjectsPageWrapper() {
  const projects = await getProjects();

  const projectSummaries = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    heroImage: p.heroImage,
    date: String(p.year),
    tags: [p.projectType, p.category].filter(Boolean),
  }));

  return (
    <>
      <OrionProjectsPage
        siteConfig={siteSummary}
        projects={projectSummaries}
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
