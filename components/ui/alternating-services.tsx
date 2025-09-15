import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface ServiceItem {
  title: string
  description: string
  features: string[]
  image: string
  href: string
  ctaText?: string
}

interface AlternatingServicesProps {
  title: string
  description?: string
  services: ServiceItem[]
}

export function AlternatingServices({ title, description, services }: AlternatingServicesProps) {
  return (
    <section className="section-standard bg-white">
      <div className="container-standard">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-section">
            {title}
          </h2>
          {description && (
            <p className="text-subtitle mx-auto max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {/* Alternating Services */}
        <div className="space-y-20">
          {services.map((service, index) => {
            const isEven = index % 2 === 0
            return (
              <div
                key={index}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-8 lg:gap-16`}
              >
                {/* Image Section */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <h3 className="heading-card">
                      {service.title}
                    </h3>
                    <p className="text-body-lg">
                      {service.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-brand-blue rounded-full mt-3"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Link
                      href={service.href}
                      className="btn-primary gap-2 hover:scale-105"
                    >
                      <span>{service.ctaText || `Learn About ${service.title}`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Need Help Choosing the Right Service?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our experienced team can assess your project requirements and recommend 
            the most suitable scaffolding solution for your needs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Get Expert Advice
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}