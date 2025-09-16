'use client';

export function CoverageStatsSection() {
  const stats = [
    {
      number: "30+",
      label: "Towns Covered",
      description: "Individual specialists for each area"
    },
    {
      number: "4",
      label: "Counties Served",
      description: "East Sussex, West Sussex, Kent, Surrey"
    },
    {
      number: "15+",
      label: "Council Relationships",
      description: "Established permit and planning partnerships"
    },
    {
      number: "100+",
      label: "Heritage Projects",
      description: "Listed buildings and conservation areas"
    }
  ];

  return (
    <section className="section-standard bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-standard">
        <div className="text-center mb-12">
          <h2 className="heading-section">
            Comprehensive South East Coverage
          </h2>
          <p className="text-lg text-gray-600 mx-auto w-full lg:w-[85%]">
            Unlike generic regional companies, we provide dedicated local specialists with genuine area expertise.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="stat-number text-brand-blue mb-2">{stat.number}</div>
                <div className="text-gray-900 font-semibold text-lg mb-2">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}