/**
 * Custom Page
 *
 * Generated from site analysis blueprint.
 * Path: /privacy-policy
 */

import { NewsletterSubscribeBanner, OrderErrorCard, SiteFooter, TopNavigation } from "@platform/themes/atlas/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Global site navigation with logo, event info button, and hamburger menu — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Displays an error message indicating no purchase was made, with a link back home — from content-error-card-centered */}
      <OrderErrorCard />

      {/* Section: Email newsletter subscription form with submit button — from cta-newsletter-banner */}
      <NewsletterSubscribeBanner />

      {/* Section: Site-wide footer with navigation links grouped by category, logo, and copyright — from footer-multi-column-links */}
      <SiteFooter />

    </div>
  );
}
