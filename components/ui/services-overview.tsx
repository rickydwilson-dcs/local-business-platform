import Link from "next/link"
import { ContentCard } from "./content-card"
import { getServiceData } from "@/lib/services-data"

const services = [
  {
    slug: "access-scaffolding",
    title: "Access Scaffolding",
    href: "/services/access-scaffolding",
  },
  {
    slug: "facade-scaffolding",
    title: "Facade Scaffolding",
    href: "/services/facade-scaffolding",
  },
  {
    slug: "edge-protection",
    title: "Edge Protection",
    href: "/services/edge-protection",
  },
  {
    slug: "birdcage-scaffolds",
    title: "Birdcage Scaffolds",
    href: "/services/birdcage-scaffolds",
  },
  {
    slug: "scaffold-towers-mast-systems",
    title: "Scaffold Towers",
    href: "/services/scaffold-towers-mast-systems",
  },
  {
    slug: "temporary-roof-systems",
    title: "Temporary Roof Systems",
    href: "/services/temporary-roof-systems",
  },
  {
    slug: "scaffolding-design-drawings",
    title: "Scaffolding Design",
    href: "/services/scaffolding-design-drawings",
  },
  {
    slug: "scaffolding-inspections-maintenance",
    title: "Scaffold Inspections",
    href: "/services/scaffolding-inspections-maintenance",
  },
]

export function ServicesOverview() {
  return (
    <section className="section-standard bg-white">
      <div className="container-standard">
        <div className="section-header">
          <h2 className="heading-section">
            Our Scaffolding Services
          </h2>
          <p className="text-subtitle mx-auto max-w-4xl">
            Professional, compliant scaffolding solutions for every project across the South East UK
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {services.map((service) => {
            const serviceData = getServiceData(service.slug)
            return (
              <ContentCard
                key={service.slug}
                title={service.title}
                description={serviceData.description}
                href={service.href}
                badge={serviceData.badge}
                image={serviceData.image}
                features={serviceData.features}
                contentType="services"
              />
            )
          })}
        </div>

        <div className="text-center">
          <Link
            href="/services"
            className="btn-primary hover:scale-105"
          >
            View All Scaffolding Services
          </Link>
        </div>
      </div>
    </section>
  )
}
