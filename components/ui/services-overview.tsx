import { ArrowRight } from "lucide-react"
import Link from "next/link"

const services = [
  {
    title: "Access Scaffolding",
    description: "Safe, compliant access scaffolding for all project types across the South East UK.",
    href: "/services/access-scaffolding",
  },
  {
    title: "Facade Scaffolding",
    description: "Professional facade scaffolding solutions for building maintenance and construction.",
    href: "/services/facade-scaffolding",
  },
  {
    title: "Edge Protection",
    description: "Comprehensive edge protection systems to ensure maximum safety on site.",
    href: "/services/edge-protection",
  },
  {
    title: "Birdcage Scaffolds",
    description: "Independent scaffold structures providing comprehensive access for complex projects.",
    href: "/services/birdcage-scaffolds",
  },
  {
    title: "Scaffold Towers",
    description: "Mobile and static scaffold towers for flexible access solutions.",
    href: "/services/scaffold-towers-mast-systems",
  },
  {
    title: "Temporary Roof Systems",
    description: "Weather protection and temporary roofing solutions for ongoing work.",
    href: "/services/temporary-roof-systems",
  },
  {
    title: "Scaffolding Design",
    description: "Professional scaffolding design and engineering drawings service.",
    href: "/services/scaffolding-design-drawings",
  },
  {
    title: "Scaffold Inspections",
    description: "Regular inspections and maintenance to ensure ongoing compliance.",
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
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden"
            >
              <div className="p-6 text-center flex flex-col h-full">
                <h3 className="text-base sm:text-lg font-heading font-semibold leading-tight mb-3 line-clamp-1">{service.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2 flex-grow-0">
                  {service.description}
                </p>
                <div className="flex-grow mb-4">
                  {/* Spacer to push button down */}
                </div>
                <Link
                  href={service.href}
                  className="inline-flex items-center justify-center gap-2 bg-transparent border border-gray-300 px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all duration-300 group-hover:scale-105 mt-auto"
                >
                  <span>Learn About {service.title}</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
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
