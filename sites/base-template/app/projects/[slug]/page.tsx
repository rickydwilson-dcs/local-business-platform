/**
 * Project Detail Page
 * ===================
 *
 * Individual project page with MDX content rendering.
 * Features hero section, project summary, outcomes, and testimonials.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Schema } from '@/components/Schema';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { BlogPostHero } from '@/components/ui/blog-post-hero';
import { FAQSection } from '@/components/ui/faq-section';
import { CTASection } from '@/components/ui/cta-section';
import { ArticleCallout } from '@/components/ui/article-callout';
import { getProjects, getProject, type Project } from '@/lib/content';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { loadMdx } from '@/lib/mdx';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

const categoryLabels: Record<string, string> = {
  heritage: 'Heritage Project',
  'new-build': 'New Build Project',
  renovation: 'Renovation Project',
  maintenance: 'Maintenance Project',
  emergency: 'Emergency Project',
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
            <dd className="font-medium text-surface-foreground">{project.scope.squareMetres}m²</dd>
          </div>
        )}
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
          <div className="pt-2 border-t border-blue-200">
            <dt className="text-surface-muted-foreground mb-2">Key constraints:</dt>
            <dd className="space-y-1">
              {project.scope.challenges.map((challenge, idx) => (
                <div key={idx} className="flex items-start gap-2 text-surface-muted-foreground">
                  <span className="text-brand-primary mt-0.5">•</span>
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

function OutcomesCallout({ results }: { results: string[] }) {
  return <ArticleCallout variant="success" title="Outcomes" items={results} />;
}

function ClientTestimonialCallout({
  testimonial,
  clientType,
  rating,
}: {
  testimonial: string;
  clientType: string;
  rating?: number;
}) {
  return <ArticleCallout variant="quote" quote={testimonial} author={clientType} rating={rating} />;
}

function RelatedProjects({ projects, currentSlug }: { projects: Project[]; currentSlug: string }) {
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
                  {project.locationName} · {project.year}
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
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <main>
        <article>
          {/* Hero Section - Reusing BlogPostHero */}
          <BlogPostHero
            variant="project"
            title={frontmatter.title}
            description={frontmatter.description}
            category={frontmatter.category}
            categoryLabel={categoryLabels[frontmatter.category] || frontmatter.category}
            locationName={frontmatter.locationName}
            year={frontmatter.year}
            duration={frontmatter.duration}
            heroImage={frontmatter.heroImage}
          />

          {/* Article Content */}
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <div className="max-w-4xl mx-auto">
                {/* Project Summary */}
                <ProjectSummary project={frontmatter} />

                {/* Prose Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4">
                  {mdxContent}
                </div>

                {/* Outcomes */}
                {frontmatter.results && frontmatter.results.length > 0 && (
                  <OutcomesCallout results={frontmatter.results} />
                )}

                {/* Client Testimonial */}
                {frontmatter.client?.testimonial && (
                  <ClientTestimonialCallout
                    testimonial={frontmatter.client.testimonial}
                    clientType={frontmatter.client.type}
                    rating={frontmatter.client.rating}
                  />
                )}
              </div>
            </div>
          </section>

          {/* FAQs */}
          {frontmatter.faqs && frontmatter.faqs.length > 0 && (
            <FAQSection items={frontmatter.faqs} variant="default" />
          )}

          {/* CTA Section */}
          <CTASection
            title="Ready to Start Your Project?"
            description={`Contact our expert team for a free consultation and quote. ${siteConfig.business.name} is ready to help.`}
            primaryButtonText="Get Free Quote"
            primaryButtonUrl="/contact"
          />
        </article>

        {/* Related Projects */}
        <RelatedProjects projects={allProjects} currentSlug={slug} />
      </main>

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
