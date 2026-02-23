/**
 * Custom Page
 *
 * Generated from site analysis blueprint.
 * Path: /buffalo-2025
 */

import { NewsletterSubscribeBanner, OrderErrorMessage, SiteFooter, TopNavigation } from "@platform/themes/atlas/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Global site navigation with logo, event info button, and hamburger menu — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Displays an error message indicating no purchase was made, with a link back home — from custom-error-card-centered */}
      <OrderErrorMessage />

      {/* Section: Email newsletter subscription form with submit button — from cta-newsletter-banner */}
      <NewsletterSubscribeBanner />

      {/* Section: Global site footer with categorised navigation links, logo, social icons, and copyright — from footer-multi-column */}
      <SiteFooter />

    </div>
  );
}
