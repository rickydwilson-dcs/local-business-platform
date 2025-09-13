import Link from "next/link";
import Schema from "@/components/Schema";

export const dynamic = "force-static";

type LocationArea = {
  slug: string;
  title: string;
  towns: string[];
  description: string;
  isHeadquarters?: boolean;
};

const coverageAreas: LocationArea[] = [
  {
    slug: "east-sussex",
    title: "East Sussex",
    towns: ["Hastings", "Bexhill", "Eastbourne", "St Leonards", "Rye", "Battle"],
    description: "Comprehensive scaffolding services across East Sussex with local expertise and rapid response times.",
    isHeadquarters: true,
  },
  {
    slug: "west-sussex",
    title: "West Sussex",
    towns: ["Brighton", "Crawley", "Worthing", "Chichester", "Horsham", "Burgess Hill"],
    description: "Professional scaffolding solutions throughout West Sussex for all project types and sizes.",
  },
  {
    slug: "kent",
    title: "Kent",
    towns: ["Canterbury", "Maidstone", "Dover", "Ashford", "Folkestone", "Tunbridge Wells"],
    description: "Expert scaffolding services across Kent with full compliance and insurance coverage.",
  },
  {
    slug: "surrey",
    title: "Surrey",
    towns: ["Guildford", "Woking", "Croydon", "Kingston", "Epsom", "Reigate"],
    description: "Reliable scaffolding installations throughout Surrey for residential and commercial projects.",
  },
  {
    slug: "london",
    title: "London",
    towns: ["All London Boroughs", "Central London", "Greater London"],
    description: "Specialized urban scaffolding services across all London boroughs with traffic management expertise.",
  },
  {
    slug: "essex",
    title: "Essex",
    towns: ["Chelmsford", "Colchester", "Southend", "Basildon", "Harlow", "Brentwood"],
    description: "Complete scaffolding services across Essex with experienced local teams and competitive pricing.",
  },
];

const serviceHighlights = [
  "TG20:21 compliant designs and installations",
  "Local planning permission assistance", 
  "Rapid response across all coverage areas",
  "CISRS qualified scaffolders in every region",
  "Comprehensive insurance coverage",
  "24/7 emergency call-out service",
];

export default function LocationsPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
              Areas We Serve
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Professional scaffolding services across the South East UK with local expertise, rapid response times, and comprehensive coverage from our experienced regional teams.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
              >
                Get Local Quote
              </Link>
              <Link
                href="tel:01424466661"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call: 01424 466 661
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <div className="bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                6 Counties Covered
              </div>
              <div className="bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                Local Teams
              </div>
              <div className="bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                Rapid Response
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Our Coverage Area</h2>
            <p className="text-lg text-gray-600">
              Serving the South East UK with professional scaffolding services and local expertise
            </p>
          </div>
          <div className="relative bg-gray-100 rounded-2xl p-8 text-center">
            <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium">South East UK Coverage Map</span>
                <p className="text-sm text-gray-500 mt-2">Interactive map showing our service areas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {coverageAreas.map((area) => (
              <div
                key={area.slug}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
              >
                {area.isHeadquarters && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-brand-blue text-white text-sm font-medium rounded-full">
                      Headquarters
                    </span>
                  </div>
                )}
                
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-brand-blue/10 rounded-lg">
                      <svg className="w-6 h-6 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-serif font-bold text-gray-900 line-clamp-1">
                      {area.title}
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2 flex-grow-0">
                    {area.description}
                  </p>

                  <ul className="space-y-2 mb-6 flex-grow">
                    {area.towns.slice(0, 3).map((town, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 line-clamp-1">{town}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/locations/${area.slug}`}
                    className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-hover font-semibold text-sm transition-colors mt-auto"
                  >
                    View Local Info
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12 text-center">
              Why Choose Our Regional Service?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceHighlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0 mt-2"></div>
                  <span className="text-gray-900 font-medium">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Not Sure If We Cover Your Area?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact our team to discuss your project location. We may be able to provide services outside our standard coverage areas for larger projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
            >
              Get Free Quote
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
      </div>

      <Schema
        service={{
          id: "/locations#service",
          url: "/locations",
          name: "Scaffolding Service Areas",
          description: "Professional scaffolding services available across multiple locations in the South East UK.",
          serviceType: "Local Services",
          areaServed: ["South East UK", "East Sussex", "West Sussex", "Kent", "Surrey", "London", "Essex"]
        }}
        org={{ 
          name: "Colossus Scaffolding", 
          url: "/", 
          logo: "/Colossus-Scaffolding-Logo.svg" 
        }}
        faqs={[
          {
            question: "Which locations do you serve?",
            answer: "We provide scaffolding services across the South East UK including East Sussex, West Sussex, Kent, Surrey, London, and Essex."
          },
          {
            question: "Do you handle permits and street works?",
            answer: "Yes, we manage all necessary permits and street works applications for scaffolding projects."
          },
          {
            question: "Can you work in residential areas?",
            answer: "Yes, we specialize in residential, commercial, and industrial scaffolding with minimal disruption."
          },
          {
            question: "Do you have local teams in each area?",
            answer: "Yes, we have experienced local teams with regional expertise and knowledge of local planning requirements."
          }
        ]}
      />
    </>
  );
}
