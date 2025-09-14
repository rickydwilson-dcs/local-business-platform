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
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Our Scaffolding Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mx-auto w-full lg:w-[90%]">
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
            className="inline-flex bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-brand-blue-hover hover:scale-105 transition-all duration-200 font-semibold"
          >
            View All Scaffolding Services
          </Link>
        </div>
      </div>
    </section>
  )
}
