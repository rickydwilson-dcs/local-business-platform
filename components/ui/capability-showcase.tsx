import Link from "next/link"

interface CapabilityItem {
  title: string
  subtitle: string
  description: string
  duration?: string
  features?: string[]
  href?: string
  ctaText?: string
}

interface CapabilityShowcaseProps {
  title: string
  description?: string
  capabilities: CapabilityItem[]
  backgroundColor?: 'white' | 'gray'
}

export function CapabilityShowcase({
  title,
  description,
  capabilities,
  backgroundColor = 'white'
}: CapabilityShowcaseProps) {
  const bgClass = backgroundColor === 'white' ? 'bg-white' : 'bg-gray-50'

  // Dynamic grid classes based on number of capabilities
  const getGridClass = (itemCount: number) => {
    switch (itemCount) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case 5:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      case 6:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
  }

  return (
    <section className={`section-standard ${bgClass}`}>
      <div className="container-standard">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="heading-section">
            {title}
          </h2>
          {description && (
            <p className="text-subtitle mx-auto max-w-4xl">
              {description}
            </p>
          )}
        </div>

        {/* Capabilities Grid */}
        <div className={`grid-responsive ${getGridClass(capabilities.length)}`}>
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="group relative bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Duration Badge */}
              {capability.duration && (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex px-3 py-1 bg-brand-blue text-white text-sm font-semibold rounded-full">
                    {capability.duration}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="pt-2">
                <div className="mb-4">
                  <h3 className="heading-card-sm">
                    {capability.title}
                  </h3>
                  <p className="text-sm text-brand-blue font-medium">
                    {capability.subtitle}
                  </p>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {capability.description}
                </p>

                {/* Features List */}
                {capability.features && capability.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {capability.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-1.5 h-1.5 bg-brand-blue rounded-full mt-2"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA Button */}
                {capability.href && capability.ctaText && (
                  <Link
                    href={capability.href}
                    className="btn-primary w-full justify-center group-hover:scale-105 text-sm"
                  >
                    {capability.ctaText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}