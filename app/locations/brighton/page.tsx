import { Metadata } from "next"
import { PageLayout } from "@/components/layouts/page-layout"
import { HeroSection } from "@/components/ui/hero-section"
import { LargeFeatureCards } from "@/components/ui/large-feature-cards"
import { ServiceCards } from "@/components/ui/service-cards"
import { CapabilityShowcase } from "@/components/ui/capability-showcase"
import { PricingPackages } from "@/components/ui/pricing-packages"
import { LocalAuthorityExpertise } from "@/components/ui/local-authority-expertise"
import { LocationFAQ } from "@/components/ui/location-faq"
import { CTASection } from "@/components/ui/cta-section"
import Breadcrumbs from "@/components/ui/breadcrumbs"
import Schema from "@/components/Schema"
import { getBrightonContent } from "@/lib/brighton-content"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getBrightonContent();

  return {
    title: content.metadata.seoTitle,
    description: content.metadata.description,
    keywords: content.metadata.keywords.join(", "),
    openGraph: {
      title: `Professional Scaffolding Services in ${content.metadata.title} | Colossus Scaffolding`,
      description: content.metadata.description,
      url: "https://colossus-scaffolding.vercel.app/locations/brighton",
      siteName: "Colossus Scaffolding",
      images: [
        {
          url: "https://colossus-scaffolding.vercel.app/brighton-scaffolding.jpg",
          width: 1200,
          height: 630,
          alt: `Professional scaffolding services in ${content.metadata.title} - Victorian terraces and seafront properties`
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `Professional Scaffolding Services in ${content.metadata.title} | Colossus Scaffolding`,
      description: content.metadata.description
    }
  }
}

export default async function BrightonPage() {
  const content = await getBrightonContent();

  // Transform specialists data for LargeFeatureCards component
  const brightonSpecialists = {
    title: content.specialists.title,
    description: content.specialists.description,
    columns: content.specialists.columns,
    backgroundColor: content.specialists.backgroundColor,
    showBottomCTA: content.specialists.showBottomCTA,
    cards: content.specialists.cards.map(card => ({
      title: card.title,
      description: card.description,
      details: card.details
    }))
  }

  // Transform services data for ServiceCards component
  const brightonServices = {
    title: content.services.title,
    description: content.services.description,
    cards: content.services.cards
  }

  // Transform capabilities data for CapabilityShowcase component
  const brightonCapabilityShowcase = {
    title: content.capabilities.title,
    description: content.capabilities.description,
    capabilities: content.capabilities.items.map(item => ({
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      features: item.features
    }))
  }

  // Transform pricing data for PricingPackages component
  const brightonPricing = {
    title: content.pricing.title,
    description: content.pricing.description,
    packages: content.pricing.packages
  }

  // Transform local authority data for LocalAuthorityExpertise component
  const brightonLocalAuthority = {
    title: content.localAuthority.title,
    description: content.localAuthority.description,
    locationName: content.localAuthority.locationName,
    authorityName: content.localAuthority.authorityName,
    expertiseItems: content.localAuthority.expertiseItems,
    supportItems: content.localAuthority.supportItems
  }

  // Transform FAQ data for LocationFAQ component
  const brightonFAQs = {
    title: "Brighton Scaffolding FAQ",
    location: content.metadata.title,
    items: content.faqs
  }

  // Transform CTA data for CTASection component
  const brightonCTA = {
    title: content.cta.title,
    description: content.cta.description,
    primaryButtonText: content.cta.primaryButtonText,
    primaryButtonUrl: content.cta.primaryButtonUrl,
    secondaryButtonText: content.cta.secondaryButtonText,
    secondaryButtonUrl: content.cta.secondaryButtonUrl,
    trustBadges: content.cta.trustBadges
  }

  return (
    <PageLayout>
      <div className="relative -mt-10 -mx-6 lg:-mx-6">
        <div className="bg-gray-50 border-b">
          <div className="container-standard py-4">
            <Breadcrumbs items={content.breadcrumbs} />
          </div>
        </div>
        <HeroSection
          title={content.hero.title}
          description={content.hero.description}
          phone={content.hero.phone}
          trustBadges={content.hero.trustBadges}
          ctaText={content.hero.ctaText}
          ctaUrl={content.hero.ctaUrl}
        />

        <LargeFeatureCards {...brightonSpecialists} />

        <ServiceCards {...brightonServices} />

        <CapabilityShowcase {...brightonCapabilityShowcase} />

        <PricingPackages {...brightonPricing} />

        <LocalAuthorityExpertise {...brightonLocalAuthority} />

        <LocationFAQ {...brightonFAQs} />

        <CTASection {...brightonCTA} />
      </div>
      <Schema
        service={{
          id: content.schema.service.id,
          name: content.schema.service.name,
          description: content.schema.service.description,
          url: content.schema.service.url,
          serviceType: content.schema.service.serviceType,
          areaServed: content.schema.service.areaServed
        }}
        faqs={content.faqs}
        breadcrumbs={content.breadcrumbs.map(b => ({ name: b.name, url: b.href }))}
      />
    </PageLayout>
  )
}