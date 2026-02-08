import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getImageUrl, generateImageAlt } from "@/lib/image";

interface ServiceItem {
  title: string;
  subtitle?: string | string[];
  description: string;
  features: string[];
  href: string;
  ctaText: string;
  image?: string;
  icon?: React.ReactNode;
}

interface ServiceShowcaseProps {
  title: string;
  description?: string;
  services: ServiceItem[];
  layout?: "grid" | "alternating";
  backgroundColor?: "white" | "gray";
  showBottomCTA?: boolean;
}

export function ServiceShowcase({
  title,
  description,
  services,
  layout = "grid",
  backgroundColor = "white",
  showBottomCTA = false,
}: ServiceShowcaseProps) {
  const bgClass = backgroundColor === "white" ? "bg-white" : "bg-surface-muted";

  // Dynamic grid classes based on number of services for grid layout
  const getGridClass = (serviceCount: number) => {
    switch (serviceCount) {
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
      case 6:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  if (layout === "alternating") {
    return (
      <section className={`section-standard ${bgClass}`}>
        <div className="container-standard">
          {/* Section Header */}
          <div className="section-header">
            <h2 className="heading-section">{title}</h2>
            {description && <p className="text-subtitle mx-auto max-w-4xl">{description}</p>}
          </div>

          {/* Alternating Services */}
          <div className="space-y-20">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } items-center gap-8 lg:gap-16`}
                >
                  {/* Image Section */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                      {service.image ? (
                        <Image
                          src={getImageUrl(service.image)}
                          alt={generateImageAlt(service.title)}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-brand-primary/10 to-brand-primary/20 flex items-center justify-center">
                          {service.icon || (
                            <div className="w-16 h-16 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-brand-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <div>
                      {/* Subtitle pills for alternating layout */}
                      {service.subtitle && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Array.isArray(service.subtitle) ? (
                            service.subtitle.map((subtitle, subtitleIndex) => (
                              <span
                                key={subtitleIndex}
                                className="inline-block px-3 py-1 bg-brand-primary/90 text-white text-sm font-semibold rounded-full backdrop-blur-sm shadow-sm"
                              >
                                {subtitle}
                              </span>
                            ))
                          ) : (
                            <span className="inline-block px-3 py-1 bg-brand-primary/90 text-white text-sm font-semibold rounded-full backdrop-blur-sm shadow-sm">
                              {service.subtitle}
                            </span>
                          )}
                        </div>
                      )}
                      <h3 className="heading-card">{service.title}</h3>
                      <p className="text-body-lg">{service.description}</p>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full mt-3"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <Link
                        href={service.href}
                        className="btn-primary gap-2 hover:scale-105"
                        aria-label={`${service.ctaText} for ${service.title}`}
                      >
                        <span>{service.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA for alternating layout */}
          {showBottomCTA && (
            <div className="text-center mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Need Help Choosing the Right Service?
              </h3>
              <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
                Our experienced team can assess your project requirements and recommend the most
                suitable scaffolding solution for your needs.
              </p>
              <Link href="/contact" className="btn-primary-lg gap-2">
                Get Expert Advice
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Grid layout (default)
  return (
    <section className={`section-standard ${bgClass}`}>
      <div className="container-standard">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="heading-section">{title}</h2>
          {description && <p className="text-subtitle mx-auto max-w-4xl">{description}</p>}
        </div>

        {/* Services Grid */}
        <div className={`grid-responsive ${getGridClass(services.length)}`}>
          {services.map((service, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`group relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                  isEven ? "bg-white" : "bg-surface-muted"
                }`}
              >
                {/* Header with Image/Icon */}
                <div className="relative">
                  {service.image ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={getImageUrl(service.image)}
                        alt={generateImageAlt(service.title)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-brand-primary/10 to-brand-primary/20 flex items-center justify-center">
                      {service.icon || (
                        <div className="w-12 h-12 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-brand-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Subtitle overlay - handles both string and string array */}
                  {service.subtitle && (
                    <div className="absolute top-4 left-4 right-4">
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(service.subtitle) ? (
                          service.subtitle.map((subtitle, subtitleIndex) => (
                            <span
                              key={subtitleIndex}
                              className="inline-block px-3 py-1 bg-brand-primary/90 text-white text-sm font-semibold rounded-full backdrop-blur-sm shadow-sm"
                            >
                              {subtitle}
                            </span>
                          ))
                        ) : (
                          <span className="inline-block px-3 py-1 bg-brand-primary/90 text-white text-sm font-semibold rounded-full backdrop-blur-sm shadow-sm">
                            {service.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>

                  <p className="text-gray-800 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-1.5 h-1.5 bg-brand-primary rounded-full mt-2"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href={service.href}
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover group-hover:scale-105 transition-all duration-200 text-sm focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                    aria-label={`${service.ctaText} for ${service.title}`}
                  >
                    {service.ctaText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
