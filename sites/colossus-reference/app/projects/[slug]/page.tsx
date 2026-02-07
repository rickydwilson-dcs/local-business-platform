import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Schema,
  Breadcrumbs,
  BlogPostHero,
  ServiceFAQ,
  ServiceCTA,
  ArticleCallout,
} from "@platform/core-components";
import { getProjects, getProject, type Project } from "@/lib/content";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { loadMdx } from "@/lib/mdx";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

const categoryLabels: Record<string, string> = {
  heritage: "Heritage Project",
  "new-build": "New Build Project",
  renovation: "Renovation Project",
  maintenance: "Maintenance Project",
  emergency: "Emergency Project",
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
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const { frontmatter } = project;

  return {
    title: frontmatter.seoTitle || `${frontmatter.title} | Colossus Scaffolding`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: absUrl(`/projects/${slug}`),
      siteName: "Colossus Scaffolding",
      type: "article",
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
      card: "summary_large_image",
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
          <dt className="text-gray-600">Location:</dt>
          <dd className="font-medium text-gray-900">
            {project.locationName}
            {project.region && `, ${project.region}`}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Completion date:</dt>
          <dd className="font-medium text-gray-900">
            {new Date(project.completionDate).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </dd>
        </div>
        {project.duration && (
          <div className="flex justify-between">
            <dt className="text-gray-600">Duration:</dt>
            <dd className="font-medium text-gray-900">{project.duration}</dd>
          </div>
        )}
        {project.scope?.buildingType && (
          <div className="flex justify-between">
            <dt className="text-gray-600">Building type:</dt>
            <dd className="font-medium text-gray-900">{project.scope.buildingType}</dd>
          </div>
        )}
        {project.scope?.storeys && (
          <div className="flex justify-between">
            <dt className="text-gray-600">Storeys:</dt>
            <dd className="font-medium text-gray-900">{project.scope.storeys}</dd>
          </div>
        )}
        {project.scope?.squareMetres && (
          <div className="flex justify-between">
            <dt className="text-gray-600">Size:</dt>
            <dd className="font-medium text-gray-900">{project.scope.squareMetres}m²</dd>
          </div>
        )}
        <div className="pt-2 border-t border-blue-200">
          <dt className="text-gray-600 mb-2">Services:</dt>
          <dd className="flex flex-wrap gap-2">
            {project.services.map((serviceSlug) => (
              <Link
                key={serviceSlug}
                href={`/services/${serviceSlug}`}
                className="text-xs bg-brand-blue/10 text-brand-blue px-2 py-1 rounded-full hover:bg-brand-blue/20 transition-colors"
              >
                {serviceSlug
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </Link>
            ))}
          </dd>
        </div>
        {project.scope?.challenges && project.scope.challenges.length > 0 && (
          <div className="pt-2 border-t border-blue-200">
            <dt className="text-gray-600 mb-2">Key constraints:</dt>
            <dd className="space-y-1">
              {project.scope.challenges.map((challenge, idx) => (
                <div key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-brand-blue mt-0.5">•</span>
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
    <section className="section-standard bg-gray-50">
      <div className="container-standard">
        <div className="section-header">
          <h2 className="heading-section">Related Projects</h2>
          <p className="text-subtitle mx-auto max-w-2xl">
            Explore more of our scaffolding projects across the South East
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {related.map((project) => (
            <article
              key={project.slug}
              className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
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
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-brand-blue transition-colors">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h3>
                <p className="text-sm text-gray-600">
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
  const { content: mdxContent } = await loadMdx({ baseDir: "projects", slug });
  const allProjects = await getProjects();

  const breadcrumbItems = [
    { name: "Projects", href: "/projects" },
    { name: frontmatter.title, href: `/projects/${slug}`, current: true },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div>
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

          {/* Article Content - Single Column Layout matching Blog */}
          <section className="section-standard bg-white">
            <div className="container-standard">
              <div className="max-w-4xl mx-auto">
                {/* Project Summary - Injected before content */}
                <ProjectSummary project={frontmatter} />

                {/* Prose Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-li:text-gray-700 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4">
                  {mdxContent}
                </div>

                {/* Outcomes - Injected after "The result" section */}
                {frontmatter.results && frontmatter.results.length > 0 && (
                  <OutcomesCallout results={frontmatter.results} />
                )}

                {/* Client Testimonial - Injected after Outcomes */}
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

          {/* FAQs - Rendered from frontmatter */}
          {frontmatter.faqs && frontmatter.faqs.length > 0 && (
            <ServiceFAQ items={frontmatter.faqs} />
          )}

          {/* CTA Section - Reusing ServiceCTA component */}
          <ServiceCTA
            title="Ready to Start Your Project?"
            description="Contact our expert team for a free consultation and quote for your scaffolding requirements."
            primaryAction="Get Free Quote"
            primaryUrl="/contact"
          />
        </article>

        {/* Related Projects */}
        <RelatedProjects projects={allProjects} currentSlug={slug} />
      </div>

      <Schema
        org={{
          name: "Colossus Scaffolding",
          url: "/",
          logo: "/Colossus-Scaffolding-Logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
          { name: frontmatter.title, url: `/projects/${slug}` },
        ]}
        webpage={{
          "@type": "WebPage",
          "@id": absUrl(`/projects/${slug}#webpage`),
          url: absUrl(`/projects/${slug}`),
          name: frontmatter.title,
          description: frontmatter.description,
        }}
      />
    </>
  );
}
