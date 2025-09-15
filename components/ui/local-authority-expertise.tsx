import Link from "next/link"

interface ExpertiseItem {
  title: string
  description: string
  icon?: React.ReactNode
}

interface LocalAuthorityExpertiseProps {
  title: string
  description?: string
  locationName: string
  authorityName: string
  expertiseItems: ExpertiseItem[]
  supportItems: ExpertiseItem[]
  backgroundColor?: 'white' | 'gray'
}

export function LocalAuthorityExpertise({
  title,
  description,
  locationName,
  authorityName,
  expertiseItems,
  supportItems,
  backgroundColor = 'gray'
}: LocalAuthorityExpertiseProps) {
  const bgClass = backgroundColor === 'white' ? 'bg-white' : 'bg-gray-50'

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

        {/* Local Authority Expertise Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Local Authority Expertise
          </h3>

          {/* Two Column Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Local Authority Expertise */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Three decades working with {authorityName} means we understand the local requirements,
                planning processes, and regulatory landscape.
              </p>

              <ul className="space-y-3">
                {expertiseItems.map((item, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <div className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-900">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - Permit & Planning Support */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">
                Permit & Planning Support
              </h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We handle all permit applications, planning submissions, and council liaison work,
                saving you time and ensuring compliance with local regulations.
              </p>

              <div className="space-y-4">
                {supportItems.map((item, index) => (
                  <div key={index}>
                    <h5 className="font-semibold text-gray-900 mb-2">{item.title}</h5>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/contact"
            className="btn-primary-lg gap-2"
          >
            Get {locationName} Planning Support
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}