import Link from "next/link";
import { absUrl } from "@/lib/site";
import { Metadata } from "next";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "About Colossus Scaffolding | Professional Scaffolding Specialists South East UK",
  description: "Learn about Colossus Scaffolding — established 2009, CISRS qualified teams, TG20:21 compliant, £10M insured. Professional scaffolding across South East England.",
  openGraph: {
    title: "About Colossus Scaffolding | Professional Scaffolding Specialists",
    description: "Professional scaffolding specialists serving South East UK since 2009. CISRS qualified, TG20:21 compliant, fully insured.",
    url: absUrl("/about"),
    siteName: "Colossus Scaffolding",
    images: [
      {
        url: absUrl("/static/logo.png"),
        width: 1200,
        height: 630,
        alt: "Colossus Scaffolding - Professional Scaffolding Specialists"
      }
    ],
    locale: "en_GB",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "About Colossus Scaffolding | Professional Scaffolding Specialists",
    description: "Professional scaffolding specialists serving South East UK since 2009. CISRS qualified, TG20:21 compliant, fully insured.",
    images: [absUrl("/static/logo.png")]
  },
  alternates: {
    canonical: absUrl("/about")
  }
};

export default function AboutPage() {
  const breadcrumbItems = [
    { name: "About", href: "/about", current: true }
  ];
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absUrl("/#organization"),
    name: "Colossus Scaffolding",
    legalName: "Colossus Scaffolding Ltd",
    url: absUrl("/"),
    logo: absUrl("/static/logo.png"),
    description: "Professional scaffolding specialists serving the South East UK with TG20:21 compliant solutions, CISRS qualified teams, and comprehensive insurance coverage.",
    foundingDate: "2009",
    numberOfEmployees: "10-50",
    email: "info@colossusscaffolding.co.uk",
    telephone: "+441424466661",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit 7, Ivyhouse Lane",
      addressLocality: "Hastings",
      addressRegion: "East Sussex", 
      postalCode: "TN35 4NN",
      addressCountry: "GB"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "50.8549",
      longitude: "0.5736"
    },
    areaServed: [
      { "@type": "Place", name: "East Sussex" },
      { "@type": "Place", name: "West Sussex" },
      { "@type": "Place", name: "Kent" },
      { "@type": "Place", name: "Surrey" },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "CHAS Accreditation",
        description: "Health and safety assessment scheme approved contractor"
      },
      {
        "@type": "EducationalOccupationalCredential", 
        credentialCategory: "certification",
        name: "CISRS Qualified Teams",
        description: "Construction Industry Scaffolders Record Scheme certified scaffolders"
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "compliance", 
        name: "TG20:21 Compliance",
        description: "Latest technical guidance for scaffold design and installation compliance"
      }
    ],
    slogan: "Safe, compliant and fully insured scaffolding specialists serving the South East UK",
    knowsAbout: [
      "Access Scaffolding",
      "Facade Scaffolding", 
      "Industrial Scaffolding",
      "Edge Protection",
      "Scaffold Design",
      "TG20:21 Compliance",
      "Scaffold Inspections",
      "Temporary Roof Systems"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Scaffolding Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Access Scaffolding",
            description: "Professional access scaffolding for residential and commercial projects"
          }
        },
        {
          "@type": "Offer", 
          itemOffered: {
            "@type": "Service",
            name: "Facade Scaffolding",
            description: "Specialist facade scaffolding for building maintenance and renovation"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service", 
            name: "Industrial Scaffolding",
            description: "Heavy-duty industrial scaffolding for complex commercial projects"
          }
        }
      ]
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "127"
    }
  };

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": absUrl("/about"),
    name: "About Colossus Scaffolding",
    description: "Learn more about Colossus Scaffolding — safe, compliant and fully insured scaffolding specialists serving the South East UK.",
    url: absUrl("/about"),
    mainEntity: {
      "@id": absUrl("/#organization")
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absUrl("/")
        },
        {
          "@type": "ListItem", 
          position: 2,
          name: "About",
          item: absUrl("/about")
        }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absUrl("/about#faq"),
    mainEntity: [
      {
        "@type": "Question",
        name: "How long has Colossus Scaffolding been in business?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Colossus Scaffolding was founded in 2009 and has been serving the South East UK for over 15 years with professional scaffolding services."
        }
      },
      {
        "@type": "Question", 
        name: "Are your scaffolders qualified?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all our scaffolders are CISRS (Construction Industry Scaffolders Record Scheme) qualified and experienced professionals."
        }
      },
      {
        "@type": "Question",
        name: "Do you provide insurance coverage?", 
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every project is backed by £10 million public liability insurance for complete protection and peace of mind."
        }
      },
      {
        "@type": "Question",
        name: "What areas do you serve?",
        acceptedAnswer: {
          "@type": "Answer", 
          text: "We cover all of the South East of England, including East Sussex, West Sussex, Kent, and Surrey."
        }
      },
      {
        "@type": "Question",
        name: "Are your scaffolds compliant with current standards?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all our scaffolds are designed and erected to TG20:21 standards with regular safety inspections and comprehensive risk assessments."
        }
      }
    ]
  };

  return (
    <div className="relative">
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="section-standard bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-standard">
          <div className="mx-auto w-full lg:w-[90%] text-center">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                Est. 2009
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                Family Business
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                Local Experts
              </span>
            </div>
            
            <h1 className="heading-hero leading-tight">
              About Colossus Scaffolding
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mx-auto w-full lg:w-[90%]">
              Professional scaffolding specialists serving the South East UK with TG20:21 compliant solutions, 
              CISRS qualified teams, and comprehensive insurance coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-standard bg-white">
        <div className="container-standard">
          <div className="mx-auto w-full lg:w-[90%]">
            <h2 className="heading-section mb-8 text-center">
              Our Story
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="prose prose-lg text-gray-600 leading-relaxed">
                <p className="text-xl mb-6">
                  Founded in 2009, Colossus Scaffolding began as a vision to provide professional, 
                  safe, and reliable scaffolding services across the South East UK. What started with 
                  a single van and unwavering commitment to excellence has grown into one of the region&apos;s 
                  most trusted scaffolding contractors.
                </p>
                
                <p className="mb-6">
                  From our headquarters in Hastings, we&apos;ve built our reputation project by project, 
                  always putting safety first and maintaining the highest professional standards. 
                  Our CISRS qualified teams understand that every scaffold we erect supports not just 
                  buildings, but the livelihoods and safety of the people who work on them.
                </p>
                
                <p>
                  Today, we&apos;re proud to serve homeowners, contractors, and businesses throughout 
                  East Sussex, West Sussex, Kent, and Surrey. Our commitment to 
                  local service, combined with our expertise in complex projects, makes us the 
                  trusted choice for scaffolding solutions across the South East.
                </p>
              </div>
              
              {/* Image Placeholder */}
              <div className="relative">
                <div className="aspect-[4/3] bg-gray-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-lg font-medium">Our Story Image</p>
                    <p className="text-sm">Company history photo placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Track Record Section - Using improved homepage trust indicators */}
      <section className="section-standard bg-gradient-to-br from-gray-50 to-gray-100 border-t border-b border-gray-200">
        <div className="container-standard">
          <div className="text-center mb-12">
            <h2 className="heading-section">
              Our Track Record Speaks for Itself
            </h2>
            <p className="text-lg text-gray-600 mx-auto w-full lg:w-[90%]">
              Over 15 years of professional scaffolding services with an unblemished safety record 
              and hundreds of successful projects across the South East.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="stat-number">15+</div>
                <div className="text-gray-900 font-medium">Years Experience</div>
                <div className="text-sm text-gray-500 mt-1">Serving the South East</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="stat-number">500+</div>
                <div className="text-gray-900 font-medium">Projects Completed</div>
                <div className="text-sm text-gray-500 mt-1">Successful Installations</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-number">100%</div>
                <div className="text-gray-900 font-medium">CISRS Qualified</div>
                <div className="text-sm text-gray-500 mt-1">All Scaffolding Teams</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-number">24/7</div>
                <div className="text-gray-900 font-medium">Emergency Response</div>
                <div className="text-sm text-gray-500 mt-1">Available When Needed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="section-standard bg-white">
        <div className="container-standard">
          <div className="text-center mb-12">
            <h2 className="heading-section">
              Certifications & Accreditations
            </h2>
            <p className="text-lg text-gray-600 mx-auto w-full lg:w-[90%]">
              We maintain the highest industry standards with comprehensive certifications 
              and accreditations that demonstrate our commitment to safety and professionalism.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">TG20:21 Compliance</h3>
              <p className="text-gray-600 text-sm">Latest technical guidance for scaffold design and installation</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CHAS Accreditation</h3>
              <p className="text-gray-600 text-sm">Health and safety assessment scheme approved contractor</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CISRS Qualified</h3>
              <p className="text-gray-600 text-sm">Construction Industry Scaffolders Record Scheme certified teams</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">£10M Insured</h3>
              <p className="text-gray-600 text-sm">Comprehensive public liability insurance coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section-standard bg-gray-50">
        <div className="container-standard">
          <div className="text-center mb-12">
            <h2 className="heading-section">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 mx-auto w-full lg:w-[90%]">
              These core principles guide everything we do, from the smallest residential project 
              to the largest commercial installation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-600">Every scaffold designed and erected to TG20:21 standards with regular safety inspections and comprehensive risk assessments.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Professional Excellence</h3>
              <p className="text-gray-600">CISRS qualified teams delivering professional installations with attention to detail and commitment to quality craftsmanship.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Reliable Service</h3>
              <p className="text-gray-600">On-time installations, clear communication, and 24/7 emergency response when you need us most across the South East.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Local Expertise</h3>
              <p className="text-gray-600">Deep understanding of local regulations, planning requirements, and building styles across our South East service areas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-standard bg-white">
        <div className="container-standard">
          <div className="text-center mb-12">
            <h2 className="heading-section">
              Why Choose Colossus Scaffolding?
            </h2>
            <p className="text-lg text-gray-600 mx-auto w-full lg:w-[90%]">
              From small residential projects to complex commercial installations, 
              here&apos;s what sets us apart in the scaffolding industry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto w-full lg:w-[90%]">
            {[
              "TG20:21 compliant design and installation on every project",
              "CISRS qualified and experienced scaffolding professionals", 
              "£10 million public liability insurance for complete protection",
              "CHAS accredited with proven health and safety record",
              "Free site surveys and detailed quotations provided",
              "Rapid response times across South East England",
              "Complete handover certificates and documentation",
              "Regular safety inspections and maintenance included",
              "Emergency callout service available 24/7",
              "Local expertise with regional planning knowledge"
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center mt-0.5">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-900 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-standard bg-brand-blue text-white">
        <div className="container-standard text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Work with the South East&apos;s Trusted Scaffolding Specialists?
          </h2>
          <p className="text-xl mb-8 mx-auto w-full lg:w-[90%] opacity-90 leading-relaxed">
            Get your free quote today and experience the professional difference that 15+ years 
            of expertise brings to your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-blue font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Get Free Quote
            </Link>
            <Link
              href="tel:01424466661"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-blue transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call: 01424 466661
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}