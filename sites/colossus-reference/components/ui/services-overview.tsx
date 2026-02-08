import Link from "next/link";
import { ContentCard } from "@platform/core-components";
import { getContentItems } from "@/lib/content";

// Static list of services to display on home page
// These services will have their data read from MDX frontmatter
const homePageServices = [
  "access-scaffolding",
  "facade-scaffolding",
  "edge-protection",
  "birdcage-scaffolds",
  "scaffold-towers-mast-systems",
  "temporary-roof-systems",
  "scaffolding-design-drawings",
  "scaffolding-inspections-maintenance",
];

export async function ServicesOverview() {
  // Get all services from MDX content
  const allServices = await getContentItems("services");

  // Filter to only home page services and maintain order
  const services = homePageServices
    .map((slug) => allServices.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  return (
    <section className="section-standard bg-white">
      <div className="container-standard">
        <div className="section-header">
          <h2 className="heading-section">Our Scaffolding Services</h2>
          <p className="text-subtitle mx-auto max-w-4xl">
            Professional, compliant scaffolding solutions for every project across the South East UK
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {services.map((service) => (
            <ContentCard
              key={service.slug}
              title={service.title.replace(" Services", "")}
              description={service.description}
              href={`/services/${service.slug}`}
              badge={service.badge}
              image={service.image}
              features={service.features}
              contentType="services"
            />
          ))}
        </div>

        <div className="text-center">
          <Link href="/services" className="btn-primary hover:scale-105">
            View All Scaffolding Services
          </Link>
        </div>
      </div>
    </section>
  );
}
