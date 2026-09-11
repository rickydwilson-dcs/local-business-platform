import type { HomePageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Phone } from 'lucide-react';

/**
 * Placeholder homepage — scaffold only.
 * The real design (auction-lot-page register, featured build, testimonials)
 * is ported from the approved static prototype in a follow-up pass; see
 * output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/session.md.
 */
export function HomePage({
  siteConfig,
  heroHeadline,
  heroSubheading,
  schemaNodes,
}: HomePageTemplateProps) {
  return (
    <div className="min-h-screen">
      {schemaNodes}

      <section className="section bg-surface-background">
        <div className="container-narrow text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-surface-foreground">
            {heroHeadline || siteConfig.name}
          </h1>
          <p className="text-xl md:text-2xl text-surface-muted-foreground mb-8 text-balance">
            {heroSubheading || siteConfig.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={siteConfig.cta.primary.href} className="btn-primary">
              {siteConfig.cta.primary.label}
            </Link>
          </div>

          {siteConfig.cta.phone.show && (
            <div className="mt-8">
              <Link
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center gap-2 text-lg font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Call us: {siteConfig.phoneDisplay}</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
