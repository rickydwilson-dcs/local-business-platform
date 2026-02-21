/**
 * Custom Page
 *
 * Generated from site analysis blueprint.
 * Path: /privacy-policy
 */

import { ErrorMessageCard, NewsletterSubscribeBanner, SiteFooter, TopNavigation } from "@platform/themes/lyra/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Primary site-wide navigation with logo, event info CTA button, and hamburger menu for mobile — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Displays an error/whoops message indicating no purchase was made, with a link back home — from content-error-card-centered */}
      <ErrorMessageCard />

      {/* Section: Encourages users to subscribe to the newsletter with an email input and submit button — from cta-newsletter-form-banner */}
      <NewsletterSubscribeBanner />

      {/* Section: Site-wide footer with navigation links grouped by category (Events, Support, Legal, Company), logo, social icons, and copyright — from footer-multi-column-links */}
      <SiteFooter />

    </div>
  );
}
