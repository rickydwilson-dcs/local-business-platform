/**
 * Custom Page
 *
 * Generated from site analysis blueprint.
 * Path: /attendee-registration
 */

import { NewsletterSignup, RegistrationErrorState, SiteFooter, TopNavigation } from "@platform/themes/lyra/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Primary site-wide navigation with logo, event info CTA button, and hamburger menu for mobile — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Displays an error/empty state message indicating no purchase was made during attendee registration flow — from custom-error-message-centered */}
      <RegistrationErrorState />

      {/* Section: Captures email addresses for newsletter subscription with heading, subtext, email input and submit button — from cta-newsletter-signup */}
      <NewsletterSignup />

      {/* Section: Site-wide footer with navigation links grouped by category (Events, Support, Legal, Company), logo, social icons, and copyright — from footer-multi-column-links */}
      <SiteFooter />

    </div>
  );
}
