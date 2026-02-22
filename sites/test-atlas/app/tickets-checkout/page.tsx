/**
 * Custom Page
 *
 * Generated from site analysis blueprint.
 * Path: /tickets-checkout
 */

import { Content, ContentCheckout, Hero } from "@platform/themes/atlas/components";
import { CTASection, SiteHeader } from "@platform/core-components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Hero section — from hero */}
      <Hero />

      {/* Section: Content section: Checkout — from content-checkout */}
      <ContentCheckout />

      {/* Section: CTA section: Subscribe to our Newsletter — from cta-subscribe-to-our-newsletter */}
      <CTASection />

      {/* Section: Content section — from content */}
      <Content />

      {/* Section: CTA section: ColorCode: Buffalo Tickets Coming Soon! — from cta-colorcode-buffalo-tickets-comi */}
      <CTASection />

      {/* Section: Content section — from content */}
      <Content />

      {/* Section: Navigation section: Jump to: — from navigation-jump-to */}
      <SiteHeader />

    </div>
  );
}
