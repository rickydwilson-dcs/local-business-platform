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
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-brand-blue mb-2">15+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-brand-blue mb-2">£10M</div>
              <div className="text-sm text-gray-600">Liability Insurance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-brand-blue mb-2">TG20:21</div>
              <div className="text-sm text-gray-600">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-brand-blue mb-2">CHAS</div>
              <div className="text-sm text-gray-600">Accredited</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
