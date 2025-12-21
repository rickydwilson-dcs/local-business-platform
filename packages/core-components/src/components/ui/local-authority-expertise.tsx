import Link from "next/link";

interface ExpertiseItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface LocalAuthorityExpertiseProps {
  title: string;
  description?: string;
  locationName: string;
  authorityName: string;
  expertiseItems: ExpertiseItem[];
  supportItems: ExpertiseItem[];
  backgroundColor?: "white" | "gray";
}

export function LocalAuthorityExpertise({
  title,
  description,
  locationName,
  authorityName,
  expertiseItems,
  supportItems,
  backgroundColor = "gray",
}: LocalAuthorityExpertiseProps) {
  const bgClass = backgroundColor === "white" ? "bg-white" : "bg-gray-50";

  return (
    <section className={`section-standard ${bgClass}`}>
      <div className="container-standard">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="heading-section">{title}</h2>
          {description && <p className="text-subtitle mx-auto max-w-4xl">{description}</p>}
        </div>

        {/* Local Authority Expertise Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Local Authority Expertise
          </h3>

          {/* Two Column Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Local Authority Expertise */}
            <div className="card-simple">
              <p className="text-gray-800 mb-6 leading-relaxed">
                Three decades working with {authorityName} means we understand the local
                requirements, planning processes, and regulatory landscape.
              </p>

              <ul className="space-y-3">
                {expertiseItems.map((item, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-900">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - Permit & Planning Support */}
            <div className="card-simple">
              <h4 className="font-semibold text-gray-900 mb-4">Permit & Planning Support</h4>
              <p className="text-gray-800 mb-6 leading-relaxed">
                We handle all permit applications, planning submissions, and council liaison work,
                saving you time and ensuring compliance with local regulations.
              </p>

              <div className="space-y-4">
                {supportItems.map((item, index) => (
                  <div key={index}>
                    <h5 className="font-semibold text-gray-900 mb-2">{item.title}</h5>
                    <p className="text-gray-800 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/contact" className="btn-primary-lg gap-2">
            Get {locationName} Planning Support
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
