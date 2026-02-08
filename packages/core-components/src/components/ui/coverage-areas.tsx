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
  title = "Professional Scaffolding Services Across the South East",
  description = "Our expert team understands the unique architectural challenges across the South East, providing specialized scaffolding solutions for the region's distinctive building types and heritage properties.",
  linkPrefix = "/locations",
}: CoverageAreasProps) {
  const projectTypes = [
    "Historic seafront properties and coastal buildings",
    "Traditional oast houses and countryside barns",
    "Victorian and Georgian terraced properties",
    "Medieval timber-framed heritage buildings",
    "Modern commercial and residential developments",
    "Industrial and warehouse complexes",
  ];

  return (
    <section className="section-standard bg-white">
      <div className="container-standard">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="heading-section mb-6">{title}</h2>
            <p className="text-body-lg mb-8">{description}</p>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Specialist Experience Across the Region
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {projectTypes.map((project, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-surface-muted rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center mt-0.5">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-900 font-medium text-sm">{project}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      TG20:21 Compliant & Fully Insured
                    </h4>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      All our scaffolding installations across the South East meet the latest
                      TG20:21 standards, with comprehensive £10M public liability insurance and CHAS
                      accreditation for complete peace of mind.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface-muted rounded-2xl p-6 border border-gray-200 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Coverage Areas
              </h3>
              <div className="space-y-3">
                {areas.map((area) => (
                  <div
                    key={area.slug}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full"></div>
                    <Link
                      href={`${linkPrefix}/${area.slug}`}
                      className="text-gray-900 font-medium hover:text-brand-primary transition-colors"
                    >
                      {area.name}
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-800 mb-4">
                  <svg
                    className="h-4 w-4 text-brand-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Rapid Response Times
                </div>
                <p className="text-sm text-gray-800 mb-4">
                  24-48 hour installation across all South East locations with emergency callout
                  available.
                </p>
                <a
                  href="/contact"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors text-sm"
                >
                  Get Free Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
