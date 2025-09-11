import Link from "next/link";

interface Area {
  name: string;
  slug: string;
}

interface CoverageAreasProps {
  areas: Area[];
  phone?: string;
  title?: string;
  description?: string;
  linkPrefix?: string;
}

export function CoverageAreas({ 
  areas, 
  phone, 
  title = "Professional Service Across the South East",
  description = "Our services are available throughout the South East UK, with local teams familiar with regional planning requirements and building regulations. We provide rapid response times and competitive pricing for all project sizes.",
  linkPrefix = "/locations"
}: CoverageAreasProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              {title}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {description}
            </p>
            <p className="text-gray-600">
              From small residential projects to large commercial developments, our experienced team
              delivers safe, compliant solutions that meet your specific requirements and timeline.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">
              {linkPrefix === "/locations" ? "Coverage Areas" : "Towns & Cities"}
            </h3>
            <ul className="space-y-2 text-sm">
              {areas.map(area => (
                <li key={area.slug}>
                  <Link href={`${linkPrefix}/${area.slug}`} className="text-brand-blue hover:underline">
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
            {phone && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Need immediate assistance?</p>
                <Link
                  href="/contact"
                  className="block text-center px-4 py-2 bg-brand-blue text-white font-medium rounded-md hover:bg-brand-blue-hover transition-colors"
                >
                  Call Now: {phone}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
