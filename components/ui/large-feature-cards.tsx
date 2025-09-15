import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface FeatureCard {
  title: string
  description: string
  details: string[]
  image?: string
  icon?: React.ReactNode
  href?: string
  ctaText?: string
  badge?: string
}

interface LargeFeatureCardsProps {
  title: string
  description?: string
  cards: FeatureCard[]
  columns?: 2 | 3 | 4
  backgroundColor?: 'white' | 'gray'
  showBottomCTA?: boolean
}

export function LargeFeatureCards({
  title,
  description,
  cards,
  columns = 2,
  backgroundColor = 'gray',
  showBottomCTA = true
}: LargeFeatureCardsProps) {
  const bgClass = backgroundColor === 'white' ? 'bg-white' : 'bg-gray-50'
  
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', 
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }[columns]

  return (
    <section className={`py-16 sm:py-20 ${bgClass}`}>
      <div className="mx-auto w-full lg:w-[90%] px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg sm:text-xl text-gray-600 mx-auto max-w-4xl">
              {description}
            </p>
          )}
        </div>

        {/* Cards Grid */}
        <div className={`grid ${gridClass} gap-6 lg:gap-8`}>
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
            >
              {/* Badge */}
              {card.badge && (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex px-3 py-1 bg-brand-blue text-white text-sm font-semibold rounded-full">
                    {card.badge}
                  </span>
                </div>
              )}

              {/* Image or Icon */}
              {card.image && (
                <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {card.icon && !card.image && (
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-brand-blue bg-opacity-10 rounded-xl flex items-center justify-center text-brand-blue">
                    {card.icon}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  {card.title}
                </h3>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* Details List */}
                {card.details.length > 0 && (
                  <ul className="space-y-3 mb-8 flex-1">
                    {card.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-brand-blue rounded-full mt-3"></div>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA Button */}
                {card.href && (
                  <div className="mt-auto">
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-blue-hover group-hover:scale-105 transition-all duration-200 w-full justify-center sm:w-auto sm:justify-start"
                    >
                      <span>{card.ctaText || `Learn More`}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {showBottomCTA && (
          <div className="text-center mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Contact our expert team to discuss your project requirements and get a tailored quote.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Get Your Quote Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}