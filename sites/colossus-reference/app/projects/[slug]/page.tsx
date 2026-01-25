import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Schema from "@/components/Schema";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { ServiceFAQ } from "@/components/ui/service-faq";
import { getProjects, getProject, type Project } from "@/lib/content";
import { getImageUrl } from "@/lib/image";
import { absUrl } from "@/lib/site";
import { loadMdx } from "@/lib/mdx";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

const projectTypeLabels: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  heritage: "Heritage",
};

const categoryLabels: Record<string, string> = {
  heritage: "Heritage",
  "new-build": "New Build",
  renovation: "Renovation",
  maintenance: "Maintenance",
  emergency: "Emergency",
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

function ProjectGallery({
  images,
  projectTitle,
}: {
  images: Project["images"];
  projectTitle: string;
}) {
  if (!images || images.length === 0) return null;

  return (
    <section className="section-standard bg-gray-50">
      <div className="container-standard">
        <h2 className="heading-section mb-8">Project Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src={getImageUrl(image.path)}
                alt={image.caption || `${projectTitle} - Image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedProjects({ projects, currentSlug }: { projects: Project[]; currentSlug: string }) {
  const related = projects.filter((p) => p.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="section-standard bg-white">
      <div className="container-standard">
        <h2 className="heading-section mb-8">Related Projects</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {related.map((project) => (
            <article
              key={project.slug}
              className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="block relative h-48 overflow-hidden"
              >
                <Image
                  src={getImageUrl(project.heroImage)}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>
              <div className="p-4">
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

      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px]">
          <Image
            src={getImageUrl(frontmatter.heroImage)}
            alt={frontmatter.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-standard pb-12">
              <div className="flex gap-2 mb-4">
                <span className="bg-brand-blue text-white text-sm font-semibold px-3 py-1.5 rounded">
                  {projectTypeLabels[frontmatter.projectType] || frontmatter.projectType}
                </span>
                <span className="bg-white/90 text-gray-800 text-sm font-medium px-3 py-1.5 rounded">
                  {categoryLabels[frontmatter.category] || frontmatter.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {frontmatter.title}
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl">{frontmatter.description}</p>
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="section-standard bg-white">
          <div className="container-standard">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-brand-blue">
                  {mdxContent}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Project Details</h3>

                  <div className="space-y-4">
                    <div>
                      <dt className="text-sm text-gray-500">Location</dt>
                      <dd className="font-medium text-gray-900">
                        {frontmatter.locationName}
                        {frontmatter.region && `, ${frontmatter.region}`}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-gray-500">Completed</dt>
                      <dd className="font-medium text-gray-900">
                        {new Date(frontmatter.completionDate).toLocaleDateString("en-GB", {
                          month: "long",
                          year: "numeric",
                        })}
                      </dd>
                    </div>

                    {frontmatter.duration && (
                      <div>
                        <dt className="text-sm text-gray-500">Duration</dt>
                        <dd className="font-medium text-gray-900">{frontmatter.duration}</dd>
                      </div>
                    )}

                    {frontmatter.scope && (
                      <>
                        {frontmatter.scope.buildingType && (
                          <div>
                            <dt className="text-sm text-gray-500">Building Type</dt>
                            <dd className="font-medium text-gray-900">
                              {frontmatter.scope.buildingType}
                            </dd>
                          </div>
                        )}
                        {frontmatter.scope.storeys && (
                          <div>
                            <dt className="text-sm text-gray-500">Storeys</dt>
                            <dd className="font-medium text-gray-900">
                              {frontmatter.scope.storeys}
                            </dd>
                          </div>
                        )}
                      </>
                    )}

                    {frontmatter.client && (
                      <div>
                        <dt className="text-sm text-gray-500">Client Type</dt>
                        <dd className="font-medium text-gray-900">{frontmatter.client.type}</dd>
                      </div>
                    )}
                  </div>

                  {/* Services Used */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Services Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {frontmatter.services.map((serviceSlug) => (
                        <Link
                          key={serviceSlug}
                          href={`/services/${serviceSlug}`}
                          className="text-sm bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full hover:bg-brand-blue/20 transition-colors"
                        >
                          {serviceSlug
                            .split("-")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Client Testimonial */}
                  {frontmatter.client?.testimonial && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Client Feedback</h4>
                      {frontmatter.client.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < frontmatter.client!.rating! ? "text-yellow-400" : "text-gray-200"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                      <blockquote className="text-sm text-gray-600 italic">
                        &ldquo;{frontmatter.client.testimonial}&rdquo;
                      </blockquote>
                      <p className="text-sm text-gray-500 mt-2">
                        &mdash; {frontmatter.client.type}
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-6 pt-6 border-t">
                    <Link href="/contact" className="btn-primary w-full text-center block">
                      Start Your Project
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {frontmatter.results && frontmatter.results.length > 0 && (
          <section className="section-standard bg-brand-blue">
            <div className="container-standard">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
                Project Results
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {frontmatter.results.map((result, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur rounded-lg p-4 flex items-start gap-3"
                  >
                    <svg
                      className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-white">{result}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Challenges Section */}
        {frontmatter.scope?.challenges && frontmatter.scope.challenges.length > 0 && (
          <section className="section-standard bg-gray-50">
            <div className="container-standard">
              <h2 className="heading-section mb-8">Project Challenges</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {frontmatter.scope.challenges.map((challenge, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 flex items-start gap-3 shadow-sm"
                  >
                    <div className="w-8 h-8 bg-brand-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-blue font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Project Gallery */}
        <ProjectGallery images={frontmatter.images} projectTitle={frontmatter.title} />

        {/* FAQs */}
        {frontmatter.faqs && frontmatter.faqs.length > 0 && <ServiceFAQ items={frontmatter.faqs} />}

        {/* CTA Section */}
        <section className="section-compact bg-white">
          <div className="container-standard text-center">
            <h2 className="heading-subsection">Ready to Start Your Project?</h2>
            <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
              Contact our expert team for a free consultation and quote for your scaffolding
              requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary-lg">
                Get Free Quote
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Our Services
              </Link>
            </div>
          </div>
        </section>

        {/* Related Projects */}
        <RelatedProjects projects={allProjects} currentSlug={slug} />
      </main>

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
