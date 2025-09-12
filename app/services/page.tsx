import Link from "next/link";
import Image from "next/image";
import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";

export const dynamic = "force-static";

type ServiceItem = {
  slug: string;
  title: string;
  description?: string;
  badge?: string;
  image?: string;
  features?: string[];
};

async function getServiceItems(): Promise<ServiceItem[]> {
  const dir = path.join(process.cwd(), "content", "services");

  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const items: ServiceItem[] = [];
  for (const file of files) {
    if (!file.toLowerCase().endsWith(".mdx")) continue;
    const slug = file.replace(/\.mdx$/i, "");
    const full = path.join(dir, file);
    const raw = await fs.readFile(full, "utf8");
    const { data } = matter(raw);

    const title =
      (typeof data.title === "string" && data.title.trim()) ||
      slug
        .split("-")
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
        .join(" ");

    // Define service-specific features and images
    const serviceData = getServiceData(slug);

    items.push({
      slug,
      title,
      description:
        typeof data.description === "string" ? data.description.trim() : serviceData.description,
      badge: serviceData.badge,
      image: serviceData.image,
      features: serviceData.features,
    });
  }

  return items.sort((a, b) => a.title.localeCompare(b.title));
}

function getServiceData(slug: string): Partial<ServiceItem> {
  const serviceMap: Record<string, Partial<ServiceItem>> = {
    "access-scaffolding": {
      description: "Safe, compliant access scaffolding for residential, commercial and industrial projects across the South East UK.",
      badge: "Most Popular",
      image: "/Access Scaffolding new build.png",
      features: ["TG20:21 Compliant", "CISRS Qualified Teams", "Full Insurance Coverage"]
    },
    "facade-scaffolding": {
      description: "Professional facade scaffolding solutions for building maintenance, renovation and construction projects.",
      image: "/Facade Scaffolding.png",
      features: ["Weatherproof Systems", "Load Bearing Design", "Planning Compliance"]
    },
    "edge-protection": {
      description: "Comprehensive edge protection systems ensuring maximum safety on construction and maintenance sites.",
      image: "/Edge Protection.png",
      features: ["HSE Compliant", "Rapid Installation", "Adjustable Systems"]
    },
    "temporary-roof-systems": {
      description: "Weather protection and temporary roofing solutions for ongoing construction and maintenance work.",
      // No specific image available - will use placeholder
      features: ["Weatherproof", "Load Rated", "Quick Assembly"]
    },
    "birdcage-scaffolds": {
      description: "Independent scaffold structures providing comprehensive access for complex commercial and industrial projects.",
      image: "/Birdcage scaffolding.png",
      features: ["Independent Structure", "Heavy Duty", "Complex Access"]
    },
    "scaffold-towers-mast-systems": {
      description: "Mobile and static scaffold towers for flexible access solutions on various project types.",
      // No specific image available - will use placeholder
      features: ["Mobile & Static", "Height Adjustable", "Quick Setup"]
    },
    "crash-decks-crane-decks": {
      description: "Protective crash decks and crane decks ensuring safety during construction operations.",
      image: "/Crash Decks & Crane Decks.png",
      features: ["Load Bearing", "Safety Compliance", "Custom Design"]
    },
    "heavy-duty-industrial-scaffolding": {
      description: "Heavy-duty scaffolding solutions for complex industrial projects and infrastructure work.",
      image: "/Heavy Industrial Scaffolding.png",
      features: ["Heavy Load Capacity", "Industrial Grade", "Complex Structures"]
    },
    "pavement-gantries-loading-bays": {
      description: "Specialized pavement gantries and loading bay solutions for urban construction projects.",
      image: "/Pavement Gantries Loading Bays.png",
      features: ["Urban Solutions", "Pedestrian Safety", "Loading Access"]
    },
    "public-access-staircases": {
      description: "Safe and compliant public access staircase systems for construction sites.",
      image: "/Public Access Staircases.png",
      features: ["Public Safety", "Accessible Design", "Code Compliant"]
    },
    "scaffold-alarms": {
      description: "Advanced scaffold alarm systems for enhanced site security and safety monitoring.",
      image: "/Scaffold Alarms.png",
      features: ["24/7 Monitoring", "Instant Alerts", "Security Integration"]
    }
  };

  return serviceMap[slug] || {
    description: "Professional scaffolding solution with full compliance and safety standards.",
    features: ["TG20:21 Compliant", "Fully Insured", "Professional Installation"]
  };
}

export default async function ServicesPage() {
  const services = await getServiceItems();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
              Our Scaffolding Services
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Professional scaffolding solutions across the South East UK. From residential repairs to large commercial projects, we deliver safe, compliant access solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
              >
                Get Free Quote
              </Link>
              <Link
                href="tel:01424466661"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now: 01424 466 661
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                <svg className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                TG20:21 Compliant
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                <svg className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                CHAS Accredited
              </div>
              <div className="bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                £10M Insured
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group relative"
              >
                {service.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-brand-blue text-white text-sm font-medium rounded-full">
                      {service.badge}
                    </span>
                  </div>
                )}
                
                <div className="relative h-48 bg-gray-200 rounded-t-2xl overflow-hidden">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Service Image</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col h-full">
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 line-clamp-1">
                    {service.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2 flex-grow-0">
                    {service.description}
                  </p>

                  {service.features && (
                    <ul className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700 line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-hover font-semibold text-sm transition-colors mt-4"
                    >
                      Learn About {service.title}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Every project is unique. Contact our expert team to discuss your specific scaffolding requirements.
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
  );
}
