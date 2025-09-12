import { HeroSection } from "@/components/ui/hero-section"
import { ServicesOverview } from "@/components/ui/services-overview"
import { CoverageAreas } from "@/components/ui/coverage-areas"

export default function HomePage() {
  return (
    <div className="relative">
      <HeroSection />
      <ServicesOverview />
      <CoverageAreas 
        areas={[
          { name: "East Sussex", slug: "east-sussex" },
          { name: "West Sussex", slug: "west-sussex" },
          { name: "Kent", slug: "kent" },
          { name: "Surrey", slug: "surrey" },
          { name: "London", slug: "london" },
          { name: "Essex", slug: "essex" }
        ]}
        phone="01424 466661"
      />
      {/* Trust Indicators Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-gray-900 mb-4">
              Trusted by Customers Across the South East
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Industry-leading certifications and proven track record you can rely on.
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
                <div className="text-3xl font-bold text-brand-blue mb-2">15+</div>
                <div className="text-gray-900 font-medium">Years Experience</div>
                <div className="text-sm text-gray-500 mt-1">Serving the South East</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-brand-blue mb-2">£10M</div>
                <div className="text-gray-900 font-medium">Liability Insurance</div>
                <div className="text-sm text-gray-500 mt-1">Comprehensive Coverage</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-brand-blue mb-2">TG20:21</div>
                <div className="text-gray-900 font-medium">Compliant</div>
                <div className="text-sm text-gray-500 mt-1">Latest Safety Standards</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-brand-blue mb-2">CHAS</div>
                <div className="text-gray-900 font-medium">Accredited</div>
                <div className="text-sm text-gray-500 mt-1">Health & Safety Approved</div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Get professional scaffolding services from the team you can trust.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
            >
              Request Free Quote
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
