/**
 * Project Detail Page — thin wrapper around OrionProjectDetailPage
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import type { SiteConfigSummary } from '@platform/core-components';
import { Schema, ArticleCallout } from '@platform/core-components';
import { getProjects, getProject, type Project } from '@/lib/content';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { loadMdx } from '@/lib/mdx';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY } from '@/lib/contact-info';
import { OrionProjectDetailPage } from '@platform/themes/orion/pages';

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

function ProjectSummary({ project }: { project: Project }) {
  return (
    <ArticleCallout variant="info" title="Project Summary">
      <dl className="space-y-2">
        <div className="flex justify-between">
          <dt className="text-surface-muted-foreground">Location:</dt>
          <dd className="font-medium text-surface-foreground">
            {project.locationName}
            {project.region && `, ${project.region}`}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-surface-muted-foreground">Completion date:</dt>
          <dd className="font-medium text-surface-foreground">
            {new Date(project.completionDate).toLocaleDateString('en-GB', {
              month: 'long',
              year: 'numeric',
            })}
          </dd>
        </div>
        {project.duration && (
          <div className="flex justify-between">
            <dt className="text-surface-muted-foreground">Duration:</dt>
            <dd className="font-medium text-surface-foreground">{project.duration}</dd>
          </div>
        )}
        {project.scope?.buildingType && (
          <div className="flex justify-between">
            <dt className="text-surface-muted-foreground">Building type:</dt>
            <dd className="font-medium text-surface-foreground">{project.scope.buildingType}</dd>
          </div>
        )}
        {project.scope?.storeys && (
          <div className="flex justify-between">
            <dt className="text-surface-muted-foreground">Storeys:</dt>
            <dd className="font-medium text-surface-foreground">{project.scope.storeys}</dd>
          </div>
        )}
        {project.scope?.squareMetres && (
          <div className="flex justify-between">
            <dt className="text-surface-muted-foreground">Size:</dt>
            <dd className="font-medium text-surface-foreground">
              {project.scope.squareMetres}m&sup2;
            </dd>
          </div>
        )}
        {/* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Intentional: decorative divider accent */}
        <div className="pt-2 border-t border-blue-200">
          <dt className="text-surface-muted-foreground mb-2">Services:</dt>
          <dd className="flex flex-wrap gap-2">
            {project.services.map((serviceSlug) => (
              <Link
                key={serviceSlug}
                href={`/services/${serviceSlug}`}
                className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full hover:bg-brand-primary/20 transition-colors"
              >
                {serviceSlug
                  .split('-')
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')}
              </Link>
            ))}
          </dd>
        </div>
        {project.scope?.challenges && project.scope.challenges.length > 0 && (
          // eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Intentional: decorative divider accent
          <div className="pt-2 border-t border-blue-200">
            <dt className="text-surface-muted-foreground mb-2">Key constraints:</dt>
            <dd className="space-y-1">
              {project.scope.challenges.map((challenge, idx) => (
                <div key={idx} className="flex items-start gap-2 text-surface-muted-foreground">
                  <span className="text-brand-primary mt-0.5">&bull;</span>
                  <span>{challenge}</span>
                </div>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </ArticleCallout>
  );
}

function RelatedProjectsSection({
  projects,
  currentSlug,
}: {
  projects: Project[];
  currentSlug: string;
}) {
  const related = projects.filter((p) => p.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="section-standard bg-surface-subtle">
      <div className="container-standard">
        <div className="section-header">
          <h2 className="heading-section">Related Projects</h2>
          <p className="text-subtitle mx-auto max-w-2xl">Explore more of our completed projects</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {related.map((project) => (
            <article
              key={project.slug}
              className="bg-surface-background rounded-xl overflow-hidden hover:shadow-lg transition-shadow group border border-surface-border"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="block relative h-56 overflow-hidden"
              >
                <Image
                  src={getImageUrl(project.heroImage)}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="p-6">
                <h3 className="font-bold text-surface-foreground mb-2 line-clamp-2 hover:text-brand-primary transition-colors">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h3>
                <p className="text-sm text-surface-muted-foreground">
                  {project.locationName} &middot; {project.year}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const { frontmatter } = project;
  const { content: mdxContent } = await loadMdx({ baseDir: 'projects', slug });
  const allProjects = await getProjects();

  const breadcrumbItems = [
    { name: 'Projects', href: '/projects' },
    { name: frontmatter.title, href: `/projects/${slug}`, current: true },
  ];

  return (
    <>
      <OrionProjectDetailPage
        siteConfig={siteSummary}
        frontmatter={{
          title: frontmatter.title,
          description: frontmatter.description,
          heroImage: frontmatter.heroImage,
          outcomes: frontmatter.results,
        }}
        mdxContent={mdxContent}
        breadcrumbs={breadcrumbItems}
        category={frontmatter.category}
        locationName={frontmatter.locationName}
        year={frontmatter.year}
        duration={frontmatter.duration}
        projectSummary={<ProjectSummary project={frontmatter} />}
        clientTestimonial={
          frontmatter.client?.testimonial
            ? {
                text: frontmatter.client.testimonial,
                type: frontmatter.client.type,
                rating: frontmatter.client.rating,
              }
            : undefined
        }
        faqs={frontmatter.faqs}
        relatedProjects={<RelatedProjectsSection projects={allProjects} currentSlug={slug} />}
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
