/**
 * Custom Page
 *
 * Generated from site analysis blueprint.
 * Path: /buffalo-2025
 */

import { NewsletterSubscribeBanner, OrderErrorMessage, SiteFooter, TopNavigation } from "@platform/themes/lyra/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Global site navigation with logo, primary CTA button, and hamburger menu, present on every page — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Displays an error message indicating no purchase was made, with a link back home — from custom-error-card-centered */}
      <OrderErrorMessage />

      {/* Section: Email newsletter subscription form with submit button — from cta-newsletter-banner */}
      <NewsletterSubscribeBanner />

      {/* Section: Global site footer with navigation links grouped by category, logo, social icons, and copyright, present on every page — from footer-multi-column */}
      <SiteFooter />

    </div>
  );
}
