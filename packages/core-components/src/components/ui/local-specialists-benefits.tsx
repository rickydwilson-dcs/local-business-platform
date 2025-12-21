"use client";

export function LocalSpecialistsBenefits() {
  const benefits = [
    {
      title: "Council Relationships",
      description:
        "Established partnerships with local planning departments speed up permit applications.",
      icon: "building",
    },
    {
      title: "Area Knowledge",
      description:
        "We know your neighborhood's challenges - from coastal winds to conservation requirements.",
      icon: "map",
    },
    {
      title: "Heritage Expertise",
      description:
        "Specialists in listed buildings, conservation areas, and English Heritage requirements.",
      icon: "landmark",
    },
    {
      title: "Local Network",
      description: "Connections with local contractors, architects, and suppliers in your area.",
      icon: "users",
    },
  ];

  const iconComponents = {
    building: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
    map: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
    landmark: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
        />
      </svg>
    ),
    users: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  };

  return (
    <section className="section-standard bg-white">
      <div className="container-standard">
        <div className="text-center mb-12">
          <h2 className="heading-section">Why Local Scaffolding Specialists Matter</h2>
          <p className="text-lg text-gray-800 mx-auto w-full lg:w-[85%]">
            Unlike companies that cover &apos;the South East&apos; generically, our town-by-town
            approach means genuine local expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-brand-primary">
                {iconComponents[benefit.icon as keyof typeof iconComponents]}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-800 leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-50 rounded-xl p-6 lg:p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">The Local Difference</h3>
            <p className="text-gray-800 mb-6 max-w-3xl mx-auto">
              When you choose Colossus Scaffolding, you&apos;re not just getting scaffolding
              services - you&apos;re partnering with experts who understand your specific
              location&apos;s challenges, regulations, and opportunities. From coastal wind loading
              in Brighton to heritage requirements in Canterbury, we bring the right expertise to
              your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#town-finder" className="btn-primary">
                Find Your Local Team
              </a>
              <a
                href="tel:01424466661"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Call: 01424 466 661
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
