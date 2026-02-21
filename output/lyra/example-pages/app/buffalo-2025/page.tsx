/**
 * Custom Page
 *
 * Generated from site analysis blueprint.
 * Path: /buffalo-2025
 */

import { ErrorMessageCard, NewsletterSubscribeBanner, SiteFooter, TopNavigation } from "@platform/themes/lyra/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Primary site-wide navigation with logo, event info CTA button, and hamburger menu for mobile — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Displays an error or empty state message indicating no purchase was made, with a link back home — from custom-error-card-centered */}
      <ErrorMessageCard />

      {/* Section: Email newsletter subscription form with submit button — from cta-newsletter-banner */}
      <NewsletterSubscribeBanner />

      {/* Section: Site-wide footer with navigation links grouped by category, logo, and social icons — from footer-multi-column */}
      <SiteFooter />

    </div>
  );
}
